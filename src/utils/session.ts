import CryptoJS from 'crypto-js';

// const SECRET_KEY = process.env.SECRET_KEY as string;

const SECRET_KEY = 'mySecretKey';

export const encryptLocalStorage = async (): Promise<void> => {
  const data = localStorage.getItem('data');
  if (!data) {
    await navigator.clipboard.writeText('No data available');
  } else {
    const ciphertext = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    try {
      await navigator.clipboard.writeText(ciphertext);
      console.log('Encrypted data copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }
};

export const decryptLocalStorage = (encryptedData: string): boolean => {
  console.log(SECRET_KEY);
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  const originalData = bytes.toString(CryptoJS.enc.Utf8);

  try {
    // Try to parse the decrypted data as JSON
    JSON.parse(originalData);

    // If no error is thrown, the data is valid JSON
    localStorage.setItem('data', originalData);
    console.log('Data was successfully decrypted and is valid JSON');
    return true;
  } catch (err) {
    // If an error is thrown, the data is not valid JSON
    console.error('Failed to parse decrypted data as JSON: ', err);
    return false;
  }
};
