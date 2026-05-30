/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Layers, 
  Activity, 
  Sparkles, 
  Plus, 
  Video, 
  Trash2, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { TopicItem, STATIC_TOPICS } from '../data/featuredTopics';

interface AdminViewProps {
  isDarkMode: boolean;
  onAddCuratedTopic: (topic: TopicItem) => void;
  curatedTopics: TopicItem[];
}

export default function AdminView({
  isDarkMode,
  curatedTopics,
  onAddCuratedTopic
}: AdminViewProps) {
  const [topicName, setTopicName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [hours, setHours] = useState('18');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [youtubeVideoId, setYoutubeVideoId] = useState('dQw4w9WgXcQ'); // Rickroll default, nice fallback!

  const [notification, setNotification] = useState('');

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim() || !description.trim()) return;

    // Create a new curated topic
    const newTopic: TopicItem = {
      id: `curated-${Date.now()}`,
      title: topicName.trim(),
      description: description.trim(),
      category: category as any,
      difficulty: difficulty as any,
      estimatedHours: Number(hours) || 12,
      modulesCount: 3,
      popularityScore: 95,
      coverGradient: 'from-blue-500 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=640'
    };

    onAddCuratedTopic(newTopic);
    
    // Clear inputs
    setTopicName('');
    setDescription('');
    setNotification(`Successfully Curated & Published "${newTopic.title}" Live! 🎉`);
    setTimeout(() => setNotification(''), 3500);
  };

  const cardBg = isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs';

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight text-red-500">Admin Control Terminal</h1>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Secure administrative panel for managing global platform parameters, curating topics, and simulating system spikes.
        </p>
      </div>

      {notification && (
        <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-2xl text-xs flex items-center gap-2 font-bold animate-bounce">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Grid statistics metrics rows */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Global Registered Users", value: "152,431", icon: Users, color: "text-indigo-500" },
          { label: "Gross Platform Revenue", value: "$41,012.50", icon: DollarSign, color: "text-emerald-500" },
          { label: "Synthesized AI Roadmaps", value: "482,901", icon: Layers, color: "text-blue-500" },
          { label: "Gemini Node Health", value: "99.98% OK", icon: Activity, color: "text-purple-500" }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-5 rounded-3xl border flex items-center gap-4 ${cardBg}`}>
              <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-405 block">{stat.label}</span>
                <span className="text-lg font-black block tracking-tight">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main admin workspaces gridsplit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Curated manual topic creation form */}
        <div className={`p-6 rounded-3xl border ${cardBg} space-y-4`}>
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Plus size={16} className="text-indigo-500" />
            <h3 className="text-sm font-extrabold tracking-tight uppercase">Curate & Publish pre-made Topic Roadmap</h3>
          </div>

          <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 block">TOPIC TITLE</label>
              <input
                id="admin-topic-title"
                type="text"
                placeholder="e.g. Master Kindle Formatting"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                required
                className={`w-full p-3 rounded-xl border focus:bg-transparent ${
                  isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-150 bg-slate-50 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 block">DESCRIPTION ABSTRACT</label>
              <textarea
                id="admin-topic-description"
                placeholder="Brief summary of syllabus objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={`w-full min-h-16 p-3 rounded-xl border focus:bg-transparent ${
                  isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-150 bg-slate-50 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">DOMAIN CATEGORY</label>
                <select
                  id="admin-topic-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-150 bg-slate-50 text-slate-700'
                  }`}
                >
                  <option value="Tech">Tech / Code</option>
                  <option value="Business">Business / Shop</option>
                  <option value="Creative">Creative / Art</option>
                  <option value="Freelancing">Freelancing / Side Job</option>
                  <option value="SaaS">SaaS Development</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">ESTIMATED HOURS</label>
                <input
                  id="admin-topic-hours"
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:bg-transparent ${
                    isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-150 bg-slate-50 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">DIFFICULTY PRESET</label>
                <select
                  id="admin-topic-difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`w-full p-3 rounded-xl border ${
                    isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-300' : 'border-slate-150 bg-slate-50 text-slate-700'
                  }`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 block">RECOMMENDED YT ID</label>
                <input
                  id="admin-topic-yt-id"
                  type="text"
                  value={youtubeVideoId}
                  onChange={(e) => setYoutubeVideoId(e.target.value)}
                  className={`w-full p-3 rounded-xl border focus:bg-transparent ${
                    isDarkMode ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-150 bg-slate-50 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <button
              id="admin-publish-topic-btn"
              type="submit"
              className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.01]"
            >
              <Sparkles size={13} fill="currentColor" />
              curate & Deploy Live
            </button>
          </form>
        </div>

        {/* Existing curated templates logs (2/2 cols) */}
        <div className={`p-6 rounded-3xl border ${cardBg} space-y-4 h-full flex flex-col`}>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold tracking-tight uppercase">Custom Published Curations</h3>
            <span className="text-[10px] bg-red-500/10 text-red-500 font-extrabold px-2 py-0.5 rounded-full">
              {curatedTopics.length} Curated
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px] no-scrollbar">
            {curatedTopics.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-12 text-center">No platform curations added yet. Fill mock form to curate one.</div>
            ) : (
              curatedTopics.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl border border-slate-100/40 dark:border-slate-800/20 flex justify-between gap-4 text-xs items-center">
                  <div className="space-y-0.5 truncate flex-1">
                    <span className="text-[9px] font-extrabold text-indigo-500 uppercase">{item.category}</span>
                    <h4 className="font-bold truncate">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
                    {item.estimatedHours} Hrs • {item.difficulty}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="pt-4 border-t border-slate-155/35 dark:border-slate-800/45 text-center">
            <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Production Deploy Logs</span>
            <p className="text-[10px] mt-1 text-slate-450 italic leading-snug">Changes are compiled onto active session caches. Re-authenticating is not needed to preview.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
