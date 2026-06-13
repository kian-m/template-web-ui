import '@testing-library/jest-dom';

(global as any).fetch = require('node-fetch');

jest.mock('./src/app/lib/firebase', () => ({
  auth: { currentUser: null },
  GoogleAuthProvider: class {},
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('@/app/lib/firebase', () => ({
  auth: { currentUser: null },
  GoogleAuthProvider: class {},
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: class {},
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  getAuth: jest.fn(() => ({ currentUser: null })),
}));
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props: any) => props.children,
}));
(global as any).Response = require('node-fetch').Response;
(HTMLElement.prototype as any).scrollIntoView = jest.fn();
