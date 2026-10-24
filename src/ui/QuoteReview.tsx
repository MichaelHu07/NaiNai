import { Button, Dialog, Badge } from '@radix-ui/themes';
import { Download, FileCheck2, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import type { PacketSnapshot } from '../shared/contracts';

export const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
export function QuoteReview({ snapshot, open, busy, onClose, onMark, onFee }: { snapshot: PacketSnapshot | null; open: boolean; busy: boolean; onClose: () => void; onMark: () => Promise<void>; onFee: (amountCents: number) => Promise<void> }) {
  const [fee, setFee] = useState('10');
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) onClose(); }}><Dialog.Content className="review-dialog" maxWidth="580px">
    <div className="dialog-top"><span className="eyebrow">HUMAN CHECKPOINT</span><Dialog.Close><Button variant="ghost" color="gray" aria-label="Close review"><X size={18}/></Button></Dialog.Close></div>
    <Dialog.Title className="serif dialog-title">A second look. Your say.</Dialog.Title>
    <Dialog.Description>Review this exact snapshot of the evidence. Marking it reviewed is nonbinding and has no commercial effect.</Dialog.Description>
    {snapshot && <>
      <div className="review-summary"><FileCheck2 size={24}/><div><strong>{snapshot.case.title}</strong><p>{snapshot.assessment.headline}</p></div></div>
      <Badge color={snapshot.case.intent === 'evaluation_only' ? 'blue' : 'tomato'}>{snapshot.case.intent === 'evaluation_only' ? 'Evaluation only' : 'Actual personal need'}</Badge> <Badge color="gray">Synthetic fixture</Badge>
      <dl className="review-details"><div><dt>Full cost</dt><dd>{snapshot.assessment.totalCents === null ? 'Incomplete — unknown costs' : money(snapshot.assessment.totalCents)}</dd></div><div><dt>Snapshot revisions</dt><dd>R{snapshot.revisions.request} · Q{snapshot.revisions.quote ?? '—'} · E{snapshot.revisions.evidence} · P{snapshot.revisions.permission}</dd></div></dl>
      {snapshot.assessment.unknowns.length > 0 && <p className="warning-copy">Unresolved: {snapshot.assessment.unknowns.join('; ')}</p>}
      <div className="nonbinding"><ShieldCheck size={18}/><span>Reviewed does not mean qualified, accepted, purchased or reserved. Incomplete findings retain their status.</span></div>
      <details className="fixture-tool"><summary>Test a changed term (synthetic only)</summary><p>Update the current fee while this review stays bound to its original revisions. A stale review must be rejected.</p><label htmlFor="review-fee">Synthetic mandatory fee (USD)</label><div className="inline-field"><input id="review-fee" type="number" min="0" step="0.01" value={fee} onChange={event => setFee(event.target.value)}/><Button variant="soft" disabled={busy || !Number.isFinite(Number(fee)) || Number(fee) < 0} onClick={() => void onFee(Math.round(Number(fee) * 100))}>Apply fee change</Button></div></details>
      <div className="dialog-actions"><Button variant="soft" color="gray" onClick={onClose}>Back to findings</Button><Button disabled={busy} onClick={() => void onMark()}><FileCheck2 size={16}/>Mark reviewed</Button></div>
    </>}
  </Dialog.Content></Dialog.Root>;
}

export function SavePacketButton({ packet, busy, onSave }: { packet: PacketSnapshot; busy: boolean; onSave: () => Promise<void> }) {
  return <Button className="save-button" variant="outline" disabled={!packet.review || busy} onClick={() => void onSave()}><Download size={16}/>Save quote packet</Button>;
}
