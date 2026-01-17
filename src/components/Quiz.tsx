import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/types';

interface QuizProps {
  questions: QuizQuestion[];
  onAskAI: (context: string) => void;
}

export function Quiz({ questions, onAskAI }: QuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[currentIdx];
  const isCorrect = selected === current?.correct_index;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === current.correct_index) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setCurrentIdx(i => i + 1);
  };

  if (currentIdx >= questions.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-6 shadow-glow">
          <CheckCircle className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
        <p className="text-xl text-muted-foreground">You scored {score} out of {questions.length}</p>
        <Button onClick={() => { setCurrentIdx(0); setScore(0); }} className="mt-6">Try Again</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm text-muted-foreground">Question {currentIdx + 1} of {questions.length}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          current.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          current.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>{current.difficulty}</span>
      </div>

      <div className="bg-card border rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-medium mb-6">{current.question}</h3>
        <div className="space-y-3">
          {current.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                showResult
                  ? idx === current.correct_index
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : idx === selected
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'opacity-50'
                  : 'hover:bg-muted hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {showResult && idx === current.correct_index && <CheckCircle className="w-5 h-5 text-green-600" />}
                {showResult && idx === selected && idx !== current.correct_index && <XCircle className="w-5 h-5 text-red-600" />}
                <span>{opt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-muted rounded-xl p-4 mb-6">
          <p className="font-medium mb-2">{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</p>
          <p className="text-muted-foreground text-sm">{current.explanation}</p>
          <button onClick={() => onAskAI(`Quiz: ${current.question}\nAnswer: ${current.options[current.correct_index]}\nExplanation: ${current.explanation}`)} className="flex items-center gap-2 text-sm text-primary mt-2">
            <Sparkles className="w-4 h-4" /> Learn more
          </button>
        </motion.div>
      )}

      {showResult && (
        <Button onClick={handleNext} className="w-full gradient-primary text-primary-foreground">
          {currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}
        </Button>
      )}
    </div>
  );
}
