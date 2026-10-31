import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Edit2,
  Check,
  AlertTriangle,
  Camera,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ConnectivityTest } from '../types';

export const ConnectivityTestsPage: React.FC = () => {
  const { state, updateTest } = useProject();
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<ConnectivityTest>>({});

  const startEdit = (test: ConnectivityTest) => {
    setSelectedTestId(test.id);
    setEditFormData({
      actualResult: test.actualResult,
      packetLoss: test.packetLoss,
      passed: test.passed,
      explanation: test.explanation,
      testDate: test.testDate || new Date().toLocaleString(),
    });
  };

  const handleSave = (testId: string) => {
    updateTest(testId, editFormData);
    setSelectedTestId(null);
  };

  const passedCount = state.tests.filter((t) => t.passed === true).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Stage 7 & Stage 10 Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Network Connectivity Verification Suite
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Record actual terminal ping outputs, packet loss percentages, and SSH session verification.
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-slate-800 text-xs flex items-center space-x-3 shrink-0 self-start sm:self-auto">
          <span className="text-slate-400">Test Suite Status:</span>
          <span className="font-bold text-amber-400 text-sm">
            {passedCount} of {state.tests.length} Verified
          </span>
        </div>
      </div>

      {/* Accuracy Warning */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-xs text-blue-950 text-xs">
        <h4 className="font-bold text-blue-900 text-sm mb-1">
          Authentic Testing Policy: Record Actual AWS Command Outputs
        </h4>
        <p className="text-blue-800 leading-relaxed">
          Do not fabricate test results or pretend an unverified test succeeded. You must execute each command from the respective host terminal, record the actual transmission statistics (e.g. 0% vs 100% packet loss), and provide a technical explanation of how packets traversed the security group and routing layers.
        </p>
      </div>

      {/* Tests Grid */}
      <div className="space-y-4">
        {state.tests.map((test, idx) => {
          const isSelected = selectedTestId === test.id;
          const isPassed = test.passed === true;
          const isFailed = test.passed === false;

          return (
            <div
              key={test.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden p-6 shadow-xs ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{test.name}</h3>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {test.stage}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 pl-8">
                    Source: <strong className="text-slate-800">{test.sourceHost}</strong> → Destination: <strong className="text-slate-800">{test.destinationIp}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isFailed
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isPassed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                          Passed / Verified
                        </>
                      ) : isFailed ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                          Failed Check
                        </>
                      ) : (
                        'Pending Execution'
                      )}
                    </span>
                    {test.packetLoss && (
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        Packet Loss: {test.packetLoss}
                      </span>
                    )}
                  </div>

                  {!isSelected ? (
                    <button
                      onClick={() => startEdit(test)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center space-x-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Record Results</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSave(test.id)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Entry</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Command box */}
              <div className="mt-4 bg-slate-900 text-white rounded-lg p-3 font-mono text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-400">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span>$ {test.command}</span>
                </div>
                <span className="text-[10px] text-slate-400">Design Expected: {test.expectedResult}</span>
              </div>

              {/* Edit Mode vs Display Mode */}
              {isSelected ? (
                <div className="mt-4 space-y-4 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Actual Terminal Command Output (Paste Raw Output)
                    </label>
                    <textarea
                      rows={4}
                      value={editFormData.actualResult || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, actualResult: e.target.value })}
                      placeholder="Paste terminal output..."
                      className="w-full px-3 py-2 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Measured Packet Loss
                      </label>
                      <input
                        type="text"
                        value={editFormData.packetLoss || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, packetLoss: e.target.value })}
                        placeholder="e.g. 0% or 100%"
                        className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Validation Verdict
                      </label>
                      <select
                        value={editFormData.passed === null ? '' : editFormData.passed ? 'true' : 'false'}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            passed: e.target.value === '' ? null : e.target.value === 'true',
                          })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="">Pending Execution</option>
                        <option value="true">Passed (Matches Expected)</option>
                        <option value="false">Failed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Execution Timestamp
                      </label>
                      <input
                        type="text"
                        value={editFormData.testDate || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, testDate: e.target.value })}
                        className="w-full px-3 py-2 font-mono text-xs border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Technical Explanation & Network Path Analysis
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.explanation || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, explanation: e.target.value })}
                      placeholder="Explain routing path and security group enforcement for this test..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-2 text-xs">
                  {test.actualResult && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Actual Recorded Terminal Output:
                      </span>
                      <pre className="font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {test.actualResult}
                      </pre>
                    </div>
                  )}

                  {test.explanation && (
                    <p className="text-slate-600 leading-relaxed text-xs">
                      <strong>Analysis: </strong> {test.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
