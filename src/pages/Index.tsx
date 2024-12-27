import { useState } from 'react';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import type { Message } from '@/lib/types';
import { generateChatResponse } from '@/lib/openai';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await generateChatResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto relative">
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} loading={loading} />
        </div>
        <div className="sticky bottom-0 w-full">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </main>
    </div>
  );
};

export default Index;