import React, { useRef, useState } from 'react';
import { Copy, Check, X, FileText, AlertCircle } from 'lucide-react';

interface ShiftBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefingText: string;
  copyError?: string | null;
}

export const ShiftBriefingModal: React.FC<ShiftBriefingModalProps> = ({
  isOpen,
  onClose,
  briefingText,
  copyError
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (textareaRef.current) {
        textareaRef.current.select();
      }
      await navigator.clipboard.writeText(briefingText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (textareaRef.current) {
        textareaRef.current.select();
      }
      setCopied(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono"
      role="dialog"
      aria-modal="true"
      aria-labelledby="briefing-modal-title"
    >
      <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] max-w-2xl w-full p-5 shadow-2xl flex flex-col gap-3.5 text-slate-100 font-mono animate-in fade-in duration-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[var(--mes-radius)] bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 id="briefing-modal-title" className="text-sm font-bold tracking-wider uppercase">
                SMT Shift Handover Briefing
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Cleanroom operational markdown summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 rounded-[var(--mes-radius)] hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {copyError && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-[var(--mes-radius)] p-2.5 text-xs text-amber-300 flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Automatic clipboard write restricted. Please copy the text below manually.</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="briefing-content" className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Markdown Telemetry Payload
          </label>
          <textarea
            id="briefing-content"
            ref={textareaRef}
            readOnly
            value={briefingText}
            className="w-full h-60 bg-slate-900 border border-slate-800 rounded-[var(--mes-radius)] p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-cyan-500 select-all resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-400">
            Press Cmd+A / Ctrl+A to select all
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-[var(--mes-radius)] border border-slate-700 text-xs font-mono font-bold tracking-wider transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-[var(--mes-radius)] text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
