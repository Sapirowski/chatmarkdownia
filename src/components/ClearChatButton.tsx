import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ClearChatButtonProps {
  onClear: () => void;
}

export const ClearChatButton = ({ onClear }: ClearChatButtonProps) => {
  const { toast } = useToast();

  const handleClear = () => {
    onClear();
    toast({
      title: "Chat history cleared",
      description: "All messages have been removed",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClear}
      className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
    >
      <Trash className="h-4 w-4" />
    </Button>
  );
};