import React, { useState } from 'react';
import { User, ShieldCheck, MapPin, Calendar, Building, Sparkles, Check, AlertTriangle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { SecurityWarning } from '../components/common/SecurityWarning';

export const SetupPage: React.FC = () => {
  const { state, updateProfile } = useProject();
  const [profile, setProfile] = useState(state.profile);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Project Initialization</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Student Profile & Lab Setup</h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your academic details, AWS laboratory region, and project metadata. These details will be automatically compiled into your final project report.
        </p>
      </div>

      {/* Security Warning Banner */}
      <SecurityWarning message="ZERO-CREDENTIAL REQUIREMENT: Do not enter or upload AWS root passwords, IAM user credentials, AWS Access Keys, Secret Access Keys, or private SSH key (.pem) files. Only enter public IDs and resource names." />

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={profile.studentName}
                onChange={(e) => setProfile({ ...profile, studentName: e.target.value })}
                placeholder="e.g. Dev Sharma"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                As registered in your university / training institute roster
              </span>
            </div>

            {/* Batch / Cohort */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Batch / Cohort Identifier *
              </label>
              <input
                type="text"
                required
                value={profile.batch}
                onChange={(e) => setProfile({ ...profile, batch: e.target.value })}
                placeholder="e.g. Cloud-Eng-2026 or CSE-Sec-B"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Assigned student batch for faculty grading
              </span>
            </div>

            {/* Project Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Title (Official Workbook Title)
              </label>
              <input
                type="text"
                required
                value={profile.projectTitle}
                onChange={(e) => setProfile({ ...profile, projectTitle: e.target.value })}
                className="w-full px-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-slate-50"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Default: AWS VPC Peering – Private Network Connectivity
              </span>
            </div>

            {/* AWS Account Alias */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                AWS Account Alias / Non-Sensitive Identifier
              </label>
              <input
                type="text"
                value={profile.awsAccountAlias}
                onChange={(e) => setProfile({ ...profile, awsAccountAlias: e.target.value })}
                placeholder="e.g. ewb-student-lab-01 or 12-digit ID"
                className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Do NOT enter passwords or IAM keys. Only account alias/number.
              </span>
            </div>

            {/* AWS Region */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Designated AWS Region
              </label>
              <select
                value={profile.awsRegion}
                onChange={(e) => setProfile({ ...profile, awsRegion: e.target.value })}
                className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="ap-south-1 (Mumbai)">ap-south-1 (Mumbai) [Recommended Lab Region]</option>
                <option value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</option>
                <option value="us-west-2 (Oregon)">us-west-2 (Oregon)</option>
                <option value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</option>
                <option value="ap-southeast-1 (Singapore)">ap-southeast-1 (Singapore)</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Workbook default: ap-south-1 (Mumbai)
              </span>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Start Date
              </label>
              <input
                type="date"
                value={profile.startDate}
                onChange={(e) => setProfile({ ...profile, startDate: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Completion / Submission Date
              </label>
              <input
                type="date"
                value={profile.completionDate}
                onChange={(e) => setProfile({ ...profile, completionDate: e.target.value })}
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Footer with Save Action */}
        <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-200 flex items-center justify-between">
          <div>
            {saved && (
              <span className="flex items-center text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4 mr-1.5" />
                Student profile changes saved successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center space-x-2"
          >
            <span>Save Profile Information</span>
          </button>
        </div>
      </form>

      {/* Reference Architecture Overview Card */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 text-xs space-y-3">
        <h4 className="font-bold text-sm text-amber-400 flex items-center">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Lab Environment Architecture Standard
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
          <div>
            <span className="text-white font-semibold block">VPC A Topology (ewb-vpc-a):</span>
            <p className="mt-0.5 text-slate-400">
              10.10.0.0/16 • ewb-igw-a (IGW) • ewb-a-public (10.10.1.0/24) with Bastion (10.10.1.10) • ewb-a-private (10.10.2.0/24) with App-A (10.10.2.10)
            </p>
          </div>
          <div>
            <span className="text-white font-semibold block">VPC B Topology (ewb-vpc-b):</span>
            <p className="mt-0.5 text-slate-400">
              10.20.0.0/16 • No IGW • ewb-b-private (10.20.1.0/24) with App-B (10.20.1.10) • Pure private workload
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
