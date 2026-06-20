export interface MLFeatures {
  followerFollowingRatio: number;
  bioLength: number;
  hasProfilePic: number;
  logPosts: number;
  logFollowers: number;
  numericUsernameRatio: number;
  isNumericUsername: number;
  fullNameWords: number;
  externalUrlPresent: number;
}

export function computeMLFraudScore(features: MLFeatures): number {
  const coefficients = {
    followerFollowingRatio: -0.0179,
    bioLength: -0.0034,
    hasProfilePic: -3.5305,
    logPosts: -0.4968,
    logFollowers: -0.8702,
    numericUsernameRatio: 9.0458,
    isNumericUsername: 0.7652,
    fullNameWords: -0.3339,
    externalUrlPresent: -1.0814,
  };

  const intercept = 7.3925;

  const logOdds =
    intercept +
    features.followerFollowingRatio * coefficients.followerFollowingRatio +
    features.bioLength * coefficients.bioLength +
    features.hasProfilePic * coefficients.hasProfilePic +
    features.logPosts * coefficients.logPosts +
    features.logFollowers * coefficients.logFollowers +
    features.numericUsernameRatio * coefficients.numericUsernameRatio +
    features.isNumericUsername * coefficients.isNumericUsername +
    features.fullNameWords * coefficients.fullNameWords +
    features.externalUrlPresent * coefficients.externalUrlPresent;

  const probability = 1 / (1 + Math.exp(-logOdds));

  return Math.round(probability * 100);
}

export function computeMLFraudFromInstagram(
  followerCount: number,
  followingCount: number,
  bio: string,
  hasProfilePic: boolean,
  mediaCount: number,
  username: string,
  fullName: string,
  externalUrl: string | null,
): number {
  const numericChars = username ? (username.match(/\d/g) || []).length : 0;
  const usernameLen = username ? username.length : 1;

  const features: MLFeatures = {
    followerFollowingRatio:
      followingCount > 0 ? followerCount / followingCount : followerCount,
    bioLength: bio ? bio.length : 0,
    hasProfilePic: hasProfilePic ? 1 : 0,
    logPosts: Math.log(1 + Math.max(mediaCount, 0)),
    logFollowers: Math.log(1 + Math.max(followerCount, 0)),
    numericUsernameRatio: numericChars / usernameLen,
    isNumericUsername: /^\d+$/.test(username) ? 1 : 0,
    fullNameWords: fullName ? fullName.trim().split(/\s+/).length : 0,
    externalUrlPresent: externalUrl ? 1 : 0,
  };

  return computeMLFraudScore(features);
}

export function getMLFraudLabel(score: number): string {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}
