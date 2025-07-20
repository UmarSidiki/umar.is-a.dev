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
  const isAndroidRef = useRef(false);
  const userInteractedRef = useRef(false);
  const voiceLoadAttemptsRef = useRef(0);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);

  const { rate = 1, pitch = 1, volume = 1, voice = null } = options;

  // Detect mobile devices and platforms
  useEffect(() => {
    const userAgent = navigator.userAgent;
    isMobileRef.current =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    isIOSRef.current = /iPad|iPhone|iPod/.test(userAgent);
    isAndroidRef.current = /Android/i.test(userAgent);

    // Store speechSynthesis reference
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis;
    }
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
    if (!speechSynthRef.current) return;

    const availableVoices = speechSynthRef.current.getVoices();

    // Mobile browsers often return empty array initially, keep trying
    if (availableVoices.length === 0 && voiceLoadAttemptsRef.current < 15) {
      voiceLoadAttemptsRef.current++;
      const delay = isAndroidRef.current ? 300 : isIOSRef.current ? 200 : 100;
      setTimeout(loadVoices, delay);
      return;
    }

    if (availableVoices.length > 0) {
      console.log(
        "Available voices:",
        availableVoices.map((v) => ({
          name: v.name,
          lang: v.lang,
          local: v.localService,
        }))
      );

      let workingVoices = availableVoices;

      // Platform-specific voice filtering
      if (isAndroidRef.current) {
        // Android Chrome: Use all voices, don't filter by localService as it's unreliable
        workingVoices = availableVoices;
      } else if (isIOSRef.current) {
        // iOS Safari: Use all voices
        workingVoices = availableVoices;
      } else if (isMobileRef.current) {
        // Other mobile: prefer local voices but fallback to all
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

        if (isAndroidRef.current) {
          // Android: Find Google US English or any English voice
          defaultVoice =
            workingVoices.find(
              (v) =>
                v.name.toLowerCase().includes("google") &&
                v.lang.startsWith("en-US")
            ) ||
            workingVoices.find((v) => v.lang.startsWith("en-US")) ||
            workingVoices.find((v) => v.lang.startsWith("en")) ||
            workingVoices[0];
        } else if (isIOSRef.current) {
          // iOS: Find Samantha or any English voice
          defaultVoice =
            workingVoices.find((v) => v.name.includes("Samantha")) ||
            workingVoices.find((v) => v.lang.startsWith("en-US")) ||
            workingVoices.find((v) => v.lang.startsWith("en")) ||
            workingVoices[0];
        } else {
          // Desktop/Other: prefer local English voices
          defaultVoice =
            workingVoices.find(
              (v) => v.lang.startsWith("en") && v.localService
            ) ||
            workingVoices.find((v) => v.lang.startsWith("en")) ||
            workingVoices[0];
        }

        if (defaultVoice) {
          console.log(
            "Selected default voice:",
            defaultVoice.name,
            defaultVoice.lang
          );
          setSelectedVoice(defaultVoice);
        }
      }
    }
  }, [selectedVoice, voice]);

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
      if (!isSupported || !text.trim() || !speechSynthRef.current) {
        console.log("TTS not supported or no text provided");
        return;
      }

      // Mobile requires user interaction
      if (isMobileRef.current && !userInteractedRef.current) {
        console.warn("TTS requires user interaction on mobile devices");
        return;
      }

      console.log("Starting TTS with text:", text.substring(0, 50) + "...");

      // Cancel any ongoing speech - critical for mobile
      speechSynthRef.current.cancel();

      // Android Chrome needs a longer delay after cancel
      const cancelDelay = isAndroidRef.current ? 100 : 50;

      setTimeout(() => {
        if (!speechSynthRef.current) return;

        const utterance = new SpeechSynthesisUtterance(text);

        // Platform-specific settings
        if (isAndroidRef.current) {
          // Android Chrome specific settings
          utterance.rate = Math.min(customRate ?? rate, 1.0); // Android works better with slower rates
          utterance.pitch = Math.min(pitch, 1.2); // Limit pitch on Android
          utterance.volume = volume;
        } else if (isIOSRef.current) {
          // iOS Safari specific settings
          utterance.rate = Math.min(customRate ?? rate, 1.2);
          utterance.pitch = pitch;
          utterance.volume = volume;
        } else {
          // Desktop settings
          utterance.rate = customRate ?? rate;
          utterance.pitch = pitch;
          utterance.volume = volume;
        }

        // Voice selection with fallback
        const voiceToUse = customVoice ?? voice ?? selectedVoice;
        if (voiceToUse) {
          utterance.voice = voiceToUse;
          console.log("Using voice:", voiceToUse.name, voiceToUse.lang);
        } else {
          console.log("No voice selected, using default");
        }

        // Event handlers
        utterance.onstart = () => {
          console.log("TTS started");
          setIsPlaying(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          console.log("TTS ended");
          setIsPlaying(false);
          setIsPaused(false);
        };

        utterance.onerror = (event) => {
          console.error("SpeechSynthesis error:", event.error, event);
          setIsPlaying(false);
          setIsPaused(false);

          // Mobile-specific error handling and retry
          if (isMobileRef.current) {
            if (event.error === "network") {
              console.warn(
                "Network error on mobile - trying without voice selection"
              );
              // Retry without voice selection
              setTimeout(() => {
                const retryUtterance = new SpeechSynthesisUtterance(text);
                retryUtterance.rate = isAndroidRef.current ? 0.8 : 1.0;
                retryUtterance.pitch = 1.0;
                retryUtterance.volume = volume;
                // Don't set voice for retry
                speechSynthRef.current?.speak(retryUtterance);
              }, 500);
            } else if (
              event.error === "synthesis-failed" &&
              isAndroidRef.current
            ) {
              console.warn(
                "Synthesis failed on Android - trying with different settings"
              );
              // Retry with minimal settings for Android
              setTimeout(() => {
                const retryUtterance = new SpeechSynthesisUtterance(text);
                retryUtterance.rate = 0.8;
                retryUtterance.pitch = 1.0;
                retryUtterance.volume = 1.0;
                speechSynthRef.current?.speak(retryUtterance);
              }, 500);
            }
          }
        };

        utterance.onpause = () => {
          setIsPaused(true);
        };

        utterance.onresume = () => {
          setIsPaused(false);
        };

        utteranceRef.current = utterance;

        // Platform-specific speech initiation
        if (isAndroidRef.current) {
          // Android Chrome needs special handling
          console.log("Starting speech on Android");

          // Ensure speechSynthesis is ready
          if (speechSynthRef.current.speaking) {
            speechSynthRef.current.cancel();
            setTimeout(() => {
              speechSynthRef.current?.speak(utterance);
            }, 100);
          } else {
            speechSynthRef.current.speak(utterance);
          }
        } else if (isIOSRef.current) {
          // iOS Safari
          console.log("Starting speech on iOS");
          setTimeout(() => {
            speechSynthRef.current?.speak(utterance);
          }, 50);
        } else {
          // Desktop
          speechSynthRef.current.speak(utterance);
        }
      }, cancelDelay);
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

      // Force initialization with a dummy utterance on mobile
      if (speechSynthRef.current) {
        console.log("Initializing TTS on mobile with dummy utterance");

        // Create a very short, silent utterance to initialize the engine
        const dummyUtterance = new SpeechSynthesisUtterance(" ");
        dummyUtterance.volume = 0.01; // Almost silent
        dummyUtterance.rate = 10; // Very fast

        dummyUtterance.onend = () => {
          console.log("Mobile TTS initialization complete");
          // Now load voices after initialization
          setTimeout(() => {
            loadVoices();
          }, 100);
        };

        dummyUtterance.onerror = (event) => {
          console.log("Dummy utterance error (expected):", event.error);
          // Even if dummy fails, try to load voices
          setTimeout(() => {
            loadVoices();
          }, 100);
        };

        // Speak the dummy utterance to initialize
        speechSynthRef.current.speak(dummyUtterance);
      } else {
        // Fallback to just loading voices
        loadVoices();
      }
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
