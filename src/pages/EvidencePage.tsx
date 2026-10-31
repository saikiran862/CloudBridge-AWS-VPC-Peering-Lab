import React, { useState } from 'react';
import {
  Camera,
  Upload,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  X,
  FileImage,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { EvidenceItem } from '../types';

export const EvidencePage: React.FC = () => {
  const { state, addEvidence, deleteEvidence, missingEvidenceCategories } = useProject();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);

  // Upload Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EvidenceItem['category']>('VPC');
  const [stageNumber, setStageNumber] = useState<number>(2);
  const [imageData, setImageData] = useState<string>('');

  const categories: EvidenceItem['category'][] = [
    'Architecture',
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
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvidence({
      title,
      description,
      category,
      stageNumber,
      imageData: imageData || '',
      verified: true,
    });

    setTitle('');
    setDescription('');
    setImageData('');
    setShowUploadModal(false);
  };

  const filteredEvidence = state.evidence.filter(
    (ev) => filterCategory === 'All' || ev.category === filterCategory
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
            <Camera className="w-4 h-4" />
            <span>Section 10 Evidence Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Project Screenshots & Testing Artifacts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload and organize actual screenshots from your AWS Management Console and terminal sessions for inclusion in the final PDF submission report.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Evidence</span>
        </button>
      </div>

      {/* Missing Evidence Warning */}
      {missingEvidenceCategories.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">
              Missing Evidence Checkpoints ({missingEvidenceCategories.length} Categories Pending)
            </h4>
            <p className="text-amber-800 mt-1">
              For full evaluation marks, ensure at least one screenshot is uploaded for each required category:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {missingEvidenceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat as any);
                    setShowUploadModal(true);
                  }}
                  className="px-2 py-0.5 rounded bg-white border border-amber-300 text-amber-900 text-[11px] font-medium hover:bg-amber-100 transition-colors"
                >
                  + Add {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
            filterCategory === 'All'
              ? 'bg-slate-900 text-white font-bold'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories ({state.evidence.length})
        </button>
        {categories.map((cat) => {
          const count = state.evidence.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors flex items-center space-x-1.5 ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span className="text-[10px] font-mono opacity-80">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Evidence Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Preview or Placeholder Thumbnail */}
              <div
                onClick={() => setPreviewItem(item)}
                className="cursor-pointer bg-slate-900 h-40 flex items-center justify-center relative overflow-hidden group"
              >
                {item.imageData ? (
                  <img
                    src={item.imageData}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="p-4 text-center space-y-2">
                    <FileImage className="w-8 h-8 text-amber-500/60 mx-auto" />
                    <span className="text-[11px] font-mono text-slate-400 block px-2 line-clamp-2">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-amber-400 block">Click to view evidence details</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Preview Evidence</span>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                    {item.category}
                  </span>
                  <span className="text-slate-400">Stage {item.stageNumber}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[10px]">{item.uploadedAt}</span>
              <button
                onClick={() => deleteEvidence(item.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                title="Delete screenshot"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Upload Project Evidence Screenshot</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Evidence Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS VPC Console - Route Table Associations"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Stage (1 - 15)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={stageNumber}
                    onChange={(e) => setStageNumber(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Test Result Details
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is demonstrated in this screenshot..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* File picker */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Screenshot File (PNG / JPG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                />
                {imageData && (
                  <div className="mt-2 text-emerald-600 font-medium text-[11px] flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Image file loaded successfully!
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow-xs"
                >
                  Save Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="bg-slate-900 text-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{previewItem.title}</h3>
                <span className="text-xs text-amber-400">Category: {previewItem.category} • Stage {previewItem.stageNumber}</span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {previewItem.imageData ? (
                <img
                  src={previewItem.imageData}
                  alt={previewItem.title}
                  className="max-h-96 w-auto mx-auto rounded-lg border border-slate-700"
                />
              ) : (
                <div className="bg-slate-800 p-8 rounded-lg text-center text-slate-400 text-xs">
                  Evidence metadata saved. (Standard demonstration placeholder)
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                {previewItem.description}
              </p>
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
