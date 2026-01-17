import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { StudyPack, StudyPackData, UserInput } from '@/types';
import { toast } from 'sonner';

export function useStudyPacks() {
  const { user } = useAuth();
  const [packs, setPacks] = useState<StudyPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPacks();
    } else {
      setPacks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPacks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('study_packs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPacks: StudyPack[] = (data || []).map((pack) => ({
        id: pack.id,
        user_id: pack.user_id,
        createdAt: new Date(pack.created_at),
        meta: {
          subject: pack.subject,
          grade: pack.grade,
          chapter_title: pack.title,
          language: pack.language,
        },
        summary: {
          tl_dr: pack.summary_tldr || '',
          important_points: (pack.summary_points as string[]) || [],
        },
        notes: (pack.notes as any[]) || [],
        key_terms: (pack.key_terms as any[]) || [],
        flashcards: (pack.flashcards as any[]) || [],
        quiz: (pack.quiz as any) || { instructions: '', questions: [] },
        mind_map: pack.mind_map as any,
      }));

      setPacks(formattedPacks);
    } catch (error) {
      console.error('Error fetching study packs:', error);
      toast.error('Failed to load study packs');
    } finally {
      setLoading(false);
    }
  };

  const generatePack = async (input: UserInput): Promise<StudyPack | null> => {
    if (!user) return null;

    setGenerating(true);

    try {
      let extractedPdfText = '';

      // If there's a PDF, extract text first
      if (input.pdfFile) {
        const reader = new FileReader();
        const pdfBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(input.pdfFile!);
        });

        toast.info('Extracting text from PDF...');

        const { data: extractData, error: extractError } = await supabase.functions.invoke('extract-pdf', {
          body: { pdfBase64 },
        });

        if (extractError) {
          console.error('PDF extraction error:', extractError);
          toast.warning('Could not extract PDF text. Using any provided text content.');
        } else if (extractData?.text) {
          extractedPdfText = extractData.text;
          toast.success('PDF text extracted successfully');
        }
      }

      toast.info('Generating study pack with AI...');

      const { data, error } = await supabase.functions.invoke('generate-study-pack', {
        body: {
          grade: input.grade,
          subject: input.subject,
          chapterTitle: input.chapterTitle,
          language: input.language,
          chapterText: input.chapterText,
          extractedPdfText,
        },
      });

      if (error) throw error;

      const studyPackData = data as StudyPackData;

      // Save to database
      const insertData = {
        user_id: user.id,
        title: studyPackData.meta.chapter_title,
        subject: studyPackData.meta.subject,
        grade: studyPackData.meta.grade,
        language: studyPackData.meta.language,
        summary_tldr: studyPackData.summary.tl_dr,
        summary_points: studyPackData.summary.important_points as unknown as any,
        notes: studyPackData.notes as unknown as any,
        key_terms: studyPackData.key_terms as unknown as any,
        flashcards: studyPackData.flashcards as unknown as any,
        quiz: studyPackData.quiz as unknown as any,
        mind_map: studyPackData.mind_map as unknown as any,
      };

      const { data: savedPack, error: saveError } = await supabase
        .from('study_packs')
        .insert(insertData)
        .select()
        .single();

      if (saveError) throw saveError;

      const newPack: StudyPack = {
        id: savedPack.id,
        user_id: savedPack.user_id,
        createdAt: new Date(savedPack.created_at),
        ...studyPackData,
      };

      setPacks((prev) => [newPack, ...prev]);
      toast.success('Study pack generated successfully!');

      return newPack;
    } catch (error) {
      console.error('Error generating study pack:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate study pack');
      return null;
    } finally {
      setGenerating(false);
    }
  };

  const deletePack = async (packId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('study_packs')
        .delete()
        .eq('id', packId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPacks((prev) => prev.filter((p) => p.id !== packId));
      toast.success('Study pack deleted');
    } catch (error) {
      console.error('Error deleting study pack:', error);
      toast.error('Failed to delete study pack');
    }
  };

  return {
    packs,
    loading,
    generating,
    generatePack,
    deletePack,
    refetch: fetchPacks,
  };
}
