import React, { useState, useEffect } from 'react';
import { Hash, Trophy, RotateCcw, CheckCircle2, XCircle, Star, ChevronRight, Calculator, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

// --- Types & Utilities ---

type Player = 'Gor' | 'Gayane';

interface NumberTask {
  number: number;
  word: string;
  options: string[];
}

const numToSpanish = (n: number): string => {
  const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const specials = {
    10: 'diez', 11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
    16: 'dieziséis', 17: 'diezisiete', 18: 'dieziocho', 19: 'diezinueve',
    20: 'veinte', 21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés', 24: 'veinticuatro',
    25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete', 28: 'veintiocho', 29: 'veintinueve'
  };
  const hundreds = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  if (n === 100) return 'cien';
  if (n === 1000) return 'mil';

  let result = '';
  
  // Hundreds
  const h = Math.floor(n / 100);
  result += hundreds[h];

  // Tens and Units
  const rest = n % 100;
  if (rest > 0) {
    result += ' ';
    if (rest < 30) {
      if (specials[rest as keyof typeof specials]) {
        result += specials[rest as keyof typeof specials];
      } else {
        const t = Math.floor(rest / 10);
        const u = rest % 10;
        result += tens[t] + (u > 0 ? ' y ' + units[u] : '');
      }
    } else {
      const t = Math.floor(rest / 10);
      const u = rest % 10;
      result += tens[t] + (u > 0 ? ' y ' + units[u] : '');
    }
  }

  return result.trim();
};

const generateTasks = (count: number): NumberTask[] => {
  const tasks: NumberTask[] = [];
  for (let i = 0; i < count; i++) {
    const num = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    const word = numToSpanish(num);
    const options = [word];
    
    while (options.length < 3) {
      const wrongNum = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
      const wrongWord = numToSpanish(wrongNum);
      if (!options.includes(wrongWord)) {
        options.push(wrongWord);
      }
    }
    
    tasks.push({
      number: num,
      word: word,
      options: options.sort(() => Math.random() - 0.5)
    });
  }
  return tasks;
};

// --- Components ---

const PlayerScore = ({ name, score, active, color }: { name: string, score: number, active: boolean, color: string }) => (
  <motion.div 
    animate={{ scale: active ? 1.05 : 1, opacity: active ? 1 : 0.6 }}
    className={`p-4 rounded-3xl border-2 transition-all bg-slate-900 ${active ? `border-${color}-500 shadow-lg shadow-${color}-500/20` : 'border-slate-800'}`}
  >
    <div className="flex justify-between items-center px-2">
      <span className="text-xs font-black uppercase tracking-widest text-slate-500">{name}</span>
      <span className={`text-2xl font-black italic text-${color}-400`}>{score}</span>
    </div>
  </motion.div>
);

export default function NumberMasterQuest() {
  const [tasks, setTasks] = useState<NumberTask[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');

  useEffect(() => {
    if (gameState === 'playing') {
      setTasks(generateTasks(15));
      setScore(0);
      setCurrentIdx(0);
    }
  }, [gameState]);

  const handleAnswer = (option: string) => {
    const isCorrect = option === tasks[currentIdx].word;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setTimeout(nextTask, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const nextTask = () => {
    setFeedback(null);
    if (currentIdx + 1 < tasks.length) {
      setCurrentIdx(i => i + 1);
    } else {
      setGameState('end');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans text-center">
        <Hash size={120} className="text-sky-500 mb-8 animate-pulse" />
        <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter mb-4">
          Números <span className="text-sky-500">100-1000</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mb-12">Թվերի Մագիստրոս: Ստուգիր քո գիտելիքները</p>
        <button 
          onClick={() => setGameState('playing')}
          className="px-12 py-6 bg-sky-600 rounded-full font-black text-2xl uppercase tracking-widest hover:bg-sky-500 transition-all hover:scale-105"
        >
          Սկսել Խաղը
        </button>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center space-y-12">
        <Trophy size={160} className="text-yellow-400 animate-bounce" />
        <div className="space-y-4">
           <h1 className="text-6xl font-black uppercase italic tracking-tighter">Ավարտ!</h1>
           <div className="text-4xl font-black italic text-sky-400 font-sans">
              Քո միավորները: {score}
           </div>
        </div>
        <button 
          onClick={() => setGameState('start')}
          className="flex items-center gap-4 px-12 py-6 bg-slate-900 border-2 border-slate-800 rounded-full font-black text-xl uppercase tracking-widest hover:border-sky-500 transition-all"
        >
          <RotateCcw /> Մի անգամ էլ
        </button>
      </div>
    );
  }

  const currentTask = tasks[currentIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center space-y-12">
        
        {/* Score Display (Simple) */}
        <div className="flex justify-center">
          <div className="px-12 py-4 bg-slate-900 border-2 border-sky-500/30 rounded-full shadow-lg shadow-sky-500/10">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 mr-4">Միավորներ</span>
            <span className="text-3xl font-black italic text-sky-400">{score}</span>
          </div>
        </div>

        {/* Task Area */}
        <AnimatePresence mode="wait">
          {currentTask && (
            <motion.div 
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-16 text-center space-y-12 shadow-2xl relative overflow-hidden"
            >
              <div className="space-y-4">
                 <div className="flex items-center justify-center gap-2 text-sky-500 mb-4">
                    <Calculator size={24} />
                    <span className="font-black uppercase tracking-[0.3em] text-xs">Ի՞նչպես է գրվում այս թիվը:</span>
                 </div>
                 <h2 className="text-9xl md:text-[12rem] font-black italic tracking-tighter leading-none text-white select-none">
                   {currentTask.number}
                 </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentTask.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`p-6 rounded-2xl font-black text-2xl md:text-3xl uppercase tracking-tighter border-2 transition-all ${
                      feedback === 'correct' && opt === currentTask.word ? 'bg-emerald-500 border-emerald-400 scale-105' :
                      feedback === 'wrong' && opt !== currentTask.word ? 'opacity-30 grayscale' :
                      'bg-slate-950 border-slate-800 hover:border-sky-500 hover:scale-[1.02]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md z-20 ${feedback === 'correct' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}
                  >
                     {feedback === 'correct' ? (
                       <CheckCircle2 size={100} className="text-emerald-500 mb-4" />
                     ) : (
                       <XCircle size={100} className="text-rose-500 mb-4" />
                     )}
                     <span className={`text-4xl font-black uppercase italic tracking-tighter ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {feedback === 'correct' ? 'Ճիշտ է!' : 'Սխալ է!'}
                     </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        <div className="flex justify-center items-center text-slate-600 font-black uppercase tracking-widest text-[10px]">
           <div className="flex items-center gap-2">
              <Star size={14} className="text-sky-500" />
              Քայլ {currentIdx + 1} / 15
           </div>
        </div>
      </div>
    </div>
  );
}
