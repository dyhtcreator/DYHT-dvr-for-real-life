import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { recordings, settings, users } from '../shared/schema'
import { eq, desc, and, gte, like, sql } from 'drizzle-orm'

const connectionString = process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/dyht'
const client = postgres(connectionString)
const db = drizzle(client)

export const storage = {
  // PERSISTENT MEMORY: Store every interaction for learning
  async createRecording(data: {
    filename: string
    duration: number
    transcription?: string
    audioData?: string
    triggerType?: string
    triggerValue?: string
    confidence?: number
    metadata?: any
  }) {
    const [recording] = await db.insert(recordings).values({
      filename: data.filename,
      duration: data.duration,
      transcription: data.transcription,
      audioData: data.audioData,
      metadata: {
        triggerType: data.triggerType,
        triggerValue: data.triggerValue,
        confidence: data.confidence,
        timestamp: new Date(),
        analysisComplete: false,
        ...data.metadata
      }
    }).returning()
    
    // SELF-LEARNING: Analyze patterns in stored data
    await this.analyzeAndLearn(recording)
    
    return recording
  },

  // PERSISTENT MEMORY: Get conversation history for context
  async getRecentRecordings(limit: number = 50) {
    return await db.select().from(recordings)
      .orderBy(desc(recordings.timestamp))
      .limit(limit)
  },

  // PERSISTENT MEMORY: Get recordings with similar patterns for learning
  async getSimilarRecordings(triggerType: string, confidence: number) {
    return await db.select().from(recordings)
      .where(
        and(
          sql`${recordings.metadata}->>'triggerType' = ${triggerType}`,
          sql`CAST(${recordings.metadata}->>'confidence' AS FLOAT) >= ${confidence - 0.1}`
        )
      )
      .orderBy(desc(recordings.timestamp))
  },

  // SELF-LEARNING: Analyze patterns and improve detection
  async analyzeAndLearn(newRecording: any) {
    const recentRecordings = await this.getRecentRecordings(100)
    
    // Learn from transcription patterns
    const transcriptionPatterns = recentRecordings
      .filter(r => r.transcription)
      .map(r => r.transcription)
      .join(' ')
    
    // Analyze trigger frequency and accuracy
    const triggerPatterns = recentRecordings
      .filter(r => r.metadata?.triggerType)
      .reduce((acc, r) => {
        const trigger = r.metadata.triggerType
        acc[trigger] = {
          count: (acc[trigger]?.count || 0) + 1,
          avgConfidence: (acc[trigger]?.avgConfidence || 0) + (r.metadata.confidence || 0),
          lastSeen: r.timestamp
        }
        return acc
      }, {})
    
    // Calculate average confidence for each trigger
    Object.keys(triggerPatterns).forEach(trigger => {
      triggerPatterns[trigger].avgConfidence = triggerPatterns[trigger].avgConfidence / triggerPatterns[trigger].count
    })
    
    // Learn common words and phrases
    const commonWords = this.extractCommonWords(transcriptionPatterns)
    
    // Update learning database
    await this.updateLearningDatabase({
      patterns: transcriptionPatterns,
      triggers: triggerPatterns,
      commonWords,
      totalRecordings: recentRecordings.length,
      lastUpdated: new Date()
    })
    
    return { patterns: transcriptionPatterns, triggers: triggerPatterns, commonWords }
  },

  // SELF-LEARNING: Extract common words for wake word detection
  extractCommonWords(text: string) {
    const words = text.toLowerCase().split(/\s+/)
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {})
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .map(([word, count]) => ({ word, count }))
  },

  // SELF-LEARNING: Store learned patterns for future use
  async updateLear