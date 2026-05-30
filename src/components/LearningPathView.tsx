/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckSquare, 
  Square, 
  ExternalLink, 
  Clock, 
  FileText, 
  Bookmark, 
  BookmarkCheck,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  Video,
  ListTodo,
  Bot,
  Terminal,
  Save,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { LearningPath, Module, Resource, YouTubeVideo, Lesson, UserProfile } from '../types';
import ModuleQuiz from './ModuleQuiz';

interface LearningPathViewProps {
  path: LearningPath;
  onBack: () => void;
  onUpdateProgress: (pathId: string, updatedPath: LearningPath) => void;
  onSaveResource: (resource: Resource, module: Module) => void;
  onRemoveResource: (id: string) => void;
  savedResourceIds: string[];
  isPro: boolean;
  onOpenTutor: (contextModule?: Module) => void;
  isDarkMode: boolean;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

export default function LearningPathView({
  path,
  onBack,
  onUpdateProgress,
  onSaveResource,
  onRemoveResource,
  savedResourceIds,
  isPro,
  onOpenTutor,
  isDarkMode,
  user,
  onUpdateUser
}: LearningPathViewProps) {
  // Find initially incomplete module or default to the first module
  const [activeModuleId, setActiveModuleId] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [notesText, setNotesText] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Find all modules inside this path
  const allModules: { mod: Module; phaseName: string }[] = [];
  (path?.phases || []).forEach(ph => {
    (ph?.modules || []).forEach(m => {
      allModules.push({ mod: m, phaseName: ph.name });
    });
  });

  // Pick first module on mount if activeModuleId is empty
  useEffect(() => {
    if (allModules.length > 0 && !activeModuleId) {
      setActiveModuleId(allModules[0].mod.id);
      if (allModules[0].mod.videos && allModules[0].mod.videos.length > 0) {
        setActiveVideo(allModules[0].mod.videos[0]);
      }
    }
  }, [path, activeModuleId, allModules]);

  // Handle active workspace selected module
  const activeObj = allModules.find(item => item.mod.id === activeModuleId);
  const activeModule = activeObj?.mod;

  // Load persisted note values from localStorage on module swap
  useEffect(() => {
    if (activeModuleId) {
      const stored = localStorage.getItem(`lf-note-${path.id}-${activeModuleId}`);
      setNotesText(stored || '');
      setSaveStatus('');
    }
  }, [activeModuleId, path.id]);

  if (!activeModule) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading active workspace curriculum...
      </div>
    );
  }

  // Update complete checklist items
  const handleToggleLesson = (lessonId: string) => {
    const updatedPhases = (path.phases || []).map(ph => {
      return {
        ...ph,
        modules: (ph.modules || []).map(mod => {
          if (mod.id !== activeModule.id) return mod;
          return {
            ...mod,
            lessons: (mod.lessons || []).map(les => {
              if (les.id !== lessonId) return les;
              return { ...les, completed: !les.completed };
            })
          };
        })
      };
    });

    // Recalculate total completed percentage value
    let totalLessons = 0;
    let completedLessons = 0;
    updatedPhases.forEach(ph => {
      (ph.modules || []).forEach(m => {
        (m.lessons || []).forEach(l => {
          totalLessons++;
          if (l.completed) completedLessons++;
        });
      });
    });

    // Percent scale bounds
    const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    onUpdateProgress(path.id, {
      ...path,
      phases: updatedPhases,
      progressPercent
    });
  };

  // Bookmark toggler handler
  const isBookmarked = (id: string) => savedResourceIds.includes(id);

  const handleToggleBookmark = (res: Resource) => {
    if (isBookmarked(res.id)) {
      onRemoveResource(res.id);
    } else {
      onSaveResource(res, activeModule);
    }
  };

  // Save notes locally
  const handleSaveNotes = () => {
    if (!isPro) {
      setSaveStatus("Notes is a Pro Level Feature");
      return;
    }
    localStorage.setItem(`lf-note-${path.id}-${activeModule.id}`, notesText);
    setSaveStatus("Saved successfully!");
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const contentBg = isDarkMode ? 'bg-[#0F1115]' : 'bg-white border text-slate-900 border-slate-100';
  const sidebarItemStyle = isDarkMode 
    ? 'hover:bg-slate-800/50 text-slate-300' 
    : 'hover:bg-slate-50 text-slate-600';
  
  const totalModCompleted = activeModule.lessons.filter(l => l.completed).length === activeModule.lessons.length && activeModule.lessons.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-200/50 dark:border-slate-800/40">
        <div className="flex items-center gap-3">
          <button
            id="path-view-back-btn"
            onClick={onBack}
            className={`p-2 rounded-xl border ${
              isDarkMode ? 'border-slate-800 hover:bg-slate-900 text-slate-300' : 'border-slate-205 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{path.topic} Roadmap</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-500">
                {path.progressPercent}% Complete
              </span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight">{path.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="path-open-tutor-btn"
            onClick={() => onOpenTutor(activeModule)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-transform hover:scale-[1.01]"
          >
            <Bot size={15} />
            Ask AI Tutor
          </button>
        </div>
      </div>

      {/* Main Dual Pane grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPONENT: STICKY PROGRESS DIRECTORY (4cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-4 rounded-3xl border ${contentBg} space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 mt-1">Syllabus Outline</h3>
            
            {(path.phases || []).map((phase) => (
              <div key={phase.id} className="space-y-1.5">
                <div className="text-[10.5px] font-extrabold tracking-wide text-indigo-500 px-2.5 py-1 uppercase bg-indigo-50/10 dark:bg-indigo-950/20 rounded-lg">
                  {phase.name}
                </div>

                <div className="space-y-1">
                  {(phase.modules || []).map((mod) => {
                    const isSelected = activeModuleId === mod.id;
                    const modCompleted = (mod.lessons || []).every(l => l.completed) && (mod.lessons || []).length > 0;
                    
                    return (
                      <button
                        key={mod.id}
                        id={`outline-module-${mod.id}-btn`}
                        onClick={() => {
                          setActiveModuleId(mod.id);
                          if (mod.videos && mod.videos.length > 0) {
                            setActiveVideo(mod.videos[0]);
                          }
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between gap-3 transition-all ${
                          isSelected 
                            ? 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20' 
                            : sidebarItemStyle
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            modCompleted ? 'bg-green-500' : isSelected ? 'bg-indigo-600 animate-ping' : 'bg-slate-350'
                          }`} />
                          <span className="truncate">{mod.title}</span>
                        </div>
                        <div className="flex-shrink-0 flex items-center text-slate-400">
                          {modCompleted ? (
                            <CheckSquare size={13} className="text-green-500" />
                          ) : (
                            <ChevronRight size={13} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COMPONENT: INTERACTIVE DESK WORKSPACE (8cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`p-6 rounded-3xl border ${contentBg} space-y-6`}>
            
            {/* Active module descriptor header */}
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeObj?.phaseName}</span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 font-mono">
                  <Clock size={11} />
                  Est: {activeModule.estimatedTime}
                </span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">{activeModule.title}</h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeModule.description}
              </p>
            </div>

            {/* Checklists Objectives Card */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ListTodo size={14} />
                <span>Lessons & Objectives Checklist</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeModule.lessons || []).map((les) => (
                  <button
                    key={les.id}
                    id={`toggle-lesson-${les.id}-btn`}
                    onClick={() => handleToggleLesson(les.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      les.completed 
                        ? 'bg-green-500/5 border-green-500/20 text-green-700 dark:text-green-400' 
                        : isDarkMode ? 'border-slate-800 hover:bg-slate-900/60' : 'border-slate-205 hover:bg-slate-50'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {les.completed ? (
                        <CheckSquare size={16} className="text-green-500 fill-green-500/20" />
                      ) : (
                        <Square size={16} className="text-slate-400" />
                      )}
                    </span>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold leading-tight block">{les.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 block tracking-tight">Est: {les.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive video component */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Video size={14} />
                <span>Recommended Video Tutorials</span>
              </h3>

              {activeModule.videos && activeModule.videos.length > 0 ? (
                <div className="space-y-4">
                  {/* Embedded Player frame iframe helper */}
                  {activeVideo && (
                    <div className="space-y-3">
                      <div className="aspect-video bg-[#05060a] rounded-3xl overflow-hidden relative border border-slate-800">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${activeVideo.id}`}
                          title={activeVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <div className="flex items-start justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150/45 dark:border-slate-800/20">
                        <div className="space-y-1">
                          <p className="text-xs font-bold leading-tight">{activeVideo.title}</p>
                          <div className="flex items-center gap-2 text-[10.5px] text-slate-400">
                            <span className="font-semibold text-indigo-500">{activeVideo.channel}</span>
                            <span>•</span>
                            <span>{activeVideo.viewCount} views</span>
                            <span>•</span>
                            <span>{activeVideo.duration} Duration</span>
                          </div>
                        </div>

                        <a
                          href={`https://youtube.com/watch?v=${activeVideo.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-[10.5px] font-bold flex items-center gap-1 shrink-0 text-slate-600 dark:text-slate-300"
                        >
                          <span>Open in YT</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Other optional video list selectors */}
                  {(activeModule.videos || []).length > 1 && (
                    <div className="grid grid-cols-2 gap-3">
                      {(activeModule.videos || []).map((vid) => (
                        <button
                          key={vid.id}
                          id={`select-video-${vid.id}-btn`}
                          onClick={() => setActiveVideo(vid)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            activeVideo?.id === vid.id 
                              ? 'border-indigo-600 bg-indigo-50/5 dark:bg-indigo-950/10' 
                              : isDarkMode ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-150 hover:bg-slate-50'
                          }`}
                        >
                          <div className="w-14 aspect-video bg-slate-900 rounded-lg overflow-hidden shrink-0">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0 pr-1">
                            <p className="text-[11px] font-bold truncate leading-tight block">{vid.title}</p>
                            <p className="text-[9.5px] text-slate-400 truncate block mt-0.5">{vid.channel}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No referenced YouTube visual files linked.</div>
              )}
            </div>

            {/* Read resources and links with bookmarks */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={14} />
                <span>Free Curated Resources & Guides</span>
              </h3>

              <div className="space-y-2">
                {(activeModule.resources || []).length > 0 ? (
                  (activeModule.resources || []).map((res) => {
                    const saved = isBookmarked(res.id);
                    return (
                      <div
                        key={res.id}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-4 ${
                          isDarkMode ? 'border-slate-800 bg-slate-900/10' : 'border-slate-150 bg-slate-50/30'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold text-indigo-500 uppercase tracking-widest px-1 bg-indigo-50 dark:bg-indigo-950 rounded">
                              {res.type}
                            </span>
                            <span className="text-xs font-bold truncate block">{res.title}</span>
                          </div>
                          <p className={`text-[10.5px] leading-relaxed truncate block max-w-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {res.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Toggle read documentation bookmark */}
                          <button
                            id={`toggle-bookmark-${res.id}-btn`}
                            onClick={() => handleToggleBookmark(res)}
                            className={`p-2 rounded-xl transition-all border ${
                              saved 
                                ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-500' 
                                : 'border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400'
                            }`}
                            title={saved ? "Saved in bookmarks" : "Save in Cabinet"}
                          >
                            {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                          </button>

                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-350"
                            title="Open external documentation link"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-400 italic">No free academic references linked yet.</div>
                )}
              </div>
            </div>

            {/* Practical exercises workspace */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal size={14} />
                <span>Actionable Practical Exercises</span>
              </h3>

              {(activeModule.exercises || []).length > 0 ? (
                <div className={`p-4 rounded-3xl border space-y-3 ${
                  isDarkMode ? 'bg-[#0A0B0D] border-slate-800' : 'bg-slate-50/50 border-slate-200'
                }`}>
                  {(activeModule.exercises || []).map((exe, idx) => (
                    <div key={idx} className="flex gap-3 leading-normal text-xs items-start">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-indigo-300/30">
                        {idx + 1}
                      </div>
                      <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{exe}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">No practical guidelines found. Experiment at own leisure!</div>
              )}
            </div>

            {/* Pro only learning notes block */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Interactive Notepad
                </h3>
                {!isPro && (
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase">
                    PRO LOCKED
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <textarea
                  id="notepad-textarea"
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder={
                    isPro 
                      ? "Draft your key study insights, code templates, or research summaries here. They will persist locally." 
                      : "Upgrade to pro inside Settings to write and save customizable learning notes per module!"
                  }
                  disabled={!isPro}
                  className={`w-full min-h-24 p-3 rounded-2xl border text-xs focus:bg-transparent ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-500' 
                      : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-600'
                  } outline-none transition-all`}
                />
                
                {isPro && (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 leading-none">{saveStatus}</span>
                    <button
                      id="save-notes-btn"
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-transform hover:scale-[1.01]"
                    >
                      <Save size={13} />
                      Save notes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Assessment Workbook Quiz */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HelpCircle size={14} />
                <span>AI Assessment Workbook & Quizzes</span>
              </h3>
              
              <ModuleQuiz
                module={activeModule}
                pathId={path.id}
                user={user}
                onUpdateUser={onUpdateUser}
                isDarkMode={isDarkMode}
                isPro={isPro}
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
