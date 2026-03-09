
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password);
}

/** Initiate Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<void> {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(authInstance, provider).then(() => {}).catch((err) => {
    throw err;
  });
}

/** Initiate GitHub sign-in (non-blocking). */
export function initiateGithubSignIn(authInstance: Auth): Promise<void> {
  const provider = new GithubAuthProvider();
  return signInWithPopup(authInstance, provider).then(() => {}).catch((err) => {
    throw err;
  });
}

/** Initiate Microsoft sign-in (non-blocking). */
export function initiateMicrosoftSignIn(authInstance: Auth): Promise<void> {
  const provider = new OAuthProvider('microsoft.com');
  return signInWithPopup(authInstance, provider).then(() => {}).catch((err) => {
    throw err;
  });
}
