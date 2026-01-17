import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Book, Layers, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudyPack } from '@/types';
import { Flashcard } from './Flashcard';
import { Quiz } from './Quiz';

type Tab = 'summary' | 'notes' | 'terms' | 'flashcards' | 'quiz';

interface StudyPackViewProps {
  pack: StudyPack;
  onBack: () => void;
  onAskAI: (context: string) => void;
}

export function StudyPackView({ pack, onBack, onAskAI }: StudyPackViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({});
  const [expandedTerms, setExpandedTerms] = useState<Record<number, boolean>>({});

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'summary', label: 'Summary', icon: Lightbulb },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'terms', label: 'Terms', icon: Book },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">{pack.meta.chapter_title}</h1>
          <p className="text-muted-foreground">{pack.meta.subject} • {pack.meta.grade}</p>
        </div>
        
        <div className="container mx-auto px-4 pb-0">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="bg-card border rounded-2xl p-6 border-l-4 border-l-primary">
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">TL;DR</h3>
                  <Button size="sm" variant="ghost" onClick={() => onAskAI(pack.summary.tl_dr)} className="ml-auto">
                    <Sparkles className="w-4 h-4 mr-1" /> Ask AI
                  </Button>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">{pack.summary.tl_dr}</p>
              </div>
              <div className="bg-card border rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
                <div className="space-y-3">
                  {pack.summary.important_points.map((point, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">{idx + 1}</div>
                      <p className="text-muted-foreground pt-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {pack.notes.map((section, idx) => (
                <div key={idx} className="bg-card border rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedNotes(p => ({ ...p, [idx]: !p[idx] }))} className="w-full flex items-center justify-between p-4 hover:bg-muted/50">
                    <span className="font-semibold">{section.title}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedNotes[idx] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedNotes[idx] && <div className="px-4 pb-4 text-muted-foreground">{section.content}</div>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              {pack.key_terms.map((term, idx) => (
                <div key={idx} className="bg-card border rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedTerms(p => ({ ...p, [idx]: !p[idx] }))} className="w-full flex items-center justify-between p-4 hover:bg-muted/50">
                    <span className="font-semibold">{term.term}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedTerms[idx] ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedTerms[idx] && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground mb-2">{term.meaning}</p>
                      {term.example && <p className="text-sm italic text-muted-foreground">Ex: "{term.example}"</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="max-w-xl mx-auto">
              <Flashcard card={pack.flashcards[flashcardIndex]} onAskAI={onAskAI} />
              <div className="flex items-center justify-between mt-6">
                <Button variant="outline" onClick={() => setFlashcardIndex(i => Math.max(0, i - 1))} disabled={flashcardIndex === 0}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-muted-foreground">{flashcardIndex + 1} / {pack.flashcards.length}</span>
                <Button variant="outline" onClick={() => setFlashcardIndex(i => Math.min(pack.flashcards.length - 1, i + 1))} disabled={flashcardIndex === pack.flashcards.length - 1}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && <Quiz questions={pack.quiz.questions} onAskAI={onAskAI} />}
        </motion.div>
      </main>
    </div>
  );
}
