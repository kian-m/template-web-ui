import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp();
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await getAuth().verifyIdToken(token, true);
    return true;
  } catch {
    return false;
  }
}
