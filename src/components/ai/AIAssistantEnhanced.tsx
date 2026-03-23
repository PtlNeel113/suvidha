import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Volume2, Send, Sparkles, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/suvidha-chat`;

const NAVIGATION_MAP: Record<string, string> = {
  electricity: "/electricity", bijli: "/electricity", बिजली: "/electricity", વીજળી: "/electricity", वीज: "/electricity",
  water: "/water", pani: "/water", पानी: "/water", પાણી: "/water", పాని: "/water",
  gas: "/gas", lpg: "/gas", गैस: "/gas", ગેસ: "/gas",
  waste: "/waste", kachra: "/waste", कचरा: "/waste", કચરો: "/waste",
  certificate: "/certificates", certificates: "/certificates", प्रमाणपत्र: "/certificates", પ્રમાણપત્ર: "/certificates",
  schemes: "/schemes", योजना: "/schemes", યોજના: "/schemes",
  complaint: "/complaints", complaints: "/complaints", शिकायत: "/complaints", तक्रार: "/complaints", ફરિયાદ: "/complaints",
  "pm kisan": "/pm-kisan", "pm-kisan": "/pm-kisan", kisan: "/pm-kisan", किसान: "/pm-kisan",
  ayushman: "/ayushman", आयुष्मान: "/ayushman",
  pension: "/pension", पेंशन: "/pension", પેન્શન: "/pension",
  ration: "/ration", राशन: "/ration",
  profile: "/profile", प्रोफ़ाइल: "/profile",
  dashboard: "/dashboard", डैशबोर्ड: "/dashboard",
};

function detectNavigation(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [keyword, route] of Object.entries(NAVIGATION_MAP)) {
    if (lower.includes(keyword)) return route;
  }
  return null;
}

const getQuickActions = (t: (key: any) => string) => [
  { label: t("pay_bill"), icon: "⚡", route: "/electricity" },
  { label: t("check_eligibility"), icon: "🏛️", route: "/schemes" },
  { label: t("file_complaint"), icon: "📝", route: "/complaints" },
  { label: t("get_certificate"), icon: "📜", route: "/certificates" },
];

export default function AIAssistantEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const quickActions = getQuickActions(t);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);
  const streamingRef = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    const greeting: Message = { id: "greeting", text: t("ai_greeting"), sender: "ai", timestamp: new Date() };
    setMessages([greeting]);
  }, [lang, t]);

  const speechLangMap: Record<string, string> = {
    en: "en-IN", hi: "hi-IN", gu: "gu-IN", mr: "mr-IN",
    ta: "ta-IN", te: "te-IN", bn: "bn-IN", kn: "kn-IN",
    ml: "ml-IN", pa: "pa-IN",
  };

  const speakText = useCallback((text: string) => {
    if (!ttsEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[🙏⚡📝📜🏛️😊✅💡🚀]/g, ""));
    utterance.lang = speechLangMap[lang] || "en-IN";
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [lang, ttsEnabled]);

  const performNavigation = useCallback((userText: string, aiText: string) => {
    // Check both user message AND AI response for navigation intent
    const navRoute = detectNavigation(userText) || detectNavigation(aiText);
    if (navRoute) {
      setTimeout(() => {
        const routeName = navRoute.slice(1).replace(/-/g, " ");
        toast({ title: "🚀 Opening service...", description: `Navigating to ${routeName}` });
        navigate(navRoute);
        setIsOpen(false); // Close chat after navigation
      }, 1500);
    }
  }, [navigate, toast]);

  const streamAIResponse = useCallback(async (userText: string) => {
    if (streamingRef.current) return;
    streamingRef.current = true;
    setIsStreaming(true);

    const chatHistory = messagesRef.current
      .filter(m => m.id !== "greeting")
      .map(m => ({
        role: m.sender === "user" ? "user" as const : "assistant" as const,
        content: m.text,
      }));

    let assistantText = "";
    const assistantId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { id: assistantId, text: "...", sender: "ai", timestamp: new Date() }]);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: chatHistory, language: lang }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Service unavailable" }));
        if (resp.status === 429) toast({ variant: "destructive", title: "Rate limited", description: "Please wait and try again." });
        else if (resp.status === 402) toast({ variant: "destructive", title: "Service unavailable", description: "AI credits depleted." });
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: err.error || "Sorry, please try again. 🙏" } : m));
        streamingRef.current = false;
        setIsStreaming(false);
        return;
      }

      const reader = resp.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantText += content;
              setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: assistantText } : m));
            }
          } catch { /* partial JSON */ }
        }
      }

      if (assistantText) {
        speakText(assistantText);
        // Check BOTH user text and AI response for navigation
        performNavigation(userText, assistantText);
      }
    } catch (e) {
      console.error("AI stream error:", e);
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, text: "Sorry, couldn't connect. Please try again! 🙏" } : m));
    }
    streamingRef.current = false;
    setIsStreaming(false);
  }, [lang, speakText, toast, performNavigation]);

  const { isListening, startListening, stopListening, isSupported } = useVoiceRecognition({
    lang,
    onResult: (text) => {
      const userMsg: Message = { id: `user-${Date.now()}`, text, sender: "user", timestamp: new Date() };
      setMessages(prev => [...prev, userMsg]);
      messagesRef.current = [...messagesRef.current, userMsg];
      streamAIResponse(text);
    },
    onError: (error) => console.log("Voice error:", error),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickAction = (action: { label: string; route: string }) => {
    const userMsg: Message = { id: `user-${Date.now()}`, text: action.label, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    messagesRef.current = [...messagesRef.current, userMsg];
    streamAIResponse(action.label);
    // Quick actions navigate immediately
    setTimeout(() => {
      navigate(action.route);
      setIsOpen(false);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || isStreaming) return;
    const userMsg: Message = { id: `user-${Date.now()}`, text: inputText, sender: "user", timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    messagesRef.current = [...messagesRef.current, userMsg];
    const text = inputText;
    setInputText("");
    streamAIResponse(text);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)} className="fixed bottom-8 right-8 z-50 group" aria-label="Open AI Assistant">
            <motion.div className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 hsl(var(--secondary)/0.4)", "0 0 0 20px hsl(var(--secondary)/0)"] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <motion.div className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
              style={{ background: "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 100%)", boxShadow: "0 8px 32px -4px hsl(var(--secondary)/0.5)" }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} animate={{ y: [0, -5, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}>
              <motion.div className="text-4xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>👩</motion.div>
              <motion.div className="absolute -top-1 -right-1" animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 180, 360] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }} className="fixed bottom-8 right-8 z-50 w-[420px] max-w-[calc(100vw-2rem)]">
            <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div className="relative w-14 h-14 rounded-full bg-secondary-foreground/20 flex items-center justify-center"
                      animate={isSpeaking || isStreaming ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
                      transition={{ duration: isSpeaking || isStreaming ? 0.5 : 3, repeat: Infinity }}>
                      <span className="text-3xl">👩</span>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-success border-2 border-secondary" />
                    </motion.div>
                    <div>
                      <h3 className="font-heading font-bold text-lg">{t("ai_name")}</h3>
                      <p className="text-xs opacity-80 flex items-center gap-1">
                        {isStreaming ? "✨ Thinking..." : isListening ? "🎤 Listening..." : <><Volume2 className="w-3 h-3" /> {t("speak_query")}</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setTtsEnabled(!ttsEnabled)} className="text-secondary-foreground hover:bg-secondary-foreground/10 w-8 h-8">
                      {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-secondary-foreground hover:bg-secondary-foreground/10 w-8 h-8">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[320px] overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "ai" && (
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <span className="text-sm">👩</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user" ? "bg-secondary text-secondary-foreground rounded-br-md" : "bg-muted rounded-bl-md"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">{t("quick_access")}:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, idx) => (
                    <Button key={idx} variant="outline" size="sm" onClick={() => handleQuickAction(action)}
                      className="text-xs rounded-full h-8" disabled={isStreaming}>
                      {action.icon} {action.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border flex items-center gap-2">
                {isSupported && (
                  <Button size="icon" variant={isListening ? "destructive" : "default"} onClick={() => isListening ? stopListening() : startListening()}
                    className={`rounded-full w-11 h-11 ${isListening ? "" : "bg-success hover:bg-success/90"}`} disabled={isStreaming}>
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                )}
                <Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={t("speak_query")}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} className="rounded-full text-base h-11" disabled={isStreaming} />
                <Button size="icon" onClick={handleSendMessage} className="rounded-full w-11 h-11 bg-secondary hover:bg-secondary/90" disabled={isStreaming || !inputText.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
