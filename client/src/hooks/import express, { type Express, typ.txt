import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertRecordingSchema, insertSystemSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time audio streaming
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'audio_chunk':
            // Process audio chunk for AI analysis
            // Broadcast to other connected clients if needed
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'audio_data',
                  data: message.data,
                  timestamp: Date.now()
                }));
              }
            });
            break;

          case 'trigger_detected':
            // Handle trigger detection and save recording
            const recording = await storage.createRecording({
              filename: `trigger_${Date.now()}`,
              duration: message.duration || 0,
              triggerType: message.triggerType || 'unknown',
              triggerValue: message.triggerValue || '',
              confidence: message.confidence || 0,
              audioData: message.audioData || null,
              transcription: message.transcription || null
            });

            // Broadcast trigger notification to all clients
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'trigger_notification',
                  recording: recording,
                  timestamp: Date.now()
                }));
              }
            });
            break;

          case 'emergency_stop':
            // Handle emergency stop
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'emergency_stop_confirmed',
                  timestamp: Date.now()
                }));
              }
            });
            break;

          case 'buffer_duration_update':
            // Handle buffer duration changes
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'buffer_duration_changed',
                  duration: message.duration,
                  timestamp: Date.now()
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });

    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connection_confirmed',
      timestamp: Date.now()
    }));
  });

  // REST API Routes

  // Get all recordings
  app.get("/api/recordings", async (req: Request, res: Response) => {
    try {
      const recordings = await storage.getAllRecordings();
      res.json(recordings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recordings" });
    }
  });

  // Get specific recording
  app.get("/api/recordings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const recording = await storage.getRecording(id);
      
      if (!recording) {
        return res.status(404).json({ message: "Recording not found" });
      }
      
      res.json(recording);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recording" });
    }
  });

  // Create new recording
  app.post("/api/recordings", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRecordingSchema.parse(req.body);
      const recording = await storage.createRecording(validatedData);
      res.status(201).json(recording);
    } catch (error) {
      res.status(400).json({ message: "Invalid recording data" });
    }
  });

  // Update recording
  app.patch("/api/recordings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      const recording = await storage.updateRecording(id, updates);
      if (!recording) {
        return res.status(404).json({ message: "Recording not found" });
      }
      
      res.json(recording);
    } catch (error) {
      res.status(500).json({ message: "Failed to update recording" });
    }
  });

  // Delete recording
  app.delete("/api/recordings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteRecording(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Recording not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recording" });
    }
  });

  // Get system settings
  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSystemSettings(1); // Default user for now
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update system settings
  app.patch("/api/settings", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const settings = await storage.updateSystemSettings(1, updates); // Default user for now
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Export recording as audio file
  app.get("/api/recordings/:id/export/:format", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const format = req.params.format; // 'wav' or 'mp3'
      
      const recording = await storage.getRecording(id);
      if (!recording) {
        return res.status(404).json({ message: "Recording not found" });
      }

      // Convert base64 audio data to buffer
      if (!recording.audioData) {
        return res.status(400).json({ message: "No audio data found" });
      }
      const audioBuffer = Buffer.from(recording.audioData, 'base64');
      
      const contentType = format === 'mp3' ? 'audio/mpeg' : 'audio/wav';
      const filename = `${recording.filename}.${format}`;
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(audioBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to export recording" });
    }
  });

  return httpServer;
}