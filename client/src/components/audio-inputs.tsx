import { useState, useEffect } from "react";

interface AudioInput {
  id: string;
  name: string;
  type: 'microphone' | 'bluetooth' | 'usb' | 'aux';
  status: 'active' | 'connected' | 'disconnected';
  description: string;
}

export function AudioInputs() {
  const [inputs, setInputs] = useState<AudioInput[]>([
    {
      id: 'builtin-mic',
      name: 'Built-in Microphone',
      type: 'microphone',
      status: 'active',
      description: 'Primary input'
    },
    {
      id: 'bluetooth-1',
      name: 'Bluetooth Audio',
      type: 'bluetooth',
      status: 'connected',
      description: 'AirPods Pro'
    },
    {
      id: 'usb-1',
      name: 'USB Audio',
      type: 'usb',
      status: 'disconnected',
      description: 'Not connected'
    },
    {
      id: 'aux-1',
      name: 'Line In/AUX',
      type: 'aux',
      status: 'disconnected',
      description: 'Not connected'
    }
  ]);

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'microphone':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      case 'bluetooth':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
      case 'usb':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'aux':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'connected': return 'text-primary';
      case 'disconnected': return 'text-on-surface-variant';
      default: return 'text-on-surface-variant';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'active': return 'bg-success animate-pulse';
      case 'connected': return 'bg-primary';
      case 'disconnected': return 'bg-surface-variant';
      default: return 'bg-surface-variant';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-variant p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Audio Inputs</h3>
      
      <div className="space-y-3">
        {inputs.map((input) => (
          <div key={input.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-surface-variant">
            <div className="flex items-center space-x-3">
              <div className={getStatusColor(input.status)}>
                {getInputIcon(input.type)}
              </div>
              <div>
                <span className="text-sm font-medium">{input.name}</span>
                <p className="text-xs text-on-surface-variant">{input.description}</p>
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${getStatusDot(input.status)}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
