import rateLimit from 'express-rate-limit';

/**
 * General API rate limit — protects all routes from abuse.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

/**
 * Strict limiter for POST /cards/:id/run — this is the only endpoint that
 * costs real money/quota per call (PRD Section 10, NFR). Keyed by user id
 * (set by requireAuth, which always runs before this) rather than IP, so
 * one user can't dodge the limit by rotating networks.
 */
export const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
  message: {
    error: 'Generation limit reached (30/hour). Please wait before running more prompts.',
  },
});
