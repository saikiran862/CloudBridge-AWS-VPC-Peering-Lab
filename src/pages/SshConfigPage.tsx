import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Key,
  Info,
  Server,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

export const SshConfigPage: React.FC = () => {
  const { state } = useProject();
  const bastion = state.instances.find((i) => i.name === 'ewb-bastion');
  const bastionIp = bastion?.publicIp || '13.232.145.88';

  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const sshConfigTemplate = `Host ewb-bastion
    HostName ${bastionIp}
    User ec2-user
    IdentityFile ~/.ssh/ewb-lab.pem
    IdentitiesOnly yes

Host ewb-app-a
    HostName 10.10.2.10
    User ec2-user
    IdentityFile ~/.ssh/ewb-lab.pem
    IdentitiesOnly yes
    ProxyJump ewb-bastion

Host ewb-app-b
    HostName 10.20.1.10
    User ec2-user
    IdentityFile ~/.ssh/ewb-lab.pem
    IdentitiesOnly yes
    ProxyJump ewb-bastion`;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(sshConfigTemplate);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-amber-600 uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Stage 6 Remote Administration</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
          SSH ProxyJump Configuration & Key Hygiene
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure transparent jump-host tunneling via <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">ProxyJump</code> so you can securely reach private instances App-A and App-B without exposing them to the internet or copying private keys onto intermediate servers.
        </p>
      </div>

      {/* Security Best Practice Notice */}
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-xs text-emerald-950">
        <div className="flex items-start">
          <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-emerald-900 text-sm">
              Key Security Principle: Never Copy Your .pem Key to the Bastion Host!
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              Traditional multi-hop SSH often tempted engineers to upload their private key (<code className="font-mono bg-emerald-100 px-1 rounded">ewb-lab.pem</code>) to the bastion host so they could SSH from the bastion to private servers. <strong>This is dangerous</strong>: if the bastion is ever compromised, the attacker acquires your private key. With OpenSSH <code className="font-mono bg-emerald-100 px-1 rounded">ProxyJump</code>, your laptop establishes an end-to-end encrypted TCP tunnel through the bastion, and SSH authentication is negotiated directly between your laptop and the private instance. The private key never leaves your local computer.
            </p>
          </div>
        </div>
      </div>

      {/* Generated ~/.ssh/config Box */}
      <div className="bg-slate-900 text-white rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-slate-400 ml-2">~/.ssh/config (Generated Template)</span>
          </div>
          <button
            onClick={handleCopyConfig}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            {copiedConfig ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SSH Config</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 overflow-x-auto">
          <pre className="font-mono text-xs text-amber-300 leading-relaxed selection:bg-amber-500 selection:text-slate-950">
            {sshConfigTemplate}
          </pre>
        </div>

        <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Actual Bastion Public IP dynamically injected: <strong className="text-white font-mono">{bastionIp}</strong></span>
          <span>Ensure permissions: <code className="text-amber-400">chmod 600 ~/.ssh/config && chmod 400 ~/.ssh/ewb-lab.pem</code></span>
        </div>
      </div>

      {/* Quick Launch Commands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bastion Command */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Direct Bastion Shell</span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Public Ingress</span>
            </div>
            <code className="text-xs font-mono font-bold text-slate-800 block mt-2 bg-slate-100 p-2 rounded">
              ssh ewb-bastion
            </code>
            <p className="text-[11px] text-slate-500 mt-2">
              Connects directly to the jump host in public subnet ewb-a-public.
            </p>
          </div>
          <button
            onClick={() => handleCopyCommand('ssh ewb-bastion')}
            className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
          >
            {copiedCmd === 'ssh ewb-bastion' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedCmd === 'ssh ewb-bastion' ? 'Copied Command!' : 'Copy Command'}</span>
          </button>
        </div>

        {/* App-A Command */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">App-A Shell via ProxyJump</span>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">VPC A Private</span>
            </div>
            <code className="text-xs font-mono font-bold text-slate-800 block mt-2 bg-slate-100 p-2 rounded">
              ssh ewb-app-a
            </code>
            <p className="text-[11px] text-slate-500 mt-2">
              Jumps through ewb-bastion to reach 10.10.2.10.
            </p>
          </div>
          <button
            onClick={() => handleCopyCommand('ssh ewb-app-a')}
            className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
          >
            {copiedCmd === 'ssh ewb-app-a' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedCmd === 'ssh ewb-app-a' ? 'Copied Command!' : 'Copy Command'}</span>
          </button>
        </div>

        {/* App-B Command */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">App-B Shell via Peering Jump</span>
              <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">VPC B Peered</span>
            </div>
            <code className="text-xs font-mono font-bold text-slate-800 block mt-2 bg-slate-100 p-2 rounded">
              ssh ewb-app-b
            </code>
            <p className="text-[11px] text-slate-500 mt-2">
              Jumps through Bastion over the VPC Peering connection to 10.20.1.10.
            </p>
          </div>
          <button
            onClick={() => handleCopyCommand('ssh ewb-app-b')}
            className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-colors"
          >
            {copiedCmd === 'ssh ewb-app-b' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedCmd === 'ssh ewb-app-b' ? 'Copied Command!' : 'Copy Command'}</span>
          </button>
        </div>
      </div>

      {/* How ProxyJump Works Architecture Breakdown */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3 text-xs text-slate-700">
        <h4 className="font-bold text-slate-900 text-sm">Understanding SSH ProxyJump Packet Flow</h4>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2 font-mono text-[11px]">
          <div className="bg-white p-3 rounded-lg border border-slate-300 text-center w-full md:w-auto">
            <span className="font-bold text-slate-900 block">Student Workstation</span>
            <span className="text-slate-500">Holds ewb-lab.pem</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-500 shrink-0 hidden md:block" />
          <div className="bg-white p-3 rounded-lg border border-slate-300 text-center w-full md:w-auto">
            <span className="font-bold text-amber-600 block">ewb-bastion (13.232.145.88)</span>
            <span className="text-slate-500">TCP Port 22 Forwarder</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-500 shrink-0 hidden md:block" />
          <div className="bg-white p-3 rounded-lg border border-slate-300 text-center w-full md:w-auto">
            <span className="font-bold text-purple-600 block">ewb-app-b (10.20.1.10)</span>
            <span className="text-slate-500">Private Host in VPC B</span>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed">
          OpenSSH executes <code className="bg-white px-1 py-0.5 rounded font-mono">ssh -W %h:%p ewb-bastion</code> behind the scenes. This establishes a TCP forwarding pipe from your laptop directly to App-B's SSH port 22. App-B's SSH daemon evaluates the SSH key presented directly by your laptop, and ewb-bastion never sees decrypted data or key material.
        </p>
      </div>
    </div>
  );
};
