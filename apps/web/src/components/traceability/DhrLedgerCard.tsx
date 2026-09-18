// apps/web/src/components/traceability/DhrLedgerCard.tsx
import React from 'react';
import { ShieldCheck, FileText, Hash, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

interface DhrLedgerCardProps {
  dhr: {
    dhrNumber: string;
    status: string;
    sha256Checksum: string;
    qaReviewerId: string | null;
    qaReleasedAt: string | null;
  } | null;
  complianceLedger: {
    dhrSignatures: Array<{
      sequenceNumber: number;
      currentHash: string;
      actorId: string;
      actorRole: string;
      actionType: string;
      signedAt: string;
    }>;
  } | null;
}

export const DhrLedgerCard: React.FC<DhrLedgerCardProps> = ({ dhr, complianceLedger }) => {
  const signatures = complianceLedger?.dhrSignatures || [];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-[var(--mes-radius)] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-100 font-mono uppercase tracking-wider">
            ELECTRONIC DEVICE HISTORY RECORD (eDHR) & AUDIT LEDGER
          </h3>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[var(--mes-radius)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
          AUDIT LEDGER LINKED
        </span>
      </div>

      {/* DHR Metadata Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">eDHR Identifier</span>
          <span className="text-xs font-bold text-slate-100 block truncate" title={dhr?.dhrNumber || 'UNISSUED'}>
            {dhr?.dhrNumber || 'UNISSUED'}
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">DHR Release State</span>
          <span
            className={`text-xs font-bold block ${
              dhr?.status === 'RELEASED'
                ? 'text-emerald-400'
                : dhr?.status === 'PENDING_QA_REVIEW'
                ? 'text-amber-300'
                : 'text-slate-400'
            }`}
          >
            {dhr?.status ? dhr.status.replace(/_/g, ' ') : 'NOT INGESTED'}
          </span>
        </div>

        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">QA Officer Release</span>
          <span className="text-xs font-bold text-slate-100 block">
            {dhr?.qaReviewerId ? `${dhr.qaReviewerId}` : 'PENDING'}
          </span>
          {dhr?.qaReleasedAt && (
            <span className="text-[10px] text-slate-400 tabular-nums">
              {new Date(dhr.qaReleasedAt).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Cryptographic Ledger SHA-256 Digest */}
      {dhr?.sha256Checksum && (
        <div className="bg-slate-900 p-3 rounded-[var(--mes-radius)] border border-slate-800 space-y-1 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
            <Hash className="w-3 h-3 text-emerald-400" />
            <span>Cryptographic DHR Checksum (SHA-256 Digest)</span>
          </div>
          <div className="text-[11px] text-slate-300 font-mono break-all select-all">
            {dhr.sha256Checksum}
          </div>
        </div>
      )}

      {/* Immutable Electronic Signature Ledger Chain */}
      {signatures.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Immutable Audit Ledger Signatures ({signatures.length} Records)
          </span>
          <div className="space-y-1.5">
            {signatures.map((sig, i) => (
              <div
                key={i}
                className="bg-slate-900 p-2.5 rounded-[var(--mes-radius)] border border-slate-800 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold tabular-nums">#{sig.sequenceNumber}</span>
                  <span className="text-slate-100 font-bold">{sig.actionType}</span>
                  <span className="text-slate-400">by {sig.actorId} ({sig.actorRole})</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="font-mono text-slate-500 truncate max-w-[120px]" title={sig.currentHash}>
                    {sig.currentHash.substring(0, 12)}...
                  </span>
                  <span className="tabular-nums">{new Date(sig.signedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
