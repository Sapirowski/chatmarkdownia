import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePointerDown = () => {
    setIsRecording(true);
    toast({
      title: "Recording started",
      description: "Hold to continue recording, release to send",
    });
  };

  const handlePointerUp = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Message will be processed",
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-800/50 backdrop-blur-sm">
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full transition-colors duration-200 ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-gray-700'
          }`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {isRecording ? (
            <Mic className="h-4 w-4 text-white animate-pulse" />
          ) : (
            <MicOff className="h-4 w-4" />
          )}
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[50px] max-h-[200px] bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          disabled={disabled}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={disabled || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};