"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ChargebeeConfig {
  domain: string;
  apiKey: string;
  pricingPageId: string;
  subscriptionId: string;
}

interface PricingSession {
  sessionId: string;
  url: string;
  createdAt: number;
  expiresAt: number;
}

export default function Pricing() {
  const [config, setConfig] = useState<ChargebeeConfig>({
    domain: "",
    apiKey: "",
    pricingPageId: "",
    subscriptionId: "",
  });
  const [savedConfig, setSavedConfig] = useState<ChargebeeConfig | null>(null);
  const [pricingSession, setPricingSession] = useState<PricingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chargebeeConfig");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedConfig(parsed);
      setConfig(parsed);
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Save config to localStorage
      localStorage.setItem("chargebeeConfig", JSON.stringify(config));
      setSavedConfig(config);

      // Fetch pricing session from our API route
      const response = await fetch("/api/chargebee/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create pricing session");
      }

      const data = await response.json();
      setPricingSession(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setPricingSession(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setConfig({
      domain: "",
      apiKey: "",
      pricingPageId: "",
      subscriptionId: "",
    });
    setSavedConfig(null);
    setPricingSession(null);
    setError(null);
    localStorage.removeItem("chargebeeConfig");
  };

  const formatExpiry = (expiresAt: number) => {
    const date = new Date(expiresAt * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="px-4 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl md:text-3xl font-bold text-[#E50914] tracking-tight">
              MAGELLAN
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-gray-400 hover:text-gray-300 transition-colors">Home</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors">Magazines</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors">New & Popular</Link>
              <Link href="/pricing" className="font-medium hover:text-gray-300 transition-colors">Pricing</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors">Browse by Genre</Link>
            </div>
          </div>
          
          <button className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center">
              <span className="text-sm font-bold">B</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content - Split Layout */}
      <div className="pt-20 flex min-h-screen">
        {/* Left Side - Pricing Table / Iframe */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-6 md:px-12 py-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Pricing Plans</h1>
            <p className="text-gray-400">
              {pricingSession 
                ? "Select a plan that works for you" 
                : "Configure Chargebee to view pricing plans"}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mx-6 md:mx-12 mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm text-red-400/80">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Iframe or Placeholder */}
          <div className="flex-1 px-6 md:px-12 pb-6">
            {pricingSession ? (
              <div className="h-full flex flex-col">
                {/* Iframe Container */}
                <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-2xl min-h-[600px]">
                  <iframe
                    src={pricingSession.url}
                    className="w-full h-full min-h-[600px]"
                    frameBorder="0"
                    allow="payment"
                    title="Chargebee Pricing Page"
                  />
                </div>
              </div>
            ) : (
              /* Placeholder State */
              <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-[#0a0a0a] rounded-xl border border-gray-800">
                <div className="w-24 h-24 mb-6 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-300">No Pricing Page Loaded</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Enter your Chargebee configuration in the panel and click &quot;Fetch Pricing&quot; to load the pricing page.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  The pricing page will appear here in an iframe
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Configuration Panel */}
        <div className="w-80 lg:w-96 bg-[#0a0a0a] border-l border-gray-800 flex flex-col">
          {/* Panel Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-lg">Configuration</h2>
                <p className="text-xs text-gray-500">Chargebee Settings</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Chargebee Domain
              </label>
              <input
                type="text"
                name="domain"
                value={config.domain}
                onChange={handleInputChange}
                placeholder="your-site.chargebee.com"
                className="w-full px-4 py-3 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
                required
              />
              <p className="mt-1 text-xs text-gray-600">e.g., acme-corp.chargebee.com</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                API Key
              </label>
              <input
                type="password"
                name="apiKey"
                value={config.apiKey}
                onChange={handleInputChange}
                placeholder="Enter your API key"
                className="w-full px-4 py-3 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
                required
              />
              <p className="mt-1 text-xs text-gray-600">Found in Settings → API Keys</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Pricing Page ID
                <span className="ml-2 text-xs text-gray-600 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="pricingPageId"
                value={config.pricingPageId}
                onChange={handleInputChange}
                placeholder="e.g., ApdMbdIErP"
                className="w-full px-4 py-3 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
              />
              <p className="mt-1 text-xs text-gray-600">From your Chargebee pricing page</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subscription ID
              </label>
              <input
                type="text"
                name="subscriptionId"
                value={config.subscriptionId}
                onChange={handleInputChange}
                placeholder="e.g., sub_123abc"
                className="w-full px-4 py-3 bg-[#1f1f1f] border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#E50914] transition-colors"
                required
              />
              <p className="mt-1 text-xs text-gray-600">Existing subscription to upgrade</p>
            </div>

            {/* Status Indicator */}
            {savedConfig && pricingSession && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Session Active</span>
                </div>
                <p className="text-xs text-gray-500">
                  ID: {pricingSession.sessionId.slice(0, 8)}...
                </p>
              </div>
            )}

            {savedConfig && !pricingSession && !error && (
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-yellow-400">Config saved, click Fetch</span>
              </div>
            )}
          </form>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-800 space-y-3">
            <button
              onClick={() => handleSubmit()}
              disabled={loading || !config.domain || !config.apiKey || !config.subscriptionId}
              className="w-full py-3 bg-[#E50914] hover:bg-[#f40612] disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Session...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Fetch Pricing
                </>
              )}
            </button>
            
            {pricingSession && (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="w-full py-3 bg-[#1f1f1f] hover:bg-[#2a2a2a] border border-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Session
              </button>
            )}
            
            <button
              type="button"
              onClick={handleClear}
              className="w-full py-3 bg-transparent hover:bg-gray-800 border border-gray-700 text-gray-400 font-medium rounded-lg transition-colors"
            >
              Clear Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
