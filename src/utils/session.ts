import CryptoJS from 'crypto-js';

// Frontend-only "backup/restore": the user's tracker data is bundled, encrypted,
// and copied to / pasted from the clipboard. No backend involved.
const SECRET_KEY = 'mySecretKey';
const TRACKER_KEYS = [
  'trackerConfig',
  'dayLog',
  'sobriety',
  'prescriptions',
  'medicationLog',
  'symptoms',
  'cycles',
];

/** Encrypt all tracker data into the clipboard as a single portable string. */
export const encryptLocalStorage = async (): Promise<void> => {
  const bundle: Record<string, string> = {};
  TRACKER_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) bundle[key] = value;
  });

  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(bundle),
    SECRET_KEY,
  ).toString();

  try {
    await navigator.clipboard.writeText(ciphertext);
  } catch (err) {
    console.error('Failed to copy backup to clipboard: ', err);
  }
};

/** Restore tracker data from an encrypted backup string. Returns success. */
export const decryptLocalStorage = (encryptedData: string): boolean => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const json = bytes.toString(CryptoJS.enc.Utf8);
    const bundle = JSON.parse(json) as Record<string, string>;

    if (!bundle || typeof bundle !== 'object') return false;

    Object.entries(bundle).forEach(([key, value]) => {
      if (TRACKER_KEYS.includes(key) && typeof value === 'string') {
        localStorage.setItem(key, value);
      }
    });
    return true;
  } catch (err) {
    console.error('Failed to restore backup: ', err);
    return false;
  }
};
