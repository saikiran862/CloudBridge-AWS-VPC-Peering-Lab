import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ProjectState,
  StudentProfile,
  ResourceItem,
  SecurityGroupConfig,
  EC2InstanceConfig,
  RouteTableConfig,
  ConnectivityTest,
  EvidenceItem,
  CleanupStep,
  TroubleshootingItem,
  EvaluationCategory,
  ControlledFailureState,
  PeeringStatus,
} from '../types';
import { initialProjectState } from '../utils/initialData';
import { checkCidrOverlap } from '../utils/cidrCalculator';

interface ProjectContextType {
  state: ProjectState;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  updateResource: (id: string, updates: Partial<ResourceItem>) => void;
  updatePeering: (updates: Partial<ProjectState['peering']>) => void;
  updateSecurityGroup: (id: string, updates: Partial<SecurityGroupConfig>) => void;
  updateInstance: (id: string, updates: Partial<EC2InstanceConfig>) => void;
  updateRouteTable: (id: string, updates: Partial<RouteTableConfig>) => void;
  updateTest: (id: string, updates: Partial<ConnectivityTest>) => void;
  updateControlledFailure: (updates: Partial<ControlledFailureState>) => void;
  toggleWorkflowTask: (stageId: number, taskId: string) => void;
  addEvidence: (item: Omit<EvidenceItem, 'id' | 'uploadedAt'>) => void;
  deleteEvidence: (id: string) => void;
  toggleCleanupStep: (stepNumber: number, notes?: string) => void;
  updateTroubleshootingItem: (id: string, updates: Partial<TroubleshootingItem>) => void;
  updateEvaluationCategory: (id: string, updates: Partial<EvaluationCategory>) => void;
  updateLessonsLearned: (text: string) => void;
  addActivity: (action: string, category: string) => void;
  resetToDefault: () => void;
  resetToBlank: () => void;
  exportProjectJson: () => void;
  importProjectJson: (jsonString: string) => boolean;

  // Computed metrics
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  progressPercentage: number;
  failedValidationChecks: string[];
  evidenceCount: number;
  missingEvidenceCategories: string[];
  totalEvaluationScore: number;
  isReportReady: boolean;
}

const STORAGE_KEY = 'ewb_vpc_peering_lab_state_v2';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProjectState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load project state from localStorage, using initial data:', e);
    }
    return initialProjectState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save project state to localStorage:', e);
    }
  }, [state]);

  const addActivity = useCallback((action: string, category: string) => {
    setState((prev) => ({
      ...prev,
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action,
          category,
        },
        ...prev.recentActivities.slice(0, 9),
      ],
    }));
  }, []);

  const updateProfile = useCallback((profileUpdates: Partial<StudentProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdates },
    }));
    addActivity('Updated student profile details', 'Profile');
  }, [addActivity]);

  const updateResource = useCallback((id: string, updates: Partial<ResourceItem>) => {
    setState((prev) => ({
      ...prev,
      resources: prev.resources.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
    addActivity(`Updated resource ${id}`, 'Inventory');
  }, [addActivity]);

  const updatePeering = useCallback((updates: Partial<ProjectState['peering']>) => {
    setState((prev) => ({
      ...prev,
      peering: { ...prev.peering, ...updates },
    }));
    addActivity(`Updated VPC Peering status to ${updates.status || 'modified'}`, 'Peering');
  }, [addActivity]);

  const updateSecurityGroup = useCallback((id: string, updates: Partial<SecurityGroupConfig>) => {
    setState((prev) => ({
      ...prev,
      securityGroups: prev.securityGroups.map((sg) => (sg.id === id ? { ...sg, ...updates } : sg)),
    }));
    addActivity(`Updated security group ${id}`, 'Security');
  }, [addActivity]);

  const updateInstance = useCallback((id: string, updates: Partial<EC2InstanceConfig>) => {
    setState((prev) => ({
      ...prev,
      instances: prev.instances.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)),
    }));
    addActivity(`Updated EC2 instance ${id}`, 'Compute');
  }, [addActivity]);

  const updateRouteTable = useCallback((id: string, updates: Partial<RouteTableConfig>) => {
    setState((prev) => ({
      ...prev,
      routeTables: prev.routeTables.map((rt) => (rt.id === id ? { ...rt, ...updates } : rt)),
    }));
    addActivity(`Updated route table ${id}`, 'Routing');
  }, [addActivity]);

  const updateTest = useCallback((id: string, updates: Partial<ConnectivityTest>) => {
    setState((prev) => ({
      ...prev,
      tests: prev.tests.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    addActivity(`Updated test results for ${id}`, 'Testing');
  }, [addActivity]);

  const updateControlledFailure = useCallback((updates: Partial<ControlledFailureState>) => {
    setState((prev) => ({
      ...prev,
      controlledFailure: { ...prev.controlledFailure, ...updates },
    }));
    addActivity('Updated Stage 11 controlled failure & recovery experiment', 'Experiment');
  }, [addActivity]);

  const toggleWorkflowTask = useCallback((stageId: number, taskId: string) => {
    setState((prev) => ({
      ...prev,
      workflowStages: prev.workflowStages.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          tasks: stage.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      }),
    }));
  }, []);

  const addEvidence = useCallback((item: Omit<EvidenceItem, 'id' | 'uploadedAt'>) => {
    const newItem: EvidenceItem = {
      ...item,
      id: `ev-${Date.now()}`,
      uploadedAt: new Date().toLocaleString(),
    };
    setState((prev) => ({
      ...prev,
      evidence: [newItem, ...prev.evidence],
    }));
    addActivity(`Uploaded evidence for category: ${item.category}`, 'Evidence');
  }, [addActivity]);

  const deleteEvidence = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((e) => e.id !== id),
    }));
    addActivity(`Removed evidence item ${id}`, 'Evidence');
  }, [addActivity]);

  const toggleCleanupStep = useCallback((stepNumber: number, notes?: string) => {
    setState((prev) => ({
      ...prev,
      cleanupSteps: prev.cleanupSteps.map((step) =>
        step.stepNumber === stepNumber
          ? {
              ...step,
              completed: !step.completed,
              notes: notes !== undefined ? notes : step.notes,
            }
          : step
      ),
    }));
    addActivity(`Updated cleanup step #${stepNumber}`, 'Cleanup');
  }, [addActivity]);

  const updateTroubleshootingItem = useCallback((id: string, updates: Partial<TroubleshootingItem>) => {
    setState((prev) => ({
      ...prev,
      troubleshooting: prev.troubleshooting.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const updateEvaluationCategory = useCallback((id: string, updates: Partial<EvaluationCategory>) => {
    setState((prev) => ({
      ...prev,
      evaluation: prev.evaluation.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)),
    }));
  }, []);

  const updateLessonsLearned = useCallback((text: string) => {
    setState((prev) => ({
      ...prev,
      lessonsLearned: text,
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setState(initialProjectState);
    addActivity('Reset project to complete reference demonstration project', 'System');
  }, [addActivity]);

  const resetToBlank = useCallback(() => {
    const blank: ProjectState = {
      ...initialProjectState,
      profile: {
        studentName: '',
        batch: '',
        projectTitle: 'AWS VPC Peering – Private Network Connectivity',
        awsAccountAlias: '',
        awsRegion: 'ap-south-1 (Mumbai)',
        startDate: new Date().toISOString().split('T')[0],
        completionDate: '',
      },
      peering: {
        connectionName: 'ewb-a-b-peer',
        peeringId: '',
        requesterVpcId: '',
        accepterVpcId: '',
        status: 'Not created' as PeeringStatus,
        notes: '',
      },
      resources: initialProjectState.resources.map((r) => ({
        ...r,
        actualResourceId: '',
        status: 'Not started',
        notes: '',
      })),
      instances: initialProjectState.instances.map((i) => ({
        ...i,
        actualInstanceId: '',
        publicIp: '',
        state: 'pending',
      })),
      routeTables: initialProjectState.routeTables.map((rt) => ({
        ...rt,
        actualId: '',
        routes: rt.routes.filter((r) => r.isLocal), // keep only local routes initially
      })),
      tests: initialProjectState.tests.map((t) => ({
        ...t,
        actualResult: '',
        packetLoss: '',
        passed: null,
      })),
      controlledFailure: {
        beforeRuleRemoved: { rulePresent: true, pingResult: '', passed: null },
        duringFailure: { ruleRemoved: false, pingResult: '', passed: null, explanation: '' },
        afterRecovery: { ruleRestored: false, pingResult: '', passed: null, explanation: '' },
      },
      workflowStages: initialProjectState.workflowStages.map((s) => ({
        ...s,
        tasks: s.tasks.map((t) => ({ ...t, completed: false })),
      })),
      evidence: [],
      cleanupSteps: initialProjectState.cleanupSteps.map((c) => ({
        ...c,
        completed: false,
        notes: '',
      })),
      recentActivities: [
        {
          id: `act-blank-${Date.now()}`,
          timestamp: 'Just now',
          action: 'Initialized fresh blank project lab',
          category: 'System',
        },
      ],
    };
    setState(blank);
  }, []);

  const exportProjectJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const filename = `${state.profile.studentName || 'Student'}_AWS_VPC_Peering_Backup.json`.replace(/\s+/g, '_');
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [state]);

  const importProjectJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString) as ProjectState;
      if (parsed.profile && parsed.resources && parsed.workflowStages) {
        setState(parsed);
        addActivity('Imported project data from JSON backup file', 'System');
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file format:', e);
    }
    return false;
  }, [addActivity]);

  // Computed metrics
  const { totalTasks, completedTasks, pendingTasks, progressPercentage } = useMemo(() => {
    let total = 0;
    let completed = 0;
    state.workflowStages.forEach((stage) => {
      stage.tasks.forEach((task) => {
        total++;
        if (task.completed) completed++;
      });
    });
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: total - completed,
      progressPercentage: percentage,
    };
  }, [state.workflowStages]);

  const failedValidationChecks = useMemo(() => {
    const checks: string[] = [];

    // 1. App-A and App-B public IP check
    const appA = state.instances.find((i) => i.name === 'ewb-app-a');
    if (appA?.hasPublicIp || (appA?.publicIp && appA.publicIp.trim() !== '')) {
      checks.push('Security Violation: ewb-app-a must NOT have a public IPv4 address.');
    }
    const appB = state.instances.find((i) => i.name === 'ewb-app-b');
    if (appB?.hasPublicIp || (appB?.publicIp && appB.publicIp.trim() !== '')) {
      checks.push('Security Violation: ewb-app-b must NOT have a public IPv4 address.');
    }

    // 2. CIDR Overlap check
    const vpcA = state.resources.find((r) => r.name === 'ewb-vpc-a');
    const vpcB = state.resources.find((r) => r.name === 'ewb-vpc-b');
    if (vpcA?.cidrOrIp && vpcB?.cidrOrIp) {
      const overlap = checkCidrOverlap(vpcA.cidrOrIp, vpcB.cidrOrIp);
      if (overlap.overlaps) {
        checks.push(`Architecture Conflict: CIDRs overlap (${vpcA.cidrOrIp} and ${vpcB.cidrOrIp}). VPC Peering cannot function.`);
      }
    }

    // 3. Security group unrestricted rule check
    state.securityGroups.forEach((sg) => {
      sg.inboundRules.forEach((rule) => {
        if (rule.source === '0.0.0.0/0' && (rule.type === 'SSH' || rule.portOrRange === '22')) {
          checks.push(`Security Alert: ${sg.name} exposes SSH (port 22) to 0.0.0.0/0. Must restrict to /32.`);
        }
      });
    });

    // 4. Peering route checks in route tables
    const rtAPriv = state.routeTables.find((rt) => rt.id === 'rt-a-private');
    const hasPeerRouteA = rtAPriv?.routes.some((r) => r.destinationCidr.includes('10.20') && r.target !== 'local');
    if (!hasPeerRouteA && state.peering.status === 'Active') {
      checks.push('Routing Gap: ewb-rt-a-private is missing peer route to 10.20.0.0/16.');
    }

    const rtBPriv = state.routeTables.find((rt) => rt.id === 'rt-b-private');
    const hasPeerRouteB = rtBPriv?.routes.some((r) => r.destinationCidr.includes('10.10') && r.target !== 'local');
    if (!hasPeerRouteB && state.peering.status === 'Active') {
      checks.push('Routing Gap: ewb-rt-b-private is missing return peer route to 10.10.0.0/16.');
    }

    return checks;
  }, [state.instances, state.resources, state.securityGroups, state.routeTables, state.peering.status]);

  const evidenceCount = useMemo(() => state.evidence.length, [state.evidence]);

  const allRequiredCategories = useMemo(
    () => [
      'VPC',
      'Subnets',
      'Route tables',
      'Security groups',
      'EC2',
      'Peering',
      'Connectivity',
      'SSH',
      'Controlled failure',
      'Recovery',
      'Cleanup',
    ],
    []
  );

  const missingEvidenceCategories = useMemo(() => {
    const uploadedCats = new Set(state.evidence.map((e) => e.category));
    return allRequiredCategories.filter((cat) => !uploadedCats.has(cat as any));
  }, [state.evidence, allRequiredCategories]);

  const totalEvaluationScore = useMemo(() => {
    return state.evaluation.reduce((acc, cat) => acc + (cat.awardedMarks || 0), 0);
  }, [state.evaluation]);

  const isReportReady = useMemo(() => {
    return (
      state.profile.studentName.trim() !== '' &&
      state.peering.status === 'Active' &&
      completedTasks >= 10
    );
  }, [state.profile.studentName, state.peering.status, completedTasks]);

  return (
    <ProjectContext.Provider
      value={{
        state,
        updateProfile,
        updateResource,
        updatePeering,
        updateSecurityGroup,
        updateInstance,
        updateRouteTable,
        updateTest,
        updateControlledFailure,
        toggleWorkflowTask,
        addEvidence,
        deleteEvidence,
        toggleCleanupStep,
        updateTroubleshootingItem,
        updateEvaluationCategory,
        updateLessonsLearned,
        addActivity,
        resetToDefault,
        resetToBlank,
        exportProjectJson,
        importProjectJson,
        totalTasks,
        completedTasks,
        pendingTasks,
        progressPercentage,
        failedValidationChecks,
        evidenceCount,
        missingEvidenceCategories,
        totalEvaluationScore,
        isReportReady,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
