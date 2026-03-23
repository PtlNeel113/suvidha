import { useState } from "react";
import { X, Mic, MicOff, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते! मैं सुविधा ताई हूं। आपकी क्या मदद करूं? (Namaste! I am Suvidha Tai. How can I help you?)",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const quickActions = [
    { label: "Pay Electricity Bill", icon: "⚡" },
    { label: "Check Scheme Eligibility", icon: "🏛️" },
    { label: "File a Complaint", icon: "📝" },
    { label: "Get Certificate", icon: "📜" },
  ];

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: "user",
      timestamp: new Date(),
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: `Bahut badhiya! "${action}" ke liye main aapki madad karungi. Please wait... (Great! I will help you with "${action}". Please wait...)`,
      sender: "ai",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, aiResponse]);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulated voice recognition
      setTimeout(() => {
        const userMessage: Message = {
          id: Date.now().toString(),
          text: "I want to pay my electricity bill",
          sender: "user",
          timestamp: new Date(),
        };

        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "Accha! Bijli bill bharna hai? Green button dabayiye aur apna meter number daale. (Good! Want to pay electricity bill? Press the green button and enter your meter number.)",
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, aiResponse]);
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Orb Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-orb group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            {/* Animated Avatar */}
            <div className="text-3xl animate-bounce">👩</div>
            {/* Pulse Ring */}
            <div className="absolute -inset-2 rounded-full border-2 border-secondary-foreground/30 animate-ping" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-card rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <p className="text-sm font-medium">Need help? Talk to Suvidha Tai!</p>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-96 max-w-[calc(100vw-2rem)] animate-scale-in">
          <div className="bg-card rounded-2xl shadow-kiosk-lg border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-secondary text-secondary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary-foreground/20 flex items-center justify-center text-2xl">
                  👩
                </div>
                <div>
                  <h3 className="font-heading font-bold">Suvidha Tai</h3>
                  <p className="text-sm opacity-80">Your AI Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-secondary-foreground hover:bg-secondary-foreground/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-4 bg-muted/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === "user"
                        ? "bg-secondary text-secondary-foreground rounded-br-md"
                        : "bg-card shadow-md rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-muted/50 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-card rounded-full text-xs font-medium border border-border hover:border-secondary hover:bg-secondary/5 transition-colors"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border flex items-center gap-3">
              <button
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-success text-success-foreground"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Type or speak your query..."
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                />
              </div>
              <Button size="icon" className="w-12 h-12 rounded-xl bg-secondary">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
