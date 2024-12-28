import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from localStorage
export const openai = new OpenAI({
  apiKey: localStorage.getItem('OPENAI_API_KEY') || '',
  dangerouslyAllowBrowser: true
});

export const generateChatResponse = async (
  message: string,
  onChunk: (chunk: string) => void
): Promise<void> => {
  if (!localStorage.getItem('OPENAI_API_KEY')) {
    throw new Error('OpenAI API key not found. Please add your API key in the settings.');
  }

  try {
    const stream = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-4",
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
};