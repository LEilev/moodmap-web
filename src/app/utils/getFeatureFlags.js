// /app/utils/getFeatureFlags.js
/**
 * Enkelt feature-flag-oppsett for Sprint A.
 * Kan senere kobles til env/remote config uten å endre forbrukende kode.
 */
export function getFeatureFlags() {
  return {
    ff_coachMode: true,
    ff_missions: true,
    ff_scores: true,
    ff_badges: false,
  };
}
