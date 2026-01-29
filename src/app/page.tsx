"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Magazine {
  id: number;
  title: string;
  issue: string;
  cover: string;
  progress?: number;
  isNew?: boolean;
}

interface Category {
  title: string;
  magazines: Magazine[];
}

const categories: Category[] = [
  {
    title: "Continue Reading",
    magazines: [
      { id: 1, title: "Vanguard", issue: "March 2026", cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=600&fit=crop", progress: 65 },
      { id: 2, title: "Horizon", issue: "Spring Edition", cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop", progress: 30 },
      { id: 3, title: "Chronicle", issue: "Issue 47", cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop", progress: 80 },
    ],
  },
  {
    title: "Trending Now",
    magazines: [
      { id: 4, title: "Prism", issue: "Design Annual", cover: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=600&fit=crop" },
      { id: 5, title: "Atlas", issue: "World Report", cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop" },
      { id: 6, title: "Kinetic", issue: "Sports Weekly", cover: "https://images.unsplash.com/photo-1461896836934- voices-from-the-sidelines?w=400&h=600&fit=crop" },
      { id: 7, title: "Lumina", issue: "Photography", cover: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=400&h=600&fit=crop" },
      { id: 8, title: "Cipher", issue: "Tech Review", cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=600&fit=crop" },
      { id: 9, title: "Ember", issue: "Food & Culture", cover: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=600&fit=crop" },
      { id: 10, title: "Solace", issue: "Wellness", cover: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop" },
    ],
  },
  {
    title: "New Releases",
    magazines: [
      { id: 11, title: "Nova", issue: "Premiere Issue", cover: "https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=600&fit=crop", isNew: true },
      { id: 12, title: "Meridian", issue: "Launch Edition", cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", isNew: true },
      { id: 13, title: "Flux", issue: "Volume 1", cover: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop", isNew: true },
      { id: 14, title: "Echo", issue: "First Print", cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop", isNew: true },
      { id: 15, title: "Aura", issue: "Debut", cover: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=400&h=600&fit=crop", isNew: true },
    ],
  },
  {
    title: "Business & Finance",
    magazines: [
      { id: 16, title: "Ledger", issue: "Q1 Outlook", cover: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=600&fit=crop" },
      { id: 17, title: "Capital", issue: "Investor Guide", cover: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=600&fit=crop" },
      { id: 18, title: "Venture", issue: "Startup Special", cover: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=600&fit=crop" },
      { id: 19, title: "Fortune Forward", issue: "Annual Report", cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop" },
      { id: 20, title: "Market Pulse", issue: "Weekly Digest", cover: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=600&fit=crop" },
    ],
  },
  {
    title: "Lifestyle & Culture",
    magazines: [
      { id: 21, title: "Wanderlust", issue: "Summer Escapes", cover: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop" },
      { id: 22, title: "Palette", issue: "Art Issue", cover: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400&h=600&fit=crop" },
      { id: 23, title: "Rhythm", issue: "Music Annual", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop" },
      { id: 24, title: "Gourmet", issue: "Chef's Pick", cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop" },
      { id: 25, title: "Abode", issue: "Interior Design", cover: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=600&fit=crop" },
      { id: 26, title: "Reverie", issue: "Fashion Week", cover: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=600&fit=crop" },
    ],
  },
  {
    title: "Science & Technology",
    magazines: [
      { id: 27, title: "Quantum", issue: "Future Tech", cover: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop" },
      { id: 28, title: "Nucleus", issue: "Research Digest", cover: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&h=600&fit=crop" },
      { id: 29, title: "Circuit", issue: "AI Special", cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop" },
      { id: 30, title: "Cosmos", issue: "Space Edition", cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop" },
      { id: 31, title: "Genesis", issue: "Biotech", cover: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=600&fit=crop" },
    ],
  },
];

const featuredMagazine = {
  title: "Vanguard",
  issue: "The Future of Design",
  description: "Explore groundbreaking innovations reshaping architecture, product design, and digital experiences. Featuring exclusive interviews with industry pioneers.",
  cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop",
  tags: ["Design", "Innovation", "Architecture"],
};

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const rowRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scroll = (direction: "left" | "right", rowTitle: string) => {
    const row = rowRefs.current[rowTitle];
    if (row) {
      const scrollAmount = row.clientWidth * 0.8;
      row.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="px-4 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#E50914] tracking-tight">MAGELLAN</h1>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="font-medium hover:text-gray-300 transition-colors">Home</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors">Magazines</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors">New & Popular</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-gray-300 transition-colors">Pricing</Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition-colors">Browse by Genre</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'bg-black/80 border border-white/50' : ''}`}>
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Titles, genres, topics"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none text-sm transition-all duration-300 ${searchOpen ? 'w-48 px-2 py-1' : 'w-0'}`}
              />
            </div>
            
            {/* Notifications */}
            <button className="p-2 hover:text-gray-300 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full" />
            </button>
            
            {/* Profile */}
            <button className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center">
                <span className="text-sm font-bold">B</span>
              </div>
              <svg className="w-4 h-4 text-white group-hover:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero / Featured Magazine */}
      <section className="relative h-[85vh] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={featuredMagazine.cover}
            alt={featuredMagazine.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 px-4 md:px-12 pb-32 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-[#E50914] text-xs font-bold rounded">FEATURED</span>
            <span className="text-sm text-gray-300">Issue 47 • March 2026</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-2 tracking-tight">{featuredMagazine.title}</h2>
          <p className="text-2xl md:text-3xl font-light text-gray-200 mb-4">{featuredMagazine.issue}</p>
          
          <div className="flex gap-2 mb-6">
            {featuredMagazine.tags.map((tag) => (
              <span key={tag} className="text-sm text-gray-400 border border-gray-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
            {featuredMagazine.description}
          </p>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Read Now
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-gray-500/50 text-white font-semibold rounded hover:bg-gray-500/70 transition-colors backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>
          </div>
        </div>
        
        {/* Mute button (decorative) */}
        <button className="absolute bottom-32 right-12 p-2 border border-gray-500 rounded-full hover:border-white transition-colors hidden md:flex">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        </button>
      </section>

      {/* Content Rows */}
      <section className="relative z-20 -mt-32 pb-16">
        {categories.map((category) => (
          <div key={category.title} className="mb-8 group/row">
            <h3 className="text-xl font-semibold mb-3 px-4 md:px-12 flex items-center gap-2">
              {category.title}
              <svg className="w-5 h-5 opacity-0 group-hover/row:opacity-100 transition-opacity text-[#54b9c5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </h3>
            
            <div className="relative group/slider">
              {/* Left Arrow */}
              <button
                onClick={() => scroll("left", category.title)}
                className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[#141414] to-transparent flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Magazine Row */}
              <div
                ref={(el) => { rowRefs.current[category.title] = el; }}
                className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {category.magazines.map((mag) => (
                  <div
                    key={mag.id}
                    className="relative shrink-0 cursor-pointer group/card"
                    onMouseEnter={() => setHoveredCard(mag.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Card */}
                    <div
                      className={`relative w-[160px] md:w-[200px] aspect-2/3 rounded overflow-hidden transition-all duration-300 ${
                        hoveredCard === mag.id ? 'scale-125 z-30 shadow-2xl shadow-black/80' : 'scale-100'
                      }`}
                      style={{ 
                        transformOrigin: 'center center',
                      }}
                    >
                      <Image
                        src={mag.cover}
                        alt={mag.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* New badge */}
                      {mag.isNew && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#E50914] text-[10px] font-bold rounded">
                          NEW
                        </div>
                      )}
                      
                      {/* Progress bar for Continue Reading */}
                      {mag.progress && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                          <div 
                            className="h-full bg-[#E50914]" 
                            style={{ width: `${mag.progress}%` }}
                          />
                        </div>
                      )}
                      
                      {/* Hover info panel */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ${
                        hoveredCard === mag.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <h4 className="font-bold text-sm mb-0.5">{mag.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{mag.issue}</p>
                        
                        <div className="flex gap-1">
                          <button className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Read
                          </button>
                          <button className="p-1.5 border border-gray-500 rounded-full hover:border-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                          <button className="p-1.5 border border-gray-500 rounded-full hover:border-white transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Right Arrow */}
              <button
                onClick={() => scroll("right", category.title)}
                className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[#141414] to-transparent flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="px-4 md:px-12 py-16 text-gray-500 text-sm">
        <div className="flex gap-4 mb-6">
          {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
            <button key={social} className="hover:text-white transition-colors">
              {social}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            ["Audio Description", "Help Center", "Gift Cards", "Media Center"],
            ["Investor Relations", "Jobs", "Terms of Use", "Privacy"],
            ["Legal Notices", "Cookie Preferences", "Corporate Info", "Contact Us"],
            ["Account", "Ways to Read", "Speed Test", "Ad Choices"],
          ].map((col, i) => (
            <div key={i} className="flex flex-col gap-2">
              {col.map((link) => (
                <a key={link} href="#" className="hover:underline">{link}</a>
              ))}
            </div>
          ))}
        </div>
        
        <button className="px-4 py-1 border border-gray-500 text-gray-400 mb-6 hover:text-white transition-colors">
          Service Code
        </button>
        
        <p className="text-xs text-gray-600">© 2026 Magellan, Inc.</p>
      </footer>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
