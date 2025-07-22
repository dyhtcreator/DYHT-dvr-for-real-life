interface AIModelsProps {
  whisperStatus: string;
  yamnetStatus: string;
  processingLoad: number;
}

export function AIModels({ whisperStatus, yamnetStatus, processingLoad }: AIModelsProps) {
  const models = [
    {
      name: 'Whisper AI',
      description: 'Speech transcription',
      status: whisperStatus,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      name: 'YAMNet',
      description: 'Sound classification',
      status: yamnetStatus,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      )
    },
    {
      name: 'TensorFlow.js',
      description: 'Local processing',
      status: 'Ready',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-success';
      case 'loaded': return 'text-success';
      case 'ready': return 'text-primary';
      case 'loading': return 'text-warning';
      case 'error': return 'text-emergency';
      default: return 'text-on-surface-variant';
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-variant p-6">
      <h3 className="text-lg font-semibold text-white mb-4">AI Processing</h3>
      
      <div className="space-y-3 mb-4">
        {models.map((model) => (
          <div key={model.name} className="flex items-center justify-between p-3 bg-background rounded-lg border border-surface-variant">
            <div className="flex items-center space-x-3">
              <div className={getStatusColor(model.status)}>
                {model.icon}
              </div>
              <div>
                <span className="text-sm font-medium">{model.name}</span>
                <p className="text-xs text-on-surface-variant">{model.description}</p>
              </div>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(model.status)}`}>
              {model.status}
            </span>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-background rounded-lg border border-surface-variant">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-on-surface-variant">Processing Load</span>
          <span className="text-xs font-mono text-on-surface">{processingLoad}%</span>
        </div>
        <div className="h-2 bg-surface-variant rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-success to-primary rounded-full transition-all duration-300" 
            style={{ width: `${processingLoad}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
