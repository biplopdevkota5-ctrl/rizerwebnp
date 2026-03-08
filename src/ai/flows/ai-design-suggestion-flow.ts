'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI design suggestions.
 *
 * - aiDesignSuggestion - A function that generates design suggestions based on user input.
 * - AiDesignSuggestionInput - The input type for the aiDesignSuggestion function.
 * - AiDesignSuggestionOutput - The return type for the aiDesignSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiDesignSuggestionInputSchema = z.object({
  designIdea: z
    .string()
    .describe("A concise description of the user's initial design idea."),
});
export type AiDesignSuggestionInput = z.infer<typeof AiDesignSuggestionInputSchema>;

const AiDesignSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('Detailed AI-generated design suggestions.'),
});
export type AiDesignSuggestionOutput = z.infer<typeof AiDesignSuggestionOutputSchema>;

export async function aiDesignSuggestion(
  input: AiDesignSuggestionInput
): Promise<AiDesignSuggestionOutput> {
  return aiDesignSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDesignSuggestionPrompt',
  input: {schema: AiDesignSuggestionInputSchema},
  output: {schema: AiDesignSuggestionOutputSchema},
  prompt: `You are an expert UI/UX designer specializing in modern, futuristic, and interactive web designs. You are assisting a user in refining their vision for a website on the RIZERWEBNP platform. Based on the user's initial design idea, provide creative and detailed design suggestions.

Focus on incorporating elements like:
- Glassmorphism effects
- Gradient colors
- Smooth transitions and animations
- Responsive layouts
- A professional, cutting-edge aesthetic
- Primary brand color: A deep indigo (#5858B3)
- Background color: A very dark, desaturated indigo (#191A23)
- Accent color: A bright, vibrant sky blue (#52A8ED)
- Headline font: 'Space Grotesk'
- Body font: 'Inter'
- Sleek, minimalist line icons

Ensure the suggestions are actionable and help the user provide a more detailed design brief.

User's initial design idea: {{{designIdea}}}`,
});

const aiDesignSuggestionFlow = ai.defineFlow(
  {
    name: 'aiDesignSuggestionFlow',
    inputSchema: AiDesignSuggestionInputSchema,
    outputSchema: AiDesignSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
