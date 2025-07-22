import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AudioVisualizerProps {
  audioLevel: number
  isRecording: boolean
}

export function AudioVisualizer({ audioLevel, isRecording }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw waveform
      ctx.strokeStyle = isRecording ? '#10b981' : '#6b7280'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const centerY = canvas.height / 2
      const amplitude = (audioLevel / 255) * (canvas.height / 2)
      
      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + Math.sin(x * 0.05 + Date.now() * 0.01) * amplitude
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.stroke()
      
      // Draw level meter
      ctx.fillStyle = isRecording ? '#10b981' : '#6b7280'
      const levelHeight = (audioLevel / 255) * canvas.height
      ctx.fillRect(canvas.width - 20, canvas.height - levelHeight, 15, levelHeight)
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [audioLevel, isRecording])

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Audio Visualizer</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="w-full bg-gray-900 rounded"
        />
        <div className="mt-2 text-sm text-gray-400">
          Level: {Math.round(audioLevel)} | Status: {isRecording ? 'Recording' : 'Idle'}
        </div>
      </CardContent>
    </Card>
  )
}