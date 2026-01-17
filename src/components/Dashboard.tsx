import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, LogOut, Settings, Trash2, Calendar, GraduationCap, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useStudyPacks } from '@/hooks/useStudyPacks';
import { StudyPack } from '@/types';
import { CreatePackForm } from './CreatePackForm';
import { StudyPackView } from './StudyPackView';
import { ChatBot } from './ChatBot';
import { ThemeCustomizer } from './ThemeCustomizer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';

type View = 'dashboard' | 'create' | 'study';

export function Dashboard() {
  const { user, profile, signOut, updateProfile } = useAuth();
  const { packs, loading, generating, generatePack, deletePack } = useStudyPacks();
  const [view, setView] = useState<View>('dashboard');
  const [activePack, setActivePack] = useState<StudyPack | null>(null);
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGenerate = async (input: any) => {
    const pack = await generatePack(input);
    if (pack) {
      setActivePack(pack);
      setView('study');
    }
  };

  const handleOpenPack = (pack: StudyPack) => {
    setActivePack(pack);
    setView('study');
  };

  const handleAskAI = (context: string) => {
    setChatContext(context);
  };

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-background">
        <CreatePackForm
          onBack={() => setView('dashboard')}
          onGenerate={handleGenerate}
          generating={generating}
        />
      </div>
    );
  }

  if (view === 'study' && activePack) {
    return (
      <div className="min-h-screen bg-background">
        <StudyPackView
          pack={activePack}
          onBack={() => {
            setView('dashboard');
            setActivePack(null);
          }}
          onAskAI={handleAskAI}
        />
        <ChatBot
          context={chatContext}
          onClearContext={() => setChatContext(undefined)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold hidden sm:inline">Notepilot</span>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button onClick={() => setView('create')} className="gradient-primary text-primary-foreground shadow-glow">
              <Plus className="w-4 h-4 mr-2" />
              New Study Pack
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end mb-6">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Signed in as</p>
                <p className="font-medium">{profile?.name || user?.email}</p>
                <div className="border-t pt-4 space-y-2">
                  <Button 
                    onClick={() => { setView('create'); setMobileMenuOpen(false); }} 
                    className="w-full gradient-primary text-primary-foreground"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Study Pack
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => { setShowSettings(true); setMobileMenuOpen(false); }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-muted-foreground">Ready to learn something new today?</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : packs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-card border rounded-2xl"
            >
              <div className="w-20 h-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-6 shadow-glow">
                <BookOpen className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No study packs yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create your first study pack by uploading content or pasting text.
              </p>
              <Button 
                onClick={() => setView('create')}
                className="gradient-primary text-primary-foreground shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Pack
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Card */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('create')}
                className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all min-h-[200px] flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-7 h-7 text-primary" />
                </div>
                <span className="font-semibold text-primary">Create New Pack</span>
              </motion.button>

              {/* Study Pack Cards */}
              {packs.map((pack, i) => (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border rounded-2xl p-6 card-hover cursor-pointer group relative"
                  onClick={() => handleOpenPack(pack)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePack(pack.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-soft">
                      <GraduationCap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{pack.meta.chapter_title}</h3>
                      <p className="text-sm text-muted-foreground">{pack.meta.subject} • {pack.meta.grade}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {pack.summary.tl_dr}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(pack.createdAt, { addSuffix: true })}</span>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <span className="px-2 py-1 bg-muted rounded-md text-xs">
                      {pack.flashcards.length} cards
                    </span>
                    <span className="px-2 py-1 bg-muted rounded-md text-xs">
                      {pack.quiz.questions.length} questions
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <ThemeCustomizer
            currentTheme={profile?.theme || 'default'}
            currentFont={profile?.font || 'Inter'}
            currentShape={profile?.shape || 'default'}
            onChange={(updates) => updateProfile(updates)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
