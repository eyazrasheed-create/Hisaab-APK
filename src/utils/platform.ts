/**
 * Utility functions for platform and APK runtime detection
 */

export const isAndroidApkHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'appassets.androidplatform.net';
};
