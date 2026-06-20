export interface MLFeatures {
  followerFollowingRatio: number;
  bioLength: number;
  hasProfilePic: number;
  postCount: number;
  usernameLength: number;
  isNumericUsername: number;
  fullNameWords: number;
  externalUrlPresent: number;
}

export function computeMLFraudScore(features: MLFeatures): number {
  const coefficients = {
    followerFollowingRatio: -0.421,
    bioLength: 0.089,
    hasProfilePic: -0.312,
    postCount: -0.185,
    usernameLength: 0.146,
    isNumericUsername: 0.523,
    fullNameWords: -0.098,
    externalUrlPresent: -0.201,
  };

  const intercept = -0.873;

  const logOdds =
    intercept +
    features.followerFollowingRatio * coefficients.followerFollowingRatio +
    features.bioLength * coefficients.bioLength +
    features.hasProfilePic * coefficients.hasProfilePic +
    features.postCount * coefficients.postCount +
    features.usernameLength * coefficients.usernameLength +
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
  const features: MLFeatures = {
    followerFollowingRatio:
      followingCount > 0 ? followerCount / followingCount : followerCount,
    bioLength: bio ? bio.length : 0,
    hasProfilePic: hasProfilePic ? 1 : 0,
    postCount: Math.min(mediaCount, 5000),
    usernameLength: username ? username.length : 0,
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
