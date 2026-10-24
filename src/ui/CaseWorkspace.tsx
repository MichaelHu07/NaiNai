import { Badge, Button, Dialog } from '@radix-ui/themes';
import { ArrowDown, ArrowUpRight, Check, CircleHelp, FileText, Hand, Headphones, MessageCircle, Pause, Play, SearchCheck, ShieldCheck, Square, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { CampaignState, CaseRequest, Check as AssessmentCheck, EvidenceRef, FixtureScenario, PacketSnapshot } from '../shared/contracts';
import { money, SavePacketButton } from './QuoteReview';

type Props = {
  packet: PacketSnapshot;
  onReview: () => Promise<void>;
  onPause: () => Promise<void>;
  onTakeover: (sessionId: string) => Promise<void>;
  onStop: (sessionId: string) => Promise<void>;
  campaign?: CampaignState | null;
  busy?: boolean;
  onResume?: () => Promise<void>;
  onStart?: () => Promise<void>;
  onScenario?: (scenario: FixtureScenario) => Promise<void>;
  onRequest?: (request: CaseRequest) => Promise<void>;
  onSharing?: (sharing: boolean) => Promise<void>;
  onSave?: () => Promise<void>;
  onAdvance?: (sessionId: string) => Promise<void>;
};
const scenarios: [FixtureScenario, string][] = [['complete', 'Complete terms'], ['missing_cost', 'Missing cost'], ['over_budget', 'Above cap'], ['condition_change', 'Changed condition'], ['minimum_term', 'Longer minimum term'], ['no_response', 'No response'], ['declined', 'Declined'], ['source_failure', 'Source failure']];
const stamp = (value: string) => new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const intent = (packet: PacketSnapshot) => packet.case.intent === 'actual_need' ? 'Actual personal need' : 'Evaluation only';
function CheckList({ checks }: { checks: AssessmentCheck[] }) {
  return <ul className="check-list">{checks.map(check => <li key={check.id}><span className={`check-icon ${check.status}`}>{check.status === 'pass' ? <Check size={13}/> : check.status === 'fail' ? <X size={13}/> : <CircleHelp size={13}/>}</span><div><strong>{check.label}</strong><p>{check.detail}</p></div></li>)}</ul>;
}

function GpuAssumptions({ request, busy, onSave }: { request: Extract<CaseRequest, { category: 'gpu' }>; busy: boolean; onSave: (request: CaseRequest) => Promise<void> }) {
  const [hours, setHours] = useState(String(request.requirements.continuousHours));
  const [storage, setStorage] = useState(String(request.requirements.storageGb));
  const [egress, setEgress] = useState(String(request.requirements.egressGb));
  return <details className="assumptions"><summary>Edit illustrative assumptions</summary><form onSubmit={event => { event.preventDefault(); void onSave({ ...request, requirements: { ...request.requirements, continuousHours: Number(hours), storageGb: Number(storage), egressGb: Number(egress) } }); }}>
    <label>Continuous hours<input type="number" min="1" step="1" required value={hours} onChange={e => setHours(e.target.value)}/></label>
    <label>Persistent storage (GB)<input type="number" min="0" required value={storage} onChange={e => setStorage(e.target.value)}/></label>
    <label>Outbound data (GB)<input type="number" min="0" required value={egress} onChange={e => setEgress(e.target.value)}/></label>
    <Button size="1" variant="soft" disabled={busy} type="submit">Save new request revision</Button>
  </form></details>;
}

export function CaseWorkspace({ packet, onReview, onPause, onTakeover, onStop, campaign, busy = false, onResume, onStart, onScenario, onRequest, onSharing, onSave, onAdvance }: Props): React.JSX.Element {
  const [source, setSource] = useState<EvidenceRef | null>(null);
  const sourceTrigger = useRef<HTMLButtonElement | null>(null);
  const request = packet.case, quote = packet.quote;
  const session = campaign?.sessions.filter(s => s.caseId === request.caseId).at(-1);
  const active = session && ['active', 'pending'].includes(session.status);
  const sharing = packet.evidence.length > 0 && packet.evidence.every(e => e.permissions.sharing);
  const complete = packet.assessment.totalCents !== null;
  const expired = quote?.expiresAt && Date.parse(quote.expiresAt) < Date.now();
  const currentSources = quote ? packet.evidence.filter(e => quote.evidenceIds.includes(e.id)) : packet.evidence.slice(-1);
  const scenarioFromSource = currentSources.map(e => e.excerpt.match(/Fixture scenario: (\w+)\./)?.[1]).find(Boolean);
  const scenarioValue = scenarioFromSource ?? (packet.context.conversationOutcome === 'no_response' ? 'no_response' : packet.context.conversationOutcome === 'declined' ? 'declined' : packet.context.conversationOutcome === 'failed' ? 'source_failure' : '');
  return <>
    <section className="case-heading" aria-label="Current buying request">
      <div><div className="request-meta"><span className="eyebrow">{request.category === 'table' ? '01 / PERSONAL PILOT' : '02 / COMPUTE PLAYBOOK'}</span><Badge variant="soft" color={request.category === 'table' ? 'tomato' : 'blue'}>{intent(packet)}</Badge></div><h1>{request.title}<span className="title-dot">.</span></h1><p className="request-description">{request.category === 'table' ? 'One new T318-1. Delivered to Decatur, GA 30033. Strictly under $150, every cost included.' : '8 × H100 80 GB SXM · one NVLink node · US region · illustrative $2,000 inclusive ceiling.'}</p></div>
      <div className="request-cap"><span>{request.category === 'table' ? 'ALL-IN TARGET' : 'ILLUSTRATIVE CEILING'}</span><strong>{request.category === 'table' ? '< $150' : money(request.capCents)}</strong><small>{request.category === 'table' ? '$149.99 maximum · USD' : 'Independent of table budget · USD'}</small></div>
    </section>
    {request.category === 'gpu' && <div className="evaluation-note"><CircleHelp size={17}/><span>No actual workload, company buyer or buying commitment. Configuration, date and ceiling are illustrative.</span></div>}
    <div className="scenario-strip"><div><span className="small-dot"/><strong>Controlled test workspace</strong><span className="scenario-description">Explore how the team handles changed terms.</span></div><label>Fixture scenario<select aria-label="Fixture scenario" value={scenarioValue} disabled={busy} onChange={e => void onScenario?.(e.target.value as FixtureScenario)}><option value="" disabled>Changed synthetic terms</option>{scenarios.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <div className="workspace-grid">
      <section className="workspace-pane conversation-pane" aria-labelledby="bargainer-title">
        <div className="pane-heading"><span className="agent-icon coral"><MessageCircle size={20}/></span><div><h2 id="bargainer-title">The Bargainer</h2><p>A good question goes a long way.</p></div><span className="agent-index">01</span></div>
        <div className="pane-content">
          <div className="conversation-meta"><Badge color="gray">Synthetic fixture</Badge><span>{session ? session.status : 'Not started'}</span></div>
          <div className="request-bubble"><span className="bubble-label">THE BUYER'S BRIEF</span><p>{request.category === 'table' ? 'Can we find this table delivered for strictly less than $150, including tax and every fee?' : 'Compare indicative compute terms for these illustrative assumptions. Do not reserve capacity.'}</p></div>
          {session ? <div className="event-list" aria-label="Conversation transcript">{session.events.map(event => <article className={`conversation-event role-${event.role}`} key={event.id}><div><strong>{event.role === 'nainai' ? 'NaiNai' : event.role}</strong><time dateTime={event.at}>{stamp(event.at)}</time></div><p>{event.text}</p><span className="origin-label">{event.origin.replaceAll('_', ' ')}</span></article>)}</div> : <div className="conversation-empty"><Headphones size={30} strokeWidth={1.3}/><h3>Ready when you are.</h3><p>Start a synthetic conversation to inspect the workflow and practice human controls.</p><Button variant="soft" disabled={busy || !onStart || campaign?.paused || campaign?.sessions.some(s => s.status === 'active' || s.status === 'pending')} onClick={() => void onStart?.()}><Play size={15}/>Start synthetic conversation</Button><small>No calls. No supplier contact. No real services.</small></div>}
          {session && <div className="session-status"><span className="small-dot"/><span>{session.stopStatus === 'pending' ? 'Stop pending — awaiting acknowledgement' : session.stopStatus === 'confirmed' ? 'Stop confirmed' : session.control === 'human' ? 'Human control' : campaign?.paused ? 'Paused — future actions blocked' : 'Synthetic conversation active'}</span></div>}
          {session && !active && <Button variant="soft" size="2" disabled={busy || campaign?.paused || campaign?.sessions.some(s => s.status === 'active' || s.status === 'pending')} onClick={() => void onStart?.()}><Play size={14}/>Start synthetic conversation</Button>}
          {active && session.control === 'ai' && !campaign?.paused && scenarioValue === 'complete' && <Button className="advance-rehearsal" variant="soft" size="2" disabled={busy} onClick={() => void onAdvance?.(session.sessionId)}>Advance rehearsal<ArrowUpRight size={14}/></Button>}
          <div className="conversation-controls"><Button size="2" variant="outline" color="gray" disabled={busy || !campaign} onClick={() => void (campaign?.paused ? onResume?.() : onPause())}>{campaign?.paused ? <Play size={14}/> : <Pause size={14}/>}<span>{campaign?.paused ? 'Resume synthetic conversations' : 'Pause all conversations'}</span></Button><div><Button variant="ghost" color="gray" disabled={busy || !active || session?.control === 'human'} onClick={() => session && void onTakeover(session.sessionId)} aria-label="Take over conversation"><Hand size={15}/>Take over</Button><Button variant="ghost" color="tomato" disabled={busy || !active || session?.stopStatus === 'pending'} onClick={() => session && void onStop(session.sessionId)} aria-label="Stop conversation"><Square size={13}/>Stop</Button></div></div>
          <p className="pane-footnote">You stay in control. Pausing blocks future actions; stopping awaits the server's acknowledgement.</p>
        </div>
      </section>
      <section className="workspace-pane evidence-pane" aria-labelledby="skeptic-title">
        <div className="pane-heading"><span className="agent-icon sage"><SearchCheck size={21}/></span><div><h2 id="skeptic-title">The Skeptic</h2><p>Trust the terms. Check the source.</p></div><span className="agent-index">02</span></div>
        <div className="pane-content">
          <div className="section-label"><span>THE EVIDENCE</span><span>{packet.evidence.length} source{packet.evidence.length === 1 ? '' : 's'}</span></div>
          {packet.evidence.length === 0 ? <div className="empty-evidence"><FileText size={24}/><p>No evidence recorded yet. Findings remain incomplete.</p></div> : [...packet.evidence].reverse().map(evidence => <article className="source-card" key={evidence.id}><div className="source-card-top"><FileText size={18}/><Badge size="1" color="gray">{evidence.origin.replaceAll('_', ' ')}</Badge></div><h3>{evidence.sourceLabel}</h3><p className="source-excerpt">{evidence.permissions.display ? evidence.excerpt : 'Display permission is revoked for this source.'}</p><div className="source-date">Cached {stamp(evidence.recordedAt)} · {evidence.verification.replaceAll('_', ' ')}</div><Button variant="ghost" size="2" color="gray" disabled={!evidence.permissions.display} onClick={event => { sourceTrigger.current = event.currentTarget; setSource(evidence); }}>Inspect original source<ArrowUpRight size={15}/></Button></article>)}
          <div className="section-label checks-label"><span>THE REALITY CHECK</span><ShieldCheck size={15}/></div>
          <CheckList checks={packet.assessment.checks.filter(check => check.status !== 'pass')}/>
          {packet.assessment.checks.some(check => check.status === 'pass') && <details className="passed-checks"><summary><Check size={13}/>{packet.assessment.checks.filter(check => check.status === 'pass').length} checks passed · inspect all</summary><CheckList checks={packet.assessment.checks.filter(check => check.status === 'pass')}/></details>}
          {packet.assessment.unknowns.length > 0 && <div className="unknown-box"><strong>Still needs an answer</strong><ul>{packet.assessment.unknowns.map(unknown => <li key={unknown}>{unknown}</li>)}</ul></div>}
          {request.category === 'table' && <label className="delivery-field">Buyer delivery service<select aria-label="Buyer delivery service" value={request.requirements.deliveryService ?? ''} disabled={busy} onChange={event => { const value = event.target.value; if (value && onRequest) void onRequest({ ...request, requirements: { ...request.requirements, deliveryService: value as 'doorstep' | 'inside' } }); }}><option value="" disabled>Select before qualifying</option><option value="doorstep">Doorstep delivery</option><option value="inside">Inside delivery</option></select><small>Choosing a service revises your request. It grants no permission to contact a supplier.</small></label>}
          {request.category === 'gpu' && onRequest && <GpuAssumptions key={request.requestRevision} request={request} busy={busy} onSave={onRequest}/>}
          <div className="sharing-control"><div><strong>Packet sharing</strong><small>{sharing ? 'Allowed for these synthetic sources' : 'Revoked for current evidence'}</small></div><Button variant="ghost" color="gray" size="1" disabled={busy || !packet.evidence.length} onClick={() => void onSharing?.(!sharing)}>{sharing ? 'Revoke sharing' : 'Allow sharing'}</Button></div>
        </div>
      </section>
      <section className="workspace-pane costs-pane" aria-labelledby="bookkeeper-title">
        <div className="pane-heading"><span className="agent-icon gold"><FileText size={20}/></span><div><h2 id="bookkeeper-title">The Bookkeeper</h2><p>Every dollar. Nothing swept under.</p></div><span className="agent-index">03</span></div>
        <div className="pane-content">
          <div className="section-label"><span>{quote ? 'SYNTHETIC QUOTE' : 'FINDINGS'}</span><Badge size="1" color="gray">USD</Badge></div>
          <h3 className="supplier-name">{quote?.supplierName ?? 'No quote received'}</h3><p className="synthetic-tax">Fictional supplier terms · sandbox tax</p>
          {quote ? <><dl className="cost-list">{Object.entries(quote.costs).map(([name, cost]) => <div key={name}><dt>{name === 'item' && request.category === 'gpu' ? 'Compute charge' : name}</dt><dd className={cost.status === 'unknown' ? 'unknown-cost' : ''}>{name === 'item' && quote.compute ? money(packet.assessment.knownTotalCents - Object.entries(quote.costs).filter(([key]) => key !== 'item').reduce((sum, [, value]) => sum + (value.amountCents ?? 0), 0)) : cost.status === 'unknown' ? 'Unknown' : cost.status === 'included' ? 'Included' : money(cost.amountCents ?? 0)}</dd></div>)}</dl>{quote.compute && <div className="compute-formula">{quote.compute.gpuCount} GPUs × ${quote.compute.ratePerGpuHour}/GPU-hour<br/>Minimum {quote.compute.minimumHours} hours · {quote.compute.billingIncrementHours}-hour billing increments</div>}<div className="quote-total"><span>{complete ? 'All-in quote' : 'Known subtotal'}</span><strong>{money(complete ? packet.assessment.totalCents! : packet.assessment.knownTotalCents)}</strong><small>{complete ? 'From synthetic terms and deterministic checks' : 'Incomplete total · missing costs are not zero'}</small></div></> : <div className="no-quote"><CircleHelp size={24}/><p>{packet.context.reason ?? 'No supplier quotation is available.'}</p></div>}
          <div className={`outcome-card ${packet.assessment.outcome === 'qualifying_table_quote' ? 'outcome-pass' : ''}`}><div><span className="small-dot"/><span>{packet.assessment.outcome.replaceAll('_', ' ')}</span></div><h3>{packet.assessment.headline}</h3>{expired && <p className="warning-copy">Quote expired. Current availability and terms need reconfirmation.</p>}</div>
          <div className="review-actions"><Button size="3" className="primary-review" disabled={busy} onClick={() => void onReview()}>Review findings<ArrowUpRight size={17}/></Button><SavePacketButton packet={packet} busy={busy} onSave={onSave ?? (async () => {})}/></div>
          <div className="review-status"><ShieldCheck size={15}/><div><span>{packet.review ? 'Reviewed snapshot' : 'Not reviewed'}</span>{packet.review && <small>{stamp(packet.review.reviewedAt)}</small>}</div></div><p className="pane-footnote">Human review is nonbinding. It creates no purchase, acceptance, payment or reservation.</p>
        </div>
      </section>
    </div>
    <div className="workflow-footer"><span>Request</span><ArrowDown size={13}/><span>Compare & question</span><ArrowDown size={13}/><strong>Human review</strong><ArrowDown size={13}/><span>Saved findings</span><em>Good terms deserve a paper trail.</em></div>
    <Dialog.Root open={!!source} onOpenChange={value => { if (!value) setSource(null); }}><Dialog.Content maxWidth="720px" onCloseAutoFocus={event => { event.preventDefault(); sourceTrigger.current?.focus(); }}><div className="dialog-top"><Badge color="gray">{source?.origin.replaceAll('_', ' ')}</Badge><Dialog.Close><Button variant="ghost" color="gray" aria-label="Close source"><X size={18}/></Button></Dialog.Close></div><Dialog.Title>{source?.sourceLabel}</Dialog.Title><Dialog.Description>Original recorded evidence · {source?.intent.replaceAll('_', ' ')} · revision {source?.revision}</Dialog.Description><pre className="source-original">{source?.excerpt}</pre><dl className="source-metadata"><div><dt>Recorded</dt><dd>{source && stamp(source.recordedAt)}</dd></div><div><dt>Verification</dt><dd>{source?.verification.replaceAll('_', ' ')}</dd></div><div><dt>Artifact hash</dt><dd>{source?.artifactHash}</dd></div></dl>{source?.sourceUrl && <a href={source.sourceUrl} target="_blank" rel="noreferrer">Open public source<ArrowUpRight size={14}/></a>}</Dialog.Content></Dialog.Root>
  </>;
}
