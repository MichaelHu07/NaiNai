import type {NaiNaiCore} from './store';
import type {DispatchJournal} from './dispatch';
export function recoverPendingActions(core:NaiNaiCore,journal?:DispatchJournal):void {journal?.recoverPendingActions();core.recoverSessions();}
