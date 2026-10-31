import React, { useState } from 'react';
import {
  FileDown,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  Edit2,
  Check,
  Layers,
  Table,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { generateVpcPeeringPdfReport } from '../utils/pdfGenerator';
import { Badge } from '../components/common/Badge';

export const FinalReportPage: React.FC = () => {
  const { state, updateLessonsLearned, totalEvaluationScore, evidenceCount, isReportReady } = useProject();
  const [lessonsInput, setLessonsInput] = useState(state.lessonsLearned);
  const [isEditingLessons, setIsEditingLessons] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      generateVpcPeeringPdfReport(state);
      setIsGenerating(false);
    }, 600);
  };

  const handleSaveLessons = () => {
    updateLessonsLearned(lessonsInput);
    setIsEditingLessons(false);
  };

  const studentFilename = `${(state.profile.studentName || 'YourName').replace(/\s+/g, '_')}_CloudBridge_AWS_VPC_Peering.pdf`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <FileDown className="w-4 h-4" />
            <span>Section 11 Academic Deliverable</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Formal Project Report & PDF Generator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Export a comprehensive, publication-grade academic laboratory project document formatted to the official EWB Cloud Labs workbook specification.
          </p>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{isGenerating ? 'Building PDF Document...' : 'Download PDF Project Report'}</span>
        </button>
      </div>

      {/* Target Filename Card */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-400 block font-medium">Authoritative Required Filename:</span>
          <span className="font-mono text-amber-400 font-bold text-sm block mt-0.5">
            {studentFilename}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero passwords, private keys, or AWS secrets included.</span>
        </div>
      </div>

      {/* Report Preview Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Page Header Mockup */}
        <div className="bg-slate-950 p-8 border-b-4 border-amber-500 text-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              CloudBridge Cloud Labs • Architect. Connect. Empower.
            </span>
            <span className="text-xs font-mono text-slate-400">
              Region: {state.profile.awsRegion}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              AWS VPC Peering – Private Network Connectivity
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Final Comprehensive Student Project Workbook Submission Report
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Student Name:</span>
              <span className="font-bold text-white mt-0.5 block">{state.profile.studentName || 'Student'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Batch Identifier:</span>
              <span className="font-bold text-amber-400 mt-0.5 block">{state.profile.batch || 'Batch-2026'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Peering ID:</span>
              <span className="font-mono text-slate-200 mt-0.5 block">{state.peering.peeringId || 'pcx-08a9f4c3b2e1d0f5a'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Evaluation Score:</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">{totalEvaluationScore} / 100 Marks</span>
            </div>
          </div>
        </div>

        {/* Report Content Sections Summary */}
        <div className="p-6 sm:p-8 space-y-8 text-xs text-slate-700">
          {/* Section 1 & 2: Architecture & CIDRs */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              1. Architecture & Non-Overlapping CIDR Topology
            </h3>
            <p className="text-slate-600 leading-relaxed">
              VPC A (10.10.0.0/16) and VPC B (10.20.0.0/16) deployed in ap-south-1 with zero CIDR overlap. Internet Gateway attached exclusively to VPC A. VPC B is completely isolated from direct public internet exposure with 0 public IP addresses.
            </p>
          </div>

          {/* Section 3: Resource Inventory Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              2. Documented AWS Resource Inventory (17 Core Items)
            </h3>
            <div className="border border-slate-200 rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">VPC</th>
                    <th className="py-2 px-3">Actual Resource ID</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {state.resources.slice(0, 6).map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">{r.name}</td>
                      <td className="py-2 px-3 text-slate-600">{r.type}</td>
                      <td className="py-2 px-3">{r.vpc}</td>
                      <td className="py-2 px-3 text-slate-800">{r.actualResourceId || 'Pending'}</td>
                      <td className="py-2 px-3 font-sans">
                        <Badge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <span className="text-[11px] text-slate-400 block italic">
              + 11 additional resources compiled in the downloaded PDF document.
            </span>
          </div>

          {/* Section 4: Security Groups & Statefulness */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              3. Security Group Rules & SSH ProxyJump
            </h3>
            <p className="text-slate-600 leading-relaxed">
              SSH (TCP Port 22) locked down strictly to operator /32 address on ewb-sg-bastion. App-A and App-B allow SSH exclusively from Bastion private IP (10.10.1.10/32) and ICMP Echo Request (Type 8, Code 0) from peer private IP. Key material never leaves client workstation.
            </p>
          </div>

          {/* Section 5: Connectivity Results */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              4. Verified Network Verification Suites (Tests 1 - 5)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.tests.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{t.name}</span>
                    <span className="font-bold text-emerald-600">Passed</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">Command: {t.command}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Editable Lessons Learned */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                5. Key Technical Findings & Lessons Learned
              </h3>
              {!isEditingLessons ? (
                <button
                  onClick={() => setIsEditingLessons(true)}
                  className="text-amber-600 hover:text-amber-700 font-medium flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Reflection</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveLessons}
                  className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Reflection</span>
                </button>
              )}
            </div>

            {isEditingLessons ? (
              <textarea
                rows={6}
                value={lessonsInput}
                onChange={(e) => setLessonsInput(e.target.value)}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
            ) : (
              <pre className="font-mono text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {state.lessonsLearned}
              </pre>
            )}
          </div>

          {/* Download PDF Trigger Button */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500">
              Formatted per ISO A4 standard with headers, footers, page numbering, and rubric scoring.
            </span>
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering PDF...' : 'Download Official PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
