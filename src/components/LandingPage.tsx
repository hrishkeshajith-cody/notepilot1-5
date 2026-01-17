import { motion } from 'framer-motion';
import { BookOpen, Brain, Sparkles, FileText, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface LandingPageProps {
  onGetStarted: () => void;
}
export function LandingPage({
  onGetStarted
}: LandingPageProps) {
  const features = [{
    icon: FileText,
    title: 'Smart Summaries',
    description: 'Get instant TL;DR and key takeaways from any content'
  }, {
    icon: BookOpen,
    title: 'Detailed Notes',
    description: 'AI-generated study notes organized by topic'
  }, {
    icon: Layers,
    title: 'Flashcards',
    description: 'Memorize faster with auto-generated flashcards'
  }, {
    icon: CheckCircle,
    title: 'Practice Quizzes',
    description: 'Test your knowledge with adaptive questions'
  }, {
    icon: Brain,
    title: 'AI Tutor',
    description: 'Ask questions and get instant explanations'
  }, {
    icon: Sparkles,
    title: 'PDF Support',
    description: 'Upload PDFs and extract content automatically'
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }} />

        <nav className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Notepilot</span>
          </div>
          <Button onClick={onGetStarted} variant="outline" className="rounded-full px-6">
            Sign In
          </Button>
        </nav>

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Study Assistant
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Study Smarter,
              <br />
              
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform any content into comprehensive study materials in seconds.
              Summaries, notes, flashcards, and quizzes — all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onGetStarted} size="lg" className="rounded-full px-8 gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-8" onClick={onGetStarted}>
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="mt-20 relative">
            <div className="bg-card border rounded-2xl shadow-soft p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Summary', 'Notes', 'Flashcards', 'Quiz'].map((tab, i) => <div key={tab} className={`p-4 rounded-xl text-center transition-all ${i === 0 ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted text-muted-foreground hover:bg-secondary'}`}>
                    <span className="font-medium">{tab}</span>
                  </div>)}
              </div>
              <div className="mt-6 p-6 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground">TL;DR</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your content is transformed into a concise summary, detailed notes, interactive flashcards,
                  and practice quizzes — all in seconds.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Study</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools designed to help you understand, memorize, and master any subject.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: i * 0.1
          }} className="bg-card border rounded-2xl p-6 card-hover">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-soft">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} className="gradient-hero rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Studying?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students using AI to learn faster and retain more.
              </p>
              <Button onClick={onGetStarted} size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 Notepilot. Built with AI for better learning.</p>
        </div>
      </footer>
    </div>;
}