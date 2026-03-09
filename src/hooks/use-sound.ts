'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * Modern UI sound effects.
 * Using subtle, non-intrusive sound assets.
 */
const SOUND_URLS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle tap
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Light chime
  error: 'https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3', // Soft warning
};

export function useSound() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    // Pre-initialize audio objects on the client
    if (typeof window !== 'undefined') {
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.volume = 0.2; // Keep it subtle
        audioRefs.current[key] = audio;
      });
    }
  }, []);

  const play = useCallback((soundType: keyof typeof SOUND_URLS) => {
    const audio = audioRefs.current[soundType];
    if (audio) {
      audio.currentTime = 0; // Reset for repeated triggers
      audio.play().catch(() => {
        /* Browser may block auto-play until interaction, which is fine for UI sounds */
      });
    }
  }, []);

  return { play };
}