import type { Tweet, Candidate } from "../db/schema";

interface GrowthSignalResult {
  score: number;
  signals: string[];
}

export function scoreGrowthSignals(candidate: Candidate, tweets: Tweet[]): GrowthSignalResult {
  const signals: string[] = [];
  let rawScore = 0;

  // Follower sweet spot: 500-50K (big enough to matter, small enough to recruit)
  const followers = candidate.followerCount || 0;
  if (followers >= 500 && followers <= 50000) {
    rawScore += 30;
    signals.push(`Ideal follower range (${followers.toLocaleString()})`);
  } else if (followers >= 100 && followers < 500) {
    rawScore += 15;
    signals.push(`Growing audience (${followers.toLocaleString()})`);
  } else if (followers > 50000 && followers <= 200000) {
    rawScore += 20;
    signals.push(`Large audience (${followers.toLocaleString()})`);
  } else if (followers > 200000) {
    rawScore += 10;
    signals.push(`Very large audience — may be hard to recruit (${followers.toLocaleString()})`);
  } else {
    rawScore += 5;
    signals.push(`Small audience (${followers.toLocaleString()})`);
  }

  // Engagement trajectory — compare recent vs older tweet engagement
  if (tweets.length >= 4) {
    const sorted = [...tweets].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    const half = Math.floor(sorted.length / 2);
    const recentAvg = sorted.slice(0, half).reduce((s, t) => s + (t.likes || 0), 0) / half;
    const olderAvg = sorted.slice(half).reduce((s, t) => s + (t.likes || 0), 0) / (sorted.length - half);

    if (olderAvg > 0) {
      const growth = recentAvg / olderAvg;
      if (growth > 1.5) {
        rawScore += 30;
        signals.push(`Engagement trending up (${growth.toFixed(1)}x)`);
      } else if (growth > 0.8) {
        rawScore += 15;
        signals.push("Stable engagement");
      } else {
        rawScore += 5;
        signals.push("Engagement declining");
      }
    } else {
      rawScore += 10;
      signals.push("Limited historical data");
    }
  }

  // Recency — are they actively posting?
  if (tweets.length > 0) {
    const latestTweet = tweets.reduce((latest, t) => {
      const d = new Date(t.createdAt || 0).getTime();
      return d > latest ? d : latest;
    }, 0);
    const daysSinceLast = (Date.now() - latestTweet) / (1000 * 60 * 60 * 24);

    if (daysSinceLast < 3) {
      rawScore += 25;
      signals.push("Very active (posted in last 3 days)");
    } else if (daysSinceLast < 14) {
      rawScore += 15;
      signals.push("Active (posted in last 2 weeks)");
    } else if (daysSinceLast < 30) {
      rawScore += 8;
      signals.push("Somewhat active (posted in last month)");
    } else {
      rawScore += 2;
      signals.push("Inactive (no posts in 30+ days)");
    }
  }

  // Tweet volume
  const tweetCount = candidate.tweetCount || 0;
  if (tweetCount > 1000) {
    rawScore += 15;
    signals.push("Consistent poster");
  } else if (tweetCount > 200) {
    rawScore += 10;
    signals.push("Regular poster");
  }

  const score = Math.min(100, Math.round(rawScore));
  return { score, signals };
}
