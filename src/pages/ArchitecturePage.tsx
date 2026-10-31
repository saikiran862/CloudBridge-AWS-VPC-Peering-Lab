import React from 'react';
import { Layers, ShieldCheck, ArrowRight, AlertTriangle, BookOpen, Lock } from 'lucide-react';
import { ArchitectureDiagram } from '../components/architecture/ArchitectureDiagram';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Interactive System Architecture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Dual-VPC Peering Network Architecture
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visual topology of VPC A (10.10.0.0/16) and VPC B (10.20.0.0/16) interconnected via VPC Peering (ewb-a-b-peer).
        </p>
      </div>

      {/* Main Interactive Diagram */}
      <ArchitectureDiagram />

      {/* Deep-Dive Architectural Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VPC A Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h3 className="font-bold text-slate-900">VPC A: Ingress Hub & Bastion Gateway</h3>
              <span className="text-xs font-mono text-blue-600">ewb-vpc-a • 10.10.0.0/16</span>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-2.5">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0" />
              <span>
                <strong>Internet Gateway (ewb-igw-a): </strong> Attached to VPC A to provide public ingress and egress for the Bastion jump host.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0" />
              <span>
                <strong>Public Subnet (ewb-a-public - 10.10.1.0/24): </strong> Hosts <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">ewb-bastion</code> (10.10.1.10) with an auto-assigned public IPv4 address.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0" />
              <span>
                <strong>Private Subnet (ewb-a-private - 10.10.2.0/24): </strong> Hosts <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">ewb-app-a</code> (10.10.2.10). Completely isolated with NO public IP.
              </span>
            </li>
          </ul>
        </div>

        {/* VPC B Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              B
            </div>
            <div>
              <h3 className="font-bold text-slate-900">VPC B: Isolated Workload VPC</h3>
              <span className="text-xs font-mono text-purple-600">ewb-vpc-b • 10.20.0.0/16</span>
            </div>
          </div>
          <ul className="text-xs text-slate-600 space-y-2.5">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 shrink-0" />
              <span>
                <strong>Zero Public Ingress: </strong> VPC B has NO Internet Gateway and NO NAT Gateway. It has no direct route out to the public internet.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 shrink-0" />
              <span>
                <strong>Private Subnet (ewb-b-private - 10.20.1.0/24): </strong> Hosts <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">ewb-app-b</code> (10.20.1.10) with public IP disabled.
              </span>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 shrink-0" />
              <span>
                <strong>Peered Ingress Only: </strong> All inbound and outbound traffic must traverse the VPC Peering connection (ewb-a-b-peer).
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Non-Transitivity Core Rule Explanatory Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <BookOpen className="w-5 h-5" />
          <span>Core Concept: Why VPC Peering is Strictly Non-Transitive</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          A common misconception among beginner cloud engineers is assuming that because VPC B is peered with VPC A, and VPC A has an Internet Gateway, VPC B can reach the internet through VPC A. 
          <strong> In AWS networking, this is strictly forbidden by design.</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-semibold block mb-1">1. Edge-to-Edge Limitation</span>
            <span className="text-slate-300">
              VPC Peering does not support routing between an edge (such as an IGW, VPN, or Direct Connect) and another VPC through a peering connection.
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-semibold block mb-1">2. No Transit Routing</span>
            <span className="text-slate-300">
              If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A CANNOT talk to VPC C through VPC B. (For transitive routing, AWS Transit Gateway is required).
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <span className="text-amber-400 font-semibold block mb-1">3. Air-Gapped Security</span>
            <span className="text-slate-300">
              This non-transitive property is a major security benefit: App-B remains completely protected from inbound internet exploits even when peered with a public hub.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
