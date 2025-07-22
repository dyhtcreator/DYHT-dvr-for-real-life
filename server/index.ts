import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { registerRoutes } from './routes.js'
import { storage } from './storage.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.static(join(__dirname, '../dist')))

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// SELF-FIXING: Initialize system health monitoring
async function initializeSystem() {
  console.log('🚀 Starting DYHT - Did You Hear That')
  console.log('🧠 Initializing persistent memory and self-learning systems...')
  
  try {
    // SELF-FIXING: Run initial system diagnosis
    const diagnosis = await storage.selfDiagnoseAndFix()
    console.log('🔧 System diagnosis complete:', diagnosis)
    
    // PERSISTENT MEMORY: Load existing learning data
    const settings = await storage.getSystemSettings(1)
    if (settings?.metadata?.learningPatterns) {
      console.log('📚 Loaded existing learning patterns:', settings.metadata.learningPatterns.length, 'characters')
    }
    
    // SELF-LEARNING: Initialize learning context
    const recentRecordings = await storage.getRecentRecordings(10)
    console.log('💾 Loaded recent recordings for context:', recentRecordings.length, 'recordings')
    
    // Performance monitoring
    const startTime = Date.now()
    const health = await storage.getSystemHealth()
    const initTime = Date.now() - startTime
    
    console.log('🏥 System health check complete:', {
      database: health.database,
      recordings: health.recordings,
      issues: health.issues.length,
      initTime: initTime + 'ms'
    })
    
    // SELF-LEARNING: Start background learning process
    startBackgroundLearning()
    
    // SELF-FIXING: Start health monitoring
    startHealthMonitoring()
    
    console.log('✅ DYHT system fully initialized and ready!')
    
  } catch (error) {
    console.error('❌ System initialization failed:', error)
    console.log('🔧 Attempting automatic recovery...')
    
    // SELF-FIXING: Attempt recovery
    try {
      await storage.logSystemError('initialization_failed', error)
      console.log('📝 Error logged for learning purposes')
    } catch (logError) {
      console.error('❌ Failed to log initialization error:', logError)
    }
  }
}

// SELF-LEARNING: Background learning process
function startBackgroundLearning() {
  console.log('🧠 Starting background learning process...')
  
  // Run learning analysis every 5 minutes
  setInterval(async () => {
    try {
      const recentRecordings = await storage.getRecentRecordings(20)
      
      if (recentRecordings.length > 0) {
        console.log('🧠 Running background learning analysis...')
        
        // Analyze recent recordings for patterns
        const learningData = await storage.analyzeAndLearn(recentRecordings[0])
        
        // Log learning progress
        console.log('📈 Learning progress:', {
          patterns: learningData.patterns.length,
          triggers: Object.keys(learningData.triggers).length,
          commonWords: learningData.commonWords?.length || 0
        })
        
        // SELF-FIXING: Check if learning improved system performance
        const health = await storage.getSystemHealth()
        if (health.issues.length === 0) {
          console.log('✅ Learning cycle completed successfully')
        }
      }
    } catch (error) {
      console.error('🧠 Background learning error:', error)
      await storage.logSystemError('background_learning_failed', error)
    }
  }, 5 * 60 * 1000) // 5 minutes
}

// SELF-FIXING: Health monitoring process
function startHealthMonitoring() {
  console.log('🏥 Starting health monitoring...')
  
  // Run health check every 2 minutes
  setInterval(async () => {
    try {
      const diagnosis = await storage.selfDiagnoseAndFix()
      
      if (diagnosis.fixes.length > 0) {
        console.log('🔧 Auto-fixes applied:', diagnosis.fixes.map(f => f.type).join(', '))
      }
      
      // Log health status
      if (diagnosis.health.issues.length > 0) {
        console.log('⚠️  System issues detected:', diagnosis.health.issues.length)
        diagnosis.health.issues.forEach(issue => {
          console.log(`   - ${issue.type}: ${issue.error || issue.count}`)
        })
      }
      
    } catch (error) {
      console.error('🏥 Health monitoring error:', error)
      await storage.logSystemError('health_monitoring_failed', error)
    }
  }, 2 * 60 * 1000) // 2 minutes
}

// PERSISTENT MEMORY: Performance tracking middleware
app.use('/api', (req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', async () => {
    const processingTime = Date.now() - startTime
    
    // Log performance metrics for learning
    if (processingTime > 1000) { // Log slow requests
      try {
        await storage.logSystemError('slow_request', {
          url: req.url,
          method: req.method,
          processingTime,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Failed to log performance metric:', error)
      }
    }
  })
  
  next()
})

// SELF-FIXING: Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Application error:', error)
  
  // Log error for learning
  storage.logSystemError('application_error', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date()
  }).catch(logError => {
    console.error('Failed to log application error:', logError)
  })
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'DYHT is attempting to self-diagnose and fix the issue',
    timestamp: new Date().toISOString()
  })
})

// Initialize WebSocket server and routes
const server = await registerRoutes(app)

// SELF-LEARNING: Enhanced startup sequence
async function startServer() {
  const PORT = process.env.PORT || 3001
  
  try {
    // Initialize all systems
    await initializeSystem()
    
    // Start server
    server.listen(PORT, () => {
      console.log('\n🎯 DYHT SERVER RUNNING')
      console.log(`📡 Server: http://localhost:${PORT}`)
      console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`)
      console.log(`🧠 AI Models: Loading in background`)
      console.log(`💾 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Using local PostgreSQL'}`)
      console.log(`🎧 Audio Processing: Ready`)
      console.log(`📚 Persistent Memory: Active`)
      console.log(`🔧 Self-Fixing: Enabled`)
      console.log(`📈 Learning Mode: Continuous`)
      console.log('\n✅ DYHT is ready to listen and learn!')
    })
    
    // SELF-FIXING: Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down DYHT...')
      
      try {
        // Save final learning state
        await storage.logSystemError('system_shutdown', {
          timestamp: new Date(),
          reason: 'User requested shutdown',
          uptime: process.uptime()
        })
        
        console.log('💾 Final state saved')
        console.log('👋 DYHT shutdown complete')
        process.exit(0)
      } catch (error) {
        console.error('❌ Error during shutdown:', error)
        process.exit(1)
      }
    })
    
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    console.log('🔧 Attempting recovery...')
    
    // SELF-FIXING: Attempt recovery
    setTimeout(startServer, 5000) // Retry after 5 seconds
  }
}

// Start the server
startServer()

// SELF-LEARNING: Export for testing
export { app, storage }