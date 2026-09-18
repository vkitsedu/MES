import React, { useState } from 'react';
import { 
  Shield, Key, Lock, AlertCircle, X, Check, Eye, EyeOff, 
  Delete, User, Fingerprint
} from 'lucide-react';
import { authService, OperatorProfile } from '../../services/auth.service';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (operator: OperatorProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [badgeCode, setBadgeCode] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [activeInput, setActiveInput] = useState<'badge' | 'pin'>('badge');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeypadPress = (digit: string) => {
    setErrorMessage(null);
    if (activeInput === 'badge') {
      setBadgeCode((prev) => prev + digit);
    } else {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setErrorMessage(null);
    if (activeInput === 'badge') {
      setBadgeCode((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setErrorMessage(null);
    if (activeInput === 'badge') {
      setBadgeCode('');
    } else {
      setPin('');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!badgeCode.trim()) {
      setErrorMessage('Please enter an operator badge ID');
      setActiveInput('badge');
      return;
    }
    if (!pin.trim()) {
      setErrorMessage('Please enter your operator PIN');
      setActiveInput('pin');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await authService.login(badgeCode.trim(), pin.trim());
    setIsLoading(false);

    if (result.success && result.operator) {
      setBadgeCode('');
      setPin('');
      if (onSuccess) onSuccess(result.operator);
      onClose();
    } else {
      setErrorMessage(result.error || 'Authentication rejected. Check badge ID and PIN.');
    }
  };

  const selectPreset = (code: string, samplePin: string) => {
    setBadgeCode(code);
    setPin(samplePin);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] shadow-2xl overflow-hidden flex flex-col font-mono"
      >
        {/* Header Bar */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[var(--mes-radius)] bg-slate-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  GATEWAY AUTHENTICATION (GATE G-08)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h2 className="text-sm font-bold text-slate-100 tracking-tight uppercase tracking-wider flex items-center gap-2">
                Cleanroom Operator Sign-In
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 p-1.5 rounded-[var(--mes-radius)] hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-950/50 border border-rose-500/50 rounded-[var(--mes-radius)] flex items-center gap-3 text-rose-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Badge ID Input Field */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                Operator Badge Code
              </span>
              <span className="text-[10px] text-slate-500">e.g. OP-01, QC-LEAD-01</span>
            </label>
            <div 
              onClick={() => setActiveInput('badge')}
              className={`flex items-center bg-slate-900 border rounded-[var(--mes-radius)] px-4 py-2.5 cursor-text transition-all ${
                activeInput === 'badge'
                  ? 'border-emerald-400 ring-1 ring-emerald-500/30'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <input
                type="text"
                value={badgeCode}
                onChange={(e) => {
                  setBadgeCode(e.target.value);
                  setErrorMessage(null);
                }}
                onFocus={() => setActiveInput('badge')}
                placeholder="Scan badge or enter code..."
                className="w-full bg-transparent text-slate-100 font-mono text-sm outline-none uppercase placeholder:text-slate-600"
                autoComplete="off"
                autoFocus
              />
              {badgeCode && (
                <button
                  type="button"
                  onClick={() => setBadgeCode('')}
                  className="text-slate-400 hover:text-slate-200 text-xs font-mono ml-2 tracking-wider"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* PIN Input Field */}
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Operator PIN Code
              </span>
              <span className="text-[10px] text-slate-500">Volatile In-Memory</span>
            </label>
            <div 
              onClick={() => setActiveInput('pin')}
              className={`flex items-center bg-slate-900 border rounded-[var(--mes-radius)] px-4 py-2.5 cursor-text transition-all ${
                activeInput === 'pin'
                  ? 'border-cyan-400 ring-1 ring-cyan-500/30'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMessage(null);
                }}
                onFocus={() => setActiveInput('pin')}
                placeholder="Enter PIN (e.g. 1234)..."
                className="w-full bg-transparent text-slate-100 font-mono text-sm outline-none tracking-widest placeholder:tracking-normal placeholder:text-slate-600"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-slate-400 hover:text-slate-200 p-1"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Touchscreen Tablet Keypad (Cleanroom Nitrile Glove Friendly) */}
          <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800 flex flex-col gap-2">
            <div className="text-[10px] font-mono text-slate-400 flex justify-between items-center px-1">
              <span>CLEANROOM TOUCH KEYPAD</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider">TARGET: {activeInput.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-2.5 bg-slate-950 hover:bg-slate-850 active:bg-emerald-500/20 text-slate-100 font-mono text-base font-bold rounded-[var(--mes-radius)] border border-slate-800 transition-colors shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 font-mono text-xs font-bold rounded-[var(--mes-radius)] border border-rose-500/30 tracking-wider transition-colors"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-2.5 bg-slate-950 hover:bg-slate-850 active:bg-emerald-500/20 text-slate-100 font-mono text-base font-bold rounded-[var(--mes-radius)] border border-slate-800 transition-colors shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-100 flex items-center justify-center rounded-[var(--mes-radius)] border border-slate-800 transition-colors"
                aria-label="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Preset Badges for Testing & Shift Handoff */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">QUICK ROLE SELECT (FACTORY SIMULATOR):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { code: 'OP-01', pin: '1234', role: 'OPERATOR', color: 'border-emerald-500/40 text-emerald-300' },
                { code: 'QC-LEAD-01', pin: '4321', role: 'QUALITY_LEAD', color: 'border-cyan-500/40 text-cyan-300' },
                { code: 'LL-01', pin: '5678', role: 'LINE_LEAD', color: 'border-sky-500/40 text-sky-300' },
                { code: 'SYS-ADMIN-01', pin: '9999', role: 'SYSTEM_ADMIN', color: 'border-amber-500/40 text-amber-300' },
              ].map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => selectPreset(preset.code, preset.pin)}
                  className={`px-2 py-1.5 bg-slate-900 hover:bg-slate-850 border rounded-[var(--mes-radius)] text-left font-mono text-[10px] flex flex-col transition-colors ${preset.color}`}
                >
                  <span className="font-bold">{preset.code}</span>
                  <span className="text-slate-400 text-[9px]">{preset.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-[var(--mes-radius)] border border-slate-700 font-mono text-xs font-bold tracking-wider transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:opacity-90 disabled:opacity-50 text-slate-950 rounded-[var(--mes-radius)] font-mono text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <span>AUTHENTICATING...</span>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>AUTHORIZE OPERATOR</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
