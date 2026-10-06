export function getDriveDirectLink(url) {
  if (!url) return '';
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }
  return url;
}

export function isValidDriveUrl(url) {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}