export type AWSResourceStatus = 'Not started' | 'Creating' | 'Available' | 'Failed' | 'Deleted';

export type PeeringStatus = 'Not created' | 'Pending acceptance' | 'Active' | 'Failed';

export interface StudentProfile {
  studentName: string;
  batch: string;
  projectTitle: string;
  awsAccountAlias: string;
  awsRegion: string;
  startDate: string;
  completionDate: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  type: 'VPC' | 'Subnet' | 'Internet Gateway' | 'Route Table' | 'Security Group' | 'EC2 Instance' | 'VPC Peering Connection' | 'Key Pair';
  vpc: 'VPC A' | 'VPC B' | 'Both' | 'N/A';
  subnet?: string;
  cidrOrIp: string;
  expectedCidrOrIp: string;
  actualResourceId: string;
  status: AWSResourceStatus;
  notes: string;
}

export interface SecurityRule {
  id: string;
  type: 'SSH' | 'ICMP Echo Request' | 'Custom TCP' | 'All Traffic';
  protocol: 'TCP' | 'ICMP' | 'All';
  portOrRange: string;
  source: string;
  expectedSource: string;
  icmpType?: number;
  icmpCode?: number;
  description: string;
}

export interface SecurityGroupConfig {
  id: string;
  name: string;
  description: string;
  vpc: 'ewb-vpc-a' | 'ewb-vpc-b';
  actualId: string;
  inboundRules: SecurityRule[];
  outboundRules: SecurityRule[];
}

export interface EC2InstanceConfig {
  id: string;
  name: string;
  vpc: 'ewb-vpc-a' | 'ewb-vpc-b';
  subnet: string;
  expectedPrivateIp: string;
  actualPrivateIp: string;
  hasPublicIp: boolean;
  publicIp: string;
  instanceType: string;
  ami: string;
  keyPair: string;
  securityGroup: string;
  state: 'running' | 'stopped' | 'terminated' | 'pending';
  actualInstanceId: string;
  availabilityZone: string;
}

export interface RouteEntry {
  id: string;
  destinationCidr: string;
  target: string;
  status: 'active' | 'blackhole';
  isLocal?: boolean;
}

export interface RouteTableConfig {
  id: string;
  name: string;
  vpc: 'ewb-vpc-a' | 'ewb-vpc-b';
  associatedSubnet: string;
  actualId: string;
  routes: RouteEntry[];
}

export interface ConnectivityTest {
  id: string;
  name: string;
  stage: string;
  sourceHost: string;
  destinationIp: string;
  command: string;
  expectedResult: string;
  actualResult: string;
  packetLoss: string;
  passed: boolean | null;
  testDate: string;
  screenshotId?: string;
  explanation: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  category: 
    | 'Architecture' 
    | 'VPC' 
    | 'Subnets' 
    | 'Route tables' 
    | 'Security groups' 
    | 'EC2' 
    | 'Peering' 
    | 'Connectivity' 
    | 'SSH' 
    | 'Controlled failure' 
    | 'Recovery' 
    | 'Cleanup';
  stageNumber: number;
  uploadedAt: string;
  imageData: string; // base64 or URL
  verified: boolean;
}

export interface WorkflowStageTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  notes?: string;
  requiredEvidenceCategory?: EvidenceItem['category'];
}

export interface WorkflowStage {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  tasks: WorkflowStageTask[];
  notes?: string;
}

export interface ControlledFailureState {
  beforeRuleRemoved: {
    rulePresent: boolean;
    pingResult: string;
    passed: boolean | null;
    screenshotId?: string;
  };
  duringFailure: {
    ruleRemoved: boolean;
    pingResult: string;
    passed: boolean | null;
    screenshotId?: string;
    explanation: string;
  };
  afterRecovery: {
    ruleRestored: boolean;
    pingResult: string;
    passed: boolean | null;
    screenshotId?: string;
    explanation: string;
  };
}

export interface CleanupStep {
  stepNumber: number;
  action: string;
  targetResource: string;
  completed: boolean;
  notes: string;
  screenshotId?: string;
}

export interface TroubleshootingItem {
  id: string;
  issue: string;
  symptoms: string[];
  possibleCauses: string[];
  remediationSteps: string[];
  resolved: boolean;
  studentNotes: string;
}

export interface EvaluationCategory {
  id: string;
  name: string;
  maxMarks: number;
  criteria: string;
  awardedMarks: number;
  feedback: string;
  autoScore: number;
}

export interface ProjectState {
  profile: StudentProfile;
  resources: ResourceItem[];
  peering: {
    connectionName: string;
    peeringId: string;
    requesterVpcId: string;
    accepterVpcId: string;
    status: PeeringStatus;
    notes: string;
  };
  securityGroups: SecurityGroupConfig[];
  instances: EC2InstanceConfig[];
  routeTables: RouteTableConfig[];
  tests: ConnectivityTest[];
  controlledFailure: ControlledFailureState;
  workflowStages: WorkflowStage[];
  evidence: EvidenceItem[];
  cleanupSteps: CleanupStep[];
  troubleshooting: TroubleshootingItem[];
  evaluation: EvaluationCategory[];
  lessonsLearned: string;
  recentActivities: {
    id: string;
    timestamp: string;
    action: string;
    category: string;
  }[];
}
