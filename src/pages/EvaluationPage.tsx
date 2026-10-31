import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { EvaluationCategory } from '../types';

export const EvaluationPage: React.FC = () => {
  const { state, updateEvaluationCategory, totalEvaluationScore, missingEvidenceCategories } = useProject();
  const [activeTab, setActiveTab] = useState<'rubric' | 'viva'>('rubric');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMarks, setEditMarks] = useState<number>(0);
  const [editFeedback, setEditFeedback] = useState<string>('');
  const [expandedViva, setExpandedViva] = useState<number | null>(1);

  const startEdit = (evalItem: EvaluationCategory) => {
    setEditingId(evalItem.id);
    setEditMarks(evalItem.awardedMarks);
    setEditFeedback(evalItem.feedback);
  };

  const handleSave = (id: string) => {
    updateEvaluationCategory(id, {
      awardedMarks: editMarks,
      feedback: editFeedback,
    });
    setEditingId(null);
  };

  const vivaQuestions = [
    {
      q: '1. Why are non-overlapping CIDRs strictly required for AWS VPC Peering?',
      a: 'VPC Peering works at Layer 3 (Network Layer) without Network Address Translation (NAT). Routers match packets using IP destination addresses. If VPC A and VPC B shared identical or overlapping CIDR blocks (e.g., both 10.10.0.0/16), the VPC route tables would have ambiguous destination targets, creating routing loops or blackholes. AWS explicitly blocks peering creation between VPCs with overlapping CIDRs.',
    },
    {
      q: '2. Why is a return route required in VPC B’s route table even after peering is Active?',
      a: 'IP communication is bidirectional. When App-A (10.10.2.10) sends a packet to App-B (10.20.1.10), VPC A routes it forward over the peering connection. However, when App-B generates the reply packet destined for 10.10.2.10, VPC B’s router must consult ewb-rt-b-private. Without an explicit return route (10.10.0.0/16 -> pcx-xxxx), VPC B does not know how to return the packet, resulting in 100% packet loss.',
    },
    {
      q: '3. Why is App-B SSH allowed from the Bastion private IP (10.10.1.10/32) instead of the student public IP?',
      a: 'Traffic arriving at App-B via SSH ProxyJump originates from the Bastion host’s internal network interface (10.10.1.10). Because the Bastion is inside VPC A and traverses the VPC Peering connection directly to VPC B, its source address as seen by App-B is 10.10.1.10/32. App-B has no internet gateway, so it cannot communicate directly with external public IP addresses.',
    },
    {
      q: '4. Why does an "Active" peering status not guarantee a successful ping?',
      a: 'An "Active" peering connection simply means both VPC owners agreed to connect their virtual routers. It does not alter route tables or firewall rules. For a ping to succeed, three independent layers must all be configured: 1) Active Peering ID, 2) Forward and return routes in both VPC route tables, and 3) Security group inbound rules authorizing ICMP Echo Requests on the target.',
    },
    {
      q: '5. Can VPC B use VPC A’s Internet Gateway through the peering connection?',
      a: 'No. AWS VPC Peering is non-transitive and does not support edge-to-edge routing. Traffic cannot enter a VPC via an Internet Gateway and exit through a peering connection, nor can peered traffic route out to the internet through another VPC’s IGW. To provide internet egress to VPC B, an independent NAT Gateway or direct VPC egress must be provisioned.',
    },
    {
      q: '6. Why should private application instances (App-A & App-B) never have public IPv4 addresses?',
      a: 'Assigning a public IP address to an instance makes it directly targetable by internet scanners and threat actors. Following the Defense-in-Depth model, sensitive backend databases and applications should reside strictly within private subnets with RFC 1918 private IPs only, reachable solely through controlled jump hosts (bastions) and authenticated tunnels.',
    },
    {
      q: '7. Why is the ICMP rule specifically needed for ping to work?',
      a: 'Ping uses the Internet Control Message Protocol (ICMP), not TCP or UDP. Security Groups default to "Deny All" for all incoming traffic. Unless an inbound rule explicitly permits ICMP Echo Requests (Type 8, Code 0) from the authorized source subnet or IP, the hypervisor firewall silently drops the ping packets.',
    },
    {
      q: '8. What was the purpose of the Controlled Failure and Recovery experiment?',
      a: 'The experiment proved two critical networking concepts: 1) VPC Peering routing alone is insufficient without security group permission, and 2) AWS Security Groups enforce dynamic stateful filtering at the hypervisor layer without requiring instance restarts. Removing only the ICMP rule broke ping while leaving SSH untouched, demonstrating protocol-specific granularity.',
    },
    {
      q: '9. Why is OpenSSH ProxyJump preferred over standard multi-hop SSH?',
      a: 'ProxyJump uses TCP port forwarding directly from the client laptop to the destination host through the jump host. This eliminates the dangerous practice of storing private key files (.pem) on the intermediate bastion server, keeping cryptographic material exclusively on the student workstation.',
    },
    {
      q: '10. Why must AWS laboratory resources be thoroughly cleaned up after project completion?',
      a: 'AWS charges on a per-second / per-hour basis for compute instances (EC2), Elastic IP addresses that are idle, and EBS storage volumes. Leaving unneeded resources running indefinitely consumes AWS educational credits and incurs real cloud infrastructure costs. Proper teardown is standard cloud engineering hygiene.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Stage 14 Evaluation & Viva Readiness</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Academic Rubric & Viva Preparation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official 100-mark evaluation matrix from the workbook and comprehensive technical viva questions.
          </p>
        </div>

        {/* Total Score Badge */}
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-right shrink-0">
          <span className="text-xs text-slate-400 block font-medium">Evaluation Total</span>
          <span className="text-2xl font-black text-amber-400 block mt-0.5">
            {totalEvaluationScore} / 100 Marks
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('rubric')}
          className={`pb-3 font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'rubric'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>100-Mark Grading Rubric</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`pb-3 font-bold transition-all border-b-2 flex items-center space-x-2 ${
            activeTab === 'viva'
              ? 'border-amber-500 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Viva Voce Question Bank (10 Core Topics)</span>
        </button>
      </div>

      {activeTab === 'rubric' ? (
        <div className="space-y-4">
          {/* Missing evidence warning if score affected */}
          {missingEvidenceCategories.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-950">Instructor Review Suggestion</h4>
                <p className="text-amber-800 mt-0.5">
                  Full 100 marks requires evidence for all 11 required categories. You currently have {missingEvidenceCategories.length} categories pending screenshot upload.
                </p>
              </div>
            </div>
          )}

          {/* Rubric Cards */}
          <div className="space-y-4">
            {state.evaluation.map((evalItem) => {
              const isEditing = editingId === evalItem.id;

              return (
                <div
                  key={evalItem.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-slate-900">{evalItem.name}</h3>
                      <p className="text-xs text-slate-500">{evalItem.criteria}</p>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">Max: {evalItem.maxMarks} Marks</span>
                        <span className="font-bold text-amber-600 text-base">
                          {evalItem.awardedMarks} / {evalItem.maxMarks}
                        </span>
                      </div>

                      {!isEditing ? (
                        <button
                          onClick={() => startEdit(evalItem)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center space-x-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSave(evalItem.id)}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Marks</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Feedback display / Edit */}
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Awarded Marks (0 - {evalItem.maxMarks})
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={evalItem.maxMarks}
                          value={editMarks}
                          onChange={(e) => setEditMarks(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-900"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Evaluator Notes / Faculty Feedback
                        </label>
                        <input
                          type="text"
                          value={editFeedback}
                          onChange={(e) => setEditFeedback(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs flex items-center justify-between text-slate-700">
                      <span><strong>Faculty Feedback: </strong> {evalItem.feedback}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Calculated from verified evidence</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Viva Voce Questions Section */
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 text-xs space-y-1">
            <h4 className="font-bold text-amber-400 text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Comprehensive AWS VPC Peering Oral Viva Guide
            </h4>
            <p className="text-slate-300 leading-relaxed">
              These 10 questions test in-depth understanding of CIDRs, routing symmetry, stateful firewalls, and bastion jump security.
            </p>
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((viva, idx) => {
              const isExpanded = expandedViva === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                >
                  <div
                    onClick={() => setExpandedViva(isExpanded ? null : idx)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none bg-slate-50/60 hover:bg-slate-50"
                  >
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{viva.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 text-xs text-slate-700 bg-white leading-relaxed">
                      <strong className="text-amber-700 block mb-1">Model Technical Answer:</strong>
                      {viva.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
