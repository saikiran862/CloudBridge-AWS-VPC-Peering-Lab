import React, { useState } from 'react';
import {
  Globe,
  Shield,
  Server,
  ArrowRight,
  Maximize2,
  Info,
  Laptop,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { ResourceDetailModal } from './ResourceDetailModal';
import { Badge } from '../common/Badge';

export const ArchitectureDiagram: React.FC = () => {
  const { state, updatePeering } = useProject();
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [activeFlow, setActiveFlow] = useState<'all' | 'laptop-bastion-a' | 'laptop-bastion-b' | 'app-a-app-b'>('all');

  const bastion = state.instances.find((i) => i.name === 'ewb-bastion');
  const appA = state.instances.find((i) => i.name === 'ewb-app-a');
  const appB = state.instances.find((i) => i.name === 'ewb-app-b');
  const peeringStatus = state.peering.status;

  const isFlowActive = (flowKey: string) => {
    if (activeFlow === 'all') return true;
    return activeFlow === flowKey;
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 text-white overflow-hidden shadow-xl">
      {/* Controls Bar */}
      <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-white flex items-center">
              <Layers className="w-5 h-5 mr-2 text-amber-500" />
              AWS VPC Peering Interactive Topology
            </h3>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              ap-south-1 (Mumbai)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any resource node to inspect configuration, route associations, and record AWS console IDs.
          </p>
        </div>

        {/* Traffic Flow Highlighting Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 font-medium">Trace Path:</span>
          <button
            onClick={() => setActiveFlow('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFlow === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Topologies
          </button>
          <button
            onClick={() => setActiveFlow('laptop-bastion-a')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFlow === 'laptop-bastion-a'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Laptop → Bastion → App-A
          </button>
          <button
            onClick={() => setActiveFlow('laptop-bastion-b')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFlow === 'laptop-bastion-b'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Laptop → Bastion → App-B (ProxyJump)
          </button>
          <button
            onClick={() => setActiveFlow('app-a-app-b')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeFlow === 'app-a-app-b'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            App-A ↔ App-B (Peering)
          </button>
        </div>
      </div>

      {/* Main Visual Canvas */}
      <div className="p-6 md:p-8 relative overflow-x-auto min-w-[900px] select-none bg-linear-to-b from-slate-900 to-slate-950">
        {/* External Client Box: Student Laptop */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                activeFlow === 'laptop-bastion-a' || activeFlow === 'laptop-bastion-b'
                  ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                  : 'border-slate-700 bg-slate-800/80'
              }`}
            >
              <div className="p-2 bg-slate-700 rounded-lg text-amber-400">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Student Laptop (Client)</span>
                <span className="text-[11px] text-slate-400 font-mono">Source IP: Student Public IPv4 /32</span>
                <span className="text-[10px] text-amber-400/90 block mt-0.5">SSH Key: ~/.ssh/ewb-lab.pem</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="h-0.5 w-12 bg-slate-700 border-t border-dashed border-amber-400" />
              <span>Public Internet (Port 22 SSH)</span>
              <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400">Peering Connection Status:</span>
            <select
              value={peeringStatus}
              onChange={(e) => updatePeering({ status: e.target.value as any })}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 font-medium"
            >
              <option value="Not created">Not created</option>
              <option value="Pending acceptance">Pending acceptance</option>
              <option value="Active">Active (Established)</option>
              <option value="Failed">Failed</option>
            </select>
            <Badge status={peeringStatus} />
          </div>
        </div>

        {/* Cloud Container Grid */}
        <div className="grid grid-cols-12 gap-6 items-stretch">
          {/* ================= VPC A ================= */}
          <div
            className={`col-span-6 rounded-2xl border-2 p-5 transition-all relative ${
              activeFlow === 'app-a-app-b' || activeFlow === 'laptop-bastion-a' || activeFlow === 'laptop-bastion-b' || activeFlow === 'all'
                ? 'border-blue-500/40 bg-blue-950/20'
                : 'border-slate-800 bg-slate-900/60 opacity-60'
            }`}
          >
            {/* VPC A Header */}
            <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-blue-400 shadow-xs shadow-blue-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-white">ewb-vpc-a</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-200">
                      10.10.0.0/16
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-300/80">Primary Ingress Hub • 65,536 IPs</span>
                </div>
              </div>

              {/* Internet Gateway Node */}
              <button
                onClick={() => setSelectedResourceId('ewb-igw-a')}
                className="group flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/40 hover:border-emerald-400 px-3 py-1.5 rounded-lg transition-all"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-emerald-200 group-hover:text-white">ewb-igw-a</div>
                  <div className="text-[10px] text-emerald-400 font-mono">0.0.0.0/0 Target</div>
                </div>
              </button>
            </div>

            {/* VPC A Subnets */}
            <div className="mt-5 space-y-5">
              {/* Public Subnet: ewb-a-public */}
              <div
                className={`p-4 rounded-xl border border-dashed transition-all ${
                  activeFlow === 'laptop-bastion-a' || activeFlow === 'laptop-bastion-b' || activeFlow === 'all'
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      Public Subnet: ewb-a-public
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                      10.10.1.0/24
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">Route: 0.0.0.0/0 → ewb-igw-a</span>
                </div>

                {/* Bastion Host Card */}
                <div
                  onClick={() => setSelectedResourceId('ewb-bastion')}
                  className="cursor-pointer group p-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-400 rounded-lg transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-white group-hover:text-amber-300">
                            ewb-bastion
                          </span>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                            Public IPv4: {bastion?.publicIp || '13.232.145.88'}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          Private: 10.10.1.10 • SG: ewb-sg-bastion
                        </div>
                      </div>
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center text-amber-400/90">
                      <Shield className="w-3 h-3 mr-1" />
                      SSH (22) from Student IP /32 only
                    </span>
                    <span className="text-emerald-400 font-medium">Auto-Assign Public IP: ON</span>
                  </div>
                </div>
              </div>

              {/* Private Subnet: ewb-a-private */}
              <div
                className={`p-4 rounded-xl border border-dashed transition-all ${
                  activeFlow === 'laptop-bastion-a' || activeFlow === 'app-a-app-b' || activeFlow === 'all'
                    ? 'border-indigo-500/50 bg-indigo-950/20'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      Private Subnet: ewb-a-private
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                      10.10.2.0/24
                    </span>
                  </div>
                  <span className="text-[10px] text-rose-300 font-mono flex items-center">
                    <Lock className="w-2.5 h-2.5 mr-1" /> No Internet Gateway Route
                  </span>
                </div>

                {/* App-A EC2 Card */}
                <div
                  onClick={() => setSelectedResourceId('ewb-app-a')}
                  className="cursor-pointer group p-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-indigo-400 rounded-lg transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-white group-hover:text-indigo-300">
                            ewb-app-a
                          </span>
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                            NO Public IP (Air-Gapped)
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          Private: 10.10.2.10 • SG: ewb-sg-app-a
                        </div>
                      </div>
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-300">SSH: 10.10.1.10/32</span>
                    <span className="text-cyan-400 font-mono">ICMP Ingress: 10.20.1.10/32</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= VPC B ================= */}
          <div
            className={`col-span-6 rounded-2xl border-2 p-5 transition-all relative ${
              activeFlow === 'app-a-app-b' || activeFlow === 'laptop-bastion-b' || activeFlow === 'all'
                ? 'border-purple-500/40 bg-purple-950/20'
                : 'border-slate-800 bg-slate-900/60 opacity-60'
            }`}
          >
            {/* VPC B Header */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-purple-400 shadow-xs shadow-purple-400" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-white">ewb-vpc-b</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200">
                      10.20.0.0/16
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-300/80">Completely Isolated Workload VPC • 65,536 IPs</span>
                </div>
              </div>

              {/* No IGW Badge */}
              <div className="flex items-center space-x-1.5 bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 rounded-lg text-rose-300 text-xs">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-semibold">NO Internet Gateway</span>
              </div>
            </div>

            {/* VPC B Subnets */}
            <div className="mt-5 space-y-5">
              {/* Isolation Notice Banner */}
              <div className="p-3 bg-purple-900/30 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex items-start space-x-2">
                <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Workload Isolation: </strong>
                  VPC B has no public subnets, no NAT gateway, and no direct internet gateway. It can ONLY communicate with authorized hosts in VPC A across the VPC Peering connection.
                </div>
              </div>

              {/* Private Subnet: ewb-b-private */}
              <div
                className={`p-4 rounded-xl border border-dashed transition-all ${
                  activeFlow === 'app-a-app-b' || activeFlow === 'laptop-bastion-b' || activeFlow === 'all'
                    ? 'border-purple-500/50 bg-purple-950/20'
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                      Private Subnet: ewb-b-private
                    </span>
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                      10.20.1.0/24
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Route: 10.10.0.0/16 → ewb-a-b-peer
                  </span>
                </div>

                {/* App-B EC2 Card */}
                <div
                  onClick={() => setSelectedResourceId('ewb-app-b')}
                  className="cursor-pointer group p-3.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-purple-400 rounded-lg transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-white group-hover:text-purple-300">
                            ewb-app-b
                          </span>
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                            NO Public IP (Air-Gapped)
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-300 mt-0.5">
                          Private: 10.20.1.10 • SG: ewb-sg-app-b
                        </div>
                      </div>
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-slate-300">SSH: 10.10.1.10/32</span>
                    <span className="text-cyan-400 font-mono">ICMP Ingress: 10.10.2.10/32</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= INTER-VPC PEERING BRIDGE ================= */}
        <div className="mt-6 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedResourceId('ewb-a-b-peer')}
                className="p-2.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shadow-md"
              >
                <Shield className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">VPC Peering Connection: ewb-a-b-peer</span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {state.peering.peeringId || 'pcx-08a9f4c3b2e1d0f5a'}
                  </span>
                  <Badge status={peeringStatus} />
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Point-to-point network connection between VPC A (10.10.0.0/16) and VPC B (10.20.0.0/16) with no single point of failure or bandwidth bottlenecks.
                </p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block font-mono">
                Requester: {state.peering.requesterVpcId}
              </span>
              <span className="text-slate-400 block font-mono">
                Accepter: {state.peering.accepterVpcId}
              </span>
            </div>
          </div>

          {/* Communication Flow Legend */}
          <div className="mt-3 pt-3 border-t border-amber-500/20 grid grid-cols-3 gap-2 text-[11px]">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-amber-400 font-semibold block">1. Laptop → Bastion → App-A:</span>
              Public SSH into 13.232.145.88, then internal jump to 10.10.2.10 (Local route).
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-amber-400 font-semibold block">2. Laptop → Bastion → App-B:</span>
              ProxyJump through Bastion over VPC Peering to 10.20.1.10. Keys stay on laptop.
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800 text-slate-300">
              <span className="text-amber-400 font-semibold block">3. App-A ↔ App-B (Peering):</span>
              Direct ICMP Ping & TCP data across AWS backbone using private RFC1918 IPs.
            </div>
          </div>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedResourceId && (
        <ResourceDetailModal
          resourceId={selectedResourceId}
          onClose={() => setSelectedResourceId(null)}
        />
      )}
    </div>
  );
};
