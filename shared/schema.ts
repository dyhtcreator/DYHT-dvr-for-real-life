import { pgTable, serial, text, timestamp, integer, boolean, jsonb, real, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// USERS TABLE: Basic user management
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActive: timestamp('last_active').defaultNow(),
  metadata: jsonb('metadata').default({})
})

// RECORDINGS TABLE: Enhanced with learning capabilities
export const recordings = pgTable('recordings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  filename: text('filename').notNull(),
  duration: real('duration').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  
  // PERSISTENT MEMORY: Core audio data
  audioData: text('audio_data'),
  transcription: text('transcription'),
  
  // SELF-LEARNING: Classification and analysis results
  classification: jsonb('classification').default({}),
  
  // PERSISTENT MEMORY: Enhanced metadata with learning data
  metadata: jsonb('metadata').default({
    // Audio analysis
    audioLevel: 0,
    frequency: null,
    patterns: null,
    confidence: 0,
    
    // Trigger information
    triggerType: null,
    triggerValue: null,
    triggerConfidence: 0,
    
    // Learning data
    learningData: false,
    systemGenerated: false,
    analysisComplete: false,
    
    // Context information
    contextUsed: false,
    previousRecordingIds: [],
    
    // Self-fixing data
    errorCount: 0,
    lastErrorType: null,
    fixAttempts: 0,
    
    // Performance metrics
    processingTime: 0,
    modelVersion: '1.0',
    
    // User feedback
    userFeedback: null,
    correctionApplied: false,
    
    timestamp: null
  })
})

// SETTINGS TABLE: Enhanced with learning and self-fixing capabilities
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  
  // Basic settings
  bufferDuration: integer('buffer_duration').default(30),
  autoRecord: boolean('auto_record').default(false),
  sensitivity: integer('sensitivity').default(50),
  
  // PERSISTENT MEMORY: Learned trigger words and patterns
  triggerWords: jsonb('trigger_words').default({}),
  
  // SELF-LEARNING: Advanced learning metadata
  metadata: jsonb('metadata').default({
    // Learning patterns
    learningPatterns: '',
    commonWords: [],
    frequentPhrases: [],
    
    // Trigger analysis
    triggerHistory: {},
    triggerAccuracy: {},
    falsePositiveRate: 0,
    
    // System health and self-fixing
    systemHealth: {
      database: true,
      recordings: 0,
      corruptedRecordings: 0,
      lastCheck: null,
      issues: []
    },
    
    // Performance metrics
    totalRecordings: 0,
    totalTranscriptions: 0,
    averageConfidence: 0,
    processingSpeed: 0,
    
    // Learning progress
    lastLearningUpdate: null,
    learningIterations: 0,
    improvementRate: 0,
    
    // Model versions and updates
    whisperVersion: '1.0',
    yamnetVersion: '1.0',
    lastModelUpdate: null,
    
    // User preferences learned over time
    preferredTriggers: [],
    ignoredSounds: [],
    customPatterns: [],
    
    // Self-fixing history
    fixHistory: [],
    lastSelfDiagnosis: null,
    autoFixEnabled: true,
    
    // Audio quality metrics
    audioQualityThreshold: 0.7,
    noiseReductionLevel: 0.5,
    
    // Context awareness
    contextWindowSize: 10,
    useHistoricalContext: true,
    
    // Advanced features
    phantomModeEnabled: false,
    stealthModeEnabled: false,
    ghostHuntingModeEnabled: false
  }),
  
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
})

// LEARNING_SESSIONS TABLE: Track learning progress over time
export const learningSessions = pgTable('learning_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  sessionStart: timestamp('session_start').defaultNow(),
  sessionEnd: timestamp('session_end'),
  
  // Learning metrics
  recordingsProcessed: integer('recordings_processed').default(0),
  patternsLearned: integer('patterns_learned').default(0),
  improvementScore: real('improvement_score').default(0),
  
  // Session data
  sessionData: jsonb('session_data').default({
    beforeMetrics: {},
    afterMetrics: {},
    changesApplied: [],
    errorsCorrected: [],
    newPatterns: [],
    performanceGains: 0
  })
})

// SYSTEM_LOGS TABLE: Track system health and self-fixing
export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  logLevel: varchar('log_level', { length: 20 }).notNull(), // info, warning, error, fix
  category: varchar('category', { length: 50 }).notNull(), // database, audio, learning, fixing
  message: text('message').notNull(),
  
  // Detailed log data
  logData: jsonb('log_data').default({
    component: null,
    errorCode: null,
    stackTrace: null,
    fixApplied: false,
    fixResult: null,
    affectedRecordings: [],
    performanceImpact: 0
  })
})

// PERFORMANCE_METRICS TABLE: Track system performance over time
export const performanceMetrics = pgTable('performance_metrics', {
  id: serial('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow(),
  
  // Processing metrics
  averageProcessingTime: real('average_processing_time').default(0),
  transcriptionAccuracy: real('transcription_accuracy').default(0),
  classificationAccuracy: real('classification_accuracy').default(0),
  
  // System metrics
  memoryUsage: real('memory_usage').default(0),
  cpuUsage: real('cpu_usage').default(0),
  diskUsage: real('disk_usage').default(0),
  
  // Learning metrics
  learningRate: real('learning_rate').default(0),
  patternRecognitionRate: real('pattern_recognition_rate').default(0),
  selfFixingSuccessRate: real('self_fixing_success_rate').default(0),
  
  // Quality metrics
  audioQualityScore: real('audio_quality_score').default(0),
  falsePositiveRate: real('false_positive_rate').default(0),
  falseNegativeRate: real('false_negative_rate').default(0),
  
  metricsData: jsonb('metrics_data').default({})
})

// ZOD SCHEMAS for validation
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

export const insertRecordingSchema = createInsertSchema(recordings)
export const selectRecordingSchema = createSelectSchema(recordings)

export const insertSystemSettingsSchema = createInsertSchema(settings)
export const selectSystemSettingsSchema = createSelectSchema(settings)

export const insertLearningSessionSchema = createInsertSchema(learningSessions)
export const selectLearningSessionSchema = createSelectSchema(learningSessions)

export const insertSystemLogSchema = createInsertSchema(systemLogs)
export const selectSystemLogSchema = createSelectSchema(systemLogs)

export const insertPerformanceMetricsSchema = createInsertSchema(performanceMetrics)
export const selectPerformanceMetricsSchema = createSelectSchema(performanceMetrics)

// CUSTOM SCHEMAS for specific operations
export const learningDataSchema = z.object({
  patterns: z.string(),
  triggers: z.record(z.object({
    count: z.number(),
    avgConfidence: z.number(),
    lastSeen: z.date()
  })),
  commonWords: z.array(z.object({
    word: z.string(),
    count: z.number()
  })),
  totalRecordings: z.number(),
  lastUpdated: z.date()
})

export const systemHealthSchema = z.object({
  database: z.boolean(),
  recordings: z.number(),
  corruptedRecordings: z.number(),
  lastCheck: z.date(),
  issues: z.array(z.object({
    type: z.string(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    message: z.string().optional(),
    count: z.number().optional()
  }))
})

export const selfFixingResultSchema = z.object({
  health: systemHealthSchema,
  fixes: z.array(z.object({
    type: z.string(),
    description: z.string().optional(),
    count: z.number().optional(),
    success: z.boolean(),
    timestamp: z.date()
  })),
  timestamp: z.date()
})

// TYPE EXPORTS
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Recording = typeof recordings.$inferSelect
export type NewRecording = typeof recordings.$inferInsert
export type Settings = typeof settings.$inferSelect
export type NewSettings = typeof settings.$inferInsert
export type LearningSession = typeof learningSessions.$inferSelect
export type NewLearningSession = typeof learningSessions.$inferInsert
export type SystemLog = typeof systemLogs.$inferSelect
export type NewSystemLog = typeof systemLogs.$inferInsert
export type PerformanceMetrics = typeof performanceMetrics.$inferSelect
export type NewPerformanceMetrics = typeof performanceMetrics.$inferInsert

export type LearningData = z.infer<typeof learningDataSchema>
export type SystemHealth = z.infer<typeof systemHealthSchema>
export type SelfFixingResult = z.infer<typeof selfFixingResultSchema>