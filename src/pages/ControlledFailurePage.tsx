import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Shield,
  Activity,
  RotateCcw,
  Check,
  Camera,
  Info,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const ControlledFailurePage: React.FC = () => {
  const { state, updateControlledFailure } = useProject();
  const [activeStep, setActiveStep] = useState<number>(2);

  const cf = state.controlledFailure;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4" />
          <span>Stage 11 Scientific Experimentation</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          Controlled Failure & Dynamic Recovery Experiment
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          A 3-state fault-injection test proving that Security Groups act as stateful hypervisor firewalls independent of underlying VPC Peering routing.
        </p>
      </div>

      {/* Experiment Protocol Card */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-bold text-amber-400 text-base">Standard Laboratory Protocol</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 space-y-1.5">
            <span className="font-bold text-white block">Step 1: Baseline Health</span>
            <p className="text-slate-300">
              App-A pings App-B (<code className="text-amber-400 font-mono">10.20.1.10</code>). Inbound ICMP rule is active on <code className="text-amber-400 font-mono">ewb-sg-app-b</code>. 4/4 packets returned (0% loss).
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-lg border border-rose-500/50 space-y-1.5">
            <span className="font-bold text-rose-300 block">Step 2: Remove ICMP Rule Only</span>
            <p className="text-slate-300">
              In AWS Console, delete the ICMP rule on App-B while keeping the SSH rule. Re-run ping from App-A: observe 100% packet loss, proving firewall isolation.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-lg border border-emerald-500/50 space-y-1.5">
            <span className="font-bold text-emerald-300 block">Step 3: Instant Recovery</span>
            <p className="text-slate-300">
              Restore the exact ICMP Echo Request rule. Ping immediately returns to 0% loss without rebooting any virtual machine or changing route tables.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Interactive State Panels */}
      <div className="space-y-4">
        {/* State 1: Before Rule Removal */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                State 1: Baseline Before Rule Removal (Normal State)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Verified Success (0% Loss)
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Rule in <code className="font-mono text-slate-800 bg-slate-100 px-1">ewb-sg-app-b</code>: ICMP Echo Request (Type 8, Code 0) from <code className="font-mono text-slate-800 bg-slate-100 px-1">10.10.2.10/32</code> is present.
          </p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
            {cf.beforeRuleRemoved.pingResult}
          </div>
        </div>

        {/* State 2: Controlled Failure */}
        <div className="bg-white rounded-xl border-2 border-rose-300 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-rose-950 text-sm">
                State 2: Controlled Failure (ICMP Rule Removed)
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 flex items-center">
              <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
              Expected Failure Verified (100% Loss)
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Only the ICMP Echo Request rule was deleted. The SSH rule remained active.
          </p>

          <div className="bg-slate-900 text-rose-400 p-3 rounded-lg font-mono text-xs">
            {cf.duringFailure.pingResult}
          </div>

          <div className="text-xs text-slate-700 space-y-1">
            <strong className="text-slate-900">Student Explanation & Observation:</strong>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {cf.duringFailure.explanation}
            </p>
          </div>
        </div>

        {/* State 3: Dynamic Recovery */}
        <div className="bg-white rounded-xl border-2 border-emerald-300 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-emerald-950 text-sm">
                State 3: Dynamic Recovery (Rule Restored)
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Dynamic Recovery Confirmed
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Rule was restored: ICMP Echo Request from <code className="font-mono text-slate-800 bg-slate-100 px-1">10.10.2.10/32</code>.
          </p>

          <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-xs">
            {cf.afterRecovery.pingResult}
          </div>

          <div className="text-xs text-slate-700 space-y-1">
            <strong className="text-slate-900">Student Explanation & Observation:</strong>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {cf.afterRecovery.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
