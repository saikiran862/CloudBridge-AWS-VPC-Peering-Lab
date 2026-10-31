import React from 'react';
import {
  Layers,
  Network,
  Shield,
  Server,
  Share2,
  Route,
  Activity,
  FileCheck,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Camera,
  Award,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/common/Badge';
import { SecurityWarning } from '../components/common/SecurityWarning';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    state,
    totalTasks,
    completedTasks,
    pendingTasks,
    progressPercentage,
    failedValidationChecks,
    evidenceCount,
    isReportReady,
    totalEvaluationScore,
  } = useProject();

  // Find next incomplete stage to continue
  const nextIncompleteStage = state.workflowStages.find((s) => s.tasks.some((t) => !t.completed)) || state.workflowStages[0];

  const statCards = [
    {
      title: 'Architecture',
      desc: 'Dual-VPC Topology (VPC A & B)',
      status: state.peering.status === 'Active' ? 'Active' : 'In Progress',
      icon: Layers,
      color: 'blue',
      nav: 'architecture',
      meta: '10.10.0.0/16 ↔ 10.20.0.0/16',
    },
    {
      title: 'Network Config',
      desc: '3 Subnets & Internet Gateway',
      status: 'Available',
      icon: Network,
      color: 'emerald',
      nav: 'network-setup',
      meta: 'ewb-igw-a attached to VPC A',
    },
    {
      title: 'Security Groups',
      desc: '3 Strict Ingress Firewalls',
      status: failedValidationChecks.some((c) => c.includes('Security')) ? 'Failed' : 'Available',
      icon: Shield,
      color: 'amber',
      nav: 'security-groups',
      meta: 'SSH restricted to /32',
    },
    {
      title: 'EC2 Instances',
      desc: 'Bastion, App-A & App-B',
      status: state.instances.every((i) => i.state === 'running') ? 'Available' : 'Pending',
      icon: Server,
      color: 'purple',
      nav: 'ec2-instances',
      meta: '2 Air-gapped private instances',
    },
    {
      title: 'VPC Peering',
      desc: 'ewb-a-b-peer Interconnect',
      status: state.peering.status,
      icon: Share2,
      color: 'cyan',
      nav: 'vpc-peering',
      meta: state.peering.peeringId || 'pcx-pending',
    },
    {
      title: 'Routing Tables',
      desc: '3 Route Tables & Peer Routes',
      status: failedValidationChecks.some((c) => c.includes('Routing')) ? 'Failed' : 'Available',
      icon: Route,
      color: 'indigo',
      nav: 'route-tables',
      meta: 'Bidirectional symmetry',
    },
    {
      title: 'Connectivity Testing',
      desc: '5 Verification Test Suites',
      status: state.tests.filter((t) => t.passed).length === state.tests.length ? 'Available' : 'Pending',
      icon: Activity,
      color: 'emerald',
      nav: 'connectivity-tests',
      meta: `${state.tests.filter((t) => t.passed).length} / ${state.tests.length} tests passed`,
    },
    {
      title: 'Documentation',
      desc: 'Evidence & Final PDF Report',
      status: isReportReady ? 'Available' : 'Pending',
      icon: FileCheck,
      color: 'teal',
      nav: 'final-report',
      meta: `${evidenceCount} screenshots collected`,
    },
    {
      title: 'AWS Cleanup',
      desc: '13 Teardown Safety Steps',
      status: state.cleanupSteps.every((c) => c.completed) ? 'Available' : 'Pending',
      icon: Trash2,
      color: 'rose',
      nav: 'cleanup',
      meta: `${state.cleanupSteps.filter((c) => c.completed).length} / 13 completed`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Project Title & Student Meta */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle orange accent graphic */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                CloudBridge AWS VPC Peering Lab Workbook
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: cloudbridge-vpc-peering-2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {state.profile.projectTitle}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Design, implement, and validate private inter-VPC networking across isolated Amazon VPCs using non-transitive VPC Peering, Bastion host proxying, and strict security groups.
            </p>
          </div>

          {/* Quick Continue Project Button */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('workflow')}
              className="px-5 py-3 rounded-xl font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 group"
            >
              <span>Continue Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('final-report')}
              className="px-4 py-3 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Report</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 10 Required Dashboard Metrics Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">1. Student Name</span>
            <span className="font-bold text-white text-sm truncate block mt-0.5">
              {state.profile.studentName || 'Dev Sharma'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">2. Batch / Cohort</span>
            <span className="font-bold text-amber-400 text-sm truncate block mt-0.5">
              {state.profile.batch || 'Cloud-Eng-2026'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">3. AWS Region</span>
            <span className="font-mono text-slate-200 font-semibold text-sm truncate block mt-0.5">
              {state.profile.awsRegion}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">4. Completed Tasks</span>
            <span className="font-bold text-emerald-400 text-sm block mt-0.5">
              {completedTasks} / {totalTasks}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">5. Pending Tasks</span>
            <span className="font-bold text-slate-300 text-sm block mt-0.5">
              {pendingTasks}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">6. Failed Validations</span>
            <span className={`font-bold text-sm block mt-0.5 ${failedValidationChecks.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {failedValidationChecks.length} Alert{failedValidationChecks.length === 1 ? '' : 's'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">7. Evidence Items</span>
            <span className="font-bold text-cyan-400 text-sm block mt-0.5">
              {evidenceCount} Screenshots
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">8. Report Status</span>
            <span className="font-bold text-sm block mt-0.5 text-white">
              {isReportReady ? (
                <span className="text-emerald-400">Ready for Download</span>
              ) : (
                <span className="text-amber-400">In Progress</span>
              )}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">9. Evaluation Score</span>
            <span className="font-bold text-amber-400 text-sm block mt-0.5">
              {totalEvaluationScore} / 100 Marks
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">10. Overall Completion</span>
            <span className="font-bold text-amber-400 text-sm block mt-0.5">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Dynamic Overall Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Project Progress Bar (Calculated Dynamically)</span>
            <span className="font-bold text-amber-400">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Security Warning Notice */}
      <SecurityWarning message="AWS credentials (access keys, secret keys, passwords, and private SSH keys) must NEVER be entered in this app. Keep all credentials strictly on your local machine." />

      {/* Validation alert banner if any */}
      {failedValidationChecks.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-900 shadow-xs">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5 mr-3 shrink-0" />
            <div className="text-sm">
              <h4 className="font-bold text-rose-900">
                Action Required: {failedValidationChecks.length} Configuration Issue{failedValidationChecks.length > 1 ? 's' : ''} Detected
              </h4>
              <ul className="mt-1 list-disc list-inside space-y-1 text-rose-800 text-xs">
                {failedValidationChecks.map((check, idx) => (
                  <li key={idx}>{check}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 9 Project Domain Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Project Domain Checkpoints</h2>
          <span className="text-xs text-slate-500 font-medium">Click any card to inspect or edit domain</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => onNavigate(card.nav)}
                className="group cursor-pointer bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-50 group-hover:bg-amber-500/10 text-slate-700 group-hover:text-amber-600 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge status={card.status} />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{card.meta}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Step & Recent Activities Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Step Recommendation */}
        <div className="lg:col-span-5 bg-linear-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Recommended Next Action</span>
            </div>
            <h3 className="text-lg font-bold text-white">{nextIncompleteStage.title}</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {nextIncompleteStage.subtitle}
            </p>

            <div className="mt-4 space-y-2">
              {nextIncompleteStage.tasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-2.5 text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50"
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${task.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {task.completed ? '✓' : '•'}
                  </span>
                  <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('workflow')}
            className="mt-6 w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Open Stage in Guided Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Activity Log */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-900 text-sm">Recent Lab Activity</h3>
              </div>
              <span className="text-xs text-slate-400">Live dynamic timeline</span>
            </div>

            <div className="space-y-3">
              {state.recentActivities.slice(0, 4).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-medium text-slate-800 block">{activity.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Category: {activity.category}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-3">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Project state stored in persistent local browser storage.</span>
            <button
              onClick={() => onNavigate('settings')}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Export JSON Backup →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
