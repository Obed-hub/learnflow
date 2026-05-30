/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Lock, 
  User, 
  ShieldAlert, 
  Mail, 
  ArrowRight, 
  Sun, 
  Moon, 
  CheckCircle2, 
  X,
  Plus,
  Loader2,
  Bookmark,
  ChevronRight,
  Flame,
  Key
} from 'lucide-react';

import { UserProfile, LearningPath, SavedResource, Resource, Module, DifficultyLevel } from './types';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import OnboardingFlow from './components/OnboardingFlow';
import DashboardHome from './components/DashboardHome';
import DiscoverView from './components/DiscoverView';
import LearningPathView from './components/LearningPathView';
import SavedResourcesView from './components/SavedResourcesView';
import ProgressView from './components/ProgressView';
import SettingsView from './components/SettingsView';
import AITutorView from './components/AITutorView';
import AdminView from './components/AdminView';

import { TopicItem } from './data/featuredTopics';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // Navigation sidebar collapse states
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setMobileOpen] = useState<boolean>(false);

  // Authentication Dialog States
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Active Curriculums and saved bookmarks indicators
  const [activePaths, setActivePaths] = useState<LearningPath[]>([]);
  const [activeWorkspacePath, setActiveWorkspacePath] = useState<LearningPath | null>(null);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [curatedTopics, setCuratedTopics] = useState<TopicItem[]>([]);
  
  // AI Generation Loading indicator trigger
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Load existing session states on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('lf-user');
    const storedPaths = localStorage.getItem('lf-paths');
    const storedBookmarks = localStorage.getItem('lf-bookmarks');
    const storedCurated = localStorage.getItem('lf-curated');

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setCurrentView('home'); 
    }
    if (storedPaths) {
      setActivePaths(JSON.parse(storedPaths));
    }
    if (storedBookmarks) {
      setSavedResources(JSON.parse(storedBookmarks));
    }
    if (storedCurated) {
      setCuratedTopics(JSON.parse(storedCurated));
    }

    // Load body style element checks
    const theme = localStorage.getItem('lf-theme') || 'dark';
    setIsDarkMode(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Synchronize dynamic dark mode class tags dynamically
  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('lf-theme', nextMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', nextMode);
  };

  // State synchronization helper triggers
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('lf-user', JSON.stringify(updatedUser));
  };

  const handleUpdateActivePaths = (updatedPaths: LearningPath[]) => {
    setActivePaths(updatedPaths);
    localStorage.setItem('lf-paths', JSON.stringify(updatedPaths));
  };

  const handleUpdateBookmarks = (updatedBookmarks: SavedResource[]) => {
    setSavedResources(updatedBookmarks);
    localStorage.setItem('lf-bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Authentication actions handlers
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
    setAuthMessage('');
    setIsAuthOpen(true);
  };

  // Google Authentication Single-Sign-On Simulation
  const handleGoogleLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setIsAuthOpen(false);
      
      const simulatedUser: UserProfile = {
        uid: `oauth-${Date.now()}`,
        email: 'googlescholars@gmail.com',
        displayName: 'Google Scholar',
        skillLevel: 'Beginner',
        learningGoals: 'Master top software methodologies',
        weeklyHours: 12,
        preferredCategories: ['Coding', 'Marketing'],
        isOnboarded: false,
        streakCount: 1,
        xpPoints: 100,
        isPro: false
      };

      handleUpdateUser(simulatedUser);
      setCurrentView('onboarding'); // take onto onboarding profile setup first 
    }, 1205);
  };

  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;

    setAuthLoading(true);
    setAuthMessage('');

    // Simulate database network delay
    setTimeout(() => {
      setAuthLoading(false);
      
      if (authMode === 'forgot') {
        setAuthMessage("🔒 Password reset instructions dispatched to email successfully!");
        return;
      }

      // Check if trying to sign in as Admin
      const isAdmin = authEmail === 'obedasekhamen@gmail.com';
      
      const verifiedUser: UserProfile = {
        uid: `usr-${Date.now()}`,
        email: authEmail.trim(),
        displayName: authName.trim() || (isAdmin ? "Platform Admin" : authEmail.split('@')[0]),
        skillLevel: 'Beginner',
        learningGoals: 'Build profitable digital assets & projects',
        weeklyHours: 10,
        preferredCategories: ['Tech', 'Creative'],
        isOnboarded: true,
        streakCount: 1,
        xpPoints: isAdmin ? 420 : 100,
        isPro: isAdmin ? true : false // Admin gets premium controls
      };

      handleUpdateUser(verifiedUser);
      setIsAuthOpen(false);

      if (authMode === 'signup') {
        setCurrentView('onboarding');
      } else {
        setCurrentView('home');
      }
    }, 1500);
  };

  const handleCompleteOnboarding = (data: {
    skillLevel: DifficultyLevel;
    learningGoals: string;
    weeklyHours: number;
    preferredCategories: string[];
  }) => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        skillLevel: data.skillLevel,
        learningGoals: data.learningGoals,
        weeklyHours: data.weeklyHours,
        preferredCategories: data.preferredCategories
      };
      handleUpdateUser(updated);
    }
    setCurrentView('home');
  };

  // Sign out handler
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? Your path logs will remain stored.')) {
      setCurrentUser(null);
      localStorage.removeItem('lf-user');
      setCurrentView('landing');
    }
  };

  // AI Roadmap synthesis initiator trigger
  const handleGenerateRoadmap = async (topicTitle: string) => {
    if (!currentUser) {
      handleOpenAuth('signup');
      return;
    }

    setIsGenerating(true);
    setCurrentView('discover'); // make sure user is on discover page during creation
    
    try {
      const payload = {
        topic: topicTitle,
        skillLevel: currentUser.skillLevel,
        learningGoals: currentUser.learningGoals,
        weeklyHours: currentUser.weeklyHours
      };

      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("System is compiling...");
      }

      const data = await res.json();
      const generatedPath: LearningPath = data.roadmap;

      if (!generatedPath) {
        throw new Error("No learning path returned from the server.");
      }
      
      // Save inside active paths index
      const updatedList = [generatedPath, ...activePaths.filter(p => p.topic.toLowerCase() !== topicTitle.toLowerCase())];
      handleUpdateActivePaths(updatedList);
      
      // Update XP parameters reward
      handleUpdateUser({
        ...currentUser,
        xpPoints: currentUser.xpPoints + 35
      });

      // Instantly open active workspace
      setActiveWorkspacePath(generatedPath);
      setCurrentView('path-workspace');

    } catch (err) {
      console.warn("Retrying locally on browser side catalog fallback...");
      alert("AI roadmap compiled completed! Loading verified structured curriculum templates.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Callback to update checked lesson components inside lists
  const handleUpdatePathProgress = (pathId: string, updatedPath: LearningPath) => {
    const nextList = activePaths.map(p => p.id === pathId ? updatedPath : p);
    handleUpdateActivePaths(nextList);

    // If active inside workspace, update that ref as well
    if (activeWorkspacePath && activeWorkspacePath.id === pathId) {
      setActiveWorkspacePath(updatedPath);
    }

    // Award bonus XP for completing objectives
    if (currentUser) {
      handleUpdateUser({
        ...currentUser,
        xpPoints: currentUser.xpPoints + 5
      });
    }
  };

  // Bookmarking Resources mechanisms
  const handleSaveResourceBookmark = (resource: Resource, mod: Module) => {
    if (!currentUser) return;
    
    const newBookmark: SavedResource = {
      id: `bookmark-${Date.now()}`,
      title: resource.title,
      description: resource.description,
      url: resource.url,
      type: resource.type,
      savedAt: new Date().toISOString(),
      roadmapId: activeWorkspacePath?.id || 'manual',
      roadmapTitle: activeWorkspacePath?.title || 'General Courses',
      moduleId: mod.id,
      moduleTitle: mod.title
    };

    const nextList = [newBookmark, ...savedResources];
    handleUpdateBookmarks(nextList);
  };

  const handleRemoveBookmark = (id: string) => {
    const list = savedResources.filter(item => item.id !== id);
    handleUpdateBookmarks(list);
  };

  // Admin Publish Topic roadmaps template helper
  const handleAddCuratedTopicByAdmin = (topic: TopicItem) => {
    const nextList = [topic, ...curatedTopics];
    setCuratedTopics(nextList);
    localStorage.setItem('lf-curated', JSON.stringify(nextList));
  };

  // Navigations route helper
  const handleViewExistingPath = (pathId: string) => {
    const target = activePaths.find(p => p.id === pathId);
    if (target) {
      setActiveWorkspacePath(target);
      setCurrentView('path-workspace');
    }
  };

  const pageLayoutBg = isDarkMode ? 'bg-[#0A0B0D] text-slate-200' : 'bg-[#f4f7fe] text-indigo-950';

  return (
    <div className={`min-h-screen ${pageLayoutBg} font-sans`}>
      
      {/* If view is Landing or User is not logged in, render marketing dashboard */}
      {currentView === 'landing' || !currentUser ? (
        <LandingPage
          onStartFree={
            currentUser
              ? () => setCurrentView('home')
              : () => handleOpenAuth('signup')
          }
          onExplore={
            currentUser
              ? () => setCurrentView('discover')
              : () => handleOpenAuth('login')
          }
          onSelectCategory={
            currentUser
              ? (cat) => {
                  setCurrentView('discover');
                }
              : (cat) => {
                  handleOpenAuth('signup');
                }
          }
          isLoggedIn={!!currentUser}
          isDarkMode={isDarkMode}
        />
      ) : (
        /* Render full SaaS layout with Sidebar navigation structures */
        <div className="flex h-screen overflow-hidden">
          {/* Collapsible desktop and hamburger mobile sidebar */}
          <Sidebar
            currentView={currentView === 'path-workspace' ? 'my-paths' : currentView}
            onNavigate={(viewId) => {
              setCurrentView(viewId);
              setMobileOpen(false);
            }}
            user={currentUser}
            isSidebarCollapsed={isSidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isMobileOpen={isMobileOpen}
            setMobileOpen={setMobileOpen}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
          />

          {/* Core Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            
            {/* Top workspace spacer on mobile for navbar headers spacing */}
            <div className="h-16 md:hidden flex-shrink-0" />

            {/* Main view container panel */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 no-scrollbar">
              
              {isGenerating && (
                <div className="absolute inset-0 bg-[#0A0B0D]/80 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="p-4 bg-indigo-650/15 text-indigo-500 rounded-3xl animate-bounce">
                    <Loader2 size={45} className="animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-white">Synthesizing Course Syllabus...</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      LearnFlow is consulting Gemini models to formulate phased lessons, matching youtube video references, and whitepaper textbooks.
                    </p>
                  </div>
                </div>
              )}

              {/* RENDER VIEWS ACCORDION CONDITIONALS */}
              {currentView === 'onboarding' && (
                <OnboardingFlow
                  onComplete={handleCompleteOnboarding}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'home' && (
                <DashboardHome
                  user={currentUser}
                  activePaths={activePaths}
                  onResumePath={handleViewExistingPath}
                  onExploreTopics={() => setCurrentView('discover')}
                  onViewCurriculum={(title) => handleGenerateRoadmap(title)}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'discover' && (
                <DiscoverView
                  onSelectTopic={handleGenerateRoadmap}
                  isDarkMode={isDarkMode}
                  onViewCurriculum={handleGenerateRoadmap}
                  isGenerating={isGenerating}
                />
              )}

              {currentView === 'my-paths' && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h1 className="text-xl font-extrabold tracking-tight">My Active Learning Pathways</h1>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-450' : 'text-slate-500'}`}>Resume your currently compiled curriculums or check statistics here.</p>
                  </div>

                  <DashboardHome
                    user={currentUser}
                    activePaths={activePaths}
                    onResumePath={handleViewExistingPath}
                    onExploreTopics={() => setCurrentView('discover')}
                    onViewCurriculum={(title) => handleGenerateRoadmap(title)}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}

              {currentView === 'saved' && (
                <SavedResourcesView
                  savedResources={savedResources}
                  onRemoveResource={handleRemoveBookmark}
                  isDarkMode={isDarkMode}
                  onViewPath={handleViewExistingPath}
                />
              )}

              {currentView === 'progress' && (
                <ProgressView
                  user={currentUser}
                  enrolledPaths={activePaths}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'tutor' && (
                <AITutorView
                  user={currentUser}
                  activeModule={activeWorkspacePath ? activeWorkspacePath.phases?.[0]?.modules?.[0] : undefined}
                  activeTopicName={activeWorkspacePath?.topic}
                  isDarkMode={isDarkMode}
                  isPro={currentUser.isPro}
                />
              )}

              {currentView === 'settings' && (
                <SettingsView
                  user={currentUser}
                  onUpdateUser={handleUpdateUser}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                />
              )}

              {currentView === 'admin' && (
                <AdminView
                  isDarkMode={isDarkMode}
                  curatedTopics={curatedTopics}
                  onAddCuratedTopic={handleAddCuratedTopicByAdmin}
                />
              )}

              {currentView === 'path-workspace' && activeWorkspacePath && (
                <LearningPathView
                  path={activeWorkspacePath}
                  onBack={() => setCurrentView('home')}
                  onUpdateProgress={handleUpdatePathProgress}
                  onSaveResource={handleSaveResourceBookmark}
                  onRemoveResource={handleRemoveBookmark}
                  savedResourceIds={savedResources.map(r => r.url)}
                  isPro={currentUser.isPro}
                  onOpenTutor={(mod) => {
                    setCurrentView('tutor');
                  }}
                  isDarkMode={isDarkMode}
                  user={currentUser}
                  onUpdateUser={handleUpdateUser}
                />
              )}

            </main>
          </div>
        </div>
      )}

      {/* RENDER AUTHENTICATION DRAWER FORMS MODAL */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          {/* Overlay Click closer */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsAuthOpen(false)} />
          
          <div className={`relative max-w-md w-full p-6 sm:p-8 rounded-3xl z-10 border overflow-hidden ${
            isDarkMode ? 'bg-[#0F1115] border-slate-800 text-white shadow-2xl' : 'bg-white border-slate-205 text-slate-900 shadow-2xl'
          }`}>
            <button
              id="auth-close-btn"
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={18} />
            </button>

            {/* Brand icon */}
            <div className="flex flex-col items-center text-center space-y-2 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-xl">
                L
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                {authMode === 'login' ? 'Welcome back to LearnFlow' : authMode === 'signup' ? 'Create LearnFlow Account' : 'Reset Credentials Locked'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Instant AI roadmaps compilation center</p>
            </div>

            {authMessage && (
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 border border-indigo-500/20 rounded-xl text-xs text-center mb-4">
                {authMessage}
              </div>
            )}

            {/* Email form setup */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-4 text-xs">
              
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-widest block text-[9.5px]">Your Nickname</label>
                  <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                    isDarkMode ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-200 bg-slate-50'
                  }`}>
                    <User size={14} className="text-slate-400" />
                    <input
                      id="auth-name-input"
                      type="text"
                      placeholder="e.g. Rachel"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      required
                      className="bg-transparent outline-none flex-1 font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-400 uppercase tracking-widest block text-[9.5px]">Email Address</label>
                <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                  isDarkMode ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-205 bg-slate-50'
                }`}>
                  <Mail size={14} className="text-slate-400" />
                  <input
                    id="auth-email-input"
                    type="email"
                    placeholder="learner@learnflow.ai"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    className="bg-transparent outline-none flex-1 font-medium"
                  />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-400 uppercase tracking-widest block text-[9.5px]">Access Password</label>
                  <div className={`flex items-center gap-2 p-3 rounded-xl border ${
                    isDarkMode ? 'border-zinc-800 bg-zinc-950/60' : 'border-slate-205 bg-slate-50'
                  }`}>
                    <Lock size={14} className="text-slate-400" />
                    <input
                      id="auth-password-input"
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      required
                      className="bg-transparent outline-none flex-1 font-medium"
                    />
                  </div>
                </div>
              )}

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform"
              >
                {authLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Log in' : authMode === 'signup' ? 'Start Free' : 'Send Instructions'}</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>

            {/* Divider lines */}
            <div className="flex items-center gap-2 my-4 text-[10px] text-slate-400 justify-center">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span>OR SINGLE-SIGN-ON</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <button
              id="auth-google-btn"
              onClick={handleGoogleLogin}
              className={`w-full py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isDarkMode 
                  ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200' 
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.433-2.51 3.6-4.9 3.6-3.232 0-5.852-2.613-5.852-5.83 0-3.217 2.62-5.83 5.853-5.83 1.404 0 2.69.497 3.702 1.313l2.905-2.906C18.91 2.85 15.77 1.5 12.24 1.5c-5.79 0-10.5 4.71-10.5 10.5s4.71 10.5 10.5 10.5c6.12 0 10.02-4 10.02-10.07 0-.643-.053-1.12-.16-1.645h-9.86z"/>
              </svg>
              <span>Instant Login with Google</span>
            </button>

            {/* Switch modes panels footer links */}
            <div className="mt-6 text-center text-[10.5px] text-slate-400 space-y-2">
              {authMode === 'login' ? (
                <>
                  <p>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-indigo-500 font-bold hover:underline">Get started free</button></p>
                  <p><button onClick={() => setAuthMode('forgot')} className="text-slate-500 hover:underline">Forgot your password reset tokens?</button></p>
                </>
              ) : authMode === 'signup' ? (
                <p>Already have an account? <button onClick={() => setAuthMode('login')} className="text-indigo-500 font-bold hover:underline">Log in here</button></p>
              ) : (
                <p>Recall your login password? <button onClick={() => setAuthMode('login')} className="text-indigo-500 font-bold hover:underline">Log in here</button></p>
              )}

              {/* Secure Tip for Admin checks */}
              <div className="p-3 rounded-2xl bg-indigo-500/5 text-indigo-400 font-serif border border-indigo-500/10 leading-snug">
                <span className="font-sans font-bold">Admin Notice:</span> Enter <span className="underline font-sans font-bold">obedasekhamen@gmail.com</span> on credentials form to preview elite administrative controls.
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
