import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { 
  users, 
  recordings, 
  settings, 
  learningSessions, 
  systemLogs, 
  performanceMetrics 
} from '../shared/schema'

// PERSISTENT MEMORY: Database connection with retry logic
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/dyht'

let client: postgres.Sql
let db: ReturnType<typeof drizzle>

// SELF-FIXING: Database connection with automatic retry
async function createConnection(retries = 3): Promise<void> {
  try {
    console.log('🔌 Connecting to PostgreSQL database...')
    
    client = postgres(connectionString, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
      onnotice: () => {}, // Suppress notices
      transform: postgres.camel
    })
    
    db = drizzle(client)
    
    // Test connection
    await client`SELECT 1`
    console.log('✅ Database connected successfully')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    
    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts remaining)`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return createConnection(retries - 1)
    }
    
    console.error('💥 Database connection failed after all retries')
    throw error
  }
}

// SELF-LEARNING: Initialize database schema and seed data
async function initializeDatabase(): Promise<void> {
  try {
    console.log('🏗️  Initializing database schema...')
    
    // Create tables if they don't exist
    await createTables()
    
    // PERSISTENT MEMORY: Create default user and settings
    await createDefaultUser()
    
    // SELF-LEARNING: Initialize system settings with learning defaults
    await initializeSystemSettings()
    
    // SELF-FIXING: Set up system monitoring
    await initializeSystemMonitoring()
    
    console.log('✅ Database initialization complete')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

// Create all tables
async function createTables(): Promise<void> {
  try {
    // Check if tables exist and create if they don't
    const tableChecks = await Promise.allSettled([
      client`SELECT to_regclass('users')`,
      client`SELECT to_regclass('recordings')`,
      client`SELECT to_regclass('settings')`,
      client`SELECT to_regclass('learning_sessions')`,
      client`SELECT to_regclass('system_logs')`,
      client`SELECT to_regclass('performance_metrics')`
    ])
    
    console.log('📊 Table status check complete')
    
    // Create missing tables (This is a simplified approach - in production, use migrations)
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        last_active TIMESTAMP DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `
    
    await client`
      CREATE TABLE IF NOT EXISTS recordings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        filename TEXT NOT NULL,
        duration REAL NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        audio_data TEXT,
        transcription TEXT,
        classification JSONB DEFAULT '{}'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb
      )
    `
    
    await client`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) UNIQUE,
        buffer_duration INTEGER DEFAULT 30,
        auto_record BOOLEAN DEFAULT FALSE,
        sensitivity INTEGER DEFAULT 50,
        trigger_words JSONB DEFAULT '{}'::jsonb,
        metadata JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `
    
    await client`
      CREATE TABLE IF NOT EXISTS learning_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        session_start TIMESTAMP DEFAULT NOW(),
        session_end TIMESTAMP,
        recordings_processed INTEGER DEFAULT 0,
        patterns_learned INTEGER DEFAULT 0,
        improvement_score REAL DEFAULT 0,
        session_data JSONB DEFAULT '{}'::jsonb
      )
    `
    
    await client`
      CREATE TABLE IF NOT EXISTS system_logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT NOW(),
        log_level VARCHAR(20) NOT NULL,
        category VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        log_data JSONB DEFAULT '{}'::jsonb
      )
    `
    
    await client`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT NOW(),
        average_processing_time REAL DEFAULT 0,
        transcription_accuracy REAL DEFAULT 0,
        classification_accuracy REAL DEFAULT 0,
        memory_usage REAL DEFAULT 0,
        cpu_usage REAL DEFAULT 0,
        disk_usage REAL DEFAULT 0,
        learning_rate REAL DEFAULT 0,
        pattern_recognition_rate REAL DEFAULT 0,
        self_fixing_success_rate REAL DEFAULT 0,
        audio_quality_score REAL DEFAULT 0,
        false_positive_rate REAL DEFAULT 0,
        false_negative_rate REAL DEFAULT 0,
        metrics_data JSONB DEFAULT '{}'::jsonb
      )
    `
    
    // Create indexes for performance
    await client`CREATE INDEX IF NOT EXISTS idx_recordings_timestamp ON recordings(timestamp DESC)`
    await client`CREATE INDEX IF NOT EXISTS idx_recordings_user_id ON recordings(user_id)`
    await client`CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp DESC)`
    await client`CREATE INDEX IF NOT EXISTS idx_system_logs_category ON system_logs(category)`
    await client`CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp DESC)`
    
    console.log('✅ Database tables created successfully')
    
  } catch (error) {
    console.error('❌ Table creation failed:', error)
    throw error
  }
}

// PERSISTENT MEMORY: Create default user
async function createDefaultUser(): Promise<void> {
  try {
    const existingUser = await client`SELECT id FROM users WHERE email = 'dyht@system.local' LIMIT 1`
    
    if (existingUser.length === 0) {
      await client`
        INSERT INTO users (email, name, metadata) 
        VALUES (
          'dyht@system.local', 
          'DYHT System User',
          '{"role": "system", "created_by": "initialization", "version": "1.0"}'::jsonb
        )
      `
      console.log('👤 Default system user created')
    }
  } catch (error) {
    console.error('❌ Failed to create default user:', error)
  }
}

// SELF-LEARNING: Initialize system settings with learning capabilities
async function initializeSystemSettings(): Promise<void> {
  try {
    const existingSettings = await client`SELECT id FROM settings WHERE user_id = 1 LIMIT 1`
    
    if (existingSettings.length === 0) {
      await client`
        INSERT INTO settings (user_id, buffer_duration, auto_record, sensitivity, trigger_words, metadata)
        VALUES (
          1,
          30,
          false,
          50,
          '{}'::jsonb,
          '{
            "learningPatterns": "",
            "commonWords": [],
            "frequentPhrases": [],
            "triggerHistory": {},
            "triggerAccuracy": {},
            "falsePositiveRate": 0,
            "systemHealth": {
              "database": true,
              "recordings": 0,
              "corruptedRecordings": 0,
              "lastCheck": null,
              "issues": []
            },
            "totalRecordings": 0,
            "totalTranscriptions": 0,
            "averageConfidence": 0,
            "processingSpeed": 0,
            "lastLearningUpdate": null,
            "learningIterations": 0,
            "improvementRate": 0,
            "whisperVersion": "1.0",
            "yamnetVersion": "1.0",
            "lastModelUpdate": null,
            "preferredTriggers": [],
            "ignoredSounds": [],
            "customPatterns": [],
            "fixHistory": [],
            "lastSelfDiagnosis": null,
            "autoFixEnabled": true,
            "audioQualityThreshold": 0.7,
            "noiseReductionLevel": 0.5,
            "contextWindowSize": 10,
            "useHistoricalContext": true,
            "phantomModeEnabled": false,
            "stealthModeEnabled": false,
            "ghostHuntingModeEnabled": false
          }'::jsonb
        )
      `
      console.log('⚙️  System settings initialized with learning capabilities')
    }
  } catch (error) {
    console.error('❌ Failed to initialize system settings:', error)
  }
}

// SELF-FIXING: Initialize system monitoring
async function initializeSystemMonitoring(): Promise<void> {
  try {
    // Log system startup
    await client`
      INSERT INTO system_logs (log_level, category, message, log_data)
      VALUES (
        'info',
        'system',
        'DYHT system initialized',
        '{
          "version": "1.0",
          "features": ["persistent_memory", "self_learning", "self_fixing"],
          "timestamp": "${new Date().toISOString()}",
          "node_version": "${process.version}",
          "platform": "${process.platform}"
        }'::jsonb
      )
    `
    
    // Initialize performance metrics
    await client`
      INSERT INTO performance_metrics (
        average_processing_time,
        transcription_accuracy,
        classification_accuracy,
        learning_rate,
        pattern_recognition_rate,
        self_fixing_success_rate,
        metrics_data
      )
      VALUES (
        0,
        0,
        0,
        0,
        0,
        0,
        '{
          "initialization": true,
          "baseline_established": "${new Date().toISOString()}",
          "system_ready": true
        }'::jsonb
      )
    `
    
    console.log('📊 System monitoring initialized')
    
  } catch (error) {
    console.error('❌ Failed to initialize system monitoring:', error)
  }
}

// SELF-FIXING: Database health check
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await client`SELECT 1`
    return true
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return false
  }
}

// SELF-FIXING: Database cleanup and optimization
async function optimizeDatabase(): Promise<void> {
  try {
    console.log('🧹 Running database optimization...')
    
    // Clean up old system logs (keep last 1000)
    await client`
      DELETE FROM system_logs 
      WHERE id NOT IN (
        SELECT id FROM system_logs 
        ORDER BY timestamp DESC 
        LIMIT 1000
      )
    `
    
    // Clean up old performance metrics (keep last 500)
    await client`
      DELETE FROM performance_metrics 
      WHERE id NOT IN (
        SELECT id FROM performance_metrics 
        ORDER BY timestamp DESC 
        LIMIT 500
      )
    `
    
    // Analyze tables for better performance
    await client`ANALYZE users, recordings, settings, learning_sessions, system_logs, performance_metrics`
    
    console.log('✅ Database optimization complete')
    
  } catch (error) {
    console.error('❌ Database optimization failed:', error)
  }
}

// SELF-FIXING: Close database connection gracefully
async function closeConnection(): Promise<void> {
  try {
    if (client) {
      await client.end()
      console.log('🔌 Database connection closed')
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error)
  }
}

// Initialize database connection
createConnection().then(() => {
  initializeDatabase().catch(error => {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  })
}).catch(error => {
  console.error('❌ Database connection failed:', error)
  process.exit(1)
})

// Export database instance and utilities
export { 
  db, 
  client, 
  checkDatabaseHealth, 
  optimizeDatabase, 
  closeConnection,
  initializeDatabase 
}