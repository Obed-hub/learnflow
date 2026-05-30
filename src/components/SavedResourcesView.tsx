/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bookmark, 
  ExternalLink, 
  Trash2, 
  Search, 
  BookOpen, 
  Clock, 
  Filter,
  FileCode,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { SavedResource } from '../types';

interface SavedResourcesViewProps {
  savedResources: SavedResource[];
  onRemoveResource: (id: string) => void;
  isDarkMode: boolean;
  onViewPath: (pathId: string) => void;
}

export default function SavedResourcesView({
  savedResources,
  onRemoveResource,
  isDarkMode,
  onViewPath
}: SavedResourcesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Documentation' | 'Tutorial' | 'Article' | 'Guide'>('All');

  // Filter bookmarked guidelines
  const filtered = savedResources.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.roadmapTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const cardBg = isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs';

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight">Saved Resources Cabinet</h1>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Direct access to bookmarked references, official document links, and tutorials curated from active pathways.
        </p>
      </div>

      {/* Filter and Search actions bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className={`flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border flex-1 max-w-md w-full ${
          isDarkMode ? 'border-slate-800' : 'border-slate-150'
        }`}>
          <Search size={16} className="text-slate-400" />
          <input
            id="saved-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved resources..."
            className="text-xs bg-transparent text-inherit outline-none flex-1 placeholder-slate-400"
          />
        </div>

        {/* Type Filter badge selectors */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {(['All', 'Documentation', 'Tutorial', 'Article', 'Guide'] as const).map(type => (
            <button
              key={type}
              id={`saved-filter-${type.toLowerCase()}-btn`}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                typeFilter === type 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : isDarkMode 
                    ? 'border-slate-805 bg-slate-900 text-slate-350 hover:border-slate-700' 
                    : 'border-slate-205 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks Grid list */}
      {filtered.length === 0 ? (
        <div className={`p-16 rounded-3xl border border-dashed text-center space-y-4 ${
          isDarkMode ? 'border-slate-800 bg-[#0F1115]/30' : 'border-slate-200 bg-slate-50/50'
        }`}>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto text-indigo-500">
            <Bookmark size={22} className="text-slate-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold">No saved bookmarks match the filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Any time you review a lesson or curriculum module, tap on the Bookmark icon to save manuals here for consolidated studies.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between gap-5 transition-all hover:scale-[1.002] ${cardBg}`}
            >
              <div className="space-y-3">
                {/* Header elements labels */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 rounded">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 tracking-tight flex items-center gap-1">
                    <Clock size={11} className="text-indigo-500" />
                    Saved: {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold leading-normal">{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-405' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>

                {/* Parent path tag banner */}
                <div 
                  onClick={() => onViewPath(item.roadmapId)}
                  className={`px-3 py-1.5 rounded-xl flex items-center justify-between text-[11px] font-semibold cursor-pointer border ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-900/50 hover:border-indigo-500 text-slate-350' 
                      : 'border-slate-150 bg-slate-50 hover:border-indigo-600 text-slate-650'
                  }`}
                  title="View parent learning path"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Layers size={12} className="text-indigo-500 flex-shrink-0" />
                    <span className="truncate">Path: {item.roadmapTitle} • Module: {item.moduleTitle}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />
                </div>
              </div>

              {/* Action buttons drawer footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100/30 dark:border-slate-800/10">
                <button
                  id={`remove-bookmark-${item.id}-btn`}
                  onClick={() => onRemoveResource(item.id)}
                  className={`p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50/20 dark:hover:bg-red-950/10 border transition-all border-slate-205 dark:border-slate-800`}
                  title="Remove bookmark"
                >
                  <Trash2 size={13} />
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Launch Resource</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
