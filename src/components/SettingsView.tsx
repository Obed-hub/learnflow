/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Sparkles, 
  CreditCard, 
  User, 
  Moon, 
  Sun, 
  Check, 
  ShieldAlert, 
  Lock, 
  Loader2,
  CheckCircle2,
  DollarSign,
  HeartHandshake
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsView({
  user,
  onUpdateUser,
  isDarkMode,
  onToggleDarkMode
}: SettingsViewProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  
  // Checkout Form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('242');
  const [billingName, setBillingName] = useState(user.displayName || 'Learner');

  const cardBg = isDarkMode ? 'bg-[#0F1115] border-slate-800' : 'bg-white border-slate-100 shadow-xs';

  const handleUpdateNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onUpdateUser({
        ...user,
        displayName: displayName.trim()
      });
      alert('Profile updated successfully!');
    }
  };

  const handleStartUpgrade = () => {
    setCheckoutStep('form');
    setIsCheckoutOpen(true);
  };

  const handleStripePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    
    // Simulate API delay network
    setTimeout(() => {
      setCheckoutStep('success');
      // Update our global user pro parameters
      onUpdateUser({
        ...user,
        isPro: true
      });
    }, 2000);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your pro subscription? You will lose access to notes directories and infinite AI roadmap tools.')) {
      onUpdateUser({
        ...user,
        isPro: false
      });
      alert('Subscription cancelled successfully. Returned to Free tier.');
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold tracking-tight">Account & Billing Settings</h1>
        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Manage your student profile preferences, light & dark visual style states, and subscription invoice billing directories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PROFILE CARD FORM (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PROFILE PREFERENCES CARD */}
          <div className={`p-6 rounded-3xl border ${cardBg} space-y-4`}>
            <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400 flex items-center gap-2">
              <User size={16} className="text-indigo-500" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleUpdateNameSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Account Email</label>
                  <input
                    id="settings-email-disabled"
                    type="email"
                    value={user.email}
                    disabled
                    className={`w-full p-3 rounded-xl border text-xs cursor-not-allowed ${
                      isDarkMode 
                        ? 'border-slate-800 bg-[#070911]/50 text-slate-500' 
                        : 'border-slate-150 bg-slate-100 text-slate-400'
                    }`}
                  />
                  <span className="text-[9.5px] text-slate-400 block italic">OAuth managed email profile</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Display Nickname</label>
                  <input
                    id="settings-name-input"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Rachel"
                    required
                    className={`w-full p-3 rounded-xl border text-xs focus:bg-transparent ${
                      isDarkMode 
                        ? 'border-slate-800 bg-slate-900 text-white focus:border-indigo-500' 
                        : 'border-slate-150 bg-slate-50 text-slate-900 focus:border-indigo-650'
                    } outline-none transition-all`}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="settings-save-profile-btn"
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-transform hover:scale-[1.01]"
                >
                  Save Profile Info
                </button>
              </div>
            </form>
          </div>

          {/* VISUAL THEME PREFERENCES CARD */}
          <div className={`p-6 rounded-3xl border ${cardBg} space-y-4`}>
            <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400 flex items-center gap-2">
              <Sun size={16} className="text-indigo-500" />
              <span>Theme Preferences</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className={`text-xs ${isDarkMode ? 'text-slate-405' : 'text-slate-500'}`}>
                Switch between light and dark modes to adjust eye-safety levels during deep curriculum study sessions.
              </p>

              <button
                id="settings-theme-toggle-btn"
                onClick={onToggleDarkMode}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 shrink-0 transition-transform hover:scale-[1.02] ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-amber-400' 
                    : 'border-slate-205 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
                }`}
              >
                {isDarkMode ? (
                  <>
                    <Sun size={14} fill="currentColor" />
                    <span>Set Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} fill="currentColor" />
                    <span>Set Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* BILLING PLAN SELECTION STATUS (1 column) */}
        <div className="space-y-8">
          
          <div className={`p-6 rounded-3xl border ${cardBg} flex flex-col justify-between h-full space-y-6`}>
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold tracking-tight uppercase text-slate-400 flex items-center gap-2">
                <CreditCard size={16} className="text-indigo-500" />
                <span>Subscription Status</span>
              </h3>

              {user.isPro ? (
                /* Pro account UI indicators */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 size={15} />
                      <span>Pro Access Active</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      You're currently upgraded to the Unlimited Plan. Next billing cycle on June 29, 2026.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Features Unlocked:</h4>
                    <ul className="space-y-1 text-xs">
                      {["Unlimited custom roadmaps", "24/7 AI learning tutor helper", "Integrated notes workspace", "Advanced study metric graphs"].map((feat, idx) => (
                        <li key={idx} className="flex gap-1.5 items-center text-slate-604 font-medium dark:text-slate-300">
                          <Check size={12} className="text-indigo-500" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* Free tier upgrader visual indicators */
                <div className="space-y-4">
                  <div className="p-4 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-2xl text-xs space-y-1.5 relative overflow-hidden">
                    <div className="absolute right-2 bottom-2 text-white/10 shrink-0">
                      <Sparkles size={60} />
                    </div>
                    
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles size={15} fill="currentColor" />
                      <span>Free Plan Limited</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-indigo-50">
                      Standard users can generate up to 3 models per month with basic roadmap filters. Get full leverage by choosing Pro.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-550 leading-relaxed dark:text-slate-400 font-medium">
                      Unlock unmitigated AI compilation resources, continuous chat mentors, project notebook files, and customized certifications.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100/35 dark:border-slate-800/25">
              {user.isPro ? (
                <button
                  id="settings-cancel-sub-btn"
                  onClick={handleCancelSubscription}
                  className="w-full text-center py-2.5 hover:text-red-500 bg-red-500/5 hover:border-red-500/20 text-xs font-semibold rounded-xl border border-transparent transition-all"
                >
                  Cancel Plan Subscription
                </button>
              ) : (
                <button
                  id="settings-upgrade-stripe-btn"
                  onClick={handleStartUpgrade}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={13} fill="currentColor" />
                  Upgrade to Pro ($14/mo)
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* STRIPE SECURE INTERACTIVE BILLING CHECKOUT FORM OVERLAY */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Dismiss triggers click */}
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsCheckoutOpen(false)} />
          
          <div className={`relative max-w-md w-full p-6 sm:p-8 rounded-3xl z-10 border transition-all ${
            isDarkMode ? 'bg-[#0F1115] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-extrabold tracking-tight mb-2 flex items-center gap-1.5">
              <CreditCard size={18} className="text-indigo-600 animate-pulse" />
              <span>Stripe Secure checkout</span>
            </h3>

            {/* STEP 1: BILLING CREDIT FORM */}
            {checkoutStep === 'form' && (
              <form onSubmit={handleStripePayment} className="space-y-4 pt-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-1 text-xs border border-slate-205 dark:border-slate-805">
                  <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-400">
                    <span>PRODUCT DESCRIPTION</span>
                    <span>AMOUNT DUE</span>
                  </div>
                  <div className="flex justify-between items-center font-bold">
                    <span>LearnFlow AI Pro Academic</span>
                    <span className="text-indigo-600">$14.00 USD / mo</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Card Holder Name</label>
                    <input
                      id="stripe-billing-name"
                      type="text"
                      className={`w-full p-2.5 rounded-xl border text-xs focus:bg-transparent ${
                        isDarkMode ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-slate-200 bg-slate-55'
                      }`}
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase">Credit Card Details</label>
                    <div className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                      isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-slate-55'
                    }`}>
                      <CreditCard size={15} className="text-indigo-500 shrink-0" />
                      <input
                        id="stripe-card-number"
                        type="text"
                        className="text-xs bg-transparent outline-none flex-1 font-mono placeholder-slate-400"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase">Expiration Date</label>
                      <input
                        id="stripe-card-expiry"
                        type="text"
                        className={`w-full p-2.5 rounded-xl border text-xs text-center font-mono focus:bg-transparent ${
                          isDarkMode ? 'border-zinc-805 bg-zinc-950' : 'border-slate-200 bg-slate-55'
                        }`}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase">Secure CVC</label>
                      <input
                        id="stripe-card-cvc"
                        type="password"
                        maxLength={3}
                        className={`w-full p-2.5 rounded-xl border text-xs text-center font-mono focus:bg-transparent ${
                          isDarkMode ? 'border-zinc-805 bg-zinc-950' : 'border-slate-200 bg-slate-55'
                        }`}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100/30 dark:border-slate-800/10 flex gap-2">
                  <button
                    id="stripe-cancel-btn"
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 py-3 text-xs border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold transition-all text-slate-600 dark:text-slate-350"
                  >
                    Cancel
                  </button>
                  <button
                    id="stripe-pay-btn"
                    type="submit"
                    className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Pay $14.00 SECURE
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PROCESSING SECURE INVOICE */}
            {checkoutStep === 'processing' && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 size={36} className="text-indigo-600 animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-bold">Contacting secure Stripe acquirer networks...</p>
                  <p className="text-[11px] text-slate-450">Please do not refresh nor navigate away from the panel</p>
                </div>
              </div>
            )}

            {/* STEP 3: TRANSACTION SUCCESSFUL */}
            {checkoutStep === 'success' && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/15 text-green-500 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={24} />
                </div>
                <div className="space-y-1 pb-4">
                  <h4 className="text-sm font-black text-green-500">Upgrade Completed successfully!</h4>
                  <p className="text-xs text-slate-450 max-w-xs mx-auto leading-normal">
                    Thank you, {billingName}! Your payment token was mapped successfully. Enjoy unmitigated LearnFlow Pro capabilities.
                  </p>
                </div>
                <button
                  id="stripe-close-success-btn"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold"
                >
                  Open Pro Space
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
