/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  FileCheck,
  AlertTriangle,
  Loader2,
  Trash2,
  BrainCircuit
} from 'lucide-react';
import { Module, UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: Date;
}

interface AITutorViewProps {
  user: UserProfile;
  activeModule?: Module;
  activeTopicName?: string;
  isDarkMode: boolean;
  isPro: boolean;
}

export default function AITutorView({
  user,
  activeModule,
  activeTopicName,
  isDarkMode,
  isPro
}: AITutorViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize welcome messages context
  useEffect(() => {
    if (messages.length === 0) {
      const topicContext = activeTopicName ? ` for your active path: **${activeTopicName}**` : '';
      const moduleContext = activeModule ? ` on module: **${activeModule.title}**` : '';

      setMessages([
        {
          id: 'welcome',
          sender: 'tutor',
          text: `Hi **${user.displayName || 'Learner'}**! I am your personal **LearnFlow AI Tutor** 🧠. I'm here to explain concepts, guide you step-by-step, draft code templates, or quiz you on study milestones.${topicContext}${moduleContext}\n\nWhat would you like to master today? Use one of the interactive prompt prompts below!`,
          timestamp: new Date()
        }
      ]);
    }
  }, [user, activeModule, activeTopicName]);

  // Keep chat scrolled down
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (customQuery?: string) => {
    const query = (customQuery || inputText).trim();
    if (!query) return;

    if (!customQuery) {
      setInputText('');
    }

    // Append user query message in list
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const payload = {
        message: query,
        context: {
          topic: activeTopicName || 'General Skill Building',
          module: activeModule ? { title: activeModule.title, description: activeModule.description } : undefined,
          skillLevel: user.skillLevel || 'Beginner',
          goals: user.learningGoals || 'Acquire general high-CPM career outcomes'
        },
        history: messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }))
      };

      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Tutor Server error");
      }

      const data = await res.json();
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: data.response || data.reply || "I apologize, but I am momentarily experiencing network difficulties. Please try again! 🌟",
        timestamp: new Date()
      }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: "My apologies! I encountered a network issue contacting the LearnFlow AI cloud cluster API. Please double check that you have configured your environment variables correctly or retry! ✨",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear active chat transcripts?')) {
      setMessages([
        {
          id: 'cleared-welcome',
          sender: 'tutor',
          text: 'History cleared. Ask me any lessons explanation or homework review query. I will assist you instantly! 🚀',
          timestamp: new Date()
        }
      ]);
    }
  };

  const textBg = isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs';
  const chatAreaBg = isDarkMode ? 'bg-[#0A0B0D]' : 'bg-slate-50/50';

  return (
    <div className="space-y-6 pb-12 relative h-[80vh] flex flex-col justify-between">
      
      {/* Title block */}
      <div className="flex items-center justify-between py-1 border-b border-slate-105 dark:border-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600/10 text-indigo-500 rounded-xl">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-sm font-extrabold tracking-tight">Active AI Tutor Classroom</h1>
            <p className="text-[10.5px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Sparkles size={11} className="text-indigo-500" />
              <span>Continuous Course Coach</span>
              {activeModule && (
                <span className="text-indigo-500 font-bold truncate max-w-[200px]">
                  • Active Module: {activeModule.title}
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          id="clear-chat-transcript-btn"
          onClick={handleClearHistory}
          className="p-2 border border-slate-205 dark:border-slate-800 hover:bg-slate-150 dark:hover:bg-slate-900 rounded-xl text-slate-400 hover:text-red-500 transition-all"
          title="Clear Transcripts"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {!isPro && (
        <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs flex gap-3 leading-normal items-start">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" />
          <p>
            <span className="font-bold">Free Plan Trial Notice:</span> Standard accounts are limited to basic conversation credits. Consider upgrading to the Pro subscription in settings to unlock unmitigated chat interactions and notes taker files safely!
          </p>
        </div>
      )}

      {/* Main split chat list area (expanded flex-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* CHAT MESSAGES PANEL (8 cols) */}
        <div className={`lg:col-span-8 rounded-3xl border flex flex-col justify-between overflow-hidden ${textBg}`}>
          {/* Messages list container */}
          <div className={`flex-1 p-4 overflow-y-auto space-y-4 ${chatAreaBg} no-scrollbar`}>
            {messages.map((item) => {
              const matchesTutor = item.sender === 'tutor';
              return (
                <div 
                  key={item.id}
                  className={`flex gap-3 leading-relaxed text-xs max-w-xl ${matchesTutor ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                    matchesTutor ? 'bg-indigo-600/10 text-indigo-500 border border-indigo-500/20' : 'bg-indigo-600 text-white font-bold'
                  }`}>
                    {matchesTutor ? <Bot size={15} /> : 'U'}
                  </div>

                  <div className={`p-4 rounded-3xl border ${
                    matchesTutor 
                      ? isDarkMode ? 'bg-[#0F1115] border-slate-800 text-slate-200' : 'bg-white border-slate-150 text-slate-800'
                      : 'bg-indigo-600 border-indigo-600 text-white'
                  }`}>
                    {/* Render basic markdown text safely */}
                    <p className="whitespace-pre-wrap font-medium">
                      {item.text.split('**').map((substring, index) => {
                        return index % 2 === 1 ? <strong key={index} className={matchesTutor ? 'text-indigo-500 dark:text-indigo-400 font-extrabold' : 'font-extrabold text-white underline'}>{substring}</strong> : substring;
                      })}
                    </p>
                    <span className={`text-[9px] block text-right mt-2 ${matchesTutor ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {item.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 items-center mr-auto text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center animate-spin">
                  <Loader2 size={13} />
                </div>
                <span>Tutor is formulating a solution...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* User query submission footer input */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              id="tutor-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me to explain code, solve quiz variables, or review syllabus..."
              className={`flex-1 text-xs p-3.5 rounded-2xl border bg-slate-50 dark:bg-slate-900 outline-none text-inherit placeholder-slate-400 ${
                isDarkMode ? 'border-slate-800' : 'border-slate-150'
              }`}
              disabled={isTyping}
            />
            <button
              id="tutor-chat-submit-btn"
              onClick={() => handleSendMessage()}
              className="px-4 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center"
              disabled={isTyping}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* STUDY COCH SUGGESTION DRAWER (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border ${textBg} space-y-4 h-full flex flex-col justify-between`}>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                <BrainCircuit size={14} className="text-indigo-500" />
                <span>Interactive Drills</span>
              </h3>

              <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Select an interactive shortcut query. Your tutor will instantly synthesize customized lessons matching your active curriculum level.
              </p>

              {/* Action shortcuts */}
              <div className="space-y-2">
                {[
                  { label: "Practice Multiple-Choice Quiz", query: activeModule ? `Please generate a 3-question multiple choice trivia quiz on this active module: "${activeModule.title}" so that I can practice. Do not show answers until I answer.` : "Please generate a 3-question multiple choice trivia quiz on my active career path." },
                  { label: "Summarize Complex Terms", query: activeModule ? `Please summarize the top 5 key terms and mental models for the active module topic: "${activeModule.title}" in clean bullet points.` : "Summarize the key foundational terms for my active study domains." },
                  { label: "Assign Homework Application", query: activeModule ? `Please assign me an interesting practical application code challenge or case study homework exercise matching: "${activeModule.title}".` : "Please assign a case study challenge matching my career goals." },
                  { label: "Verify My Implementation Answer", query: "Can you please assess my homework answer? Give me an inline letter grade review and checklist points." }
                ].map((act, idx) => (
                  <button
                    key={idx}
                    id={`tutor-drill-${idx}-btn`}
                    onClick={() => handleSendMessage(act.query)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 text-slate-650 dark:text-slate-300 transition-all ${
                      isDarkMode ? 'border-slate-805 bg-slate-900/60 hover:border-indigo-500' : 'border-slate-150 bg-slate-50 hover:border-indigo-600 shadow-2xs'
                    }`}
                  >
                    <span>{act.label}</span>
                    <HelpCircle size={13} className="text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-2xl flex gap-3 text-[10.5px] items-center leading-normal border border-dashed ${
              isDarkMode ? 'bg-[#0A0B0D]/30 border-slate-800 text-slate-450' : 'bg-slate-50 border-slate-150 text-slate-500'
            }`}>
              <FileCheck size={16} className="text-indigo-500 shrink-0" />
              <span>LearnFlow tutor maps replies on top of official manuals instantly.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
