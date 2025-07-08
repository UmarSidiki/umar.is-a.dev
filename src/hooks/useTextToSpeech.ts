'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);

  const { rate = 1, pitch = 1, volume = 1, voice = null } = options;

  // Load voices efficiently
  const loadVoices = useCallback(() => {
    if (voicesLoadedRef.current) return;

    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      setVoices(availableVoices);
      voicesLoadedRef.current = true;
      // Set a default voice if none is selected
      if (!selectedVoice && !voice) {
        const defaultVoice = availableVoices.find((v) => v.lang.startsWith('en')) || availableVoices[0];
        if (defaultVoice) setSelectedVoice(defaultVoice);
      }
    }
  }, [selectedVoice, voice]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    setIsSupported(true);

    // Initial voice load attempt
    loadVoices();

    // Listen for voiceschanged event
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    // Single delayed check to catch late-loading voices (e.g., in Chrome)
    const timeout = setTimeout(loadVoices, 100);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      clearTimeout(timeout);
    };
  }, [loadVoices]);

  const speak = useCallback(
    (text: string, customVoice?: SpeechSynthesisVoice | null, customRate?: number) => {
      if (!isSupported || !text.trim()) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = customRate ?? rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Use custom voice, provided voice, or selected voice
      const voiceToUse = customVoice ?? voice ?? selectedVoice;
      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = (event) => {
        console.error('SpeechSynthesis error:', event);
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, pitch, volume, voice, selectedVoice]
  );

  const pause = useCallback(() => {
    if (isSupported && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isSupported]);

  const resume = useCallback(() => {
    if (isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    speak,
    pause,
    resume,
    stop,
  };
};