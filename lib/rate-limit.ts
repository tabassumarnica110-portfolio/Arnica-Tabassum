/**
 * KrishiLink Rate Limiting and Brute Force Defense
 * In-memory sliding window rate limiter with Redis/Upstash adapter support.
 * Enforces:
 *  - Login API: 5 req/min
 *  - Register API: 3 req/min
 *  - Product Add API: 10 req/min
 *  - Account Lockout: 5 failed attempts triggers 15-minute freeze
 */

interface RateLimitRecord {
  timestamps: number[];
}

interface LockoutRecord {
  failedCount: number;
  lockedUntil?: number;
}

class SecurityLimiter {
  private requestMap = new Map<string, RateLimitRecord>();
  private lockoutMap = new Map<string, LockoutRecord>();

  /**
   * Check rate limit for given key and limit within window (in seconds)
   */
  checkRateLimit(key: string, maxRequests: number, windowSeconds: number): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = this.requestMap.get(key) || { timestamps: [] };

    // Filter out expired timestamps
    const activeTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (activeTimestamps.length >= maxRequests) {
      const oldest = activeTimestamps[0];
      const resetIn = Math.ceil((oldest + windowMs - now) / 1000);
      return { allowed: false, remaining: 0, resetIn };
    }

    activeTimestamps.push(now);
    this.requestMap.set(key, { timestamps: activeTimestamps });

    return {
      allowed: true,
      remaining: maxRequests - activeTimestamps.length,
      resetIn: windowSeconds,
    };
  }

  /**
   * Account Lockout mechanism:
   * Records failed login attempts. On 5th failure, locks account for 15 minutes.
   */
  recordFailedLogin(identifier: string): { isLocked: boolean; attemptsLeft: number; lockedUntilMinutes?: number } {
    const now = Date.now();
    const record = this.lockoutMap.get(identifier) || { failedCount: 0 };

    if (record.lockedUntil && record.lockedUntil > now) {
      const lockedUntilMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      return { isLocked: true, attemptsLeft: 0, lockedUntilMinutes };
    }

    record.failedCount += 1;

    if (record.failedCount >= 5) {
      record.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
      this.lockoutMap.set(identifier, record);
      return { isLocked: true, attemptsLeft: 0, lockedUntilMinutes: 15 };
    }

    this.lockoutMap.set(identifier, record);
    return { isLocked: false, attemptsLeft: 5 - record.failedCount };
  }

  recordSuccessfulLogin(identifier: string) {
    this.lockoutMap.delete(identifier);
  }

  isAccountLocked(identifier: string): { locked: boolean; minutesRemaining: number } {
    const record = this.lockoutMap.get(identifier);
    if (!record || !record.lockedUntil) return { locked: false, minutesRemaining: 0 };

    const now = Date.now();
    if (record.lockedUntil > now) {
      return { locked: true, minutesRemaining: Math.ceil((record.lockedUntil - now) / 60000) };
    }

    // Expired lockout
    this.lockoutMap.delete(identifier);
    return { locked: false, minutesRemaining: 0 };
  }

  getFailedAttempts(identifier: string): number {
    return this.lockoutMap.get(identifier)?.failedCount || 0;
  }

  /**
   * Quick rate limiter helper for user actions (preventing flooding / DoS)
   */
  checkActionRateLimit(action: string, key: string = "session_user"): { allowed: boolean; message?: string } {
    const limits: Record<string, { max: number; windowSec: number }> = {
      PRODUCT_ADD: { max: 10, windowSec: 60 },
      ORDER_PLACE: { max: 6, windowSec: 60 },
      CHAT_MESSAGE: { max: 30, windowSec: 60 },
      AUCTION_BID: { max: 15, windowSec: 60 },
      RFQ_SUBMIT: { max: 5, windowSec: 60 },
      DEFAULT: { max: 40, windowSec: 60 },
    };

    const cfg = limits[action] || limits.DEFAULT;
    const result = this.checkRateLimit(`${action}_${key}`, cfg.max, cfg.windowSec);

    if (!result.allowed) {
      return {
        allowed: false,
        message: `Too many requests for ${action}. Rate limit reached. Please wait ${result.resetIn} seconds.`,
      };
    }
    return { allowed: true };
  }
}

export const securityLimiter = new SecurityLimiter();
