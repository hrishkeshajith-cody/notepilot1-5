import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Book, Layers, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudyPack } from '@/types';
import { Flashcard } from './Flashcard';
import { Quiz } from './Quiz';

type Tab = 'summary' | 'notes' | 'terms' | 'flashcards' | 'quiz' | 'questions';

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

  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});
  const [activeMarkFilter, setActiveMarkFilter] = useState<1 | 3 | 5 | 'all'>('all');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'summary', label: 'Summary', icon: Lightbulb },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'terms', label: 'Terms', icon: Book },
    { id: 'flashcards', label: 'Cards', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: CheckCircle },
    { id: 'questions', label: 'Important Q', icon: HelpCircle },
  ];

  const filteredQuestions = pack.important_questions?.filter(
    q => activeMarkFilter === 'all' || q.marks === activeMarkFilter
  ) || [];

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

          {activeTab === 'questions' && (
            <div className="space-y-8">
              {/* Hero Header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8 border border-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/20 backdrop-blur-sm">
                      <HelpCircle className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Important Questions</h2>
                      <p className="text-muted-foreground text-sm">Master these for exam success ✨</p>
                    </div>
                  </div>
                  
                  {/* Filter Pills */}
                  <div className="flex gap-3 flex-wrap mt-6">
                    {([
                      { value: 'all' as const, label: 'All', emoji: '📚', color: 'from-primary to-primary' },
                      { value: 1 as const, label: '1 Mark', emoji: '⚡', color: 'from-emerald-500 to-green-600' },
                      { value: 3 as const, label: '3 Marks', emoji: '🎯', color: 'from-amber-500 to-orange-500' },
                      { value: 5 as const, label: '5 Marks', emoji: '🏆', color: 'from-rose-500 to-red-600' },
                    ]).map((filter) => (
                      <motion.button
                        key={filter.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveMarkFilter(filter.value)}
                        className={`relative px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                          activeMarkFilter === filter.value
                            ? `bg-gradient-to-r ${filter.color} text-white shadow-lg shadow-primary/25`
                            : 'bg-card border border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        <span className="mr-1.5">{filter.emoji}</span>
                        {filter.label}
                        {activeMarkFilter === filter.value && (
                          <motion.div
                            layoutId="activeFilter"
                            className="absolute inset-0 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
              
              {filteredQuestions.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-card/50 rounded-3xl border border-dashed border-border"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <HelpCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">No questions for this filter</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">Try selecting a different category</p>
                </motion.div>
              ) : (
                <div className="grid gap-4">
                  {filteredQuestions.map((q, idx) => {
                    const markConfig = {
                      1: { 
                        gradient: 'from-emerald-500/20 to-green-500/10',
                        border: 'border-emerald-500/30',
                        badge: 'bg-gradient-to-r from-emerald-500 to-green-600',
                        icon: '⚡',
                        label: 'Quick Answer'
                      },
                      3: { 
                        gradient: 'from-amber-500/20 to-orange-500/10',
                        border: 'border-amber-500/30',
                        badge: 'bg-gradient-to-r from-amber-500 to-orange-500',
                        icon: '🎯',
                        label: 'Short Answer'
                      },
                      5: { 
                        gradient: 'from-rose-500/20 to-red-500/10',
                        border: 'border-rose-500/30',
                        badge: 'bg-gradient-to-r from-rose-500 to-red-600',
                        icon: '🏆',
                        label: 'Long Answer'
                      }
                    }[q.marks] || { gradient: 'from-primary/20 to-primary/10', border: 'border-primary/30', badge: 'bg-primary', icon: '📝', label: 'Answer' };

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`relative overflow-hidden rounded-2xl border ${markConfig.border} bg-gradient-to-br ${markConfig.gradient} backdrop-blur-sm`}
                      >
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                        
                        <button
                          onClick={() => setExpandedQuestions(p => ({ ...p, [idx]: !p[idx] }))}
                          className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/5 transition-colors"
                        >
                          {/* Mark Badge */}
                          <div className={`flex-shrink-0 ${markConfig.badge} text-white px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg flex items-center gap-1.5`}>
                            <span>{markConfig.icon}</span>
                            <span>{q.marks}M</span>
                          </div>
                          
                          {/* Question */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground leading-relaxed pr-8">{q.question}</p>
                            <p className="text-xs text-muted-foreground mt-1.5">{markConfig.label}</p>
                          </div>
                          
                          {/* Expand Icon */}
                          <motion.div
                            animate={{ rotate: expandedQuestions[idx] ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center"
                          >
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </button>
                        
                        {/* Answer Section */}
                        <motion.div
                          initial={false}
                          animate={{ 
                            height: expandedQuestions[idx] ? 'auto' : 0,
                            opacity: expandedQuestions[idx] ? 1 : 0
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5">
                            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                                  </div>
                                  <span className="text-sm font-semibold text-primary">Model Answer</span>
                                </div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAskAI(q.question + '\n\nAnswer: ' + q.answer);
                                  }} 
                                  className="h-8 text-xs hover:bg-primary/10"
                                >
                                  <Sparkles className="w-3 h-3 mr-1" /> Explain More
                                </Button>
                              </div>
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{q.answer}</p>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Stats Footer */}
              {filteredQuestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-6 pt-4"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{pack.important_questions?.filter(q => q.marks === 1).length || 0} Quick</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{pack.important_questions?.filter(q => q.marks === 3).length || 0} Short</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>{pack.important_questions?.filter(q => q.marks === 5).length || 0} Long</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
