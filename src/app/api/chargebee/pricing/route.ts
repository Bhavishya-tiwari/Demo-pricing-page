import { NextRequest, NextResponse } from "next/server";

interface ChargebeeConfig {
  domain: string;
  apiKey: string;
  pricingPageId: string;
  subscriptionId: string;
}

interface PricingPageSession {
  id: string;
  url: string;
  created_at: number;
  expires_at: number;
  object: string;
}

interface ChargebeeResponse {
  pricing_page_session: PricingPageSession;
}

export async function POST(request: NextRequest) {
  try {
    const config: ChargebeeConfig = await request.json();

    // Validate required fields (pricingPageId is optional)
    if (!config.domain || !config.apiKey || !config.subscriptionId) {
      return NextResponse.json(
        { error: "Missing required configuration fields (domain, apiKey, subscriptionId)" },
        { status: 400 }
      );
    }

    // Clean up domain (remove protocol and trailing slashes)
    const cleanDomain = config.domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

    // Construct the Chargebee API URL
    const apiUrl = `https://${cleanDomain}/api/v2/pricing_page_sessions/create_for_existing_subscription`;

    // Create Basic Auth header from API key
    const authHeader = Buffer.from(`${config.apiKey}:`).toString("base64");

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("redirect_url", "https://example.com/upgrade-success");
    if (config.pricingPageId) {
      formData.append("pricing_page[id]", config.pricingPageId);
    }
    formData.append("subscription[id]", config.subscriptionId);

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

    const data: ChargebeeResponse = await response.json();

    return NextResponse.json({
      sessionId: data.pricing_page_session.id,
      url: data.pricing_page_session.url,
      createdAt: data.pricing_page_session.created_at,
      expiresAt: data.pricing_page_session.expires_at,
    });
  } catch (error) {
    console.error("Error creating pricing page session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
