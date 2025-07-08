'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface BlogTTSProps {
  content: string;
  title: string;
  excerpt: string;
  className?: string;
}

const BlogTTS: React.FC<BlogTTSProps> = ({ content, title, excerpt, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(0.9);
  const [estimatedDuration, setEstimatedDuration] = useState('');

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
    stop 
  } = useTextToSpeech({
    rate: 0.9, // Use initial rate, we'll pass dynamic rate to speak function
    pitch: 1.0,
    volume: 1.0
  });

  // Enhanced content cleaning for better TTS experience
  const cleanContent = (text: string): string => {
    return text
      // Remove markdown headers but add pauses
      .replace(/#{1,6}\s+(.+)/g, '$1. ')
      // Remove markdown links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove markdown bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, ' code block. ')
      .replace(/`([^`]+)`/g, '$1')
      // Replace common punctuation for better speech
      .replace(/--/g, ', ')
      .replace(/\.\.\./g, '. pause. ')
      // Add natural pauses
      .replace(/\n\n+/g, '. pause. ')
      .replace(/\n/g, '. ')
      // Clean up spacing
      .replace(/\s+/g, ' ')
      .replace(/\.\s*\./g, '.')
      .trim();
  };

  // Calculate estimated reading duration
  const calculateDuration = useCallback((text: string) => {
    const words = text.split(' ').length;
    const wordsPerMinute = Math.round(160 * readingSpeed); // Adjust based on speed
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }, [readingSpeed]);

  // Filter out online voices and improve mobile voice selection
  const isOnlineVoice = (voice: SpeechSynthesisVoice) => {
    // Online voices often have 'Google', 'Cloud', 'Online', 'Network', 'Microsoft Server', 'Remote', or 'Wavenet' in their name
    const name = voice.name.toLowerCase();
    return (
      name.includes('google') ||
      name.includes('cloud') ||
      name.includes('online') ||
      name.includes('network') ||
      name.includes('server') ||
      name.includes('remote') ||
      name.includes('wavenet')
    );
  };

  // Find best voice (prioritize local, high-quality voices, and improve mobile fallback)
  const findBestVoice = useCallback(() => {
    if (!voices.length) return null;

    // Only local English voices
    const englishVoices = voices.filter(
      (voice) =>
        voice.lang.startsWith('en') &&
        !isOnlineVoice(voice) &&
        !voice.name.toLowerCase().includes('android')
    );

    // Priority order for better voices (Sonia first!)
    const preferredVoices = [
      'Sonia', 'Samantha', 'Alex', 'Karen', 'Daniel', 'Moira', 'Tessa',
      'Enhanced', 'Premium', 'Neural', 'Natural', 'Microsoft'
    ];

    for (const preferred of preferredVoices) {
      const voice = englishVoices.find((v) =>
        v.name.toLowerCase().includes(preferred.toLowerCase())
      );
      if (voice) return voice;
    }

    // On mobile, fallback to the first available local English voice
    if (englishVoices.length > 0) {
      return englishVoices[0];
    }

    // If no local English voice, fallback to any local voice
    const localVoices = voices.filter((v) => !isOnlineVoice(v));
    if (localVoices.length > 0) {
      return localVoices[0];
    }

    // As a last resort, return any voice
    return voices[0];
  }, [voices]);

  useEffect(() => {
    setIsVisible(isSupported);
    if (voices.length > 0 && !selectedVoice) {
      const bestVoice = findBestVoice();
      setSelectedVoice(bestVoice);
    }
  }, [isSupported, voices, selectedVoice, findBestVoice, setSelectedVoice]);

  useEffect(() => {
    const fullContent = `${title}. ${excerpt}. ${cleanContent(content)}`;
    setEstimatedDuration(calculateDuration(fullContent));
  }, [content, title, excerpt, readingSpeed, calculateDuration]);

  // Enhanced progress tracking
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isPaused) {
      const fullContent = `${title}. ${excerpt}. ${cleanContent(content)}`;
      const totalWords = fullContent.split(' ').length;
      const progressIncrement = 100 / (totalWords * 0.4); // Rough estimation
      
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95; // Don't reach 100% until speech ends
          return prev + progressIncrement;
        });
      }, 1000);
    }
    
    if (!isPlaying) {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPaused, content, title, excerpt]);

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else if (!isPlaying) {
      const fullContent = `${title}. ${excerpt}. ${cleanContent(content)}`;
      speak(fullContent, selectedVoice, readingSpeed);
      setProgress(0);
    } else {
      pause();
    }
  };

  const handleStop = () => {
    stop();
    setProgress(100); // Complete progress when stopped
    setTimeout(() => setProgress(0), 500); // Reset after animation
  };

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    if (isPlaying) {
      stop();
    }
  };

  const handleSpeedChange = (speed: number) => {
    setReadingSpeed(speed);
    if (isPlaying) {
      stop(); // Stop current playback to apply new speed
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`w-full ${className}`}>
      {/* Inline TTS Control Panel */}
      <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 shadow-sm">
        
        {/* Single Line Layout */}
        <div className="flex items-center justify-between space-x-4">
          
          {/* Left: Play Button + Title + Status */}
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {/* Play/Pause Button as main icon */}
            <button
              onClick={handlePlay}
              disabled={!selectedVoice}
              className="p-2 bg-amber-500 dark:bg-amber-600 rounded-lg flex-shrink-0 hover:bg-amber-600 dark:hover:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={
                isPlaying && !isPaused 
                  ? "Pause reading"
                  : isPaused 
                    ? "Resume reading"
                    : "Start reading"
              }
            >
              {isPlaying && !isPaused ? (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1zm4 0a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-200 truncate">
                  Listen to Article
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                  {isPlaying ? (isPaused ? '⏸️ Paused' : '▶️ Playing') : `🕒 ${estimatedDuration}`}
                </span>
              </div>
            </div>
          </div>

          {/* Center: Stop Button + Progress */}
          <div className="flex items-center space-x-3">
            {/* Stop Button */}
            {isPlaying && (
              <button
                onClick={handleStop}
                className="p-2 rounded-lg bg-neutral-200 hover:bg-red-500 dark:bg-neutral-700 dark:hover:bg-red-500 text-neutral-600 hover:text-white dark:text-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Stop reading"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Progress Bar - Inline */}
            {(isPlaying || progress > 0) && (
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full h-1">
                  <div 
                    className="bg-amber-500 h-1 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 min-w-[25px] text-center">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>

          {/* Right: Voice Info + Settings */}
          <div className="flex items-center space-x-2">
            <div className="text-right text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
              <p className="truncate max-w-[80px]">{selectedVoice?.name?.split(' ')[0] || 'No voice'}</p>
              {readingSpeed !== 0.9 && <p>{readingSpeed}x</p>}
            </div>
            
            {/* Settings Toggle */}
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
              title="Settings"
            >
              <svg className="w-3 h-3 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsible Settings Panel - Below the main line */}
        {showVoiceSettings && (
          <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Voice Selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Voice
                </label>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = voices.find(v => v.name === e.target.value);
                    if (voice) handleVoiceChange(voice);
                  }}
                  className="w-full p-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-xs"
                >
                  {/* Only show local English voices, fallback to local voices if none */}
                  {(() => {
                    let filtered = voices.filter(v => v.lang.startsWith('en') && !isOnlineVoice(v));
                    if (filtered.length === 0) {
                      filtered = voices.filter(v => !isOnlineVoice(v));
                    }
                    if (filtered.length === 0) {
                      filtered = voices;
                    }
                    return filtered.map((voice, index) => {
                      const langParts = voice.lang.split('-');
                      const countryCode = langParts.length > 1 ? langParts[1].toUpperCase() : 'EN';
                      return (
                        <option key={index} value={voice.name}>
                          {voice.name} ({countryCode})
                        </option>
                      );
                    });
                  })()}
                </select>
              </div>

              {/* Speed Control */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Speed: {readingSpeed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={readingSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTTS;
