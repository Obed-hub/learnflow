/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Flame, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Compass, 
  Clock, 
  Bookmark, 
  ChevronRight,
  Plus,
  ArrowRight
} from 'lucide-react';
import { UserProfile, LearningPath } from '../types';
import { STATIC_TOPICS, TopicItem } from '../data/featuredTopics';

interface DashboardHomeProps {
  user: UserProfile;
  activePaths: LearningPath[];
  onResumePath: (pathId: string) => void;
  onExploreTopics: () => void;
  onViewCurriculum: (topicTitle: string) => void;
  isDarkMode: boolean;
}

export default function DashboardHome({
  user,
  activePaths,
  onResumePath,
  onExploreTopics,
  onViewCurriculum,
  isDarkMode
}: DashboardHomeProps) {

  // Simple recommendations based on preferred categories or default
  const recommendations: TopicItem[] = STATIC_TOPICS.filter(topic => {
    if (user.preferredCategories && user.preferredCategories.length > 0) {
      return user.preferredCategories.includes(topic.title) || 
             user.preferredCategories.some(cat => topic.title.toLowerCase().includes(cat.toLowerCase()));
    }
    return true;
  }).slice(0, 3);

  // If no specific matches, default to popular ones
  const finalRecs = recommendations.length > 0 ? recommendations : STATIC_TOPICS.slice(0, 3);

  // Completed modules calculation
  const totalCompletedModulesCount = activePaths.reduce((acc, path) => {
    let count = 0;
    (path?.phases || []).forEach(ph => {
      (ph?.modules || []).forEach(mod => {
        const totalLessons = (mod?.lessons || []).length;
        const completedLessons = (mod?.lessons || []).filter(l => l.completed).length;
        if (totalLessons > 0 && completedLessons === totalLessons) {
          count++;
        }
      });
    });
    return acc + count;
  }, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Message banner */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-3xl bg-linear-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
        {/* Background bubbles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider leading-none">
            <Sparkles size={11} className="animate-spin" />
            <span>LEVEL {Math.floor(user.xpPoints / 100) + 1} ACADEMIC RANK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.displayName || 'Learner'}!
          </h1>
          <p className="text-xs text-indigo-100 max-w-xl font-normal leading-relaxed">
            You're currently pursuing <span className="font-bold underline">{user.learningGoals}</span>. Below is your structured learning trajectory curated for <span className="font-bold">{user.weeklyHours} hrs/week</span>.
          </p>
        </div>

        {/* Streak & XP Display widgets */}
        <div className="flex gap-4 shrink-0 relative z-10">
          <div className="flex-1 min-w-[100px] border border-white/20 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame size={20} className="text-orange-400 fill-orange-400 animate-bounce" />
              <span className="text-2xl font-black">{user.streakCount || 1}</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-indigo-200 mt-1">Study Streak</p>
          </div>
          
          <div className="flex-1 min-w-[100px] border border-white/20 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-1">
              <Award size={20} className="text-yellow-300 animate-pulse" />
              <span className="text-2xl font-black">{user.xpPoints || 120}</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-indigo-200 mt-1">XP Units</p>
          </div>
        </div>
      </section>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER PANELS: ENROLLED PATHS & STATS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: CONTINUE LEARNING CARDS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold tracking-tight">Active Learning Pathways</h2>
              {activePaths.length > 0 && (
                <span className="text-xs font-bold text-slate-400">
                  {activePaths.length} Enrolled
                </span>
              )}
            </div>

            {activePaths.length === 0 ? (
              <div className={`p-10 rounded-3xl border border-dashed text-center space-y-4 ${
                isDarkMode ? 'border-slate-800 bg-slate-900/15' : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="w-12 h-12 bg-indigo-50/30 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-indigo-500">
                  <BookOpen size={22} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold">No active pathways yet</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Type any topic on the Discover panel to synthesize your first curriculum and begin learning.
                  </p>
                </div>
                <button
                  id="home-explore-paths-btn"
                  onClick={onExploreTopics}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  <Plus size={14} className="inline mr-1" />
                  Explore Featured Topics
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activePaths.map((path, idx) => (
                  <div 
                    key={path.id || `active-p-${idx}`}
                    className={`p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:scale-[1.005] ${
                      isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'
                    }`}
                  >
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          path.difficulty === 'Beginner' 
                            ? 'bg-emerald-500/10 text-emerald-500' 
                            : path.difficulty === 'Intermediate'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-red-500/10 text-red-500'
                        }`}>
                          {path.difficulty}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={11} />
                          {path.estimatedHours} Hours total
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-base font-bold tracking-tight">{path.title}</h3>
                        <p className={`text-xs truncate max-w-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {path.description}
                        </p>
                      </div>

                      {/* Progress meter line */}
                      <div className="space-y-1.5 max-w-md">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400">Curriculum Progress</span>
                          <span className="text-indigo-600">{path.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${path.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      id={`resume-path-${path.id}-btn`}
                      onClick={() => onResumePath(path.id)}
                      className="px-5 py-3 bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold shrink-0 self-start md:self-center flex items-center gap-1.5 transition-all"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Resume Path</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section: LEARNING STATISTICS */}
          <section className="space-y-4">
            <h2 className="text-lg font-extrabold tracking-tight">Weekly Learning Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily study tracker metric */}
              <div className={`p-6 rounded-3xl border ${
                isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
                  <span>Weekly Study Log</span>
                  <Clock size={14} className="text-indigo-500" />
                </h3>
                {/* SVG Graphic represent daily study hours */}
                <div className="flex justify-between items-end h-28 pt-2">
                  {[
                    { day: "M", mins: 45 },
                    { day: "T", mins: 20 },
                    { day: "W", mins: 60 },
                    { day: "T", mins: 15 },
                    { day: "F", mins: 90 },
                    { day: "S", mins: 30 },
                    { day: "S", mins: 10 }
                  ].map((log, idx) => {
                    const barHeightPercent = (log.mins / 90) * 100;
                    return (
                      <div key={`study-bar-${idx}`} className="flex flex-col items-center gap-2 group flex-1">
                        <div className="relative w-full flex justify-center">
                          {/* Tooltip trigger label */}
                          <span className="absolute -top-6 text-[9px] font-bold bg-[#14171d] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
                            {log.mins} mins
                          </span>
                          <div 
                            className={`w-4 bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-all cursor-pointer`}
                            style={{ height: `${Math.max(barHeightPercent, 8)}%`, minHeight: '8px' }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{log.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress milestones and XP ratios */}
              <div className={`p-6 rounded-3xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'
              }`}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Completed Milestones</span>
                  <TrendingUp size={14} className="text-emerald-500" />
                </h3>

                <div className="py-2 flex items-center gap-6">
                  {/* Circular progress loader */}
                  <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                    <svg className="absolute w-20 h-20 -rotate-90">
                      <circle 
                        cx="40" cy="40" r="32" 
                        className="stroke-slate-100 dark:stroke-slate-800 fill-transparent"
                        strokeWidth="7"
                      />
                      <circle 
                        cx="40" cy="40" r="32" 
                        className="stroke-indigo-600 fill-transparent transition-all duration-300"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 32}
                        strokeDashoffset={2 * Math.PI * 32 * (1 - (totalCompletedModulesCount > 0 ? 0.65 : 0.05))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center">
                      <span className="text-lg font-extrabold text-indigo-600">{totalCompletedModulesCount}</span>
                      <span className="text-[9px] font-semibold text-slate-400 block -mt-1">modules</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold">Execution Velocity looks excellent!</p>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      You're studying faster than 85% of other learners in high-CPM topics. Build 1 more project to expand XP!
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-150/45 dark:border-slate-800/20 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Level-up milestone:</span>
                  <span className="text-indigo-600">80 / 100 XP remaining</span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT SIDEBAR: RECENT VIEW & HIGHLIGHT RECOMMENDATIONS */}
        <div className="space-y-8">
          
          {/* Section: SHORT RECOMMENDATIONS CARD LIST */}
          <section className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-indigo-55/10 border-indigo-50 shadow-xs'
          }`}>
            <h3 className="text-sm font-extrabold tracking-tight mb-4 flex items-center justify-between">
              <span>Personalized Recommendations</span>
              <Compass size={16} className="text-indigo-500 animate-spin" />
            </h3>

            <div className="space-y-3">
              {finalRecs.map((topic, idx) => (
                <div 
                  key={topic.id || `rec-topic-${idx}`}
                  onClick={() => onViewCurriculum(topic.title)}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer hover:-translate-y-[1px] transition-all duration-200 group ${
                    isDarkMode ? 'bg-[#14171d]/60 border-slate-800 hover:border-indigo-500' : 'bg-white border-slate-150 hover:border-indigo-600'
                  }`}
                  title={`View details for ${topic.title}`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-bold truncate tracking-tight">{topic.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-medium text-indigo-500">{topic.category}</span>
                      <span>•</span>
                      <span>{topic.estimatedHours} Hours</span>
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full border border-transparent bg-slate-50 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ChevronRight size={14} />
                  </div>
                </div>
              ))}
            </div>

            <button
              id="home-discover-all-btn"
              onClick={onExploreTopics}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all hover:scale-[1.01]"
            >
              Discover all Topics
              <ArrowRight size={14} />
            </button>
          </section>

          {/* Section: BOOKMARK HIGHLIGHT STAT */}
          <section className={`p-6 rounded-3xl border flex gap-4 items-start ${
            isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'
          }`}>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl shrink-0">
              <Bookmark size={20} />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-extrabold text-slate-700 dark:text-slate-200">Study bookmarks ready</h4>
              <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                You have saved guides inside your cabinet. Go to the "Saved Resources" folder any time to study them.
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
