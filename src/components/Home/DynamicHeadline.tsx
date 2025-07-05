import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Language {
  main: string;
  highlight: string;
  code: string;
  flag: string;
  name: string;
}

const languages: Language[] = [
  { main: "Hello", highlight: "", code: "en", flag: "🇺🇸", name: "English" },
  { main: "Hola", highlight: "", code: "es", flag: "🇪🇸", name: "Español" },
  { main: "Salut", highlight: "", code: "fr", flag: "🇫🇷", name: "Français" },
  { main: "Hallo", highlight: "", code: "de", flag: "🇩🇪", name: "Deutsch" },
  { main: "你好", highlight: "", code: "zh", flag: "🇨🇳", name: "中文" },
  { main: "Olá", highlight: "", code: "pt", flag: "🇵🇹", name: "Português" },
  { main: "Ciao", highlight: "", code: "it", flag: "🇮🇹", name: "Italiano" },
  { main: "こんにちは", highlight: "", code: "ja", flag: "🇯🇵", name: "日本語" },
  { main: "مرحبا", highlight: "", code: "ar", flag: "🇸🇦", name: "العربية" },
  { main: "नमस्ते", highlight: "", code: "hi", flag: "🇮🇳", name: "हिन्दी" }
];

interface DynamicHeadlineProps {
  showLanguageIndicator?: boolean;
}

export const DynamicHeadline: React.FC<DynamicHeadlineProps> = ({ 
  showLanguageIndicator = true 
}) => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Get initial language based on browser language
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      const langIndex = languages.findIndex(lang => lang.code === browserLang);
      if (langIndex !== -1) {
        setCurrentLanguageIndex(langIndex);
      }
    }
  }, []);

  // GSAP typing animation effect
  useEffect(() => {
    const currentWord = languages[currentLanguageIndex].main;
    
    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Reset text
    setDisplayedText("");
    setIsTyping(true);

    // Create new GSAP timeline
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Typing animation with GSAP
    const chars = currentWord.split('');

    // Type each character
    chars.forEach((char, index) => {
      tl.call(() => {
        setDisplayedText(currentWord.substring(0, index + 1));
      }, undefined, index * 0.08);
    });

    // Pause with blinking cursor
    tl.call(() => {
      setIsTyping(false);
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          opacity: 0.3,
          duration: 0.5,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut"
        });
      }
    }, undefined, chars.length * 0.08);

    // Start erasing after pause
    tl.call(() => {
      setIsTyping(true);
    }, undefined, chars.length * 0.08 + 2.0);

    // Erase each character
    for (let i = chars.length - 1; i >= 0; i--) {
      tl.call(() => {
        setDisplayedText(currentWord.substring(0, i));
      }, undefined, chars.length * 0.08 + 2.0 + (chars.length - i) * 0.05);
    }

    // Change to next language after erasing
    tl.call(() => {
      setCurrentLanguageIndex((prevIndex) => 
        (prevIndex + 1) % languages.length
      );
    }, undefined, chars.length * 0.08 + 2.0 + chars.length * 0.05 + 0.2);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [currentLanguageIndex]);

  const currentLanguage = languages[currentLanguageIndex];

  return (
    <div className="relative min-h-[100px] sm:min-h-[120px] md:min-h-[180px] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      {showLanguageIndicator && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-100/80 dark:bg-neutral-800/80 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-sm shadow-sm">
          <span className="text-sm sm:text-lg">{currentLanguage.flag}</span>
          <span className="font-medium hidden sm:inline">{currentLanguage.name}</span>
          <span className="font-medium sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </div>
      )}
      
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4 sm:mb-6 leading-tight text-center w-full max-w-4xl">
        <span 
          ref={textRef}
          className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600 inline-block"
        >
          {displayedText}
          <span 
            ref={cursorRef}
            className={`inline-block w-0.5 h-8 sm:h-10 md:h-12 lg:h-16 bg-amber-500 ml-0.5 sm:ml-1 ${isTyping ? 'animate-pulse' : 'animate-blink'}`}
          ></span>
        </span>
      </h1>
    </div>
  );
};
