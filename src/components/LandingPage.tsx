/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Play, 
  Users, 
  Star, 
  BookOpen, 
  Video, 
  Award, 
  Zap, 
  Check, 
  DollarSign, 
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { FEATURED_CATEGORIES } from '../data/featuredTopics';

interface LandingPageProps {
  onStartFree: () => void;
  onExplore: () => void;
  onSelectCategory: (category: string) => void;
  isLoggedIn: boolean;
  isDarkMode: boolean;
}

export default function LandingPage({
  onStartFree,
  onExplore,
  onSelectCategory,
  isLoggedIn,
  isDarkMode
}: LandingPageProps) {

  const testimonials = [
    {
      name: "Sophia Martinez",
      role: "Freelance Designer",
      text: "LearnFlow generated an incredible Custom UI/UX Roadmap that helped me master Figma and secure three major clients in under two months. The curated YouTube videos were perfectly targeted!",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "Ethan Wright",
      role: "Indie Hacker & Developer",
      text: "I wanted to build a SaaS but had huge gaps in server-side TypeScript. In 10 seconds, LearnFlow mapped out a beautiful step-by-step path, and the AI tutor explained the middleware issues instantly.",
      rating: 5,
      avatar: "EW"
    },
    {
      name: "Aisha Vance",
      role: "Digital Marketer",
      text: "Amazon KDP looked overwhelming. LearnFlow simplified everything down to daily micro-lessons, and the Canva templates saved me hours of cover calculation error trial-and-error.",
      rating: 5,
      avatar: "AV"
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0A0B0D] text-slate-100' : 'bg-[#fafbfe] text-slate-900'} font-sans antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white`}>
      {/* Navbar overlay */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDarkMode ? 'bg-[#0A0B0D]/80 border-slate-900' : 'bg-[#fafbfe]/80 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-base shadow-sm">
              L
            </div>
            <span className="text-md font-bold tracking-tight">
              LearnFlow <span className="text-indigo-600">AI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              id="landing-explore-nav-btn"
              onClick={onExplore}
              className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'} transition-all`}
            >
              Explore Topics
            </button>
            <button 
              id="landing-signin-nav-btn"
              onClick={onStartFree}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs tracking-tight hover:bg-indigo-700 transition-all shadow-xs hover:scale-[1.02]"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Start Learning Free'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Blur circles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-24 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/40 dark:border-indigo-950/40 text-xs font-bold leading-none mb-6 animate-pulse">
          <Sparkles size={12} />
          <span>Next-Generation Personalized Roadmaps</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Learn Anything With <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">AI-Powered</span> Learning Paths
        </h1>

        <p className={`mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
          Turn any skill, career target, or curiosity into a structured step-by-step roadmap packed with curated YouTube educational videos, free learning text resources, and custom progress tracking.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            id="landing-hero-start-btn"
            onClick={onStartFree}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold tracking-tight shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all"
          >
            {isLoggedIn ? 'Open Application' : 'Start Learning Free'}
            <ArrowRight size={18} />
          </button>
          
          <button
            id="landing-hero-explore-btn"
            onClick={onExplore}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border rounded-2xl font-bold tracking-tight transition-all ${
              isDarkMode 
                ? 'border-slate-800 hover:bg-slate-900 text-slate-100' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            Explore Roadmaps
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dashboard Preview mockup panel */}
        <div className="mt-16 relative rounded-3xl p-2 border border-slate-205/50 dark:border-slate-800/80 bg-slate-100/10 dark:bg-slate-900/10 backdrop-blur-md max-w-5xl mx-auto shadow-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0A0B0D] aspect-16/10 flex flex-col items-start text-left shadow-lg">
            {/* Mock Header */}
            <div className={`w-full h-11 border-b flex items-center px-4 justify-between ${isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className={`text-xs px-12 py-1 rounded-sm w-72 text-center truncate ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                learnflow.ai/dashboard/amazon-kdp
              </div>
              <div className="w-12 h-2" />
            </div>
            {/* Mock Inside Workspace content */}
            <div className="p-6 flex-1 w-full flex flex-col md:flex-row gap-6 overflow-hidden">
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <div className="inline-flex gap-2 items-center text-[11px] font-bold text-indigo-500">
                    <BookOpen size={12} />
                    <span>PHASE 1: RESEARCH MECHANICS</span>
                  </div>
                  <h3 className="text-xl font-bold">Market Research & Profitable Niches</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Execute keyword research to locate high-demand, low-competition journal categories.</p>
                </div>
                <div className="aspect-video bg-slate-200 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center relative overflow-hidden group border border-slate-300/40 dark:border-slate-700/40">
                  <span className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={20} fill="currentColor" className="ml-1" />
                  </span>
                  <div className="absolute bottom-3 left-3 bg-black/75 px-3 py-1 rounded-md text-[10px] text-white font-mono tracking-tight">
                    Videos included • 18 mins
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 space-y-4">
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">AI Tutor Assistant</h4>
                  <div className="space-y-2 text-xs">
                    <p className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>How do I calculate spine thickness for a 120 page journal cover?</p>
                    <p className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-medium">Spine thickness is calculated as: Page Count * coefficient (0.00225 inches for cream paper).</p>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                  <span className="text-xs font-bold">Module completed</span>
                  <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xs font-bold">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof metrics */}
      <section className={`py-12 border-y ${isDarkMode ? 'bg-[#0F1115]/30 border-slate-800/60' : 'bg-indigo-50/10 border-indigo-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">142,500+</p>
            <p className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Learning paths created</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">500+</p>
            <p className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Topics successfully mapped</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">99.4%</p>
            <p className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>User satisfaction rating</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">1.8M+</p>
            <p className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Videos completed</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h2 className="text-3xl font-extrabold tracking-tight">How LearnFlow AI Works</h2>
        <p className={`mt-3 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} max-w-lg mx-auto`}>
          We programmatically scan, structure, and filter resources so you can master skills with zero distraction.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {[
            { step: "1", title: "Enter Any Topic", desc: "Type in any skill, technology, or business model you want to acquire (e.g., 'Amazon KDP')." },
            { step: "2", title: "AI Formulates Path", desc: "Our engine curates difficulty phases, objective scopes, reading lists, and exercises." },
            { step: "3", title: "Direct Video Tutoring", desc: "We index matching step-by-step videos. Stream lesson nodes directly inside the player workspace." },
            { step: "4", title: "Track Progress & AI Chat", desc: "Log active streak values, bookmarks, notes, and solve tricky concepts with the chat coach." }
          ].map((item, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border text-left relative ${isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold mb-4">
                {item.step}
              </div>
              <h3 className="text-md font-bold mb-2">{item.title}</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Featured Categories badge list */}
      <section className={`py-20 ${isDarkMode ? 'bg-slate-900/10' : 'bg-indigo-50/20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Explore Ready Learning Paths</h2>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Click on any high-interest skill to load its instant AI learning curator.</p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {FEATURED_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                id={`featured-cat-${cat.toLowerCase().replace(/\s+/g, '-')}-btn`}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition-all hover:scale-[1.03] active:scale-[0.98] ${
                  isDarkMode 
                    ? 'border-slate-800 bg-[#0F1115] hover:border-indigo-500 hover:bg-slate-800 text-slate-300' 
                    : 'border-slate-200 bg-white hover:border-indigo-600 hover:bg-slate-50 text-slate-700 shadow-xs'
                }`}
              >
                <span>{cat}</span>
                <ChevronRight size={13} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Engineered For Rapid Mastery</h2>
          <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Say goodbye to course clutter and algorithmic infinite scrolling distractions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: BrainCircuit, title: "Personalized Curriculum", desc: "No more one-size-fits-all tutorials. Our AI custom tailors phases, milestone deliverables, and test questions matching your precise level." },
            { icon: Video, title: "Curated YouTube Videos", desc: "Instant matching to the best educational content available, keeping study material modern, visually simple, and highly effective." },
            { icon: BookOpen, title: "Curated Free Resources", desc: "Direct access to official whitepapers, manuals, and code frameworks to fortify your core theoretical foundations." },
            { icon: TrendingUp, title: "Streak & Progress tracking", desc: "Keep study streaks alive, watch your experience stats expand, and log completed milestones on your visual profile dashboard." },
            { icon: Zap, title: "Active AI tutor checks", desc: "Ask for quiz iterations, summarized code, or homework reviews on the active model instantly without swapping apps." },
            { icon: Award, title: "Custom Study Outputs", desc: "Convert finished paths to high-quality certifications, shareable guides, or portfolio blueprints ready to show employers." }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className={`p-8 rounded-3xl border flex flex-col items-start text-left ${isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
                <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-600 mb-6">
                  <Icon size={22} />
                </div>
                <h3 className="text-md font-bold mb-3">{item.title}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`py-24 border-t ${isDarkMode ? 'bg-[#0F1115]/30 border-slate-800/80' : 'bg-[#f4f7fe]/40 border-slate-150'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Flexible, Transparent Pricing</h2>
          <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} max-w-lg mx-auto`}>
            Start for free and unlock pro capabilities when you are ready to scale.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
            {/* Free Plan */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-150 shadow-xs'}`}>
              <div>
                <h3 className="text-lg font-bold text-slate-500">Free Tier</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">$0</span>
                  <span className="ml-1 text-xs text-slate-400">/ forever</span>
                </div>
                <p className="mt-4 text-xs text-slate-500">Perfect for exploring new skills and basic curriculum structuring.</p>
                
                <ul className="mt-6 space-y-3">
                  {[
                    "3 custom learning paths per month",
                    "Basic AI roadmap layout",
                    "Direct integrated YouTube viewing",
                    "Free curated text resources access"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex gap-2 items-center text-xs text-slate-400">
                      <Check size={14} className="text-emerald-500" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                id="pricing-free-cta-btn"
                onClick={onStartFree}
                className={`mt-8 w-full py-3 rounded-2xl font-bold text-xs text-center border ${
                  isDarkMode 
                    ? 'border-slate-800 hover:bg-slate-905 text-slate-200' 
                    : 'border-slate-250 hover:bg-slate-50 text-slate-700'
                } transition-all`}
              >
                Start Learning Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`p-8 rounded-3xl border-2 border-indigo-600 flex flex-col justify-between relative ${isDarkMode ? 'bg-[#111422]' : 'bg-[#f7f8ff]'}`}>
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-500">Pro Upgrade</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">$14</span>
                  <span className="ml-1 text-xs text-slate-500">/ month</span>
                </div>
                <p className="mt-4 text-xs text-slate-500">For active builders, freelancers, and students scaling their execution speed.</p>
                
                <ul className="mt-6 space-y-3">
                  {[
                    "Unlimited AI learning roadmaps",
                    "Dedicated 24/7 AI tutor & code checks",
                    "Personalized micro-quizzes with inline grading",
                    "Integrated notes taking workspace",
                    "Advanced progress metrics & learning analytics",
                    "Custom certifications download"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex gap-2 items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                      <Check size={14} className="text-indigo-600" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                id="pricing-pro-cta-btn"
                onClick={onStartFree}
                className="mt-8 w-full py-3.5 rounded-2xl font-bold text-xs text-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:scale-[1.02] transition-all"
              >
                Unlock Unlimited Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Approved by 150,000+ Students</h2>
        <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>See why self-taught creators prefer LearnFlow's custom structures.</p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {testimonials.map((item, idx) => (
            <div key={idx} className={`p-6 rounded-3xl border flex flex-col justify-between ${isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs'}`}>
              <div>
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed italic`}>
                  "{item.text}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100/30 dark:border-slate-800/20">
                <div className="w-8 h-8 rounded-full bg-indigo-600/15 text-indigo-500 flex items-center justify-center font-bold text-xs uppercase">
                  {item.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDarkMode ? 'bg-[#0A0B0D] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-slate-950 dark:text-white">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                L
              </div>
              <span className="font-bold tracking-tight">LearnFlow AI</span>
            </div>
            <p className="max-w-xs leading-relaxed">
              We leverage modern AI models to programmatically index educational resources, saving you hundreds of hours in learning curves.
            </p>
            <p className="font-medium text-[10px] text-slate-500">© 2026 LearnFlow AI Inc. All rights reserved.</p>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Product</h4>
            <ul className="space-y-2">
              <li><button onClick={onExplore} className="hover:text-indigo-600">Explore</button></li>
              <li><button onClick={onStartFree} className="hover:text-indigo-600">Pricing</button></li>
              <li><button onClick={onStartFree} className="hover:text-indigo-600">AI Tutor</button></li>
              <li><button onClick={onStartFree} className="hover:text-indigo-600">Roadmap Generator</button></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Company</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-indigo-600 cursor-pointer">About</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Blog</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Careers</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Contact</span></li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Legal</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-indigo-600 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Security Code</span></li>
              <li><span className="hover:text-indigo-600 cursor-pointer">Cookie Settings</span></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
