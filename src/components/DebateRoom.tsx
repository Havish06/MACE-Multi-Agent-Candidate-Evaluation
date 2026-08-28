import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sparkles,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Code2,
  Users2,
  Briefcase,
  AlertOctagon,
  Radio,
  Award
} from 'lucide-react';
import {
  DebateMessage,
  DisputeTopic,
  EvidenceItem,
  PositionRevisionRecord,
  AgentType,
  StanceType
} from '../types';
import { EvidenceBadge } from './EvidenceBadge';

interface DebateRoomProps {
  debateMessages: DebateMessage[];
  disputes: DisputeTopic[];
  positionRevisions?: PositionRevisionRecord[];
  evidenceStore: EvidenceItem[];
  onSelectEvidence: (id: string) => void;
}

export const DebateRoom: React.FC<DebateRoomProps> = ({
  debateMessages,
  disputes,
  positionRevisions = [],
  evidenceStore,
  onSelectEvidence,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(-1);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const messagesList = debateMessages || [];
  const disputesList = disputes || [];

  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        if (synthRef.current) {
          const v = synthRef.current.getVoices();
          if (v && v.length > 0) setAvailableVoices(v);
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const getSpeakerMeta = (type: AgentType) => {
    switch (type) {
      case 'technical':
        return {
          title: 'Dr. Elena Rostova (Technical Architect)',
          badgeColor: 'bg-[#E9F2EC] text-[#2D5A3F] border-[#B4D5C2]',
          avatarBg: 'bg-[#2D5A3F]',
          icon: <Code2 className="w-3.5 h-3.5 text-white" />,
          voicePitch: 1.1,
          voiceRate: 1.05,
        };
      case 'hr':
        return {
          title: 'Marcus Vance-Cole (Head of Culture)',
          badgeColor: 'bg-[#FAF0E6] text-[#8C510A] border-[#E5CFB8]',
          avatarBg: 'bg-[#C2781D]',
          icon: <Users2 className="w-3.5 h-3.5 text-white" />,
          voicePitch: 0.95,
          voiceRate: 1.0,
        };
      case 'hiring_manager':
        return {
          title: 'David Sterling (Hiring Lead)',
          badgeColor: 'bg-[#FDF0EE] text-[#A82A2A] border-[#F0C4BD]',
          avatarBg: 'bg-[#D94F33]',
          icon: <Briefcase className="w-3.5 h-3.5 text-white" />,
          voicePitch: 0.85,
          voiceRate: 0.95,
        };
      case 'skeptic':
        return {
          title: 'Arthur Pendelton (Risk Auditor)',
          badgeColor: 'bg-[#FDF0EE] text-[#A82A2A] border-[#F0C4BD]',
          avatarBg: 'bg-[#A82A2A]',
          icon: <AlertOctagon className="w-3.5 h-3.5 text-white" />,
          voicePitch: 0.8,
          voiceRate: 1.0,
        };
      default:
        return {
          title: 'Committee Member',
          badgeColor: 'bg-[#EFECE7] text-[#121212] border-[#121212]/20',
          avatarBg: 'bg-[#121212]',
          icon: <Sparkles className="w-3.5 h-3.5 text-white" />,
          voicePitch: 1.0,
          voiceRate: 1.0,
        };
    }
  };

  const getStanceBadge = (stance: StanceType) => {
    switch (stance) {
      case 'challenge':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] rounded-xs bg-[#A82A2A] text-white">CHALLENGE</span>;
      case 'defend':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] rounded-xs bg-[#2D5A3F] text-white">DEFENSE</span>;
      case 'concede':
      case 'partially_agree':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] rounded-xs bg-[#C2781D] text-white">PARTIAL AGREEMENT</span>;
      case 'agree':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] rounded-xs bg-[#2D5A3F]/90 text-white">CONSENSUS</span>;
      case 'disagree':
        return <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] rounded-xs bg-[#D94F33] text-white">DISAGREE</span>;
      default:
        return null;
    }
  };

  const speakTurn = (index: number) => {
    if (!synthRef.current || index < 0 || index >= messagesList.length) {
      setIsPlayingAudio(false);
      return;
    }

    synthRef.current.cancel();
    const msg = messagesList[index];
    if (!msg) {
      setIsPlayingAudio(false);
      return;
    }

    const meta = getSpeakerMeta(msg.speaker);

    setCurrentMessageIndex(index);
    setIsPlayingAudio(true);

    const textToSpeak = `${msg.speakerName} says: ${msg.message}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utteranceRef.current = utterance;

    utterance.pitch = meta.voicePitch;
    utterance.rate = meta.voiceRate * audioSpeed;

    const voices = availableVoices.length > 0 ? availableVoices : (synthRef.current.getVoices() || []);
    if (voices.length > 0) {
      if (msg.speaker === 'technical') {
        const fVoice = voices.find((v) => v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
        if (fVoice) utterance.voice = fVoice;
      } else if (msg.speaker === 'skeptic') {
        const dVoice = voices.find((v) => v.name.includes('David') || v.name.includes('George') || v.name.includes('Male') || v.name.includes('Google UK English Male'));
        if (dVoice) utterance.voice = dVoice;
      }
    }

    utterance.onend = () => {
      if (index + 1 < messagesList.length) {
        speakTurn(index + 1);
      } else {
        setIsPlayingAudio(false);
      }
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    synthRef.current.speak(utterance);
  };

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      if (synthRef.current) synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      const nextIdx = currentMessageIndex >= 0 && currentMessageIndex < messagesList.length ? currentMessageIndex : 0;
      speakTurn(nextIdx);
    }
  };

  const skipNextTurn = () => {
    const nextIdx = currentMessageIndex + 1;
    if (nextIdx < messagesList.length) {
      speakTurn(nextIdx);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      setIsPlayingAudio(false);
    }
  };

  const resetDebatePlayback = () => {
    if (synthRef.current) synthRef.current.cancel();
    setCurrentMessageIndex(0);
    speakTurn(0);
  };

  const cycleSpeed = () => {
    const next = audioSpeed === 1.0 ? 1.25 : audioSpeed === 1.25 ? 1.5 : 1.0;
    setAudioSpeed(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Voice Debate Controls Bar */}
      <div className="p-4 sm:p-5 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2.5 rounded-xs bg-[#F4F1EA] border border-[#121212]/10 text-[#D94F33] shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-serif-editorial font-bold text-[#121212]">
                Interactive Voice Debate Chamber
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E9F2EC] text-[#2D5A3F] border border-[#B4D5C2] rounded-xs flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse text-[#2D5A3F]" />
                Audio Synthesis Active
              </span>
            </div>
            <p className="text-xs text-[#57534E] font-serif-editorial italic mt-0.5">
              Listen to the 4 committee personas actively challenge hypotheses and revise stances.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            id="btn-toggle-audio-speed"
            type="button"
            onClick={cycleSpeed}
            className="px-2.5 py-2 text-xs font-mono font-bold bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/20 rounded-xs transition-colors cursor-pointer shadow-2xs"
            title="Toggle Audio Playback Speed"
          >
            {audioSpeed}x
          </button>

          <button
            id="btn-play-voice-debate"
            type="button"
            onClick={togglePlayAudio}
            disabled={messagesList.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
              isPlayingAudio
                ? 'bg-[#121212] hover:bg-[#2A2A2A] text-[#FDFCFB]'
                : 'bg-[#D94F33] hover:bg-[#B83A20] text-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Debate Audio</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Voice Debate</span>
              </>
            )}
          </button>

          <button
            id="btn-skip-debate-turn"
            type="button"
            onClick={skipNextTurn}
            disabled={currentMessageIndex >= messagesList.length - 1 || messagesList.length === 0}
            className="p-2 rounded-xs bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/20 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Next Speaker"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            id="btn-restart-debate-turn"
            type="button"
            onClick={resetDebatePlayback}
            disabled={messagesList.length === 0}
            className="p-2 rounded-xs bg-[#FFFFFF] hover:bg-[#F4F1EA] text-[#121212] border border-[#121212]/20 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
            title="Restart from Round 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Disputed Topics Overview Banner */}
      {disputesList.length > 0 && (
        <div className="p-5 rounded-xs bg-[#FFFFFF] border border-[#121212]/15 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/10">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#121212] flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#D94F33]" />
              <span>Identified Key Committee Disagreements ({disputesList.length})</span>
            </span>
            <span className="text-xs text-[#57534E] font-serif-editorial italic">Targeted Multi-Turn Dialectic</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {disputesList.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xs bg-[#FDFCFB] border border-[#121212]/15 flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#121212] bg-[#EFECE7] px-1.5 py-0.5 rounded-xs border border-[#121212]/10">{d.id}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                        d.tensionLevel === 'high'
                          ? 'bg-[#FDF0EE] text-[#A82A2A] border border-[#F0C4BD]'
                          : 'bg-[#FAF0E6] text-[#8C510A] border border-[#E5CFB8]'
                      }`}
                    >
                      {d.tensionLevel?.toUpperCase() || 'MEDIUM'} TENSION
                    </span>
                  </div>
                  <h4 className="text-sm font-serif-editorial font-bold text-[#121212]">{d.topic}</h4>
                  <p className="text-xs text-[#57534E] mt-1 leading-relaxed">{d.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#121212]/10 text-xs">
                  <span className="text-[#57534E] font-mono text-[11px]">
                    {d.initiatingAgent?.toUpperCase()} vs {d.opposingAgent?.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1">
                    {(d.coreEvidenceIds || []).map((eid) => (
                      <EvidenceBadge
                        key={eid}
                        id={eid}
                        evidenceStore={evidenceStore}
                        onSelectEvidence={onSelectEvidence}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debate Timeline Messages */}
      {messagesList.length === 0 ? (
        <div className="p-8 text-center bg-[#FFFFFF] border border-[#121212]/15 rounded-xs space-y-3">
          <MessageSquare className="w-8 h-8 text-[#D94F33] mx-auto opacity-70" />
          <h4 className="font-serif-editorial font-bold text-base text-[#121212]">Debate Not Yet Initialized</h4>
          <p className="text-xs text-[#57534E] max-w-md mx-auto">
            Click "Run Agent Debate" in the top header bar to trigger the multi-turn adversarial deliberation across Technical, HR, Hiring Manager, and Skeptic agents.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messagesList.map((msg, index) => {
            const meta = getSpeakerMeta(msg.speaker);
            const isCurrentlySpeaking = isPlayingAudio && currentMessageIndex === index;

            return (
              <div
                key={msg.id || `msg-${index}`}
                id={`debate-message-${msg.id || index}`}
                className={`p-5 sm:p-6 rounded-xs border transition-all shadow-2xs ${
                  isCurrentlySpeaking
                    ? 'bg-[#FAF0E6]/60 border-[#D94F33] ring-1 ring-[#D94F33]'
                    : 'bg-[#FFFFFF] border-[#121212]/15 hover:border-[#121212]/30'
                }`}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-[#121212]/10">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-xs ${meta.avatarBg} flex items-center justify-center shadow-xs`}>
                      {meta.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif-editorial font-bold text-sm text-[#121212]">{msg.speakerName}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-0.5 rounded-xs border ${meta.badgeColor}`}>
                          {msg.speaker?.toUpperCase()}
                        </span>
                      </div>
                      {msg.respondingTo && (
                        <span className="text-[11px] text-[#57534E] flex items-center gap-1 mt-0.5 font-serif-editorial italic">
                          <span>responding to</span>
                          <span className="font-bold text-[#121212] uppercase font-sans text-[10px]">
                            {msg.respondingTo.replace('_', ' ')}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-xs bg-[#EFECE7] text-[#121212] border border-[#121212]/15">
                      Round {msg.round}
                    </span>
                    {getStanceBadge(msg.stance)}
                    <button
                      type="button"
                      onClick={() => speakTurn(index)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        isCurrentlySpeaking ? 'text-[#D94F33] bg-[#FAF0E6]' : 'text-[#57534E] hover:text-[#D94F33] hover:bg-[#F4F1EA]'
                      }`}
                      title="Speak this turn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <p className="text-[13px] text-[#292524] leading-relaxed font-serif-editorial pl-2 sm:pl-4 italic">
                  "{msg.message}"
                </p>

                {/* Position Revision Highlight */}
                {msg.changedPosition && (
                  <div className="mt-3.5 sm:ml-4 p-3 rounded-xs bg-[#FAF0E6] border border-[#E5CFB8] flex items-start gap-2.5 text-xs text-[#8C510A]">
                    <Award className="w-4 h-4 text-[#C2781D] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span className="font-serif-editorial">Position Calibrated During Debate:</span>
                        <span className="font-mono text-[#57534E] line-through">{msg.previousConfidence}%</span>
                        <ArrowRight className="w-3 h-3 text-[#C2781D]" />
                        <span className="font-mono font-bold text-[#8C510A]">{msg.newConfidence}% Confidence</span>
                      </div>
                      {msg.revisionReason && (
                        <p className="text-[#57534E] text-xs mt-1 italic">
                          "{msg.revisionReason}"
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Evidence Citations Footer */}
                {msg.evidenceIds && msg.evidenceIds.length > 0 && (
                  <div className="mt-3.5 sm:ml-4 pt-2.5 border-t border-[#121212]/10 flex items-center gap-2 text-xs">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#57534E]">Cited Evidence:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.evidenceIds.map((eid) => (
                        <EvidenceBadge
                          key={eid}
                          id={eid}
                          evidenceStore={evidenceStore}
                          onSelectEvidence={onSelectEvidence}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

