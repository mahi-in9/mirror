const generateFingerprint = () => {
  const nav = window.navigator;
  const screen = window.screen;
  const parts = [
    nav.userAgent,
    nav.language,
    screen.colorDepth,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    nav.hardwareConcurrency || '',
    nav.platform || '',
  ];
  const raw = parts.join('|');
  // Simple hash
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const char = raw.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export const getFingerprint = () => {
  let fp = sessionStorage.getItem('mirror_fp');
  if (!fp) {
    fp = generateFingerprint() + '_' + Date.now().toString(36);
    sessionStorage.setItem('mirror_fp', fp);
  }
  return fp;
};
