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
        className="w-full max-w-lg bg-[var(--mes-bg-surface)] border border-[var(--mes-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans"
      >
        {/* Header Bar */}
        <div className="bg-[var(--mes-bg-well)] px-6 py-4 border-b border-[var(--mes-border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--mes-bg-card)] border border-[var(--mes-status-pass)]/40 flex items-center justify-center text-[var(--mes-status-pass)]">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--mes-text-muted)]">
                  GATEWAY AUTHENTICATION (GATE G-08)
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mes-status-pass)]" />
              </div>
              <h2 className="text-base font-bold text-[var(--mes-text-primary)] tracking-tight flex items-center gap-2">
                Cleanroom Operator Sign-In
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] p-1 rounded-lg hover:bg-[var(--mes-bg-card)] transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-xs font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Badge ID Input Field */}
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--mes-text-muted)] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--mes-status-pass)]" />
                Operator Badge Code
              </span>
              <span className="text-[10px] text-[var(--mes-text-muted)]">e.g. OP-01, QC-LEAD-01</span>
            </label>
            <div 
              onClick={() => setActiveInput('badge')}
              className={`flex items-center bg-[var(--mes-bg-well)] border rounded-xl px-4 py-3 cursor-text transition-all ${
                activeInput === 'badge'
                  ? 'border-[var(--mes-status-pass)] ring-1 ring-[var(--mes-status-pass)]/30'
                  : 'border-[var(--mes-border)] hover:border-[var(--mes-text-muted)]'
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
                className="w-full bg-transparent text-[var(--mes-text-primary)] font-mono text-base outline-none uppercase placeholder:text-[var(--mes-text-muted)]/50"
                autoComplete="off"
                autoFocus
              />
              {badgeCode && (
                <button
                  type="button"
                  onClick={() => setBadgeCode('')}
                  className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] text-xs font-mono ml-2"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* PIN Input Field */}
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--mes-text-muted)] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--mes-accent-primary)]" />
                Operator PIN Code
              </span>
              <span className="text-[10px] text-[var(--mes-text-muted)]">Volatile In-Memory</span>
            </label>
            <div 
              onClick={() => setActiveInput('pin')}
              className={`flex items-center bg-[var(--mes-bg-well)] border rounded-xl px-4 py-3 cursor-text transition-all ${
                activeInput === 'pin'
                  ? 'border-[var(--mes-accent-primary)] ring-1 ring-[var(--mes-accent-primary)]/30'
                  : 'border-[var(--mes-border)] hover:border-[var(--mes-text-muted)]'
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
                className="w-full bg-transparent text-[var(--mes-text-primary)] font-mono text-base outline-none tracking-widest placeholder:tracking-normal placeholder:text-[var(--mes-text-muted)]/50"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] p-1"
                aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Touchscreen Tablet Keypad (Cleanroom Nitrile Glove Friendly) */}
          <div className="bg-[var(--mes-bg-well)] p-3 rounded-xl border border-[var(--mes-border)] flex flex-col gap-2">
            <div className="text-[10px] font-mono text-[var(--mes-text-muted)] flex justify-between items-center px-1">
              <span>CLEANROOM TOUCH KEYPAD</span>
              <span className="text-[var(--mes-status-pass)]">TARGET: {activeInput.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  className="py-3 bg-[var(--mes-bg-card)] hover:bg-[var(--mes-bg-surface)] active:bg-[var(--mes-status-pass)]/20 text-[var(--mes-text-primary)] font-mono text-lg font-bold rounded-lg border border-[var(--mes-border)] transition-colors shadow-sm"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClear}
                className="py-3 bg-red-950/20 hover:bg-red-950/40 text-red-400 font-mono text-xs font-bold rounded-lg border border-red-500/30 transition-colors"
              >
                CLR
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="py-3 bg-[var(--mes-bg-card)] hover:bg-[var(--mes-bg-surface)] active:bg-[var(--mes-status-pass)]/20 text-[var(--mes-text-primary)] font-mono text-lg font-bold rounded-lg border border-[var(--mes-border)] transition-colors shadow-sm"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-3 bg-[var(--mes-bg-card)] hover:bg-[var(--mes-bg-surface)] text-[var(--mes-text-muted)] hover:text-[var(--mes-text-primary)] flex items-center justify-center rounded-lg border border-[var(--mes-border)] transition-colors"
                aria-label="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Preset Badges for Testing & Shift Handoff */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[var(--mes-text-muted)]">QUICK ROLE SELECT (FACTORY SIMULATOR):</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { code: 'OP-01', pin: '1234', role: 'OPERATOR', color: 'border-emerald-500/40 text-emerald-400' },
                { code: 'QC-LEAD-01', pin: '4321', role: 'QUALITY_LEAD', color: 'border-purple-500/40 text-purple-400' },
                { code: 'LL-01', pin: '5678', role: 'LINE_LEAD', color: 'border-blue-500/40 text-blue-400' },
                { code: 'SYS-ADMIN-01', pin: '9999', role: 'SYSTEM_ADMIN', color: 'border-amber-500/40 text-amber-400' },
              ].map((preset) => (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => selectPreset(preset.code, preset.pin)}
                  className={`px-2 py-1.5 bg-[var(--mes-bg-card)] hover:bg-[var(--mes-bg-surface)] border rounded-lg text-left font-mono text-[10px] flex flex-col transition-colors ${preset.color}`}
                >
                  <span className="font-bold">{preset.code}</span>
                  <span className="text-[var(--mes-text-muted)] text-[9px]">{preset.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-[var(--mes-bg-well)] hover:bg-[var(--mes-bg-card)] text-[var(--mes-text-secondary)] hover:text-[var(--mes-text-primary)] rounded-xl border border-[var(--mes-border)] font-mono text-xs font-bold transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-[var(--mes-status-pass)] hover:opacity-90 active:opacity-80 disabled:opacity-50 text-black rounded-xl font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
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
