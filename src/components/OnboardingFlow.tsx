/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { DifficultyLevel } from '../types';
import { FEATURED_CATEGORIES } from '../data/featuredTopics';

interface OnboardingFlowProps {
  onComplete: (data: {
    skillLevel: DifficultyLevel;
    learningGoals: string;
    weeklyHours: number;
    preferredCategories: string[];
  }) => void;
  isDarkMode: boolean;
}

export default function OnboardingFlow({ onComplete, isDarkMode }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [skillLevel, setSkillLevel] = useState<DifficultyLevel>('Beginner');
  const [learningGoals, setLearningGoals] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    if (preferredCategories.includes(cat)) {
      setPreferredCategories(preferredCategories.filter(c => c !== cat));
    } else {
      setPreferredCategories([...preferredCategories, cat]);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete({
        skillLevel,
        learningGoals: learningGoals.trim() || "Master new skills effectively",
        weeklyHours,
        preferredCategories: preferredCategories.length > 0 ? preferredCategories : ["Web Development"]
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const stepperLabel = [
    "Experience Level",
    "Define Objectives",
    "Study Budget",
    "Focus Areas"
  ];

  return (
    <div className={`min-h-screen flex flex-col justify-between p-6 ${
      isDarkMode ? 'bg-[#0A0B0D] text-slate-100' : 'bg-[#fafbfe] text-slate-900'
    } transition-colors duration-300`}>
      {/* Wave Header */}
      <div className="max-w-xl mx-auto w-full pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-base">
            L
          </div>
          <span className="font-bold text-md tracking-tight">LearnFlow AI</span>
        </div>
        <div className="text-[11px] font-bold tracking-widest text-[#717b99] uppercase">
          Step {step} of 4 • {stepperLabel[step - 1]}
        </div>
      </div>

      {/* Progress horizontal line */}
      <div className="max-w-xl mx-auto w-full mt-4 bg-slate-250 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out animate-pulse"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main card */}
      <main className="max-w-xl mx-auto w-full flex-1 flex flex-col justify-center py-10">
        <div className={`p-8 rounded-3xl border ${
          isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-sm'
        } transition-all`}>
          {/* STEP 1: SKILL LEVEL */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold tracking-tight">What is your current experience level?</h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  We will adapt the initial phase checkpoints, objectives complexity, and lesson durations to match.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { value: 'Beginner', title: 'Beginner', desc: 'New to the concepts. Needs step-by-step foundation lessons, term definitions, and guided projects.' },
                  { value: 'Intermediate', title: 'Intermediate', desc: 'Knows basics. Wants to practice scaling strategies, troubleshoot complex setups, and get direct code checklists.' },
                  { value: 'Advanced', title: 'Advanced', desc: 'Experienced practitioner. Seeks elite optimization tricks, monetization frameworks, and whitepaper case studies.' }
                ].map((tier) => {
                  const isSelected = skillLevel === tier.value;
                  return (
                    <button
                      key={tier.value}
                      id={`onboarding-level-${tier.value.toLowerCase()}-btn`}
                      onClick={() => setSkillLevel(tier.value as DifficultyLevel)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all outline-none ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/5 dark:bg-indigo-950/15' 
                          : `${isDarkMode ? 'border-slate-800 hover:border-slate-750' : 'border-slate-205 hover:border-slate-300'}`
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-sm font-bold block">{tier.title}</span>
                        <span className={`text-[11px] leading-relaxed block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {tier.desc}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: LEARNING GOALS */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold tracking-tight">What is your primary learning goal?</h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Be brief but specific (e.g., 'Learn Amazon KDP to launch my first low-content interior shop' or 'Build a web portfolio to pitch clients').
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  id="onboarding-goals-input"
                  value={learningGoals}
                  onChange={(e) => setLearningGoals(e.target.value)}
                  placeholder="Enter your goals here..."
                  className={`w-full min-h-36 p-4 rounded-2xl border text-xs leading-relaxed focus:bg-transparent ${
                    isDarkMode 
                      ? 'border-slate-800 bg-slate-900 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      : 'border-slate-250 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600'
                  } outline-none transition-all`}
                />
                
                <div className={`p-4 rounded-2xl flex gap-3 text-xs leading-normal items-start ${
                  isDarkMode ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-500'
                }`}>
                  <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-slate-700 dark:text-slate-200 mb-0.5">Tutor Tip:</span>
                    Defining a concrete deliverable goal (like 'Build my first react app') maximizes the effectiveness of our AI roadmap indexing engine.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: WEEKLY STUDY BUDGET */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold tracking-tight">Define your weekly study budget</h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  How many hours can you commit each week to studying lessons and practicing portfolio exercises?
                </p>
              </div>

              <div className="space-y-8 py-4">
                <div className="text-center">
                  <span className="text-5xl font-extrabold text-indigo-600 tracking-tight">{weeklyHours}</span>
                  <span className="text-xs font-bold text-slate-400 block mt-2 uppercase tracking-widest">hours per week</span>
                </div>

                <div className="space-y-2">
                  <input
                    id="onboarding-hours-slider"
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full h-2 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-800 accent-indigo-600"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>1 Hour (Casual)</span>
                    <span>20 Hrs (Active)</span>
                    <span>40 Hrs (Crash Course)</span>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl flex gap-3 items-center text-xs justify-between ${
                  isDarkMode ? 'bg-[#151a2a]/50 text-slate-400' : 'bg-indigo-50/20 text-slate-600'
                }`}>
                  <div className="flex gap-2.5 items-center">
                    <Clock size={16} className="text-indigo-500 shrink-0" />
                    <span>Estimated Roadmap Length:</span>
                  </div>
                  <span className="font-extrabold text-indigo-600">
                    {Math.ceil(40 / (weeklyHours || 5))} Weeks
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERRED CATEGORIES */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold tracking-tight">Select your focus categories</h2>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select any categories that align with your immediate goals.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                {FEATURED_CATEGORIES.map((cat, idx) => {
                  const isSelected = preferredCategories.includes(cat);
                  return (
                    <button
                      key={idx}
                      id={`onboarding-cat-${cat.toLowerCase().replace(/\s+/g, '-')}-btn`}
                      onClick={() => toggleCategory(cat)}
                      className={`py-2 px-3.5 rounded-xl border text-xs font-semibold tracking-tight text-center transition-all truncate outline-none select-none ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : `${
                              isDarkMode 
                                ? 'border-slate-800 bg-[#121623] hover:border-slate-700 text-slate-300' 
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 shadow-xs'
                            }`
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-widest">
                Selected: {preferredCategories.length} categories
              </div>
            </div>
          )}

          {/* Stepper buttons footer */}
          <div className="mt-8 pt-6 border-t border-slate-100/30 dark:border-slate-800/20 flex items-center justify-between">
            {step > 1 ? (
              <button
                id="onboarding-back-btn"
                onClick={handleBack}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  isDarkMode 
                    ? 'border-slate-850 hover:bg-slate-800 text-slate-300' 
                    : 'border-slate-250 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              id="onboarding-next-btn"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{step === 4 ? 'Complete Onboarding' : 'Continue'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>

      {/* Aesthetic quote line */}
      <footer className="text-center py-4 text-[10px] text-slate-400 font-medium">
        LearnFlow AI uses state-of-the-art curriculum synthesis. Launching launch-ready skills on-demand.
      </footer>
    </div>
  );
}
