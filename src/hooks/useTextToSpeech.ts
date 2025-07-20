"use client";

import { useState, useRef, useCallback, useEffect } from "react";

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
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesLoadedRef = useRef(false);
  const isMobileRef = useRef(false);
  const isIOSRef = useRef(false);
  const userInteractedRef = useRef(false);
  const voiceLoadAttemptsRef = useRef(0);

  const { rate = 1, pitch = 1, volume = 1, voice = null } = options;

  // Detect mobile devices and iOS
  useEffect(() => {
    const userAgent = navigator.userAgent;
    isMobileRef.current =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    isIOSRef.current = /iPad|iPhone|iPod/.test(userAgent);
  }, []);

  // Track user interaction for mobile
  useEffect(() => {
    const handleUserInteraction = () => {
      userInteractedRef.current = true;
    };

    // Listen for any user interaction
    document.addEventListener("touchstart", handleUserInteraction, {
      once: true,
    });
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("keydown", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  // Load voices with mobile-specific handling
  const loadVoices = useCallback(() => {
    if (voicesLoadedRef.current && voices.length > 0) return;

    const availableVoices = window.speechSynthesis.getVoices();

    // iOS Safari often returns empty array initially, keep trying
    if (availableVoices.length === 0 && voiceLoadAttemptsRef.current < 10) {
      voiceLoadAttemptsRef.current++;
      setTimeout(loadVoices, isIOSRef.current ? 200 : 100);
      return;
    }

    if (availableVoices.length > 0) {
      let workingVoices = availableVoices;

      // iOS-specific voice filtering
      if (isIOSRef.current) {
        // iOS Safari works better with all voices, don't filter by localService
        workingVoices = availableVoices;
      } else if (isMobileRef.current) {
        // Android: prefer local voices but fallback to all if none found
        const localVoices = availableVoices.filter(
          (voice) => voice.localService
        );
        workingVoices = localVoices.length > 0 ? localVoices : availableVoices;
      }

      setVoices(workingVoices);
      voicesLoadedRef.current = true;

      // Set a default voice if none is selected
      if (!selectedVoice && !voice && workingVoices.length > 0) {
        let defaultVoice;

        if (isIOSRef.current) {
          // iOS: Find Samantha or any English voice
          defaultVoice =
            workingVoices.find((v) => v.name.includes("Samantha")) ||
            workingVoices.find((v) => v.lang.startsWith("en-US")) ||
            workingVoices.find((v) => v.lang.startsWith("en")) ||
            workingVoices[0];
        } else {
          // Other platforms: prefer local English voices
          defaultVoice =
            workingVoices.find(
              (v) => v.lang.startsWith("en") && v.localService
            ) ||
            workingVoices.find((v) => v.lang.startsWith("en")) ||
            workingVoices[0];
        }

        if (defaultVoice) setSelectedVoice(defaultVoice);
      }
    }
  }, [selectedVoice, voice, voices.length]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    setIsSupported(true);

    // Initialize voice loading
    const initVoices = () => {
      // Reset attempts counter
      voiceLoadAttemptsRef.current = 0;
      loadVoices();

      // iOS Safari needs multiple attempts with specific timing
      if (isIOSRef.current) {
        setTimeout(loadVoices, 100);
        setTimeout(loadVoices, 300);
        setTimeout(loadVoices, 1000);
        setTimeout(loadVoices, 2000);
      } else if (isMobileRef.current) {
        // Android devices
        setTimeout(loadVoices, 200);
        setTimeout(loadVoices, 800);
      } else {
        // Desktop
        setTimeout(loadVoices, 100);
      }
    };

    // For mobile devices, wait for user interaction
    if (isMobileRef.current) {
      if (userInteractedRef.current) {
        initVoices();
      } else {
        // Set up a listener for when user interaction occurs
        const handleFirstInteraction = () => {
          if (userInteractedRef.current) {
            initVoices();
          }
        };

        // Check periodically for user interaction
        const checkInterval = setInterval(() => {
          if (userInteractedRef.current) {
            handleFirstInteraction();
            clearInterval(checkInterval);
          }
        }, 100);

        // Clean up interval after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000);
      }
    } else {
      // Desktop initialization
      initVoices();
    }

    // Listen for voiceschanged event
    const handleVoicesChanged = () => {
      voiceLoadAttemptsRef.current = 0;
      voicesLoadedRef.current = false;
      loadVoices();
    };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };
  }, [loadVoices]);

  const speak = useCallback(
    (
      text: string,
      customVoice?: SpeechSynthesisVoice | null,
      customRate?: number
    ) => {
      if (!isSupported || !text.trim()) return;

      // Mobile requires user interaction
      if (isMobileRef.current && !userInteractedRef.current) {
        console.warn("TTS requires user interaction on mobile devices");
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
          console.error("SpeechSynthesis error:", event);
          setIsPlaying(false);
          setIsPaused(false);

          // Mobile-specific error handling
          if (isMobileRef.current && event.error === "network") {
            console.warn("Network error on mobile - try using a local voice");
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
    if (
      isSupported &&
      window.speechSynthesis.speaking &&
      !window.speechSynthesis.paused
    ) {
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
