import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface SecurityWarningProps {
  type?: 'credentials' | 'cost' | 'general';
  message?: string;
  className?: string;
}

export const SecurityWarning: React.FC<SecurityWarningProps> = ({
  type = 'credentials',
  message,
  className = '',
}) => {
  if (type === 'cost') {
    return (
      <div
        className={`bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm text-amber-900 ${className}`}
      >
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
          <div className="text-sm">
            <h4 className="font-semibold text-amber-800">
              AWS Cloud Cost Warning
            </h4>
            <p className="mt-1 text-amber-700 leading-relaxed">
              {message ||
                'AWS resources can incur charges. Complete cleanup after saving your project evidence. Terminate all EC2 instances, delete peering connections, and release any Elastic IPs when testing finishes.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg shadow-sm text-rose-900 ${className}`}
    >
      <div className="flex items-start">
        <ShieldAlert className="w-5 h-5 text-rose-600 mt-0.5 mr-3 shrink-0" />
        <div className="text-sm">
          <h4 className="font-semibold text-rose-800">
            Mandatory Security Warning: Zero-Credential Policy
          </h4>
          <p className="mt-1 text-rose-700 leading-relaxed">
            {message ||
              'AWS credentials (Access Keys, Secret Keys, Session Tokens), passwords, and private SSH keys (.pem / .id_rsa) must NEVER be uploaded or entered into this application. All private keys must remain strictly on your local computer.'}
          </p>
        </div>
      </div>
    </div>
  );
};
