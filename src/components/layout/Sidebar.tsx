import React from 'react';
import {
  LayoutDashboard,
  User,
  Layers,
  Table,
  Network,
  Shield,
  Server,
  Terminal,
  Share2,
  Route,
  Activity,
  AlertOctagon,
  Wrench,
  Camera,
  Award,
  FileDown,
  Trash2,
  Settings,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useProject } from '../../context/ProjectContext';

interface SidebarProps {
  currentPage: string;
  onSelectPage: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
  statusBadge?: string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onClose,
}) => {
  const { state, progressPercentage, failedValidationChecks, evidenceCount, completedTasks, totalTasks } = useProject();

  const navigationSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'setup', label: 'Project Setup & Profile', icon: User },
        { id: 'architecture', label: 'Network Architecture', icon: Layers },
      ],
    },
    {
      title: 'INFRASTRUCTURE SETUP',
      items: [
        { id: 'inventory', label: 'Resource Inventory', icon: Table, count: state.resources.length },
        { id: 'workflow', label: 'Project Workflow (15 Stages)', icon: CheckCircle, badge: `${completedTasks}/${totalTasks}` },
        { id: 'network-setup', label: 'VPCs & CIDR Calculator', icon: Network },
        { id: 'security-groups', label: 'Security Groups', icon: Shield },
        { id: 'ec2-instances', label: 'EC2 Instances', icon: Server, count: state.instances.length },
        { id: 'ssh-config', label: 'SSH & ProxyJump', icon: Terminal },
      ],
    },
    {
      title: 'VPC INTERCONNECT & ROUTING',
      items: [
        { id: 'vpc-peering', label: 'VPC Peering Connection', icon: Share2, statusBadge: state.peering.status },
        { id: 'route-tables', label: 'Route Tables & Validation', icon: Route },
      ],
    },
    {
      title: 'TESTING & DIAGNOSTICS',
      items: [
        { id: 'connectivity-tests', label: 'Connectivity Verification', icon: Activity },
        { id: 'controlled-failure', label: 'Controlled Failure & Recovery', icon: AlertOctagon },
        { id: 'troubleshooting', label: 'Troubleshooting Decision Tree', icon: Wrench },
      ],
    },
    {
      title: 'DELIVERABLES & GRADING',
      items: [
        { id: 'evidence', label: 'Evidence Management', icon: Camera, count: evidenceCount },
        { id: 'evaluation', label: 'Evaluation & Viva (100 M)', icon: Award },
        { id: 'final-report', label: 'Export PDF Project Report', icon: FileDown, highlight: true },
      ],
    },
    {
      title: 'LIFECYCLE & DATA',
      items: [
        { id: 'cleanup', label: 'AWS Teardown Cleanup', icon: Trash2 },
        { id: 'settings', label: 'Lab Settings & Backup', icon: Settings },
      ],
    },
  ];

  const handleNav = (id: string) => {
    onSelectPage(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-68 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Project Progress Widget in Sidebar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-white">Project Progress</span>
            <span className="font-bold text-amber-400">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>{completedTasks} of {totalTasks} checkpoints</span>
            <span className="text-amber-400 font-medium">Stage {Math.min(15, Math.floor((completedTasks / Math.max(1, totalTasks)) * 15) + 1)}/15</span>
          </div>

          {failedValidationChecks.length > 0 && (
            <div className="mt-2.5 p-2 bg-rose-950/80 border border-rose-800/80 rounded text-[11px] text-rose-300 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{failedValidationChecks.length} configuration warning{failedValidationChecks.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {section.title}
              </h4>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium text-left transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                          : item.highlight
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 ml-1">
                        {item.count !== undefined && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-amber-400'}`}>
                            {item.badge}
                          </span>
                        )}
                        {item.statusBadge && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                            item.statusBadge === 'Active'
                              ? 'bg-emerald-900/60 text-emerald-300'
                              : 'bg-amber-900/60 text-amber-300'
                          }`}>
                            {item.statusBadge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 text-center">
          CloudBridge AWS VPC Peering Lab v2.4
        </div>
      </aside>
    </>
  );
};
