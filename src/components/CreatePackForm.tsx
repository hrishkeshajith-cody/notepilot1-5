import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileText, Loader2, Sparkles, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { UserInput } from '@/types';
import { GenerationStep } from '@/hooks/useStudyPacks';
import { toast } from 'sonner';

interface CreatePackFormProps {
  onBack: () => void;
  onGenerate: (input: UserInput) => Promise<void>;
  generating: boolean;
  generationStep: GenerationStep;
}

const grades = ['Elementary', 'Middle School', 'High School', 'College', 'Graduate', 'Professional'];
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic', 'Portuguese'];

const GENERATION_STEPS = [
  { key: 'extracting', label: 'Extracting PDF text', progress: 25 },
  { key: 'generating', label: 'Generating study materials', progress: 60 },
  { key: 'saving', label: 'Saving to your library', progress: 90 },
  { key: 'done', label: 'Complete!', progress: 100 },
] as const;

export function CreatePackForm({ onBack, onGenerate, generating, generationStep }: CreatePackFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<UserInput>({
    grade: '',
    subject: '',
    chapterTitle: '',
    language: 'English',
    chapterText: '',
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setPdfFile(file);
      toast.success(`${file.name} selected`);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.grade || !form.subject || !form.chapterTitle) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!form.chapterText && !pdfFile) {
      toast.error('Please provide content (text or PDF)');
      return;
    }

    await onGenerate({
      ...form,
      pdfFile: pdfFile || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 shadow-glow">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Study Pack</h1>
            <p className="text-muted-foreground">Upload content or paste text to generate study materials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-2xl p-6 md:p-8">
            {/* PDF Upload */}
            <div className="space-y-2">
              <Label>Upload PDF (optional)</Label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'
                } ${pdfFile ? 'bg-primary/5 border-primary' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {pdfFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{pdfFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPdfFile(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium mb-1">Drop your PDF here or click to upload</p>
                    <p className="text-sm text-muted-foreground">Max file size: 10MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 border-t" />
              <span className="text-sm text-muted-foreground bg-card px-2">or paste text</span>
              <div className="flex-1 border-t" />
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Study Content</Label>
              <Textarea
                id="content"
                placeholder="Paste your chapter content, notes, or any text you want to study..."
                value={form.chapterText}
                onChange={(e) => setForm({ ...form, chapterText: e.target.value })}
                className="min-h-[200px] resize-y"
              />
              <p className="text-xs text-muted-foreground">
                {form.chapterText.length} characters
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Biology, History, Math"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              {/* Chapter Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Chapter/Topic Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cell Division, World War II"
                  value={form.chapterTitle}
                  onChange={(e) => setForm({ ...form, chapterTitle: e.target.value })}
                  required
                />
              </div>

              {/* Grade Level */}
              <div className="space-y-2">
                <Label>Grade Level *</Label>
                <Select value={form.grade} onValueChange={(v) => setForm({ ...form, grade: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What you'll get:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>TL;DR summary with key takeaways</li>
                  <li>Detailed study notes organized by topic</li>
                  <li>Key terms with definitions and examples</li>
                  <li>Flashcards for memorization</li>
                  <li>Practice quiz with explanations</li>
                </ul>
              </div>
            </div>

            {generating ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {GENERATION_STEPS.find(s => s.key === generationStep)?.label || 'Preparing...'}
                    </span>
                    <span className="text-muted-foreground">
                      {GENERATION_STEPS.find(s => s.key === generationStep)?.progress || 10}%
                    </span>
                  </div>
                  <Progress 
                    value={GENERATION_STEPS.find(s => s.key === generationStep)?.progress || 10} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  {GENERATION_STEPS.map((step, idx) => {
                    const stepIndex = GENERATION_STEPS.findIndex(s => s.key === generationStep);
                    const currentIdx = GENERATION_STEPS.findIndex(s => s.key === step.key);
                    const isComplete = stepIndex > currentIdx;
                    const isCurrent = step.key === generationStep;
                    
                    return (
                      <motion.div
                        key={step.key}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          isComplete 
                            ? 'bg-primary/20 text-primary' 
                            : isCurrent 
                              ? 'bg-primary text-primary-foreground animate-pulse' 
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isComplete ? (
                          <Check className="w-3 h-3" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : null}
                        {step.label.split(' ')[0]}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground shadow-glow py-6 text-lg"
                disabled={generating}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Study Pack
              </Button>
            )}
          </form>
        </motion.div>
      </main>
    </div>
  );
}
