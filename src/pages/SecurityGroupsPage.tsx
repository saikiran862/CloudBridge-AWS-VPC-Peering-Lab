import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Info,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SecurityRule } from '../types';

export const SecurityGroupsPage: React.FC = () => {
  const { state, updateSecurityGroup } = useProject();
  const [activeSgId, setActiveSgId] = useState<string>('sg-bastion');
  const [studentIpInput, setStudentIpInput] = useState('49.207.210.45/32');
  const [ipUpdatedNotice, setIpUpdatedNotice] = useState(false);

  const activeSg = state.securityGroups.find((sg) => sg.id === activeSgId) || state.securityGroups[0];

  const handleUpdateStudentIp = () => {
    const formatted = studentIpInput.includes('/') ? studentIpInput.trim() : `${studentIpInput.trim()}/32`;
    const bastionSg = state.securityGroups.find((s) => s.id === 'sg-bastion');
    if (bastionSg) {
      const updatedRules = bastionSg.inboundRules.map((rule) => {
        if (rule.type === 'SSH') {
          return { ...rule, source: formatted };
        }
        return rule;
      });
      updateSecurityGroup('sg-bastion', { inboundRules: updatedRules });
      setIpUpdatedNotice(true);
      setTimeout(() => setIpUpdatedNotice(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Shield className="w-4 h-4" />
          <span>Stage 4 Security Hardening</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Security Groups & Stateful Ingress Control
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure least-privilege inbound firewall rules for Bastion, App-A, and App-B. Security groups operate at the hypervisor network interface layer.
        </p>
      </div>

      {/* Security Best Practice Notice */}
      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-xs text-rose-950">
        <div className="flex items-start">
          <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-rose-900 text-sm">
              Strict Security Rule: Never Open Port 22 or ICMP to 0.0.0.0/0
            </h4>
            <p className="text-rose-800 leading-relaxed">
              Exposing SSH (TCP Port 22) to <code className="bg-rose-100 font-mono px-1 rounded">0.0.0.0/0</code> opens your bastion host to automated internet brute-force attacks. Bastion SSH must be strictly locked down to your current IP with a <code className="bg-rose-100 font-mono px-1 rounded">/32</code> subnet mask. Application hosts (App-A and App-B) must NEVER accept traffic from the public internet.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Operator Public IP Helper */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 block uppercase tracking-wider">
            Operator Public IP Address Configuration
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            Set your workstation's current external IPv4 for the <code className="text-amber-400 font-mono">ewb-sg-bastion</code> SSH ingress rule.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            value={studentIpInput}
            onChange={(e) => setStudentIpInput(e.target.value)}
            placeholder="e.g. 49.207.210.45/32"
            className="px-3 py-2 text-xs font-mono bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
          />
          <button
            onClick={handleUpdateStudentIp}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0"
          >
            Update Bastion Rule
          </button>
        </div>
      </div>
      {ipUpdatedNotice && (
        <div className="text-xs text-emerald-600 font-bold flex items-center">
          <Check className="w-4 h-4 mr-1" />
          Updated ewb-sg-bastion SSH rule source to {studentIpInput}!
        </div>
      )}

      {/* Security Group Selector Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        {state.securityGroups.map((sg) => (
          <button
            key={sg.id}
            onClick={() => setActiveSgId(sg.id)}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-2 ${
              activeSgId === sg.id
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{sg.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
              {sg.vpc}
            </span>
          </button>
        ))}
      </div>

      {/* Active Security Group Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg text-slate-900">{activeSg.name}</h3>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                Actual ID: {activeSg.actualId || 'sg-pending'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{activeSg.description}</p>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Attached to: <strong className="text-slate-800">{activeSg.vpc}</strong>
          </span>
        </div>

        {/* Inbound Rules Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center">
              <span>Inbound Rules (Strict Ingress Enforcement)</span>
            </h4>
            <span className="text-xs text-slate-500">
              {activeSg.inboundRules.length} Rule{activeSg.inboundRules.length === 1 ? '' : 's'} Configured
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Protocol</th>
                  <th className="py-2.5 px-3 font-semibold">Port Range / ICMP</th>
                  <th className="py-2.5 px-3 font-semibold">Source IP (Authorized)</th>
                  <th className="py-2.5 px-3 font-semibold">Design Rule Intent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {activeSg.inboundRules.map((rule) => {
                  const isOpen = rule.source === '0.0.0.0/0';
                  return (
                    <tr key={rule.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-sans font-bold text-slate-900 flex items-center space-x-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rule.type}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{rule.protocol}</td>
                      <td className="py-3 px-3 text-slate-800 font-bold">{rule.portOrRange}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            isOpen
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {rule.source}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-600 text-[11px]">
                        {rule.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statefulness Explanatory Callout */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-1.5">
          <h4 className="font-bold text-blue-950 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-blue-600" />
            Why are Security Groups "Stateful"?
          </h4>
          <p className="text-blue-800 leading-relaxed">
            In AWS, Security Groups are stateful firewalls. When an inbound packet is allowed (for example, an ICMP Echo Request arriving at App-B from App-A), the connection state is automatically tracked in the hypervisor connection tracking table. The returning response packet (ICMP Echo Reply) is <strong>automatically allowed out</strong>, regardless of outbound rules. Network ACLs (NACLs), by contrast, are stateless and would require explicit rules in both directions.
          </p>
        </div>

        {/* Security Rule Matrix Reference */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block mb-2">Authoritative Security Matrix from Workbook:</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block text-xs">ewb-sg-bastion</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Port 22 (SSH) from Student IP /32</span>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block text-xs">ewb-sg-app-a</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Port 22 from 10.10.1.10/32</span>
              <span className="text-[11px] text-slate-500 block">ICMP (Type 8) from 10.20.1.10/32</span>
            </div>
            <div className="bg-white p-3 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block text-xs">ewb-sg-app-b</span>
              <span className="text-[11px] text-slate-500 block mt-0.5">Port 22 from 10.10.1.10/32</span>
              <span className="text-[11px] text-slate-500 block">ICMP (Type 8) from 10.10.2.10/32</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
