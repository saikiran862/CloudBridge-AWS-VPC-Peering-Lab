import React, { useState } from 'react';
import {
  Network,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Server,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { checkCidrOverlap, parseCidr } from '../utils/cidrCalculator';

export const NetworkSetupPage: React.FC = () => {
  const { state, updateResource } = useProject();

  // CIDR Calculator State
  const [testCidrA, setTestCidrA] = useState('10.10.0.0/16');
  const [testCidrB, setTestCidrB] = useState('10.20.0.0/16');

  const overlapResult = checkCidrOverlap(testCidrA, testCidrB);

  const subnetsList = [
    {
      name: 'ewb-a-public',
      vpc: 'ewb-vpc-a (10.10.0.0/16)',
      cidr: '10.10.1.0/24',
      usableIps: 251,
      routeTarget: '0.0.0.0/0 → ewb-igw-a',
      autoPublicIp: 'Enabled',
      workload: 'ewb-bastion (10.10.1.10)',
    },
    {
      name: 'ewb-a-private',
      vpc: 'ewb-vpc-a (10.10.0.0/16)',
      cidr: '10.10.2.0/24',
      usableIps: 251,
      routeTarget: '10.20.0.0/16 → ewb-a-b-peer',
      autoPublicIp: 'Disabled',
      workload: 'ewb-app-a (10.10.2.10)',
    },
    {
      name: 'ewb-b-private',
      vpc: 'ewb-vpc-b (10.20.0.0/16)',
      cidr: '10.20.1.0/24',
      usableIps: 251,
      routeTarget: '10.10.0.0/16 → ewb-a-b-peer',
      autoPublicIp: 'Disabled',
      workload: 'ewb-app-b (10.20.1.10)',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Network className="w-4 h-4" />
          <span>Stage 1-3 Network Architecture</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          VPC Design, Subnets & CIDR Overlap Calculator
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Validate your IP addressing scheme and understand why non-overlapping CIDR ranges are an absolute prerequisite for AWS VPC Peering.
        </p>
      </div>

      {/* Interactive CIDR Overlap Calculator */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Interactive CIDR Overlap & Routing Calculator</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate AWS VPC Peering validation logic to guarantee non-overlapping IP spaces.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded">
            RFC 1918 Private IPv4
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* CIDR Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  VPC A CIDR Block
                </label>
                <button
                  onClick={() => setTestCidrA('10.10.0.0/16')}
                  className="text-[10px] text-slate-400 hover:text-amber-400 underline"
                >
                  Reset to 10.10.0.0/16
                </button>
              </div>
              <input
                type="text"
                value={testCidrA}
                onChange={(e) => setTestCidrA(e.target.value)}
                placeholder="e.g. 10.10.0.0/16"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {overlapResult.parsed1 && (
                <div className="text-[11px] text-slate-400 space-y-1 font-mono pt-1">
                  <div>Range: {overlapResult.parsed1.startIp} - {overlapResult.parsed1.endIp}</div>
                  <div>Total IPs: {overlapResult.parsed1.totalIps.toLocaleString()} (Netmask: {overlapResult.parsed1.netmask})</div>
                </div>
              )}
            </div>

            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  VPC B CIDR Block
                </label>
                <div className="space-x-2 text-[10px]">
                  <button
                    onClick={() => setTestCidrB('10.20.0.0/16')}
                    className="text-slate-400 hover:text-amber-400 underline"
                  >
                    10.20.0.0/16
                  </button>
                  <button
                    onClick={() => setTestCidrB('10.10.0.0/16')}
                    className="text-rose-400 hover:text-rose-300 underline"
                  >
                    Test Overlap (10.10.0.0/16)
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={testCidrB}
                onChange={(e) => setTestCidrB(e.target.value)}
                placeholder="e.g. 10.20.0.0/16"
                className="w-full px-3 py-2 text-sm font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {overlapResult.parsed2 && (
                <div className="text-[11px] text-slate-400 space-y-1 font-mono pt-1">
                  <div>Range: {overlapResult.parsed2.startIp} - {overlapResult.parsed2.endIp}</div>
                  <div>Total IPs: {overlapResult.parsed2.totalIps.toLocaleString()} (Netmask: {overlapResult.parsed2.netmask})</div>
                </div>
              )}
            </div>
          </div>

          {/* Overlap Result Callout */}
          <div
            className={`p-4 rounded-xl border flex items-start space-x-3 transition-colors ${
              overlapResult.overlaps
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
            }`}
          >
            {overlapResult.overlaps ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-sm">
                {overlapResult.overlaps
                  ? 'AWS Peering Conflict: Overlapping CIDRs Detected!'
                  : 'CIDR Validation Passed: Non-Overlapping & Peering Ready'}
              </h4>
              <p className="leading-relaxed opacity-90">{overlapResult.explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subnets Inventory Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Project Subnet Allocations & Route Associations</h3>
        <p className="text-xs text-slate-500">
          In each /24 subnet, AWS reserves 5 IP addresses: .0 (Network address), .1 (VPC Router), .2 (Amazon DNS), .3 (Future use), and .255 (Broadcast address). Therefore, 256 - 5 = 251 usable host IPs remain.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Subnet Name</th>
                <th className="py-2.5 px-3 font-semibold">VPC</th>
                <th className="py-2.5 px-3 font-semibold">CIDR Block</th>
                <th className="py-2.5 px-3 font-semibold">Usable IPs</th>
                <th className="py-2.5 px-3 font-semibold">Default Route Target</th>
                <th className="py-2.5 px-3 font-semibold">Auto-Assign Public IP</th>
                <th className="py-2.5 px-3 font-semibold">Assigned Workload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {subnetsList.map((s) => (
                <tr key={s.name} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold font-sans text-slate-900">{s.name}</td>
                  <td className="py-3 px-3 text-slate-600">{s.vpc}</td>
                  <td className="py-3 px-3 text-slate-900 font-bold">{s.cidr}</td>
                  <td className="py-3 px-3 text-emerald-600 font-bold font-sans">{s.usableIps} hosts</td>
                  <td className="py-3 px-3 text-slate-700">{s.routeTarget}</td>
                  <td className="py-3 px-3 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.autoPublicIp === 'Enabled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {s.autoPublicIp}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-800">{s.workload}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 Reserved AWS IPs Visual Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 text-amber-950 text-xs space-y-2">
        <h4 className="font-bold text-amber-900 text-sm flex items-center">
          <Info className="w-4 h-4 mr-1.5 text-amber-600" />
          AWS Subnet IP Reservation Standard (Why 10.10.1.10 is used for Bastion)
        </h4>
        <p className="text-amber-800 leading-relaxed">
          AWS automatically assigns the first 4 IPs and the last IP in every subnet to internal AWS hypervisor networking:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[11px]">
          <div className="bg-white p-2 rounded border border-amber-200">
            <span className="font-bold text-amber-900 block">.0</span>
            <span className="text-slate-500 text-[10px] block">Network Address</span>
          </div>
          <div className="bg-white p-2 rounded border border-amber-200">
            <span className="font-bold text-amber-900 block">.1</span>
            <span className="text-slate-500 text-[10px] block">VPC Router</span>
          </div>
          <div className="bg-white p-2 rounded border border-amber-200">
            <span className="font-bold text-amber-900 block">.2</span>
            <span className="text-slate-500 text-[10px] block">Amazon DNS</span>
          </div>
          <div className="bg-white p-2 rounded border border-amber-200">
            <span className="font-bold text-amber-900 block">.3</span>
            <span className="text-slate-500 text-[10px] block">Future Use</span>
          </div>
          <div className="bg-white p-2 rounded border border-amber-200">
            <span className="font-bold text-amber-900 block">.255</span>
            <span className="text-slate-500 text-[10px] block">Broadcast Address</span>
          </div>
        </div>
        <p className="text-amber-900 font-medium pt-1">
          Hence, our project uses static private IP assignments starting at <code className="bg-white px-1 py-0.5 rounded border border-amber-300 font-mono">10.10.1.10</code> for the Bastion, <code className="bg-white px-1 py-0.5 rounded border border-amber-300 font-mono">10.10.2.10</code> for App-A, and <code className="bg-white px-1 py-0.5 rounded border border-amber-300 font-mono">10.20.1.10</code> for App-B.
        </p>
      </div>
    </div>
  );
};
