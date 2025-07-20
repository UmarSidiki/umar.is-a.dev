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
  const isMobileRef = useRef(false);
  const userInteractedRef = useRef(false);

  const { rate = 1, pitch = 1, volume = 1, voice = null } = options;

  // Detect mobile devices
  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  // Track user interaction for mobile
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    // Listen for any user interaction
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);

  // Load voices with mobile-specific handling
  const loadVoices = useCallback(() => {
    if (voicesLoadedRef.current) return;

    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      // Filter out voices that might not work on mobile
      const workingVoices = availableVoices.filter(voice => {
        // On mobile, prefer local voices over network voices
        if (isMobileRef.current) {
          return voice.localService;
        }
        return true;
      });

      setVoices(workingVoices.length > 0 ? workingVoices : availableVoices);
      voicesLoadedRef.current = true;

      // Set a default voice if none is selected
      if (!selectedVoice && !voice) {
        const voiceList = workingVoices.length > 0 ? workingVoices : availableVoices;
        const defaultVoice = voiceList.find((v) => v.lang.startsWith('en') && v.localService) || 
                            voiceList.find((v) => v.lang.startsWith('en')) || 
                            voiceList[0];
        if (defaultVoice) setSelectedVoice(defaultVoice);
      }
    }
  }, [selectedVoice, voice]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    setIsSupported(true);

    // Mobile-specific initialization
    if (isMobileRef.current) {
      // On mobile, we need to wait for user interaction and longer delays
      const delayedInit = () => {
        loadVoices();
        // Multiple attempts with longer delays for mobile
        setTimeout(loadVoices, 500);
        setTimeout(loadVoices, 1500);
      };
      
      if (userInteractedRef.current) {
        delayedInit();
      } else {
        // Wait for user interaction on mobile
        const waitForInteraction = () => {
          if (userInteractedRef.current) {
            delayedInit();
          } else {
            setTimeout(waitForInteraction, 100);
          }
        };
        waitForInteraction();
      }
    } else {
      // Desktop initialization
      loadVoices();
      setTimeout(loadVoices, 100);
    }

    // Listen for voiceschanged event
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [loadVoices]);

  const speak = useCallback(
    (text: string, customVoice?: SpeechSynthesisVoice | null, customRate?: number) => {
      if (!isSupported || !text.trim()) return;

      // Mobile requires user interaction
      if (isMobileRef.current && !userInteractedRef.current) {
        console.warn('TTS requires user interaction on mobile devices');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Small delay to ensure cancel is processed
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Mobile-optimized settings
        if (isMobileRef.current) {
          utterance.rate = Math.min(customRate ?? rate, 1.2); // Limit rate on mobile
          utterance.pitch = pitch;
          utterance.volume = volume;
        } else {
          utterance.rate = customRate ?? rate;
          utterance.pitch = pitch;
          utterance.volume = volume;
        }

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
          
          // Mobile-specific error handling
          if (isMobileRef.current && event.error === 'network') {
            console.warn('Network error on mobile - try using a local voice');
          }
        };

        // Mobile-specific: Add onpause and onresume handlers
        utterance.onpause = () => {
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPaused(false);
        };

        utteranceRef.current = utterance;
        
        // Mobile workaround: Ensure speechSynthesis is ready
        if (isMobileRef.current) {
          // Sometimes mobile needs a small delay
          setTimeout(() => {
            window.speechSynthesis.speak(utterance);
          }, 50);
        } else {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);
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

  // Mobile-specific method to initialize TTS after user interaction
  const initializeTTS = useCallback(() => {
    if (isMobileRef.current && !userInteractedRef.current) {
      userInteractedRef.current = true;
      loadVoices();
    }
  }, [loadVoices]);

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
    initializeTTS, // New method for mobile initialization
    isMobile: isMobileRef.current,
    userInteracted: userInteractedRef.current,
  };
};