import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Square, AlertTriangle } from 'lucide-react'

interface RecordingControlsProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  bufferDuration: number
  onBufferChange: (value: number) => void
}

export function RecordingControls({ 
  isRecording, 
  onStart, 
  onStop, 
  bufferDuration, 
  onBufferChange 
}: RecordingControlsProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recording Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button
            onClick={isRecording ? onStop : onStart}
            className={`flex-1 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Recording