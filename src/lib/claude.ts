import Anthropic from '@anthropic-ai/sdk';

// Single shared extraction/scoring pipeline used by both Claims
// Intelligence (consultant-facing) and Claim Score (subcontractor-facing)
// per the "single unified AI pass" decision in the Claim Score scoping
// doc — no separate contract-risk-clause engine.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export interface ExtractionInput {
  /** Raw extracted text from an uploaded document. */
  documentText: string;
  /** For Claim Score: the user's free-text question, e.g. "Have I been delayed?" */
  userPrompt?: string;
}

// TODO: port the real extraction system prompt + the Claim Signal
// underscore-normalisation mapping logic (raw AI labels like
// "Delay_Notice" -> the spaced Choice label "Delay Notice") from the
// existing Power Automate flow. This is a placeholder shape only.
export async function extractSignals(input: ExtractionInput) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: [
          input.userPrompt
            ? `Question: ${input.userPrompt}`
            : 'Extract claim-relevant events from this document.',
          '',
          input.documentText,
        ].join('\n'),
      },
    ],
  });

  return message;
}
