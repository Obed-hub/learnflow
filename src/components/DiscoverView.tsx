/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Flame, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  ChevronRight, 
  Sparkles, 
  CornerDownLeft,
  X,
  Filter
} from 'lucide-react';
import { TopicItem, STATIC_TOPICS, DISCOVER_DIVISIONS, INSTANT_SUGGESTIONS } from '../data/featuredTopics';

interface DiscoverViewProps {
  onSelectTopic: (topicTitle: string) => void;
  isDarkMode: boolean;
  onViewCurriculum: (topicTitle: string) => void;
  isGenerating: boolean;
}

export default function DiscoverView({
  onSelectTopic,
  isDarkMode,
  onViewCurriculum,
  isGenerating
}: DiscoverViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | 'Business' | 'Tech' | 'Creative' | 'Freelancing' | 'SaaS'>('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter topics of our static db
  const filteredStatic = STATIC_TOPICS.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || topic.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Autocomplete filter matching
  const suggestedQueries = INSTANT_SUGGESTIONS.filter(item => 
    item.toLowerCase().includes(searchQuery.toLowerCase()) && 
    item.toLowerCase() !== searchQuery.toLowerCase()
  );

  // Close suggestions card on outside click (click listener)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSelectTopic(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title: string) => {
    setSearchQuery(title);
    onSelectTopic(title);
    setShowSuggestions(false);
  };

  const rowBg = isDarkMode ? 'bg-[#0F1115]' : 'bg-white';

  // Build rows for specific divisions (Netflix-style scrollable blocks)
  const renderNetflixRow = (title: string, topicTitles: string[]) => {
    const matchedTopics = STATIC_TOPICS.filter(item => 
      topicTitles.some(t => item.title.toLowerCase().includes(t.toLowerCase()))
    );

    if (matchedTopics.length === 0) return null;

    return (
      <div key={title} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400">{title}</h3>
          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 hover:scale-[1.01] transition-transform cursor-pointer">
            <span>Scroll horizontally</span>
            <ChevronRight size={12} />
          </div>
        </div>

        {/* Netflix style strip container */}
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar scroll-smooth">
          {matchedTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onViewCurriculum(topic.title)}
              className={`w-64 shrink-0 rounded-2xl border cursor-pointer hover:-translate-y-1 hover:border-indigo-500/55 transition-all duration-300 relative overflow-hidden group ${rowBg}`}
            >
              {/* Gradients or cover image */}
              <div className="aspect-video bg-slate-200 dark:bg-slate-900 border-b border-inherit relative overflow-hidden">
                <img 
                  src={topic.image} 
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-extrabold leading-none truncate max-w-[180px] drop-shadow-md">
                    {topic.title}
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-3">
                <p className={`text-[11px] leading-relaxed line-clamp-2 h-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {topic.description}
                </p>

                <div className="flex items-center justify-between text-[10.5px] font-bold">
                  <span className={`px-2 py-0.5 rounded-full ${
                    topic.difficulty === 'Beginner' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : topic.difficulty === 'Intermediate'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-red-500/10 text-red-500'
                  }`}>
                    {topic.difficulty}
                  </span>

                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Clock size={11} />
                    {topic.estimatedHours} Hours
                  </span>
                </div>

                {/* Score meters */}
                <div className="pt-2 border-t border-slate-150/45 dark:border-slate-800/20 flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-400 uppercase">Popularity Index</span>
                  <span className="text-indigo-600 flex items-center gap-0.5">
                    <Flame size={12} className="fill-orange-400 text-orange-400" />
                    {topic.popularityScore}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Smart Search Bar container */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight">What do you want to learn today?</h2>
        
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl" ref={suggestionRef}>
          <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
            isDarkMode 
              ? 'bg-[#0F1115] border-slate-800 focus-within:border-indigo-500' 
              : 'bg-white border-slate-200 focus-within:border-indigo-600 shadow-xs'
          }`}>
            <Search size={20} className="text-slate-400" />
            <input
              id="discover-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search any skill, tool, or topic (e.g. 'Amazon KDP' or 'TypeScript')..."
              className="flex-1 text-xs bg-transparent text-inherit placeholder-slate-400 outline-none"
              disabled={isGenerating}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={14} />
              </button>
            )}
            <button
              id="discover-generate-btn"
              type="submit"
              disabled={isGenerating}
              className={`px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0 transition-transform hover:scale-[1.01] active:scale-[0.98] ${
                isGenerating ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Sparkles size={13} className="animate-pulse" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Path'}</span>
            </button>
          </div>

          {/* Autocomplete Suggestions Box Drawer */}
          {showSuggestions && searchQuery.trim() && suggestedQueries.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl border z-50 text-xs shadow-xl max-h-60 overflow-y-auto ${
              isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 py-1">Instant Matches</div>
              {suggestedQueries.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(item)}
                  className={`px-2.5 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isDarkMode ? 'hover:bg-slate-800/80 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Search size={13} className="text-slate-400" />
                    <span className="font-semibold">{item}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    <span>Press Enter</span>
                    <CornerDownLeft size={10} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </section>

      {/* Category filters */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold">
          <Filter size={14} className="text-slate-400" />
          <span>Filter by Domain</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Business', 'Tech', 'Creative', 'Freelancing', 'SaaS'] as const).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`discover-filter-${cat.toLowerCase()}-btn`}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected 
                    ? 'bg-indigo-650 border-indigo-600 text-white shadow-xs' 
                    : `${
                        isDarkMode 
                          ? 'border-slate-800 bg-[#0F1115] hover:border-slate-700 text-slate-300' 
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 shadow-xs'
                      }`
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* If search query is entered, show main search results layout */}
      {searchQuery.trim() ? (
        <section className="space-y-4">
          <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400">Search Results</h3>
          
          {filteredStatic.length === 0 ? (
            <div className={`p-12 rounded-3xl border border-dashed text-center space-y-4 ${
              isDarkMode ? 'border-slate-800 bg-slate-900/15' : 'border-slate-200 bg-slate-50/50'
            }`}>
              <div className="inline-flex py-3 px-4 bg-indigo-600/10 rounded-2xl text-indigo-500 text-sm font-semibold gap-1.5">
                <Sparkles size={16} />
                <span>Custom Generation available</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold">No static templates match your search exactly</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click 'Generate Path' and LearnFlow will use Gemini to synthesize a complete customized learning path for you in seconds.
                </p>
              </div>
              <button
                id="discover-custom-generate-btn"
                onClick={() => onSelectTopic(searchQuery)}
                disabled={isGenerating}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
              >
                {isGenerating ? 'Generating curriculum...' : 'Generate New Custom Roadmap'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredStatic.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => onViewCurriculum(topic.title)}
                  className={`rounded-3xl border cursor-pointer hover:-translate-y-1 hover:border-indigo-500/55 transition-all duration-300 overflow-hidden group ${rowBg}`}
                >
                  <div className="aspect-video bg-slate-200 dark:bg-slate-900 border-b border-inherit relative overflow-hidden">
                    <img 
                      src={topic.image} 
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent flex items-end p-4">
                      <span className="text-white text-sm font-extrabold tracking-tight drop-shadow-md">
                        {topic.title}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className={`text-xs leading-relaxed line-clamp-2 h-10 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {topic.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full ${
                        topic.difficulty === 'Beginner' 
                          ? 'bg-emerald-500/10 text-emerald-500' 
                          : topic.difficulty === 'Intermediate'
                            ? 'bg-blue-500/10 text-blue-500'
                            : 'bg-red-500/10 text-red-500'
                      }`}>
                        {topic.difficulty}
                      </span>

                      <span className="text-slate-400 flex items-center gap-1 font-mono">
                        <Clock size={12} />
                        {topic.estimatedHours} Hours
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-150/45 dark:border-slate-800/20 flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400 uppercase">Popularity Score</span>
                      <span className="text-indigo-600 flex items-center gap-0.5">
                        <Flame size={12} className="fill-orange-400 text-orange-400" />
                        {topic.popularityScore}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Render normal horizontal-scrolling Netflix rows strip content */
        <div className="space-y-10">
          {renderNetflixRow("Popular Topics", DISCOVER_DIVISIONS.popular)}
          {renderNetflixRow("Trending This Week", DISCOVER_DIVISIONS.trending)}
          {renderNetflixRow("Career Skills", DISCOVER_DIVISIONS.careers)}
          {renderNetflixRow("Business & Side Hustles", DISCOVER_DIVISIONS.business)}
          {renderNetflixRow("Creative Skills", DISCOVER_DIVISIONS.creative)}
          {renderNetflixRow("Technology & Code", DISCOVER_DIVISIONS.technology)}
        </div>
      )}
    </div>
  );
}
