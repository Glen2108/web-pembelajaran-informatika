/**
 * Memeriksa apakah URL yang dimasukkan merupakan tautan Google Drive yang valid
 */
export const isValidDriveUrl = (url) => {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

/**
 * Mengonversi URL Google Drive biasa menjadi direktori tautan unduh/pratinjau langsung
 */
export const getDriveDirectLink = (url) => {
  if (!url) return '#';

  // Jika sudah tautan eksternal biasa atau bukan Google Drive, kembalikan langsung
  if (!url.includes('drive.google.com')) return url;

  // Ekstraksi File ID dari berbagai format URL Google Drive
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const fileId = match[1];
    // Mengembalikan URL pratinjau langsung Google Drive
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  return url;
};