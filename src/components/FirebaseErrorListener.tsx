'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Listens for globally emitted 'permission-error' events.
 * Removed the toast notification to prevent UI overlap as requested.
 * Errors are now logged to the console for developer debugging.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.warn("Firestore Permission Denied (Silenced Toast):", error.request.path);
      // Toast has been removed to prevent hiding content in the Admin/Home pages.
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
