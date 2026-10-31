import React, { useState, useMemo } from 'react';
import {
  Table,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Edit2,
  Check,
  Server,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Badge } from '../components/common/Badge';
import { ResourceDetailModal } from '../components/architecture/ResourceDetailModal';
import { AWSResourceStatus, ResourceItem } from '../types';

export const InventoryPage: React.FC = () => {
  const { state, updateResource } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [vpcFilter, setVpcFilter] = useState<'All' | 'VPC A' | 'VPC B' | 'Both' | 'N/A'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return state.resources.filter((res) => {
      const matchSearch =
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.actualResourceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.cidrOrIp.toLowerCase().includes(searchTerm.toLowerCase());

      const matchVpc = vpcFilter === 'All' || res.vpc === vpcFilter;
      const matchStatus = statusFilter === 'All' || res.status === statusFilter;
      const matchType = typeFilter === 'All' || res.type === typeFilter;

      return matchSearch && matchVpc && matchStatus && matchType;
    });
  }, [state.resources, searchTerm, vpcFilter, statusFilter, typeFilter]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Resource Name', 'Type', 'VPC', 'Subnet', 'CIDR/IP', 'Actual AWS Resource ID', 'Status', 'Notes'];
    const rows = state.resources.map((r) => [
      `"${r.name}"`,
      `"${r.type}"`,
      `"${r.vpc}"`,
      `"${r.subnet || 'N/A'}"`,
      `"${r.cidrOrIp}"`,
      `"${r.actualResourceId}"`,
      `"${r.status}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${state.profile.studentName || 'Student'}_AWS_Resource_Inventory.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const resourceTypes = useMemo(() => {
    const types = new Set(state.resources.map((r) => r.type));
    return ['All', ...Array.from(types)];
  }, [state.resources]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Table className="w-4 h-4" />
            <span>Infrastructure Inventory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            AWS Lab Resource Inventory ({state.resources.length} Core Items)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and record the actual AWS Console IDs generated during laboratory provisioning.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-xs transition-colors flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Inventory CSV</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by resource name, type, actual ID, or IP..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* VPC Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">VPC:</span>
            <select
              value={vpcFilter}
              onChange={(e) => setVpcFilter(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All VPCs</option>
              <option value="VPC A">VPC A</option>
              <option value="VPC B">VPC B</option>
              <option value="Both">Both (Cross-VPC)</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
            >
              {resourceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-1 focus:ring-amber-500"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Creating">Creating</option>
              <option value="Not started">Not started</option>
              <option value="Failed">Failed</option>
              <option value="Deleted">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Resource Name</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">VPC</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">CIDR / Private IP</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Actual AWS Resource ID</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No resources matched your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredResources.map((res) => {
                  const hasIpWarning =
                    res.expectedCidrOrIp &&
                    res.cidrOrIp !== res.expectedCidrOrIp &&
                    res.cidrOrIp.includes('.');

                  return (
                    <tr
                      key={res.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => setEditingResourceId(res.id)}
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                        <span>{res.name}</span>
                        {hasIpWarning && (
                          <span
                            title="Recorded IP differs from project architecture plan!"
                            className="text-amber-500"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                          {res.type}
                        </span>
                      </td>

                      {/* VPC */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                            res.vpc === 'VPC A'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : res.vpc === 'VPC B'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {res.vpc}
                        </span>
                      </td>

                      {/* CIDR / IP */}
                      <td className="py-3.5 px-4 font-mono text-slate-800">
                        <div>
                          <span>{res.cidrOrIp}</span>
                          {hasIpWarning && (
                            <span className="text-[10px] text-amber-600 block">
                              Expected: {res.expectedCidrOrIp}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actual Resource ID */}
                      <td className="py-3.5 px-4 font-mono">
                        {res.actualResourceId ? (
                          <span className="text-slate-900 font-semibold bg-slate-100 px-2 py-1 rounded">
                            {res.actualResourceId}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending Entry...</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge status={res.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingResourceId(res.id);
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredResources.length} of {state.resources.length} workbook resources
          </span>
          <span className="font-mono">
            {state.resources.filter((r) => r.actualResourceId.trim() !== '').length} with actual AWS IDs
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {editingResourceId && (
        <ResourceDetailModal
          resourceId={editingResourceId}
          onClose={() => setEditingResourceId(null)}
        />
      )}
    </div>
  );
};
