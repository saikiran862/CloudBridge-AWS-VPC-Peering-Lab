import React, { useState } from 'react';
import { X, Server, Network, Shield, ArrowRight, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { Badge } from '../common/Badge';
import { AWSResourceStatus } from '../../types';

interface ResourceDetailModalProps {
  resourceId: string | null;
  onClose: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resourceId, onClose }) => {
  const { state, updateResource, updateInstance, updatePeering } = useProject();

  if (!resourceId) return null;

  const res = state.resources.find((r) => r.id === resourceId || r.name === resourceId);
  const inst = state.instances.find((i) => i.id === resourceId || i.name === resourceId);
  const isPeering = resourceId === 'ewb-a-b-peer' || resourceId === 'res-16';

  const [actualIdInput, setActualIdInput] = useState(res?.actualResourceId || inst?.actualInstanceId || '');
  const [statusInput, setStatusInput] = useState<AWSResourceStatus>(res?.status || 'Available');
  const [notesInput, setNotesInput] = useState(res?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (res) {
      updateResource(res.id, {
        actualResourceId: actualIdInput,
        status: statusInput,
        notes: notesInput,
      });
    }
    if (inst) {
      updateInstance(inst.id, {
        actualInstanceId: actualIdInput,
      });
    }
    if (isPeering) {
      updatePeering({
        peeringId: actualIdInput,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const title = res?.name || inst?.name || (isPeering ? 'ewb-a-b-peer' : 'Resource Details');
  const type = res?.type || (inst ? 'EC2 Instance' : (isPeering ? 'VPC Peering Connection' : 'AWS Resource'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg text-white">{title}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                VPC: {res?.vpc || inst?.vpc || 'AWS Region: ap-south-1'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Spec Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Design Expected IP / CIDR</span>
              <span className="text-sm font-mono font-semibold text-slate-900 mt-0.5 block">
                {res?.expectedCidrOrIp || inst?.expectedPrivateIp || (isPeering ? '10.10.0.0/16 ↔ 10.20.0.0/16' : 'N/A')}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-500 font-medium block">Current Status</span>
              <div className="mt-1">
                <Badge status={statusInput} />
              </div>
            </div>
          </div>

          {/* Instance specific warnings */}
          {inst && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
              <div className="flex items-start">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 mr-2 shrink-0" />
                <div className="text-xs leading-relaxed">
                  <strong>Security Specification: </strong>
                  {inst.name === 'ewb-bastion' ? (
                    <span>
                      Bastion requires Public IPv4 auto-assign enabled for SSH ingress from your IP. Private IP: 10.10.1.10.
                    </span>
                  ) : (
                    <span>
                      {inst.name} is strictly private! Public IPv4 must be DISABLED. Must not be directly reachable from the internet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form to edit actual ID and status */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Actual AWS Resource ID (from AWS Management Console)
              </label>
              <input
                type="text"
                value={actualIdInput}
                onChange={(e) => setActualIdInput(e.target.value)}
                placeholder="e.g. vpc-0a1b2c3d4e5f60001, subnet-xxx, i-xxx, pcx-xxx"
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Copy and paste the exact resource ID provisioned in your AWS Console.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Resource Lifecycle Status
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as AWSResourceStatus)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                >
                  <option value="Not started">Not started</option>
                  <option value="Creating">Creating</option>
                  <option value="Available">Available</option>
                  <option value="Failed">Failed</option>
                  <option value="Deleted">Deleted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subnet / Region
                </label>
                <input
                  type="text"
                  disabled
                  value={res?.subnet || inst?.subnet || 'ap-south-1 (Mumbai)'}
                  className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Lab Documentation Notes
              </label>
              <textarea
                rows={2}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Record any configuration notes or observation details..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center text-xs">
            {savedSuccess && (
              <span className="flex items-center text-emerald-600 font-medium">
                <Check className="w-4 h-4 mr-1" />
                Updated in project inventory!
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors flex items-center"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
