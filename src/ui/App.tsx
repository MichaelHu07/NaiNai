import { Badge, Button, Spinner } from '@radix-ui/themes';
import { ArrowRight, Armchair, CircleAlert, Cpu, Flower2, LockKeyhole, LogOut, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CampaignState, CaseRequest, PacketSnapshot, ProviderHealth } from '../shared/contracts';
import { api, ApiError } from './api';
import { CaseWorkspace } from './CaseWorkspace';
import { QuoteReview } from './QuoteReview';

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [cases, setCases] = useState<CaseRequest[]>([]), [activeId, setActiveId] = useState(() => localStorage.getItem('nainai-case') ?? 'table');
  const [packet, setPacket] = useState<PacketSnapshot | null>(null), [campaign, setCampaign] = useState<CampaignState | null>(null), [health, setHealth] = useState<ProviderHealth | null>(null);
  const [error, setError] = useState(''), [notice, setNotice] = useState(''), [busy, setBusy] = useState(false), [loading, setLoading] = useState(false);
  const [passphrase, setPassphrase] = useState(''), [reviewSnapshot, setReviewSnapshot] = useState<PacketSnapshot | null>(null), [reviewOpen, setReviewOpen] = useState(false);
  const actionLock = useRef(false), activeCase = useRef(activeId); activeCase.current = activeId;
  // A mutation invalidates every read that began before its acknowledgement.
  const mutationGeneration = useRef(0);

  const fail = useCallback((value: unknown) => { setError(value instanceof Error ? value.message : 'The request could not be completed.'); if (value instanceof ApiError && value.status === 401) setAuthenticated(false); }, []);
  useEffect(() => { const controller = new AbortController(); api.session(controller.signal).then(result => setAuthenticated(result.authenticated)).catch(value => { if (!controller.signal.aborted) { fail(value); setAuthenticated(false); } }); return () => controller.abort(); }, [fail]);
  useEffect(() => {
    if (!authenticated) return;
    const controller = new AbortController(), generation = mutationGeneration.current;
    Promise.all([api.cases(controller.signal), api.campaign(controller.signal), api.health(controller.signal)]).then(([items, state, ready]) => {
      if (controller.signal.aborted) return;
      setCases(items);
      if (generation === mutationGeneration.current && !actionLock.current) { setCampaign(state); setHealth(ready); }
      if (!items.some(item => item.caseId === activeCase.current) && items[0]) setActiveId(items[0].caseId);
    }).catch(value => { if (!controller.signal.aborted && generation === mutationGeneration.current && !actionLock.current) fail(value); });
    return () => controller.abort();
  }, [authenticated, fail]);
  useEffect(() => {
    if (!authenticated) return;
    const controller = new AbortController(), generation = mutationGeneration.current; setPacket(null); setLoading(true); setReviewOpen(false); setError('');
    localStorage.setItem('nainai-case', activeId);
    api.packet(activeId, controller.signal).then(current => { if (!controller.signal.aborted && generation === mutationGeneration.current && activeId === activeCase.current) setPacket(current); }).catch(value => { if (!controller.signal.aborted && generation === mutationGeneration.current) fail(value); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [activeId, authenticated, fail]);
  useEffect(() => {
    if (!authenticated) return;
    const controller = new AbortController();
    let polling = false;
    const timer = window.setInterval(() => {
      if (document.hidden || actionLock.current || polling) return;
      polling = true;
      const generation = mutationGeneration.current;
      const currentRead = () => !controller.signal.aborted && generation === mutationGeneration.current && activeId === activeCase.current && !actionLock.current;
      Promise.all([api.packet(activeId, controller.signal), api.campaign(controller.signal), api.health(controller.signal)]).then(([current, state, ready]) => {
        if (!currentRead()) return;
        setPacket(current); setCampaign(state); setHealth(ready);
      }).catch(value => { if (currentRead()) fail(value); }).finally(() => { polling = false; });
    }, 10000);
    return () => { clearInterval(timer); controller.abort(); };
  }, [authenticated, activeId, fail]);
  const refresh = async () => { const id = activeId; const [current, state] = await Promise.all([api.packet(id), api.campaign()]); if (id === activeCase.current) setPacket(current); setCampaign(state); };
  const perform = async (action: () => Promise<void>) => {
    if (actionLock.current) return;
    actionLock.current = true; mutationGeneration.current++; setBusy(true); setError(''); setNotice('');
    try { await action(); }
    catch (value) {
      fail(value);
      if (value instanceof ApiError && value.code === 'STALE_REVISION') { setReviewOpen(false); setReviewSnapshot(null); try { await refresh(); } catch (refreshError) { fail(refreshError); } }
    } finally { actionLock.current = false; setBusy(false); }
  };
  const body = authenticated === null ? <div className="boot-state" role="status"><Spinner/>Opening your workspace…</div> : !authenticated ? <main className="login-layout"><div className="login-story"><span className="eyebrow">A LITTLE WISDOM. A BETTER DEAL.</span><h1>Grandma<br/>means <em>business.</em></h1><p>A small buying team with a sharp eye for terms, a soft spot for your budget, and you at the head of the table.</p><div className="login-principles"><span><MessageMark/>Ask good questions.</span><span><ShieldCheck size={18}/>Keep the receipts.</span><span><LockKeyhole size={18}/>Leave the decision to you.</span></div></div><form className="login-card" onSubmit={event => { event.preventDefault(); void perform(async () => { await api.login(passphrase); setPassphrase(''); setAuthenticated(true); }); }}><div className="login-lock"><LockKeyhole size={22}/></div><h2>Come on in.</h2><p>Use your startup passphrase or the local access-key file shown in your server terminal to open this private workspace.</p><label htmlFor="passphrase">Startup passphrase</label><input autoFocus id="passphrase" type="password" autoComplete="current-password" value={passphrase} onChange={e => setPassphrase(e.target.value)} required/><Button size="3" disabled={busy || !passphrase} type="submit">Open workspace<ArrowRight size={17}/></Button><small>Local fixture mode · external contact disabled</small></form></main> : <main className="app-main">
    <div className="workspace-topline"><nav aria-label="Buying cases" className="case-tabs">{cases.map(item => <button key={item.caseId} className={item.caseId === activeId ? 'active' : ''} disabled={busy} aria-current={item.caseId === activeId ? 'page' : undefined} onClick={() => { setNotice(''); setActiveId(item.caseId); }}>{item.category === 'table' ? <Armchair size={17}/> : <Cpu size={17}/>}<span>{item.category === 'table' ? 'Coffee table' : 'GPU compute'}</span></button>)}</nav><div className="workspace-status"><span className="small-dot"/>Saved on this device<Button aria-label="Refresh workspace" title="Refresh workspace" size="1" variant="ghost" color="gray" disabled={busy} onClick={() => void perform(refresh)}><RefreshCw size={15}/></Button></div></div>
    {loading ? <div className="workspace-loading" role="status"><Spinner/>Reading current evidence…</div> : packet ? <CaseWorkspace packet={packet} campaign={campaign} busy={busy}
      onReview={async () => { setReviewSnapshot(structuredClone(packet)); setReviewOpen(true); }}
      onPause={async () => perform(async () => { setCampaign(await api.pause()); })}
      onResume={async () => perform(async () => { setCampaign(await api.resume()); })}
      onStart={async () => perform(async () => { setCampaign(await api.start(activeId, packet.revisions)); })}
      onTakeover={async id => perform(async () => { await api.takeover(id); setCampaign(await api.campaign()); })}
      onStop={async id => perform(async () => { await api.stop(id); setCampaign(await api.campaign()); })}
      onAdvance={async id => perform(async () => { await api.advance(id); await refresh(); })}
      onScenario={async scenario => perform(async () => { setPacket(await api.scenario(activeId, scenario, packet.revisions)); })}
      onRequest={async request => perform(async () => { setPacket(await api.updateRequest(activeId, request, packet.revisions)); })}
      onSharing={async sharing => perform(async () => { setPacket(await api.sharing(activeId, sharing, packet.revisions)); setNotice(sharing ? 'Sharing permission updated. Review the new permission revision before saving.' : 'Sharing revoked. Previous reviews do not authorize export of the current evidence.'); })}
      onSave={async () => perform(async () => { if (packet.review) { await api.save(packet.review.id); setNotice('Reviewed findings packet downloaded as JSON. Evidence origin and unresolved findings are preserved.'); } })}
    /> : <div className="workspace-loading"><CircleAlert/><p>The workspace could not be opened.</p><Button onClick={() => void perform(refresh)}>Try again</Button></div>}
    {campaign && <section className="activity-bar" aria-label="Recorded activity"><div><span className="eyebrow">ACTUAL ACTIVITY</span><small>Synthetic sessions count separately.</small></div><div aria-label="Genuine observations"><strong>{campaign.counts.observations}</strong><span>observations</span></div><div aria-label="Actual supplier contacts"><strong>{campaign.counts.suppliersContacted}</strong><span>supplier contacts</span></div><div aria-label="Actual supplier replies"><strong>{campaign.counts.replies}</strong><span>supplier replies</span></div><div aria-label="Actual confirmed quotes"><strong>{campaign.counts.confirmedQuotes}</strong><span>confirmed quotes</span></div><div className="fixture-count"><strong>{campaign.counts.fixtureSessions}</strong><span>synthetic sessions</span></div></section>}
    <footer className="app-footer"><span>NaiNai · A small buying team, on your side.</span><div aria-label="Provider readiness"><span>INTEGRATIONS</span>{(['claude', 'cartesia', 'apify'] as const).map(provider => <span key={provider} className="provider-status"><i/>{provider}<em>{health?.providers[provider] ?? 'checking'}</em></span>)}</div></footer>
  </main>;
  return <div className="app-shell"><a className="skip-link" href="#main-content">Skip to workspace</a><header className="app-header"><a href="/" className="brand" aria-label="NaiNai home"><span className="brand-mark"><Flower2 size={28} strokeWidth={1.8}/></span><span>NaiNai<span className="brand-period">.</span></span></a><span className="brand-tagline">Grandma means business.</span><div className="header-right"><Badge color="gray" variant="outline"><LockKeyhole size={11}/>Private workspace</Badge>{authenticated && <Button variant="ghost" color="gray" size="1" disabled={busy} aria-label="Log out" onClick={() => void perform(async () => { await api.logout(); setAuthenticated(false); setPacket(null); })}><LogOut size={16}/></Button>}</div></header>
    <div className="fixture-banner"><Sparkles size={14}/><strong>Synthetic demo</strong><span>All quotes, conversations and tax are fixtures. Providers are placeholders. No suppliers are contacted.</span></div>
    <div id="main-content" tabIndex={-1}>{error && <div className="app-alert" role="alert"><CircleAlert size={18}/><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError('')}>×</button></div>}{notice && <div className="app-notice" role="status"><ShieldCheck size={17}/>{notice}</div>}{body}</div>
    <QuoteReview snapshot={reviewSnapshot} open={reviewOpen} busy={busy} onClose={() => setReviewOpen(false)} onMark={async () => perform(async () => { if (!reviewSnapshot) return; await api.review(activeId, reviewSnapshot.revisions, reviewSnapshot.reviewBasis); await refresh(); setReviewOpen(false); setNotice('Findings marked reviewed. Their outcome is unchanged.'); })} onFee={async amountCents => perform(async () => { if (!packet?.quote) return; const oldFee = packet.quote.costs.fees; const totalCents = packet.quote.totalCents === null || oldFee.status === 'unknown' ? null : packet.quote.totalCents - (oldFee.amountCents ?? 0) + amountCents; const quote = { ...packet.quote, totalCents, costs: { ...packet.quote.costs, fees: { status: 'known' as const, amountCents } } }; setPacket(await api.fee(activeId, quote, packet.revisions)); })}/>
  </div>;
}
function MessageMark() { return <Sparkles size={18}/>; }
