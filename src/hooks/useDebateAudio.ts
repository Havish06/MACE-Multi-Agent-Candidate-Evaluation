import { useState, useEffect, useRef, useCallback } from 'react';
import { DebateMessage, AgentType } from '../types';

interface SpeakerVoiceMeta {
  pitch: number;
  rate: number;
}

export function useDebateAudio(messages: DebateMessage[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [speed, setSpeed] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isMountedRef = useRef(true);

  // Initialize SpeechSynthesis and load voices
  useEffect(() => {
    isMountedRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        if (synthRef.current && isMountedRef.current) {
          const v = synthRef.current.getVoices();
          if (v && v.length > 0) setVoices(v);
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    return () => {
      isMountedRef.current = false;
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getSpeakerMeta = useCallback((type: AgentType): SpeakerVoiceMeta => {
    switch (type) {
      case 'technical':
        return { pitch: 1.15, rate: 1.05 };
      case 'hr':
        return { pitch: 0.95, rate: 1.0 };
      case 'hiring_manager':
        return { pitch: 0.85, rate: 0.98 };
      case 'skeptic':
        return { pitch: 0.8, rate: 1.0 };
      default:
        return { pitch: 1.0, rate: 1.0 };
    }
  }, []);

  const speakTurn = useCallback(
    (index: number) => {
      if (!synthRef.current || index < 0 || index >= messages.length) {
        setIsPlaying(false);
        return;
      }

      synthRef.current.cancel();
      const msg = messages[index];
      if (!msg) {
        setIsPlaying(false);
        return;
      }

      const meta = getSpeakerMeta(msg.speaker);
      setCurrentIndex(index);
      setIsPlaying(true);

      const cleanText = msg.message.replace(/\[E\d+\]/g, ''); // strip citation brackets for smoother voice flow
      const textToSpeak = `${msg.speakerName} states: ${cleanText}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      utterance.pitch = meta.pitch;
      utterance.rate = meta.rate * speed;

      const availableVoices = voices.length > 0 ? voices : (synthRef.current.getVoices() || []);
      if (availableVoices.length > 0) {
        if (msg.speaker === 'technical') {
          const fVoice = availableVoices.find((v) =>
            v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female')
          );
          if (fVoice) utterance.voice = fVoice;
        } else if (msg.speaker === 'skeptic') {
          const dVoice = availableVoices.find((v) =>
            v.name.includes('David') || v.name.includes('George') || v.name.includes('Male') || v.name.includes('Google UK English Male')
          );
          if (dVoice) utterance.voice = dVoice;
        }
      }

      utterance.onend = () => {
        if (!isMountedRef.current) return;
        if (index + 1 < messages.length) {
          speakTurn(index + 1);
        } else {
          setIsPlaying(false);
          setCurrentIndex(-1);
        }
      };

      utterance.onerror = () => {
        if (!isMountedRef.current) return;
        setIsPlaying(false);
      };

      synthRef.current.speak(utterance);
    },
    [messages, speed, voices, getSpeakerMeta]
  );

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      if (synthRef.current) synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      const startIdx = currentIndex >= 0 && currentIndex < messages.length ? currentIndex : 0;
      speakTurn(startIdx);
    }
  }, [isPlaying, currentIndex, messages.length, speakTurn]);

  const stop = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    setCurrentIndex(-1);
  }, []);

  const skipNext = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < messages.length) {
      speakTurn(nextIdx);
    } else {
      stop();
    }
  }, [currentIndex, messages.length, speakTurn, stop]);

  const restart = useCallback(() => {
    if (messages.length > 0) {
      speakTurn(0);
    }
  }, [messages.length, speakTurn]);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => (prev === 1.0 ? 1.25 : prev === 1.25 ? 1.5 : 1.0));
  }, []);

  return {
    isPlaying,
    currentIndex,
    speed,
    togglePlay,
    speakTurn,
    skipNext,
    restart,
    stop,
    cycleSpeed,
  };
}
