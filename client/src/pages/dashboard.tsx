import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { AudioVisualizer } from '@/components/audio-visualizer'
import { RecordingControls } from '@/components/recording-controls'
import { AlertsPanel } from '@/components/alerts-panel'
import { useAudio } from '@/hooks/use-audio'
import { useWebSocket } from '@/hooks/use-websocket'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isRecording, audioLevel, startRecording, stopRecording, bufferDuration, setBufferDuration } = useAudio()
  const { isConnected, sendMessage } = useWebSocket('ws://localhost:3001/ws')

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">DYHT - Did You Hear That</h1>
          <div className="text-sm text-gray-400">
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </header>

        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <RecordingControls
              isRecording={isRecording}
              onStart={startRecording}
              onStop={stopRecording}
              bufferDuration={bufferDuration}
              onBufferChange={setBufferDuration}
            />
            
            <AudioVisualizer
              audioLevel={audioLevel}
              isRecording={isRecording}
            />
          </div>
          
          <div>
            <AlertsPanel />
          </div>
        </main>
      </div>
    </div>
  )
}