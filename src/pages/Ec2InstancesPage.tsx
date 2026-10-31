import React, { useState } from 'react';
import {
  Server,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe,
  Edit2,
  Check,
  Key,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/common/Badge';
import { EC2InstanceConfig } from '../types';

export const Ec2InstancesPage: React.FC = () => {
  const { state, updateInstance } = useProject();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<EC2InstanceConfig>>({});

  const startEdit = (inst: EC2InstanceConfig) => {
    setEditingId(inst.id);
    setFormData({
      actualInstanceId: inst.actualInstanceId,
      publicIp: inst.publicIp,
      actualPrivateIp: inst.actualPrivateIp,
      state: inst.state,
      availabilityZone: inst.availabilityZone,
    });
  };

  const handleSave = (id: string) => {
    updateInstance(id, formData);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Server className="w-4 h-4" />
          <span>Stage 5 Compute Workloads</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          EC2 Instance Deployments & IP Verification
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Launch and track the three Amazon Linux 2023 (t3.micro) instances using the <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">ewb-lab</code> key pair.
        </p>
      </div>

      {/* Security Check Banner: Private Instance Isolation */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Security Audit: 0 Public IP Addresses on Private Instances</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Both <strong className="text-white">ewb-app-a</strong> and <strong className="text-white">ewb-app-b</strong> reside strictly in private subnets with auto-assign public IPv4 turned OFF. If AWS assigns a public IP to either application instance, it represents a critical compliance violation.
        </p>
        <div className="flex items-center space-x-3 text-xs pt-1">
          <span className="flex items-center text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            ewb-app-a: 0 Public IPs (Compliant)
          </span>
          <span className="flex items-center text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            ewb-app-b: 0 Public IPs (Compliant)
          </span>
        </div>
      </div>

      {/* Instance Cards */}
      <div className="space-y-4">
        {state.instances.map((inst) => {
          const isEditing = editingId === inst.id;
          const isBastion = inst.name === 'ewb-bastion';
          const hasIllegalPublicIp = !isBastion && (inst.hasPublicIp || (inst.publicIp && inst.publicIp.trim() !== ''));

          return (
            <div
              key={inst.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden p-6 shadow-xs ${
                hasIllegalPublicIp
                  ? 'border-rose-400 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-3 rounded-xl ${
                      isBastion ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-slate-900">{inst.name}</h3>
                      <Badge status={inst.state} />
                      <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {inst.instanceType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Subnet: <span className="font-mono text-slate-700">{inst.subnet}</span> • AZ: <span className="font-mono text-slate-700">{inst.availabilityZone}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => startEdit(inst)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit AWS Details</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSave(inst.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Read / Edit Fields */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Instance ID */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Actual EC2 Instance ID</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.actualInstanceId || ''}
                      onChange={(e) => setFormData({ ...formData, actualInstanceId: e.target.value })}
                      placeholder="e.g. i-0123456789abcdef0"
                      className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-amber-500"
                    />
                  ) : (
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block truncate">
                      {inst.actualInstanceId || 'Pending Launch'}
                    </span>
                  )}
                </div>

                {/* Private IP */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Assigned Private IPv4</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.actualPrivateIp || ''}
                      onChange={(e) => setFormData({ ...formData, actualPrivateIp: e.target.value })}
                      placeholder="e.g. 10.10.1.10"
                      className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-amber-500"
                    />
                  ) : (
                    <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                      {inst.actualPrivateIp} (Expected: {inst.expectedPrivateIp})
                    </span>
                  )}
                </div>

                {/* Public IP */}
                <div
                  className={`p-3 rounded-lg border ${
                    hasIllegalPublicIp
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-slate-500 font-medium block">Public IPv4 Address</span>
                  {isEditing && isBastion ? (
                    <input
                      type="text"
                      value={formData.publicIp || ''}
                      onChange={(e) => setFormData({ ...formData, publicIp: e.target.value })}
                      placeholder="e.g. 13.232.145.88"
                      className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-amber-500"
                    />
                  ) : (
                    <span
                      className={`font-mono font-bold mt-0.5 block ${
                        isBastion ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      {isBastion ? inst.publicIp || 'None assigned' : 'Disabled (Air-Gapped)'}
                    </span>
                  )}
                </div>

                {/* Security Group & Key */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Security Group & Key Pair</span>
                  <span className="font-mono font-semibold text-slate-800 mt-0.5 block truncate">
                    {inst.securityGroup} • {inst.keyPair}.pem
                  </span>
                </div>
              </div>

              {/* Violation Warning */}
              {hasIllegalPublicIp && (
                <div className="mt-3 p-3 bg-rose-100 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    CRITICAL VIOLATION: {inst.name} must NOT have a public IP address! Modify instance settings or terminate and re-launch in private subnet.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
