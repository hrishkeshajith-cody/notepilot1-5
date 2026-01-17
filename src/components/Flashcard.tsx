import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FlashcardItem } from '@/types';

interface FlashcardProps {
  card: FlashcardItem;
  onAskAI: (context: string) => void;
}

export function Flashcard({ card, onAskAI }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="perspective-1000" onClick={() => setFlipped(!flipped)}>
      <motion.div
        className="relative w-full aspect-[3/2] cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div className="absolute inset-0 bg-card border rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden shadow-soft">
          <p className="text-xl font-medium text-center">{card.q}</p>
          <p className="text-sm text-muted-foreground mt-4">Click to flip</p>
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 gradient-primary rounded-2xl p-8 flex flex-col items-center justify-center shadow-glow"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <p className="text-xl font-medium text-center text-primary-foreground">{card.a}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onAskAI(`Flashcard: Q: ${card.q} A: ${card.a}`); }}
            className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <Sparkles className="w-4 h-4" /> Ask AI
          </button>
        </div>
      </motion.div>
    </div>
  );
}
