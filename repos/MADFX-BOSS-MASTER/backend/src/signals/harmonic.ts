export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface HarmonicPattern {
  type: 'Gartley' | 'Butterfly' | 'Bat' | 'Crab' | 'Shark';
  direction: 'bullish' | 'bearish';
  points: {
    X: { index: number; price: number };
    A: { index: number; price: number };
    B: { index: number; price: number };
    C: { index: number; price: number };
    D: { index: number; price: number };
  };
  ratios: {
    XAB: number;
    ABC: number;
    BCD: number;
    XAD: number;
  };
  prz: {
    min: number;
    max: number;
  };
}

interface RatioRange {
  min: number;
  max: number;
}

const PATTERN_CONFIGS = {
  Gartley: {
    B: { min: 0.618, max: 0.618 }, // Strict 0.618 often used, but range 0.618-0.618 is too tight
    B_Range: { min: 0.618, max: 0.618 }, 
    XAB: { min: 0.618, max: 0.618 },
    ABC: { min: 0.382, max: 0.886 },
    BCD: { min: 0.382, max: 0.886 },
    XAD: { min: 0.786, max: 0.786 },
  },
  // Overriding with more realistic ranges for detection
};

// More flexible ratio sets based on standard harmonic trading rules
const RATIOS = {
  Gartley: {
    B: { min: 0.618, max: 0.618 }, // Standard 0.618
    C: { min: 0.382, max: 0.886 }, 
    D: { min: 0.786, max: 0.786 }, // XAD
  },
  Bat: {
    B: { min: 0.382, max: 0.500 },
    C: { min: 0.382, max: 0.886 },
    D: { min: 0.886, max: 0.886 }, // XAD
  },
  Butterfly: {
    B: { min: 0.786, max: 0.786 },
    C: { min: 0.382, max: 0.886 },
    D: { min: 1.27, max: 1.618 }, // XAD extension
  },
  Crab: {
    B: { min: 0.382, max: 0.618 },
    C: { min: 0.382, max: 0.886 },
    D: { min: 1.618, max: 1.618 }, // XAD extension
  },
  Shark: {
    // Shark is slightly different (XOC pattern)
    // 0.886 - 1.13 for XA correction
    // C is usually 1.618 - 2.24 of AB
  }
};

/**
 * Simplified zigzag to find peaks and troughs
 */
function getZigZag(candles: Candle[], depth: number = 5) {
  const points: { index: number; price: number; type: 'high' | 'low' }[] = [];
  let lastPoint = { index: 0, price: candles[0].close, type: 'unknown' as any };

  for (let i = depth; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;

    if (lastPoint.type !== 'high' && high > Math.max(...candles.slice(i - depth, i).map(c => c.high))) {
      points.push({ index: i, price: high, type: 'high' });
      lastPoint = { index: i, price: high, type: 'high' };
    } else if (lastPoint.type !== 'low' && low < Math.min(...candles.slice(i - depth, i).map(c => c.low))) {
      points.push({ index: i, price: low, type: 'low' });
      lastPoint = { index: i, price: low, type: 'low' };
    }
  }
  return points;
}

function calculateRatio(p1: number, p2: number, p3: number): number {
  const leg1 = Math.abs(p1 - p2);
  const leg2 = Math.abs(p2 - p3);
  return leg1 === 0 ? 0 : leg2 / leg1;
}

function isWithin(val: number, range: RatioRange, tolerance = 0.05): boolean {
  return val >= range.min - tolerance && val <= range.max + tolerance;
}

export function detectHarmonicPattern(candles: Candle[]): HarmonicPattern | null {
  if (candles.length < 20) return null;

  const zigzag = getZigZag(candles);
  if (zigzag.length < 5) return null;

  // We analyze the last 5 points as potential X, A, B, C, D
  const points = zigzag.slice(-5);
  const X = points[0].price;
  const A = points[1].price;
  const B = points[2].price;
  const C = points[3].price;
  const D = points[4].price;

  const direction = (X < A && B < A && C > B && D < C) ? 'bullish' : 
                    (X > A && B > A && C < B && D > C) ? 'bearish' : null;

  if (!direction) return null;

  const ratioXAB = calculateRatio(X, A, B);
  const ratioABC = calculateRatio(A, B, C);
  const ratioBCD = calculateRatio(B, C, D);
  const ratioXAD = calculateRatio(X, A, D);

  const currentRatios = { XAB: ratioXAB, ABC: ratioABC, BCD: ratioBCD, XAD: ratioXAD };

  // Validation logic for different patterns
  const patterns: (keyof typeof RATIOS)[] = ['Gartley', 'Bat', 'Butterfly', 'Crab'];
  
  for (const type of patterns) {
    const config = RATIOS[type];
    if (isWithin(ratioXAB, config.B) && isWithin(ratioABC, config.C) && isWithin(ratioXAD, config.D)) {
      
      // PRZ (Potential Reversal Zone) Calculation
      // PRZ is usually a confluence of XAD ratio and BCD ratio
      const przMin = Math.min(D, D * (1 - 0.02)); // Simplification: +/- 2% around D
      const przMax = Math.max(D, D * (1 + 0.02));

      return {
        type,
        direction,
        points: {
          X: { index: points[0].index, price: X },
          A: { index: points[1].index, price: A },
          B: { index: points[2].index, price: B },
          C: { index: points[3].index, price: C },
          D: { index: points[4].index, price: D },
        },
        ratios: currentRatios,
        prz: { min: przMin, max: przMax }
      };
    }
  }

  // Shark detection (Simplified: 0.886-1.13 XA, then C extension)
  if (isWithin(ratioXAB, { min: 0.886, max: 1.13 }) && ratioABC > 1.618) {
     return {
        type: 'Shark',
        direction,
        points: {
          X: { index: points[0].index, price: X },
          A: { index: points[1].index, price: A },
          B: { index: points[2].index, price: B },
          C: { index: points[3].index, price: C },
          D: { index: points[4].index, price: D },
        },
        ratios: currentRatios,
        prz: { min: D * 0.98, max: D * 1.02 }
     } as any;
  }

  return null;
}
