"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Pause, Play, Settings2, Square } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface BlogTTSProps {
  content: string;
  title: string;
  excerpt: string;
  className?: string;
}

export default function BlogTTS({ content, title, excerpt, className = "" }: BlogTTSProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.9);
  const [estimatedDuration, setEstimatedDuration] = useState("");

  const {
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
    initializeTTS,
    isMobile,
    userInteracted,
  } = useTextToSpeech({ rate: 0.9, pitch: 1.0, volume: 1.0 });

  const cleanContent = (text: string): string =>
    text
      .replace(/#{1,6}\s+(.+)/g, "$1. ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/```[\s\S]*?```/g, " code block. ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/--/g, ", ")
      .replace(/\.\.\./g, ". pause. ")
      .replace(/\n\n+/g, ". pause. ")
      .replace(/\n/g, ". ")
      .replace(/\s+/g, " ")
      .replace(/\.\s*\./g, ".")
      .trim();

  const calculateDuration = useCallback(
    (text: string) => {
      const words = text.split(" ").length;
      const wordsPerMinute = Math.round(160 * readingSpeed);
      const minutes = Math.ceil(words / wordsPerMinute);
      return minutes === 1 ? "1 minute" : `${minutes} minutes`;
    },
    [readingSpeed]
  );

  const isOnlineVoice = useCallback(
    (voice: SpeechSynthesisVoice) => {
      const name = voice.name.toLowerCase();
      if (isMobile) {
        return ["cloud", "online", "network", "remote", "wavenet"].some((k) =>
          name.includes(k)
        );
      }
      return ["google", "cloud", "online", "network", "server", "remote", "wavenet"].some(
        (k) => name.includes(k)
      );
    },
    [isMobile]
  );

  const findBestVoice = useCallback(() => {
    if (!voices.length) return null;

    if (isMobile) {
      let english = voices.filter((v) => v.lang.startsWith("en") && !isOnlineVoice(v));
      if (english.length === 0) english = voices.filter((v) => v.lang.startsWith("en"));
      const preferred = ["Google", "Samantha", "Alex", "Karen", "Daniel", "Sonia", "Neural", "Natural"];
      for (const p of preferred) {
        const voice = english.find((v) => v.name.toLowerCase().includes(p.toLowerCase()));
        if (voice) return voice;
      }
      if (english.length > 0) return english[0];
    } else {
      const english = voices.filter(
        (v) =>
          v.lang.startsWith("en") &&
          !isOnlineVoice(v) &&
          !v.name.toLowerCase().includes("android")
      );
      const preferred = [
        "Sonia", "Samantha", "Alex", "Karen", "Daniel", "Moira", "Tessa", "Neural", "Natural", "Microsoft",
      ];
      for (const p of preferred) {
        const voice = english.find((v) => v.name.toLowerCase().includes(p.toLowerCase()));
        if (voice) return voice;
      }
      if (english.length > 0) return english[0];
    }
    return voices[0];
  }, [voices, isMobile, isOnlineVoice]);

  useEffect(() => {
    setIsVisible(isSupported);
    if (voices.length > 0 && !selectedVoice) {
      setSelectedVoice(findBestVoice());
    }
  }, [isSupported, voices, selectedVoice, findBestVoice, setSelectedVoice]);

  useEffect(() => {
    setEstimatedDuration(calculateDuration(`${title}. ${excerpt}. ${cleanContent(content)}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, title, excerpt, readingSpeed, calculateDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isPlaying && !isPaused) {
      const totalWords = `${title}. ${excerpt}. ${cleanContent(content)}`.split(" ").length;
      const increment = 100 / (totalWords * 0.4);
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 95 ? 95 : prev + increment));
      }, 1000);
    }
    if (!isPlaying) setProgress(0);
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isPaused, content, title, excerpt]);

  const handlePlay = () => {
    if (isMobile && !userInteracted) {
      initializeTTS();
      setTimeout(() => handlePlay(), 200);
      return;
    }
    if (isPaused) resume();
    else if (!isPlaying) {
      speak(`${title}. ${excerpt}. ${cleanContent(content)}`, selectedVoice, readingSpeed);
      setProgress(0);
    } else pause();
  };

  const handleStop = () => {
    stop();
    setProgress(100);
    setTimeout(() => setProgress(0), 500);
  };

  if (!isVisible) return null;

  const statusText =
    isMobile && !userInteracted
      ? "Tap to enable"
      : isPlaying
        ? isPaused
          ? "Paused"
          : "Playing"
        : estimatedDuration;

  return (
    <div className={className}>
      <div className="border border-hairline p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={handlePlay}
              disabled={!selectedVoice}
              aria-label={isPlaying && !isPaused ? "Pause" : isPaused ? "Resume" : "Listen to article"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-signal-ink transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
            >
              {isPlaying && !isPaused ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Listen to this article</p>
              <p className="label-mono text-ink-soft">{statusText}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPlaying && (
              <button
                type="button"
                onClick={handleStop}
                aria-label="Stop"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-destructive hover:text-destructive"
              >
                <Square className="h-4 w-4" aria-hidden="true" />
              </button>
            )}

            {(isPlaying || progress > 0) && (
              <div className="hidden items-center gap-2 sm:flex">
                <div className="h-1 w-24 bg-hairline">
                  <div className="h-1 bg-signal transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
                <span className="label-mono text-ink-soft">{Math.round(progress)}%</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowVoiceSettings((v) => !v)}
              aria-expanded={showVoiceSettings}
              aria-label="Voice settings"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline transition-colors hover:border-signal hover:text-signal"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {showVoiceSettings && (
          <div className="mt-4 grid gap-4 border-t border-hairline pt-4 sm:grid-cols-2">
            <div>
              <label htmlFor="tts-voice" className="label-mono mb-2 block text-ink-soft">
                Voice
              </label>
              <select
                id="tts-voice"
                value={selectedVoice?.name || ""}
                onChange={(e) => {
                  const voice = voices.find((v) => v.name === e.target.value);
                  if (voice) {
                    setSelectedVoice(voice);
                    if (isPlaying) stop();
                  }
                }}
                className="w-full border border-hairline bg-transparent px-3 py-2 text-sm focus:border-signal focus:outline-none"
              >
                {(() => {
                  let filtered = voices.filter((v) => v.lang.startsWith("en") && !isOnlineVoice(v));
                  if (filtered.length === 0) filtered = voices.filter((v) => !isOnlineVoice(v));
                  if (filtered.length === 0) filtered = voices;
                  return filtered.map((voice) => {
                    const country = voice.lang.split("-")[1]?.toUpperCase() ?? "EN";
                    return (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({country})
                      </option>
                    );
                  });
                })()}
              </select>
            </div>

            <div>
              <label htmlFor="tts-speed" className="label-mono mb-2 block text-ink-soft">
                Speed: {readingSpeed.toFixed(1)}x
              </label>
              <input
                id="tts-speed"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={readingSpeed}
                onChange={(e) => {
                  setReadingSpeed(parseFloat(e.target.value));
                  if (isPlaying) stop();
                }}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-hairline accent-[var(--signal)]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
