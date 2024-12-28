import { useState } from 'react';
import { MessageList } from '@/components/MessageList';
import { ChatInput } from '@/components/ChatInput';
import { ClearChatButton } from '@/components/ClearChatButton';
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
      // Create a new AI message with empty content
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        content: '',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Handle streaming response
      await generateChatResponse(content, (chunk) => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === aiMessageId) {
            return {
              ...msg,
              content: msg.content + chunk
            };
          }
          return msg;
        }));
      });
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

  const handleClearChat = () => {
    setMessages([{
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: 'assistant',
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto relative">
        <div className="flex-1 overflow-hidden">
          <div className="flex justify-end p-4">
            <ClearChatButton onClear={handleClearChat} />
          </div>
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