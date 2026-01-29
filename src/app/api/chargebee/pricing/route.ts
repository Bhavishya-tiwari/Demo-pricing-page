import { NextRequest, NextResponse } from "next/server";

interface ChargebeeConfig {
  domain: string;
  apiKey: string;
  pricingPageId: string;
  subscriptionId: string;
  customFieldKey?: string;
  customFieldValue?: string;
}

export async function POST(request: NextRequest) {
  try {
    const config: ChargebeeConfig = await request.json();
    console.log("Input config received:", JSON.stringify({
      domain: config.domain,
      apiKey: config.apiKey ? "***" + config.apiKey.slice(-4) : undefined,
      pricingPageId: config.pricingPageId,
      subscriptionId: config.subscriptionId,
      customFieldKey: config.customFieldKey,
      customFieldValue: config.customFieldValue,
    }, null, 2));

    // Validate required fields (pricingPageId is optional)
    if (!config.domain || !config.apiKey || !config.subscriptionId) {
      return NextResponse.json(
        { error: "Missing required configuration fields (domain, apiKey, subscriptionId)" },
        { status: 400 }
      );
    }

    // Clean up domain - user only needs to enter site name (e.g., "acme-corp")
    // We'll add https:// and .chargebee.com automatically
    const cleanDomain = config.domain
      .replace(/^https?:\/\//, "")  // Remove protocol if present
      .replace(/\.chargebee\.com\/?$/, "")  // Remove .chargebee.com if present
      .replace(/\/$/, "");  // Remove trailing slash

    // Construct the Chargebee API URL with full domain
    const apiUrl = `https://${cleanDomain}.chargebee.com/api/v2/pricing_page_sessions/create_for_existing_subscription`;

    // Create Basic Auth header from API key
    const authHeader = Buffer.from(`${config.apiKey}:`).toString("base64");

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("redirect_url", "https://example.com/upgrade-success");
    if (config.pricingPageId) {
      formData.append("pricing_page[id]", config.pricingPageId);
    }
    formData.append("subscription[id]", config.subscriptionId);

    // Add custom field if both key and value are provided
    if (config.customFieldKey && config.customFieldValue) {
      const customData = { [config.customFieldKey]: config.customFieldValue };
      formData.append("custom", JSON.stringify(customData));
    }

    console.log("API URL:", apiUrl);
    console.log("Form data:", formData.toString());

    // Make the request to Chargebee
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${authHeader}`,
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Chargebee API Error:", errorText);
      
      let errorMessage = "Failed to create pricing page session";
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        } else if (errorJson.api_error_code) {
          errorMessage = `${errorJson.api_error_code}: ${errorJson.message || errorText}`;
        }
      } catch {
        // If parsing fails, use the raw error text
        if (errorText) {
          errorMessage = errorText;
        }
      }

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key or unauthorized access" },
          { status: 401 }
        );
      }
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Pricing page or subscription not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Raw Chargebee response:", JSON.stringify(data, null, 2));

    const result = {
      sessionId: data.pricing_page_session?.id,
      url: data.pricing_page_session?.url,
      createdAt: data.pricing_page_session?.created_at,
      expiresAt: data.pricing_page_session?.expires_at,
    };
    console.log("Sending to frontend:", JSON.stringify(result, null, 2));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating pricing page session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
