import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  Info,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/common/Badge';
import { PeeringStatus } from '../types';

export const VpcPeeringPage: React.FC = () => {
  const { state, updatePeering } = useProject();
  const [peeringIdInput, setPeeringIdInput] = useState(state.peering.peeringId || '');
  const [statusInput, setStatusInput] = useState<PeeringStatus>(state.peering.status);
  const [notesInput, setNotesInput] = useState(state.peering.notes || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    updatePeering({
      peeringId: peeringIdInput,
      status: statusInput,
      notes: notesInput,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Share2 className="w-4 h-4" />
          <span>Stage 8 Cross-VPC Interconnect</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          VPC Peering Connection Lifecycle (ewb-a-b-peer)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Establish and verify the AWS VPC Peering connection linking VPC A (10.10.0.0/16) and VPC B (10.20.0.0/16).
        </p>
      </div>

      {/* Critical Architecture Rule Notice */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs text-amber-950">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-amber-900 text-sm">
              Core Networking Truth: "Active Peering" Does NOT Equal Connected
            </h4>
            <p className="text-amber-800 leading-relaxed">
              When a VPC Peering connection transitions to <span className="font-bold text-emerald-700">Active</span>, AWS has merely created the physical conduit between the VPC routers. Packets will STILL FAIL to flow until you:
              <br />
              1. Add routes pointing to the <code className="font-mono bg-amber-100 px-1 rounded">pcx-xxxx</code> peering ID in VPC A's route tables.
              <br />
              2. Add symmetric return routes pointing to <code className="font-mono bg-amber-100 px-1 rounded">pcx-xxxx</code> in VPC B's route tables.
              <br />
              3. Authorize incoming packets in each instance's Security Group firewall.
            </p>
          </div>
        </div>
      </div>

      {/* Peering State Machine Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-slate-900">{state.peering.connectionName}</h3>
              <Badge status={state.peering.status} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Peer requester: <span className="font-mono text-slate-700">ewb-vpc-a</span> • Peer accepter: <span className="font-mono text-slate-700">ewb-vpc-b</span>
            </p>
          </div>

          <div className="text-xs text-right text-slate-500">
            <span>AWS Region: <strong>ap-south-1</strong></span>
            <span className="block text-[11px] text-slate-400">Same Account Peering</span>
          </div>
        </div>

        {/* State Machine Step Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className={`p-3 rounded-lg border ${state.peering.status !== 'Not created' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="font-bold block text-[11px] text-slate-400">Step 1</span>
            <span className="font-semibold block mt-0.5">1. Create Peering</span>
            <span className="text-[10px] opacity-80">Requester VPC A → Accepter VPC B</span>
          </div>

          <div className={`p-3 rounded-lg border ${state.peering.status === 'Pending acceptance' || state.peering.status === 'Active' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="font-bold block text-[11px] text-slate-400">Step 2</span>
            <span className="font-semibold block mt-0.5">2. Record pcx ID</span>
            <span className="text-[10px] opacity-80">pcx-08a9f4c3b2e1d0f5a</span>
          </div>

          <div className={`p-3 rounded-lg border ${state.peering.status === 'Active' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
            <span className="font-bold block text-[11px] text-slate-400">Step 3</span>
            <span className="font-semibold block mt-0.5">3. Accept Request</span>
            <span className="text-[10px] opacity-80">Actions → Accept Request</span>
          </div>

          <div className={`p-3 rounded-lg border ${state.peering.status === 'Active' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <span className="font-bold block text-[11px] text-slate-400">Step 4</span>
            <span className="font-semibold block mt-0.5">4. Active State</span>
            <span className="text-[10px] opacity-80">Ready for Route Tables</span>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Actual AWS Peering Connection ID (pcx-xxxx)
              </label>
              <input
                type="text"
                value={peeringIdInput}
                onChange={(e) => setPeeringIdInput(e.target.value)}
                placeholder="e.g. pcx-08a9f4c3b2e1d0f5a"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Found in AWS VPC Console under "Peering Connections"
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current AWS Lifecycle Status
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as PeeringStatus)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="Not created">Not created</option>
                <option value="Pending acceptance">Pending acceptance</option>
                <option value="Active">Active</option>
                <option value="Failed">Failed</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Must be "Active" to support route table targets
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Peering Notes / AWS Console Feedback
            </label>
            <textarea
              rows={2}
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="Record peering verification observations..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedNotice && (
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <Check className="w-4 h-4 mr-1" />
                VPC Peering details saved!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors ml-auto flex items-center space-x-1.5"
            >
              <span>Save Peering Configuration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
