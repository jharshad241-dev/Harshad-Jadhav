import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IconRenderer } from './IconRenderer';
import { playHygieneSound } from '../utils/hygieneSounds';
import { HYGIENE_QUIZ_QUESTIONS } from '../data/hygieneData';

interface GermTarget {
  id: number;
  type: 'germ' | 'bacteria' | 'pollution' | 'soap' | 'sanitizer' | 'water';
  x: number; // percentage 5% to 90%
  y: number; // percentage 10% to 85%
  size: number; // 38px to 64px
  points: number;
  emoji: string;
  label: string;
  createdAt: number;
  lifespan: number; // ms before it disappears
}

interface HygieneGameProps {
  onScoreEarned?: (points: number) => void;
}

export const HygieneGame: React.FC<HygieneGameProps> = ({ onScoreEarned }) => {
  const [activeTab, setActiveTab] = useState<'arcade' | 'quiz'>('arcade');

  // Arcade Game State
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('hygiene_game_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [health, setHealth] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [combo, setCombo] = useState<number>(1);
  const [targets, setTargets] = useState<GermTarget[]>([]);
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const nextTargetIdRef = useRef<number>(1);
  const splashIdRef = useRef<number>(1);

  const triggerSound = useCallback((type: 'alert' | 'success' | 'pop' | 'hit' | 'complete' | 'levelUp' | 'splash') => {
    if (soundEnabled) {
      playHygieneSound(type);
    }
  }, [soundEnabled]);

  // Start Arcade Game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setHealth(3);
    setTimeLeft(40);
    setCombo(1);
    setTargets([]);
    setSplashes([]);
    triggerSound('levelUp');
  };

  // Spawn Target helper
  const spawnTarget = useCallback(() => {
    const types: ('germ' | 'bacteria' | 'pollution' | 'soap' | 'sanitizer' | 'water')[] = [
      'germ', 'germ', 'bacteria', 'pollution', 'soap', 'sanitizer', 'water'
    ];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    let emoji = '🦠';
    let label = 'Germ';
    let points = 10;
    let size = 48;
    let lifespan = 3200;

    if (chosenType === 'bacteria') {
      emoji = '🧫';
      label = 'Microbe';
      points = 15;
      size = 44;
      lifespan = 2800;
    } else if (chosenType === 'pollution') {
      emoji = '💨';
      label = 'Pollutant';
      points = 20;
      size = 52;
      lifespan = 2600;
    } else if (chosenType === 'soap') {
      emoji = '🧼';
      label = 'Handwash (+35)';
      points = 35;
      size = 46;
      lifespan = 3000;
    } else if (chosenType === 'sanitizer') {
      emoji = '🧴';
      label = 'Sanitizer (+40)';
      points = 40;
      size = 48;
      lifespan = 2900;
    } else if (chosenType === 'water') {
      emoji = '💧';
      label = 'Pure Water (+25)';
      points = 25;
      size = 42;
      lifespan = 3000;
    }

    const newTarget: GermTarget = {
      id: nextTargetIdRef.current++,
      type: chosenType,
      x: Math.floor(Math.random() * 78) + 8,
      y: Math.floor(Math.random() * 68) + 12,
      size,
      points,
      emoji,
      label,
      createdAt: Date.now(),
      lifespan,
    };

    setTargets((prev) => [...prev.slice(-7), newTarget]);
  }, []);

  // Main game tick: countdown timer & target expiration
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawner = setInterval(() => {
      spawnTarget();
    }, 850);

    // Target lifetime cleanup & miss penalty
    const cleaner = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => {
        const remaining: GermTarget[] = [];
        let lostHealth = false;

        for (const t of prev) {
          if (now - t.createdAt > t.lifespan) {
            // If an uncleaned bad germ despawns, lose a heart!
            if (t.type === 'germ' || t.type === 'bacteria' || t.type === 'pollution') {
              lostHealth = true;
            }
          } else {
            remaining.push(t);
          }
        }

        if (lostHealth) {
          setHealth((h) => {
            const nextH = h - 1;
            if (nextH <= 0) {
              endGame();
              return 0;
            }
            triggerSound('hit');
            return nextH;
          });
          setCombo(1);
        }

        return remaining;
      });
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(cleaner);
    };
  }, [gameState, spawnTarget, triggerSound]);

  const endGame = useCallback(() => {
    setGameState('gameover');
    setTargets([]);
    triggerSound('complete');

    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        try {
          localStorage.setItem('hygiene_game_highscore', currentScore.toString());
        } catch {}
      }
      if (onScoreEarned && currentScore > 0) {
        onScoreEarned(currentScore);
      }
      return currentScore;
    });
  }, [highScore, onScoreEarned, triggerSound]);

  // Handle clicking / tapping a germ or hygiene powerup
  const handleHitTarget = (target: GermTarget, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    // Calculate score with combo
    const gained = target.points * combo;
    setScore((s) => s + gained);
    setCombo((c) => Math.min(c + 1, 5));

    // Sounds
    if (target.type === 'soap' || target.type === 'sanitizer' || target.type === 'water') {
      triggerSound('splash');
    } else {
      triggerSound('pop');
    }

    // Visual floating splash text
    const rect = gameAreaRef.current?.getBoundingClientRect();
    const xPos = rect ? e.clientX - rect.left : target.x;
    const yPos = rect ? e.clientY - rect.top : target.y;

    const newSplash = {
      id: splashIdRef.current++,
      x: xPos,
      y: yPos,
      text: `+${gained} ${combo > 1 ? `(x${combo})` : ''}`,
    };
    setSplashes((prev) => [...prev, newSplash]);
    setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => s.id !== newSplash.id));
    }, 800);

    // Remove the tapped target
    setTargets((prev) => prev.filter((t) => t.id !== target.id));
  };

  // Misclick on clean area
  const handleAreaMiss = () => {
    if (gameState !== 'playing') return;
    setCombo(1);
  };

  // Quiz Handling
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const q = HYGIENE_QUIZ_QUESTIONS[currentQuizIdx];

    if (selectedOption === q.correctIndex) {
      setQuizScore((s) => s + 50);
      triggerSound('success');
      if (onScoreEarned) onScoreEarned(50);
    } else {
      triggerSound('hit');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx < HYGIENE_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIdx((idx) => idx + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      triggerSound('levelUp');
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="rounded-3xl bg-neutral-900/90 border border-emerald-500/30 p-4 sm:p-6 shadow-2xl space-y-5">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <IconRenderer name="Gamepad2" className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
              <IconRenderer name="Sparkles" className="w-3 h-3 text-emerald-400" />
              <span>INTERACTIVE HYGIENE PLAY</span>
            </div>
            <h2 className="text-xl font-extrabold font-serif text-white">
              Health & Hygiene Game Suite
            </h2>
            <p className="text-xs text-neutral-400">
              Bust germs in fast reflex rush or test your grooming & scalp knowledge
            </p>
          </div>
        </div>

        {/* Tab Switcher & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-neutral-800 text-neutral-500 border-neutral-700'
            }`}
            title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
          >
            <IconRenderer name={soundEnabled ? 'Volume2' : 'VolumeX'} className="w-4 h-4" />
          </button>

          <div className="flex bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('arcade')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'arcade'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <IconRenderer name="Zap" className="w-3.5 h-3.5" />
              <span>Germ Buster Rush</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <IconRenderer name="BrainCircuit" className="w-3.5 h-3.5" />
              <span>Hygiene Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODE 1: GERMBUSHER ARCADE ================= */}
      {activeTab === 'arcade' && (
        <div className="space-y-4">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">Score</span>
              <span className="text-lg font-black font-mono text-emerald-400">{score}</span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">Time</span>
              <span className={`text-lg font-black font-mono ${timeLeft < 10 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">Hygiene Health</span>
              <div className="flex gap-1 text-rose-500 text-sm">
                {[...Array(3)].map((_, i) => (
                  <span key={i} className={i < health ? 'opacity-100 scale-100' : 'opacity-25 grayscale scale-90'}>
                    ❤️
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">Best Score</span>
              <span className="text-lg font-black font-mono text-amber-300">👑 {highScore}</span>
            </div>
          </div>

          {/* Game Arena Canvas */}
          <div
            ref={gameAreaRef}
            onClick={handleAreaMiss}
            className="relative w-full h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-2 border-emerald-500/40 overflow-hidden shadow-inner cursor-crosshair select-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.07) 0%, transparent 70%)',
            }}
          >
            {/* Arena Grid Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

            {/* Active Combo Badge */}
            {gameState === 'playing' && combo > 1 && (
              <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-xs font-black font-mono animate-bounce z-20">
                ⚡ COMBO x{combo}!
              </div>
            )}

            {/* Floating Score Splash Effects */}
            {splashes.map((s) => (
              <div
                key={s.id}
                className="absolute pointer-events-none font-mono font-black text-xs sm:text-sm text-emerald-300 drop-shadow-lg animate-fade-out -translate-y-6 z-30"
                style={{ left: s.x, top: s.y }}
              >
                {s.text}
              </div>
            ))}

            {/* IDLE SCREEN */}
            {gameState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-neutral-950/80 backdrop-blur-sm z-30">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 animate-pulse">
                  🧼
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="text-xl font-black font-serif text-white">
                    Germ Buster: Clean Rush
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Microbes, bacteria, and dust are invading skin pores! Tap germs before they linger. Catch luxury soaps, water drops, and sanitizers for bonus combos!
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400 font-mono py-1">
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">🦠 Germ = 10 pts</span>
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">🧫 Microbe = 15 pts</span>
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">🧼 Soap = 35 pts</span>
                  <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800">🧴 Sanitizer = 40 pts</span>
                </div>
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-neutral-950 font-black text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/30 transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <IconRenderer name="Play" className="w-5 h-5 fill-neutral-950" />
                  <span>Start Game Now</span>
                </button>
              </div>
            )}

            {/* GAMEOVER SCREEN */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-neutral-950/90 backdrop-blur-md z-30 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
                  {score >= 500 ? '👑' : score >= 250 ? '🌟' : '🧼'}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    MISSION COMPLETE
                  </span>
                  <h3 className="text-2xl font-black font-serif text-white">
                    {score >= 500 ? 'Sanitization Master!' : score >= 250 ? 'Cleanliness Champion!' : 'Hygiene Defender!'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    You eradicated impurities and defended skin health!
                  </p>
                </div>

                <div className="flex gap-4 text-center">
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 min-w-[100px]">
                    <span className="text-[10px] text-neutral-500 font-mono block">FINAL SCORE</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">{score}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 min-w-[100px]">
                    <span className="text-[10px] text-neutral-500 font-mono block">BEST RECORD</span>
                    <span className="text-2xl font-black font-mono text-amber-400">👑 {highScore}</span>
                  </div>
                </div>

                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105 cursor-pointer flex items-center gap-2"
                >
                  <IconRenderer name="RotateCcw" className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            )}

            {/* ACTIVE SPAWNED TARGETS */}
            {gameState === 'playing' &&
              targets.map((target) => (
                <button
                  key={target.id}
                  onClick={(e) => handleHitTarget(target, e)}
                  style={{
                    left: `${target.x}%`,
                    top: `${target.y}%`,
                    width: `${target.size}px`,
                    height: `${target.size}px`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl flex flex-col items-center justify-center transition-transform active:scale-90 hover:scale-110 shadow-lg cursor-pointer animate-scale-in z-20 ${
                    target.type === 'soap' || target.type === 'sanitizer' || target.type === 'water'
                      ? 'bg-gradient-to-br from-cyan-500/30 to-emerald-500/40 border-2 border-cyan-400 shadow-cyan-500/30'
                      : 'bg-gradient-to-br from-neutral-900/90 to-rose-950/80 border-2 border-rose-500/50 shadow-rose-500/20'
                  }`}
                  title={`${target.label} (+${target.points})`}
                >
                  <span className="text-xl sm:text-2xl drop-shadow">{target.emoji}</span>
                  <span className="text-[9px] font-mono font-bold text-white/90 leading-tight">
                    +{target.points}
                  </span>
                </button>
              ))}
          </div>

          {/* Quick instructions bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 px-2">
            <span>💡 Pro-tip: Keep your combo high by tapping swiftly without clicking empty space.</span>
            <span className="text-emerald-400 font-bold font-mono">1 Heart lost if bad germs escape!</span>
          </div>
        </div>
      )}

      {/* ================= MODE 2: HYGIENE & TRICHOLOGY QUIZ ================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {!quizFinished ? (
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 space-y-5">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs border-b border-neutral-800 pb-3">
                <span className="font-mono font-bold text-emerald-400">
                  Question {currentQuizIdx + 1} of {HYGIENE_QUIZ_QUESTIONS.length}
                </span>
                <span className="font-mono font-bold text-amber-300">
                  Quiz Points: {quizScore}
                </span>
              </div>

              {/* Question Title */}
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].question}
              </h3>

              {/* Options List */}
              <div className="space-y-2.5">
                {HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].options.map((option, idx) => {
                  let btnClass = 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-200';

                  if (selectedOption === idx) {
                    btnClass = 'bg-emerald-950/60 border-emerald-500 text-emerald-300';
                  }

                  if (isAnswerSubmitted) {
                    if (idx === HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].correctIndex) {
                      btnClass = 'bg-emerald-900/60 border-emerald-400 text-emerald-200 font-bold';
                    } else if (selectedOption === idx) {
                      btnClass = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    } else {
                      btnClass = 'bg-neutral-900/50 border-neutral-800 text-neutral-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && idx === HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].correctIndex && (
                        <IconRenderer name="CheckCircle2" className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswerSubmitted && selectedOption === idx && idx !== HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].correctIndex && (
                        <IconRenderer name="XCircle" className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Action */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-700 space-y-2 animate-fade-in text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <IconRenderer name="Lightbulb" className="w-4 h-4 text-amber-400" />
                    <span>Scientific Insight:</span>
                  </div>
                  <p className="text-neutral-300">
                    {HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].explanation}
                  </p>
                  <p className="text-amber-300/90 font-mono text-[11px] pt-1">
                    🌟 <span className="font-bold">Pro-Tip:</span> {HYGIENE_QUIZ_QUESTIONS[currentQuizIdx].tip}
                  </p>
                </div>
              )}

              {/* Submit / Next Button */}
              <div className="flex justify-end pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <span>{currentQuizIdx < HYGIENE_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                    <IconRenderer name="ChevronRight" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Results Finished */
            <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-500/20">
                🎓
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  KNOWLEDGE EVALUATION
                </span>
                <h3 className="text-2xl font-black font-serif text-white">
                  Hygiene & Scalp Certified!
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  You scored <span className="text-emerald-400 font-bold font-mono">{quizScore} points</span>. You know the exact secrets to keep your skin, scalp, and hands clean, hydrated, and protected.
                </p>
              </div>

              <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div className="text-left">
                  <span className="text-[10px] text-neutral-500 font-mono block">FINAL SCORE</span>
                  <span className="text-xl font-black font-mono text-emerald-400">+{quizScore} pts</span>
                </div>
                <div className="h-8 w-px bg-neutral-800" />
                <div className="text-left">
                  <span className="text-[10px] text-neutral-500 font-mono block">ACCURACY</span>
                  <span className="text-xl font-black font-mono text-amber-400">
                    {Math.round((quizScore / (HYGIENE_QUIZ_QUESTIONS.length * 50)) * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <IconRenderer name="RotateCcw" className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
