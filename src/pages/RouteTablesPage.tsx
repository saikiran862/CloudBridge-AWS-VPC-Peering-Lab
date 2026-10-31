import React, { useState } from 'react';
import {
  Route,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  Info,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/common/Badge';

export const RouteTablesPage: React.FC = () => {
  const { state, updateRouteTable } = useProject();
  const [activeRtId, setActiveRtId] = useState<string>('rt-a-private');

  const activeRt = state.routeTables.find((rt) => rt.id === activeRtId) || state.routeTables[0];

  // Route validation helper
  const getValidationForRouteTable = (rtId: string) => {
    const rt = state.routeTables.find((r) => r.id === rtId);
    if (!rt) return { status: 'Missing', issues: ['Route table not found'] };

    const issues: string[] = [];
    const hasLocal = rt.routes.some((r) => r.target === 'local');
    if (!hasLocal) issues.push('Missing required local VPC route');

    if (rtId === 'rt-a-private') {
      const hasPeer = rt.routes.some((r) => r.destinationCidr.includes('10.20') && r.target.includes('pcx'));
      if (!hasPeer) issues.push('Missing forward peering route: 10.20.0.0/16 -> pcx-xxxx');
      const hasIgw = rt.routes.some((r) => r.destinationCidr === '0.0.0.0/0');
      if (hasIgw) issues.push('Security Alert: Private subnet must NOT have 0.0.0.0/0 -> IGW route');
    }

    if (rtId === 'rt-b-private') {
      const hasPeer = rt.routes.some((r) => r.destinationCidr.includes('10.10') && r.target.includes('pcx'));
      if (!hasPeer) issues.push('Missing return peering route: 10.10.0.0/16 -> pcx-xxxx');
      const hasIgw = rt.routes.some((r) => r.destinationCidr === '0.0.0.0/0');
      if (hasIgw) issues.push('Security Alert: VPC B has no IGW and must not have a default internet route');
    }

    if (rtId === 'rt-a-public') {
      const hasIgw = rt.routes.some((r) => r.destinationCidr === '0.0.0.0/0' && r.target.includes('igw'));
      if (!hasIgw) issues.push('Missing default internet route: 0.0.0.0/0 -> ewb-igw-a');
      const hasPeer = rt.routes.some((r) => r.destinationCidr.includes('10.20') && r.target.includes('pcx'));
      if (!hasPeer) issues.push('Missing bastion peer route: 10.20.0.0/16 -> pcx-xxxx (bastion cannot reach App-B)');
    }

    return {
      status: issues.length === 0 ? 'Correct' : 'Issues Detected',
      issues,
    };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Route className="w-4 h-4" />
          <span>Stage 9 Routing Configuration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Route Table Editor & Bidirectional Route Validator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ensure route table symmetry across both VPCs. Every packet requires both a forward route and a return route to achieve 0% packet loss.
        </p>
      </div>

      {/* Route Table Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.routeTables.map((rt) => {
          const validation = getValidationForRouteTable(rt.id);
          const isSelected = activeRtId === rt.id;

          return (
            <div
              key={rt.id}
              onClick={() => setActiveRtId(rt.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-900">{rt.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    validation.status === 'Correct'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {validation.status}
                </span>
              </div>
              <span className="text-xs text-slate-500 block">Subnet: {rt.associatedSubnet}</span>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                {rt.routes.length} Active Routes
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Route Table Inspector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-slate-900">{activeRt.name}</h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                ID: {activeRt.actualId || 'rtb-pending'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Associated Subnet: <strong className="text-slate-800">{activeRt.associatedSubnet}</strong> ({activeRt.vpc})
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {getValidationForRouteTable(activeRt.id).status === 'Correct' ? (
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Routes Validated & Symmetrical
              </span>
            ) : (
              <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                <AlertTriangle className="w-4 h-4 mr-1.5" />
                Missing Required Route Target
              </span>
            )}
          </div>
        </div>

        {/* Routes Table */}
        <div className="border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Destination CIDR</th>
                <th className="py-2.5 px-3 font-semibold">Target (Gateway / Connection)</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Route Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {activeRt.routes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">{route.destinationCidr}</td>
                  <td className="py-3 px-3 text-slate-700 font-bold">{route.target}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-500">
                    {route.isLocal
                      ? 'Local VPC Route'
                      : route.destinationCidr === '0.0.0.0/0'
                      ? 'Internet Gateway Route'
                      : 'VPC Peering Interconnect Route'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Validation Issues Feedback */}
        {getValidationForRouteTable(activeRt.id).issues.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-xs space-y-1">
            <span className="font-bold block">Validation Warnings:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {getValidationForRouteTable(activeRt.id).issues.map((iss, i) => (
                <li key={i}>{iss}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Educational Section on Longest Prefix Match & Return Routes */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-4">
        <h4 className="font-bold text-amber-400 text-sm flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          AWS Routing Fundamentals from the Project Workbook
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">1. Longest Prefix Match (LPM) Rule</span>
            <p className="text-slate-400 leading-relaxed">
              When multiple routes match a packet destination IP, AWS always selects the most specific route (the route with the longest subnet mask prefix). For example, a packet destined to <code className="text-amber-400 font-mono">10.20.1.10</code> in ewb-a-public will match <code className="text-amber-400 font-mono">10.20.0.0/16</code> (peer route) over <code className="text-amber-400 font-mono">0.0.0.0/0</code> (IGW default route).
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">2. The Crucial Bastion Peer Route</span>
            <p className="text-slate-400 leading-relaxed">
              Students often forget to add <code className="text-amber-400 font-mono">10.20.0.0/16 → pcx-xxxx</code> to <code className="text-amber-400 font-mono">ewb-rt-a-public</code>. Without this route, Bastion (10.10.1.10) sends packets destined to App-B (10.20.1.10) to the Internet Gateway (0.0.0.0/0), where they are promptly dropped, breaking SSH ProxyJump!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
