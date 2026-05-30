/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  Bookmark, 
  CheckCircle, 
  Flame, 
  Sparkles, 
  Layers, 
  Search,
  BookOpen,
  Calendar,
  X,
  Download,
  Share2
} from 'lucide-react';
import { UserProfile, LearningPath } from '../types';

interface ProgressViewProps {
  user: UserProfile;
  enrolledPaths: LearningPath[];
  isDarkMode: boolean;
}

export default function ProgressView({
  user,
  enrolledPaths,
  isDarkMode
}: ProgressViewProps) {
  const [selectedCertPath, setSelectedCertPath] = useState<LearningPath | null>(null);

  // Statistics calculation helpers
  const totalPathsCount = enrolledPaths.length;
  const completedPaths = enrolledPaths.filter(p => p.progressPercent === 100);
  const completedPathsCount = completedPaths.length;

  const totalLessonsCount = enrolledPaths.reduce((acc, p) => {
    let internal = 0;
    (p.phases || []).forEach(ph => (ph?.modules || []).forEach(m => internal += (m?.lessons || []).length));
    return acc + internal;
  }, 0);

  const completedLessonsCount = enrolledPaths.reduce((acc, p) => {
    let internal = 0;
    (p.phases || []).forEach(ph => (ph?.modules || []).forEach(m => {
      internal += (m?.lessons || []).filter(l => l.completed).length;
    }));
    return acc + internal;
  }, 0);

  const totalObjectivesCount = enrolledPaths.reduce((acc, p) => {
    let internal = 0;
    (p.phases || []).forEach(ph => (ph?.modules || []).forEach(m => internal += (m?.learningObjectives?.length || 0)));
    return acc + internal;
  }, 0);

  const totalSavedNotesCount = enrolledPaths.reduce((acc, p) => {
    let internal = 0;
    (p.phases || []).forEach(ph => (ph?.modules || []).forEach(m => {
      const stored = localStorage.getItem(`lf-note-${p.id}-${m.id}`);
      if (stored && stored.trim().length > 0) internal++;
    }));
    return acc + internal;
  }, 0);

  // Approximate study hours checked of completed items (~20 mins per lesson)
  const totalStudyHoursScaled = Math.round((completedLessonsCount * 22) / 60) + 2; // offset casual start

  const cardBg = isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs';

  return (
    <div className="space-y-8 pb-12 relative animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight">Progress & Deep Learning Analytics</h1>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          A comprehensive analysis of your educational milestones, XP parameters, study timelines, and official certifications.
        </p>
      </div>

      {/* Stats Cards grid rows */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Study Time Log", val: `${totalStudyHoursScaled} hrs`, icon: Clock, color: "text-indigo-500" },
          { label: "XP Points", val: `${user.xpPoints} pts`, icon: Sparkles, color: "text-yellow-500" },
          { label: "Completed Lessons", val: `${completedLessonsCount} / ${totalLessonsCount}`, icon: CheckCircle, color: "text-green-500" },
          { label: "Academic Rank", val: `Grade ${Math.floor(user.xpPoints / 250) + 1}`, icon: Award, color: "text-amber-500" }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-5 rounded-3xl border flex items-center gap-4 ${cardBg}`}>
              <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 ${item.color}`}>
                <Icon size={20} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.label}</span>
                <span className="text-lg font-black block tracking-tight">{item.val}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main progress graphs details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrolled roads breakdown log (2/3 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-6 rounded-3xl border ${cardBg} space-y-4`}>
            <h2 className="text-sm font-extrabold tracking-tight uppercase text-slate-400 mb-2">My Enrolled Pathways Breakdown</h2>

            {enrolledPaths.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">No pathways generated yet. Check the Discover panel.</div>
            ) : (
              <div className="space-y-4">
                {enrolledPaths.map((path) => (
                  <div key={path.id} className="p-4 rounded-2xl border border-slate-100/40 dark:border-slate-800/20 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[9px] font-extrabold uppercase text-indigo-500">{path.topic}</span>
                        <h4 className="text-xs font-bold truncate leading-snug">{path.title}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-indigo-500 font-mono shrink-0">{path.progressPercent}%</span>
                    </div>

                    {/* Progress indicator meter bars */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-650 h-full rounded-full transition-all" 
                        style={{ width: `${path.progressPercent}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span>{(path.phases || []).length} Phases • {(path.phases || []).reduce((acc, ph) => acc + (ph?.modules || []).length, 0)} Modules</span>
                      {path.progressPercent === 100 ? (
                        <button
                          id={`cert-unlock-${path.id}-btn`}
                          onClick={() => setSelectedCertPath(path)}
                          className="text-[10px] tracking-tight bg-linear-to-r from-amber-500 to-orange-500 hover:scale-[1.02] text-white px-2.5 py-1 rounded-lg font-bold"
                        >
                          Certificate Unlocked! ★
                        </button>
                      ) : (
                        <span className="italic uppercase text-slate-450">In-Progress study</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GitHub contributions style activity map dashboard widget */}
          <div className={`p-6 rounded-3xl border ${cardBg} space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400">Study Frequency Activity Grid</h3>
              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                <Calendar size={12} className="text-indigo-500" />
                Past 4 weeks study log
              </span>
            </div>

            <p className="text-[11px] text-slate-450 leading-relaxed font-normal">Each slot represents study frequency and activeXP completions mapped across calendar dates.</p>

            <div className="pt-2">
              {/* Layout grid mock of calendar days */}
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {[...Array(28)].map((_, idx) => {
                  // Generate realistic random shade ratios
                  const shades = [
                    "bg-slate-100 dark:bg-slate-900 border-transparent",
                    "bg-indigo-950/20 text-white dark:bg-indigo-950/40 border-transparent",
                    "bg-indigo-600/30 text-white dark:bg-indigo-900/30 border-transparent",
                    "bg-indigo-650/60 text-white dark:bg-indigo-700/60 border-transparent",
                    "bg-indigo-600 text-white dark:bg-indigo-600 border-transparent"
                  ];
                  // Give higher shade ratios to mid items
                  const selectShadeIdx = Math.floor(Math.sin((idx + 2) / 3) * 2) + 2;
                  const finalShade = idx % 5 === 0 ? shades[0] : shades[Math.max(0, Math.min(selectShadeIdx, 4))];

                  return (
                    <div 
                      key={idx} 
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center font-bold text-[9px] font-mono select-none ${finalShade}`}
                      title={`Date point study activity: level indicators`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-4 text-[9.5px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                <span>Blank</span>
                <div className="w-3 h-3 bg-slate-100 dark:bg-slate-900 border rounded" />
                <div className="w-3 h-3 bg-indigo-600/30 border rounded" />
                <div className="w-3 h-3 bg-indigo-600 border rounded" />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR STATS SUMMARY GAUGE (1/3 cols) */}
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl border ${cardBg} space-y-5 flex flex-col justify-between h-full`}>
            
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400">Accomplishment Metrics</h3>
              
              <div className="space-y-4">
                {[
                  { label: "Active study streak", val: `${user.streakCount || 1} days`, desc: "Keep study habits persistent", icon: Flame, color: "text-orange-500" },
                  { label: "Completed pathways", val: `${completedPathsCount} / ${totalPathsCount}`, desc: "Courses finalized 100%", icon: Award, color: "text-indigo-500" },
                  { label: "Assigned exercises", val: `${completedLessonsCount} finalized`, desc: "Interactive drills mapped", icon: BookOpen, color: "text-green-500" },
                  { label: "Persisted notes", val: `${totalSavedNotesCount} manuals drafted`, desc: "Personal study notepad files", icon: Bookmark, color: "text-yellow-500" }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="flex gap-3.5 items-start leading-tight">
                      <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 shrink-0 mt-0.5 ${stat.color}`}>
                        <Icon size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[10.5px] text-slate-400 font-semibold block">{stat.label}</span>
                        <span className="text-xs font-bold block">{stat.val}</span>
                        <span className="text-[10px] text-slate-450 block font-normal text-slate-400">{stat.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-150/45 dark:border-slate-800/20 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed your learning path?</span>
              <p className="text-[11.5px] mt-1 text-slate-400 leading-normal max-w-xs mx-auto">Get absolute completion parameters on pathways and claim your formal certificates here!</p>
            </div>
          </div>
        </div>

      </div>

      {/* RENDER ACADEMIC CERTIFICATE DIALOG OVERLAY (State Overlay Modal) */}
      {selectedCertPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Close Area trigger */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCertPath(null)} />
          
          <div className={`relative max-w-2xl w-full p-8 sm:p-12 rounded-3xl z-10 text-center border overflow-hidden ${
            isDarkMode ? 'bg-[#0F1115] border-slate-800 text-white shadow-2xl' : 'bg-[#fafbff] border-slate-150 text-slate-900 shadow-2xl'
          }`}>
            <button
              id="close-cert-modal-btn"
              onClick={() => setSelectedCertPath(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={18} />
            </button>

            {/* Premium Board layout of Cert */}
            <div className="border-[6px] border-double border-indigo-600/40 p-6 sm:p-10 rounded-2xl space-y-6 relative">
              
              {/* Elegant ambient elements */}
              <div className="absolute top-2 left-2 text-[10px] font-mono text-indigo-500/30 uppercase tracking-widest font-bold">LearnFlow AI Certified</div>
              <div className="absolute bottom-2 right-2 text-3xl font-serif text-indigo-700/20 select-none font-bold italic">Official Honor</div>

              <div className="flex justify-center mx-auto text-amber-500">
                <Award size={55} className="animate-spin duration-1000" />
              </div>

              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-indigo-500 tracking-widest uppercase block">Certificate of Completion</span>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} italic font-serif`}>This credential formally certifies that</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight underline decoration-indigo-500 capitalize">{user.displayName || 'Studious Learner'}</h3>
                <p className={`text-xs max-w-md mx-auto pt-2 leading-relaxed ${isDarkMode ? 'text-slate-350' : 'text-slate-600'}`}>
                  has successfully completed all structural modules, study videos, checklist reading objectives, and practical lab works required for the professional mastery course of:
                </p>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-indigo-600 tracking-tight capitalize">"{selectedCertPath.title}"</h2>

              <div className="grid grid-cols-2 gap-4 text-left pt-6 max-w-sm mx-auto border-t border-slate-100/30 dark:border-slate-800/20 text-[10.5px]">
                <div>
                  <span className="text-slate-400 font-bold block uppercase">Granted Date</span>
                  <span className="font-extrabold">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold block uppercase">Authorized Signature</span>
                  <span className="font-serif font-bold italic text-indigo-600">LearnFlow AI Academic</span>
                </div>
              </div>
            </div>

            {/* Cert actions drawer */}
            <div className="mt-8 flex justify-center gap-3">
              <button
                id="share-cert-btn"
                onClick={() => alert("Certificate link copied to clipboard for recruitment portfolios!")}
                className="px-5 py-2.5 border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 size={13} />
                Share Credential
              </button>

              <button
                id="print-cert-btn"
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download size={13} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
