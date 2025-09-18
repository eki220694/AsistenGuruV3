const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const validator = require('validator');
const express = require('express');
// Note: csurf is deprecated, but we'll use it for now as a temporary measure
// A better long-term solution would be to use double-submit cookies or header-based approaches
const csrf = require('csurf');
const logger = require('./logger');

const setupSecurity = (app) => {
  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }
  // Basic security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "https://picsum.photos"],
        connectSrc: ["'self'", "https://api.gemini.com"], // Add your API endpoints
      },
    },
    crossOriginEmbedderPolicy: false, // Needed for some Google services
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    // Additional helmet protections
    noSniff: true,
    ieNoOpen: true,
    hidePoweredBy: true,
    xssFilter: true
  }));

  // CORS configuration
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : ['http://localhost:3000', 'http://localhost:5173']; // Development

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['x-csrf-token']
  }));

  // Rate limiting with different rules for different endpoints
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: { error: 'Too many authentication attempts, try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for API endpoints
    message: { error: 'API rate limit exceeded' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiters
  app.use('/api/', generalLimiter);
  app.use('/api/auth/', authLimiter);
  app.use('/api/auth/google', authLimiter); // Specific limiter for Google login
  app.use('/api/v1/', apiLimiter);

  // Data sanitization and parsing
  app.use(mongoSanitize({
    replaceWith: '_' // Replace prohibited characters with underscore
  }));
  
  app.use(compression());
  
  // Body parsing with size limits
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch(e) {
        throw new Error('Invalid JSON');
      }
    }
  }));
  
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
  }));

  // Input validation middleware
  const validateInput = (req, res, next) => {
    // Sanitize string inputs
    const sanitizeObject = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = validator.escape(obj[key].trim());
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };

    if (req.body && typeof req.body === 'object') {
      sanitizeObject(req.body);
    }
    
    if (req.query && typeof req.query === 'object') {
      sanitizeObject(req.query);
    }

    next();
  };

  // Apply input validation to all API routes
  app.use('/api/', validateInput);
  
  // Additional validation for specific routes can be added here
  // For example, validating request bodies for auth endpoints
  app.use('/api/auth/', (req, res, next) => {
    // Specific validation for auth routes
    if (req.path === '/google' && req.method === 'POST') {
      if (!req.body.tokenId) {
        return res.status(400).json({
          error: 'tokenId is required',
          timestamp: new Date().toISOString()
        });
      }
      
      // Validate tokenId format (should be a string)
      if (typeof req.body.tokenId !== 'string') {
        return res.status(400).json({
          error: 'Invalid tokenId format',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    next();
  });

  // Security headers middleware
  app.use((req, res, next) => {
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    // Add custom security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    next();
  });

  // Setup CSRF protection
  // Note: This is a temporary implementation using the deprecated csurf package
  // For production, consider implementing a more modern approach
  const csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }
  });
  
  // Apply CSRF protection to web routes (if any)
  // For API routes, CSRF protection is typically handled differently
  // We'll apply it selectively to routes that need it
  // app.use(csrfProtection); // Uncomment this line to enable CSRF protection

  // Error handling middleware
  app.use((error, req, res, next) => {
    // Log the error with Winston
    logger.error('Security Error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
      referer: req.get('Referer')
    });

    // Don't expose error details in production
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : error.message;

    res.status(error.status || 500).json({
      error: message,
      timestamp: new Date().toISOString()
    });
  });

  // 404 handler for API routes only
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'API endpoint not found',
      timestamp: new Date().toISOString()
    });
  });

  console.log('✅ Security middleware configured');
};

// JWT Security utilities
const jwtSecurity = {
  generateSecureToken: () => {
    return require('crypto').randomBytes(64).toString('hex');
  },
  
  validateJWTSecret: (secret) => {
    return secret && secret.length >= 32;
  },
  
  getJWTOptions: () => ({
    expiresIn: process.env.JWT_EXPIRY || '15m',
    issuer: process.env.APP_NAME || 'AsistenGuruV3',
    audience: process.env.APP_DOMAIN || 'localhost',
    algorithm: 'HS256'
  })
};

// Database security
const dbSecurity = {
  getSecureMongoOptions: () => ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
    ssl: process.env.NODE_ENV === 'production',
    authMechanism: 'SCRAM-SHA-256',
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    // Additional security options
    retryWrites: true,
    readPreference: 'primary',
    // Enable compression for better performance
    compressors: ['snappy', 'zlib']
  }),
  
  validateMongoURI: (uri) => {
    // In production, ensure we're using a secure connection
    if (process.env.NODE_ENV === 'production') {
      return uri && 
             uri.includes('mongodb+srv://') &&  // Use SRV record for Atlas
             !uri.includes('localhost') && 
             uri.includes('@') &&
             !uri.includes('test'); // Don't allow test databases in production
    }
    
    // In development, allow localhost connections
    return uri && (uri.includes('mongodb://localhost') || uri.includes('mongodb+srv://'));
  }
};

// Production readiness checker
const productionChecker = {
  checkEnvironment: () => {
    const required = [
      'NODE_ENV',
      'PORT',
      'MONGODB_URI', 
      'JWT_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (!jwtSecurity.validateJWTSecret(process.env.JWT_SECRET)) {
      throw new Error('JWT_SECRET must be at least 32 characters long');
    }

    if (process.env.NODE_ENV === 'production' && !dbSecurity.validateMongoURI(process.env.MONGODB_URI)) {
      throw new Error('Production MongoDB URI must be remote and authenticated');
    }

    console.log('✅ Environment validation passed');
  }
};

module.exports = {
  setupSecurity,
  jwtSecurity,
  dbSecurity,
  productionChecker
};