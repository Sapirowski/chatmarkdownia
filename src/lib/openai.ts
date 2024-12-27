import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from localStorage
export const openai = new OpenAI({
  apiKey: localStorage.getItem('OPENAI_API_KEY') || '',
  dangerouslyAllowBrowser: true
});

export const generateChatResponse = async (message: string): Promise<string> => {
  if (!localStorage.getItem('OPENAI_API_KEY')) {
    throw new Error('OpenAI API key not found. Please add your API key in the settings.');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-4",
    });

    return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
};