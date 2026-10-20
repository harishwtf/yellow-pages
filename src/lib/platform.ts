/** Android phones and tablets get Google Play links; everything else (iPhone, iPad, desktop browsers) the App Store. */
export const IS_ANDROID = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
