/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  HelpCircle, 
  Loader2, 
  RefreshCw, 
  Send, 
  Sparkles, 
  Trophy, 
  X 
} from 'lucide-react';
import { Module, ModuleQuizQuestion, UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ModuleQuizProps {
  module: Module;
  pathId: string;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  isDarkMode: boolean;
  isPro: boolean;
}

export default function ModuleQuiz({
  module,
  pathId,
  user,
  onUpdateUser,
  isDarkMode,
  isPro
}: ModuleQuizProps) {
  const [quizType, setQuizType] = useState<'multiple_choice' | 'short_answer' | 'mixed'>('mixed');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<ModuleQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  
  // Scoring & grading states
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [saAnswerText, setSaAnswerText] = useState<string>('');
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradingFeedback, setGradingFeedback] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Load quiz from localStorage on module change, if completed previously
  useEffect(() => {
    const key = `lf-quiz-${pathId}-${module.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuestions(parsed.questions || []);
        setCompleted(parsed.completed || false);
        setCorrectCount(parsed.correctCount || 0);
        setCurrentIdx(0);
        setSelectedOption(null);
        setSaAnswerText('');
        setGradingFeedback(null);
      } catch (e) {
        console.error("Error loading cached quiz", e);
      }
    } else {
      // Clear state for new quiz
      setQuestions([]);
      setCompleted(false);
      setCorrectCount(0);
      setCurrentIdx(0);
      setSelectedOption(null);
      setSaAnswerText('');
      setGradingFeedback(null);
    }
    setApiError(null);
  }, [module.id, pathId]);

  // Generate Quiz API call
  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch('/api/generate-module-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleTitle: module.title,
          moduleDescription: module.description,
          learningObjectives: module.learningObjectives,
          exercises: module.exercises,
          quizType: quizType
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCompleted(false);
        setCorrectCount(0);
        setCurrentIdx(0);
        setSelectedOption(null);
        setSaAnswerText('');
        setGradingFeedback(null);
        if (data.apiError) {
          console.warn("API parsed using fallback mechanism:", data.apiError);
        }
      } else {
        throw new Error("No quiz questions could be processed. Please retry.");
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Could not generate AI quiz questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Multiple Choice option click handler
  const handleOptionSelect = (optionIdx: number) => {
    if (selectedOption !== null) return; // Answer locked
    setSelectedOption(optionIdx);
    
    const currentQ = questions[currentIdx];
    const isCorrect = optionIdx === currentQ.correctAnswerIndex;
    
    // Update local copy
    const updatedQs = [...questions];
    updatedQs[currentIdx] = {
      ...currentQ,
      userAnswerIndex: optionIdx
    };
    setQuestions(updatedQs);

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
  };

  // Short Answer evaluation API grader
  const handleGradeShortAnswer = async () => {
    if (!saAnswerText.trim() || isGrading) return;
    setIsGrading(true);
    setApiError(null);

    const currentQ = questions[currentIdx];

    try {
      const response = await fetch('/api/grade-short-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          userAnswer: saAnswerText,
          moduleTitle: module.title
        })
      });

      if (!response.ok) {
        throw new Error(`Grader failed: ${response.statusText}`);
      }

      const data = await response.json();
      const grading = data.grading || { isCorrect: false, score: 0, feedback: "Grading system temporary offline." };

      setGradingFeedback(grading.feedback);

      const updatedQs = [...questions];
      updatedQs[currentIdx] = {
        ...currentQ,
        userShortAnswer: saAnswerText,
        feedbackGrading: grading
      };
      setQuestions(updatedQs);

      if (grading.isCorrect) {
        setCorrectCount(prev => prev + 1);
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Failed to grade short answer. Please try submitting again.");
    } finally {
      setIsGrading(false);
    }
  };

  // Navigating through questions
  const handNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setSaAnswerText('');
      setGradingFeedback(null);
      
      // Load previous state if answers exist
      const nextQ = questions[currentIdx + 1];
      if (nextQ.type === 'multiple_choice' && nextQ.userAnswerIndex !== undefined) {
        setSelectedOption(nextQ.userAnswerIndex);
      } else if (nextQ.type === 'short_answer' && nextQ.userShortAnswer !== undefined) {
        setSaAnswerText(nextQ.userShortAnswer);
        setGradingFeedback(nextQ.feedbackGrading?.feedback || null);
      }
    } else {
      // Quiz complete!
      setCompleted(true);
      
      // Reward user with 50 XP if finished successfully
      const earnedXp = 50 + (correctCount * 10);
      const isNewSuccess = !localStorage.getItem(`lf-quiz-${pathId}-${module.id}`);
      
      if (isNewSuccess) {
        const nextXp = user.xpPoints + earnedXp;
        const nextStreak = user.streakCount + 1; // reward daily streak activity
        onUpdateUser({
          ...user,
          xpPoints: nextXp,
          streakCount: nextStreak,
          lastActiveDate: new Date().toISOString().split('T')[0]
        });
      }

      // Persist locally
      const key = `lf-quiz-${pathId}-${module.id}`;
      localStorage.setItem(key, JSON.stringify({
        questions: questions,
        completed: true,
        correctCount: correctCount
      }));
    }
  };

  const handPrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setSelectedOption(null);
      setSaAnswerText('');
      setGradingFeedback(null);

      const prevQ = questions[currentIdx - 1];
      if (prevQ.type === 'multiple_choice' && prevQ.userAnswerIndex !== undefined) {
        setSelectedOption(prevQ.userAnswerIndex);
      } else if (prevQ.type === 'short_answer' && prevQ.userShortAnswer !== undefined) {
        setSaAnswerText(prevQ.userShortAnswer);
        setGradingFeedback(prevQ.feedbackGrading?.feedback || null);
      }
    }
  };

  const handleResetQuiz = () => {
    localStorage.removeItem(`lf-quiz-${pathId}-${module.id}`);
    setQuestions([]);
    setCompleted(false);
    setCorrectCount(0);
    setCurrentIdx(0);
    setSelectedOption(null);
    setSaAnswerText('');
    setGradingFeedback(null);
    setApiError(null);
  };

  // Color mappings
  const cardBg = isDarkMode ? 'bg-[#0F1115] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-xs';
  const headerText = isDarkMode ? 'text-indigo-400' : 'text-indigo-600';

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
        <Loader2 size={32} className="text-indigo-600 animate-spin" />
        <div className="space-y-1">
          <p className="text-xs font-extrabold tracking-tight">Compiling AI Syllabus Questions...</p>
          <p className="text-[10px] text-slate-400 max-w-sm">
            AI is analyzing module resources, syllabusObjectives, and study exercise tasks to map custom assessment metrics.
          </p>
        </div>
      </div>
    );
  }

  // Quiz completed summary dashboard
  if (completed) {
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 60;
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-6 pt-4"
      >
        <div className={`p-8 rounded-3xl border text-center relative overflow-hidden ${cardBg}`}>
          {/* Confetti or decorative circle overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div className="relative space-y-4">
            <div className="mx-auto w-14 h-14 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center">
              <Trophy size={28} className="animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black tracking-tight uppercase">Quiz Evaluation Complete!</h3>
              <p className="text-[10.5px] text-slate-400 font-medium">
                Syllabus Module: <strong className="text-slate-200">{module.title}</strong>
              </p>
            </div>

            <div className="flex justify-center items-baseline gap-2 py-4">
              <span className="text-5xl font-black tracking-tight text-indigo-500">{correctCount}</span>
              <span className="text-xl text-slate-400 font-medium">/ {questions.length}</span>
              <span className="text-xs font-mono ml-3 px-2 py-1 rounded-full bg-slate-900/40 text-slate-400 font-bold border border-slate-800">
                {percentage}% Score
              </span>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl border border-dashed text-xs leading-relaxed border-indigo-500/20 bg-indigo-550/5">
              {passed ? (
                <span>
                  🌟 <strong>Outstanding Knowledge Retention!</strong> You have successfully checked off terms, benchmarks, and objectives. Your streak has been registered and <strong>+50 Activity XP</strong> credited safely in your cabinet!
                </span>
              ) : (
                <span>
                  💡 <strong>Comfortable Attempt!</strong> Excellent courage validating your growth. Re-read the manuals, watch corresponding playlists, review notes, and click Regenerate to test yourself again!
                </span>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                id="redo-quiz-btn"
                onClick={handleResetQuiz}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw size={14} />
                Regenerate New Questions
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Quiz interactive taker layout screen
  if (questions.length > 0) {
    const currentQ = questions[currentIdx];
    const isMcq = currentQ.type === 'multiple_choice';
    const isAnswered = isMcq 
      ? selectedOption !== null 
      : currentQ.userShortAnswer !== undefined;

    return (
      <div className="space-y-6 pt-4">
        {/* Progress header progress bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-400`}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
              {isMcq ? 'Multiple Choice' : 'Short Answer Practice'}
            </span>
          </div>

          <button
            id="abort-quiz-btn"
            onClick={handleResetQuiz}
            className="flex items-center gap-1 text-[10.5px] font-bold text-rose-500 hover:text-rose-600 transition-all"
            title="Reset active quiz questions"
          >
            <X size={13} />
            <span>Abort Session</span>
          </button>
        </div>

        {/* Dynamic transition scope */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className={`p-6 rounded-3xl border ${cardBg} space-y-6`}
          >
            {/* The Question Text display */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 leading-none">Active Assessment Drill</span>
              <h4 className="text-sm font-extrabold tracking-tight leading-relaxed text-slate-100">
                {currentQ.question}
              </h4>
            </div>

            {/* MCQ OPTIONS BLOCK */}
            {isMcq && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectAnswer = idx === currentQ.correctAnswerIndex;
                  const showFeedback = selectedOption !== null;
                  
                  let optionStyle = 'border-slate-800 hover:bg-slate-900/55';
                  let statusBadge = null;

                  if (showFeedback) {
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-green-500/10 border-green-500 text-green-400';
                      statusBadge = <Check size={14} className="text-green-500 shrink-0" />;
                    } else if (isSelected) {
                      optionStyle = 'bg-rose-500/10 border-rose-500 text-rose-400';
                      statusBadge = <X size={14} className="text-rose-500 shrink-0" />;
                    } else {
                      optionStyle = 'opacity-50 border-slate-800';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-indigo-600 bg-indigo-600/5 text-indigo-500';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={showFeedback}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs font-medium transition-all duration-150 flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-lg font-mono text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {statusBadge}
                    </button>
                  );
                })}
              </div>
            )}

            {/* SHORT ANSWER INPUT AREA */}
            {!isMcq && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Written Answer</label>
                  <textarea
                    value={saAnswerText}
                    onChange={(e) => setSaAnswerText(e.target.value)}
                    disabled={currentQ.userShortAnswer !== undefined}
                    placeholder="Enter your summary explanation or analysis of the objectives here. (Recommended > 15 words for full evaluation)..."
                    className="w-full min-h-24 p-3.5 rounded-2xl border text-xs focus:bg-transparent border-slate-800 bg-slate-950 text-slate-100 outline-none placeholder-slate-500 focus:border-indigo-600 transition-all resize-none"
                  />
                </div>

                {currentQ.userShortAnswer === undefined && (
                  <button
                    onClick={handleGradeShortAnswer}
                    disabled={!saAnswerText.trim() || isGrading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isGrading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Analyzing via AI Grader...
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Submit for Grading
                      </>
                    )}
                  </button>
                )}

                {/* Grading Feedback block */}
                {gradingFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-xs space-y-2 whitespace-pre-wrap leading-relaxed ${
                      currentQ.feedbackGrading?.isCorrect 
                        ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                        : 'bg-indigo-500/5 border-indigo-500/20 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 font-bold uppercase rounded text-[9.5px] ${
                        currentQ.feedbackGrading?.isCorrect ? 'bg-green-500/10 text-green-500' : 'bg-indigo-550/20 text-indigo-400'
                      }`}>
                        Score: {currentQ.feedbackGrading?.score}/10
                      </span>
                      <span className="font-extrabold uppercase text-[9.5px] tracking-wide text-indigo-400 flex items-center gap-1">
                        <Sparkles size={11} /> AI Evaluation Feedback
                      </span>
                    </div>
                    <p className="border-t border-slate-800/60 pt-2 text-[11px] leading-relaxed select-text">
                      {gradingFeedback}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Answer Explanation Display */}
            {isMcq && selectedOption !== null && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed select-text"
              >
                <div className="flex items-center gap-1 mb-1 font-extrabold uppercase text-indigo-400 text-[10px] tracking-wider">
                  <Sparkles size={12} />
                  <span>Syllabus Explanation</span>
                </div>
                <span>{currentQ.explanation}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {apiError && (
          <div className="p-3 bg-rose-500/15 border border-rose-500/20 rounded-2xl text-[11px] text-rose-450 text-center leading-normal">
            {apiError}
          </div>
        )}

        {/* Footer actions navigator controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handPrevQuestion}
            disabled={currentIdx === 0}
            className="flex items-center gap-1 text-[10.5px] font-bold text-slate-400 border border-slate-800 rounded-xl px-3 py-2 disabled:opacity-30 hover:bg-slate-900 select-none btn-prev-question"
          >
            <ChevronLeft size={14} />
            <span>Prev Question</span>
          </button>

          <button
            onClick={handNextQuestion}
            disabled={!isAnswered}
            className="flex items-center gap-1 text-[10.5px] font-bold text-white bg-indigo-600 disabled:opacity-40 hover:bg-indigo-700 rounded-xl px-4 py-2 hover:scale-[1.01] transition-transform select-none btn-next-question"
          >
            <span>
              {currentIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            </span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Quiz initiation placeholder layout CTA
  return (
    <div className={`p-6 sm:p-8 rounded-3xl border ${cardBg} max-w-2xl mx-auto space-y-6 pt-6`}>
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-500 shrink-0">
          <HelpCircle size={24} className="animate-pulse" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">Module Milestone Quiz</span>
          <h3 className="text-base font-extrabold tracking-tight">Generate AI Practice Check</h3>
          <p className="text-xs text-slate-400 leading-normal">
            Test and reinforce your comprehension of <strong>{module.title}</strong> objectives using custom multiple-choice or short-answer prompt assessments drafted live by our academic AI tutor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/50 pt-5 text-xs">
        {/* Selecting Quiz structure type */}
        <div className="space-y-1 bg-slate-950/20 p-3 rounded-2xl border border-slate-800/40">
          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Assessment Structure Type</label>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[
              { id: 'multiple_choice', label: 'MCQs Only' },
              { id: 'short_answer', label: 'Short Answer' },
              { id: 'mixed', label: 'Mixed Deck' }
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setQuizType(option.id as any)}
                type="button"
                className={`py-1.5 px-1 font-bold text-[10px] rounded-lg border text-center transition-all ${
                  quizType === option.id 
                    ? 'border-indigo-600 bg-indigo-600/10 text-indigo-500' 
                    : 'border-slate-800 hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Benefits panel summary list info */}
        <div className="p-3 bg-slate-950/20 rounded-2xl border border-slate-800/40 space-y-1.5 leading-snug">
          <p className="text-[10px] uppercase font-mono text-indigo-400 font-bold">Reward Incentives</p>
          <div className="space-y-1 text-[10.5px] text-slate-400">
            <p className="flex items-center gap-1.5">
              <Award size={12} className="text-amber-500" />
              <span>Earn +50 XP and consolidate active streak days.</span>
            </p>
            <p className="flex items-center gap-1.5">
              <BookOpen size={12} className="text-blue-400" />
              <span>Grades directly map onto official curriculum objectives.</span>
            </p>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/20 rounded-2xl text-[11px] text-rose-450 leading-normal">
          {apiError}
        </div>
      )}

      {/* Primary initiation launch CTA button */}
      <div className="pt-2">
        <button
          id="trigger-quiz-generation-btn"
          onClick={handleGenerateQuiz}
          disabled={isLoading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all uppercase tracking-wider"
        >
          <Sparkles size={14} className="animate-spin-slow" />
          <span>Compile custom quiz questions now</span>
        </button>
      </div>
    </div>
  );
}
