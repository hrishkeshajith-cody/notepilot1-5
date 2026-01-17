import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STUDY_PACK_TOOLS = [
  {
    type: "function",
    function: {
      name: "create_study_pack",
      description: "Generate a comprehensive study pack with summary, notes, terms, flashcards, and quiz",
      parameters: {
        type: "object",
        properties: {
          meta: {
            type: "object",
            properties: {
              subject: { type: "string" },
              grade: { type: "string" },
              chapter_title: { type: "string" },
              language: { type: "string" },
            },
            required: ["subject", "grade", "chapter_title", "language"],
          },
          summary: {
            type: "object",
            properties: {
              tl_dr: { type: "string", description: "A concise 2-3 sentence summary" },
              important_points: {
                type: "array",
                items: { type: "string" },
                description: "Exactly 15-20 key takeaways",
              },
            },
            required: ["tl_dr", "important_points"],
          },
          notes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string", description: "Brief explanation, 2-3 sentences" },
              },
              required: ["title", "content"],
            },
            description: "5-8 note sections",
          },
          key_terms: {
            type: "array",
            items: {
              type: "object",
              properties: {
                term: { type: "string" },
                meaning: { type: "string" },
              },
              required: ["term", "meaning"],
            },
            description: "10-15 key terms",
          },
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                q: { type: "string", description: "Question" },
                a: { type: "string", description: "Answer" },
              },
              required: ["q", "a"],
            },
            description: "10-15 flashcards",
          },
          quiz: {
            type: "object",
            properties: {
              instructions: { type: "string" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    question: { type: "string" },
                    options: { type: "array", items: { type: "string" }, description: "4 options" },
                    correct_index: { type: "integer", description: "0-3" },
                    explanation: { type: "string" },
                    difficulty: { type: "string", enum: ["easy", "medium", "hard"] },
                  },
                  required: ["id", "question", "options", "correct_index", "explanation", "difficulty"],
                },
              },
            },
            required: ["instructions", "questions"],
            description: "10-15 quiz questions",
          },
          important_questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string", description: "An important exam question" },
                answer: { type: "string", description: "Model answer for the question" },
                marks: { type: "integer", enum: [1, 3, 5], description: "1, 3, or 5 marks" },
              },
              required: ["question", "answer", "marks"],
            },
            description: "9 important questions: 3 one-mark, 3 three-mark, 3 five-mark",
          },
        },
        required: ["meta", "summary", "notes", "key_terms", "flashcards", "quiz", "important_questions"],
        additionalProperties: false,
      },
    },
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { grade, subject, chapterTitle, language, chapterText, extractedPdfText } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const contentToAnalyze = extractedPdfText || chapterText || "";
    
    if (!contentToAnalyze || contentToAnalyze.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Please provide more content to analyze (at least 50 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are an expert educational content creator specializing in creating comprehensive study materials for students. Your task is to analyze the provided content and create a complete study pack.

Guidelines:
- Use the specified language: ${language}
- Tailor content to grade level: ${grade}
- Subject: ${subject}
- Chapter/Topic: ${chapterTitle}
- Be accurate, engaging, and educational
- Create content that helps students understand and retain information
- Include varied difficulty levels in quiz questions`;

    // Truncate content to speed up processing (first 4000 chars should be enough)
    const truncatedContent = contentToAnalyze.slice(0, 4000);

    const userPrompt = `Create a study pack from this content. Be concise.

GRADE: ${grade} | SUBJECT: ${subject} | TOPIC: ${chapterTitle} | LANGUAGE: ${language}

CONTENT:
${truncatedContent}

Generate: TL;DR (2 sentences), 10 key points, 6 notes, 12 terms, 12 flashcards, 10 quiz questions (easy/medium/hard mix), and 9 important questions (3 one-mark short answer, 3 three-mark medium answer, 3 five-mark detailed answer).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: STUDY_PACK_TOOLS,
        tool_choice: { type: "function", function: { name: "create_study_pack" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "create_study_pack") {
      throw new Error("Invalid response from AI");
    }

    const studyPack = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(studyPack), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating study pack:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to generate study pack" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
