import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, MicOff, Volume2, Send, Sparkles, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useLanguage } from "@/hooks/useLanguage";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const quickActions = [
  { label: "Pay Electricity Bill", icon: "⚡", route: "/electricity" },
  { label: "Check Scheme Eligibility", icon: "🏛️", route: "/schemes" },
  { label: "File a Complaint", icon: "📝", route: "/complaints" },
  { label: "Get Certificate", icon: "📜", route: "/certificates" },
];

const aiResponses: Record<string, Record<string, string>> = {
  en: {
    "Pay Electricity Bill": "Great! Press the green button to pay your electricity bill. I'll guide you step by step.",
    "Check Scheme Eligibility": "Checking your eligibility... You may be eligible for PM Awas Yojana! Let me show you.",
    "File a Complaint": "To file a complaint, upload a photo and share your location. I'll help you through it.",
    "Get Certificate": "Which certificate do you need? Caste, Income or Domicile? Just tell me!",
    default: "I understand! I'm here to help you with any government service. What do you need?",
  },
  hi: {
    "Pay Electricity Bill": "बहुत बढ़िया! बिजली बिल भरने के लिए हरा बटन दबाइए। मैं आपको स्टेप बाय स्टेप गाइड करूंगी।",
    "Check Scheme Eligibility": "आपकी पात्रता जांच रही हूं... पीएम आवास योजना में आप पात्र हो सकते हैं!",
    "File a Complaint": "शिकायत दर्ज करने के लिए फोटो अपलोड करें और लोकेशन बताएं।",
    "Get Certificate": "कौन सा प्रमाणपत्र चाहिए? जाति, आय या निवास? बस बताइए!",
    default: "मैं समझ गई! आपकी मदद के लिए हाज़िर हूं। क्या चाहिए आपको?",
  },
  gu: {
    "Pay Electricity Bill": "ખૂબ સરસ! વીજળી બિલ ભરવા લીલું બટન દબાવો. હું તમને સ્ટેપ બાય સ્ટેપ ગાઈડ કરીશ.",
    "Check Scheme Eligibility": "તમારી પાત્રતા તપાસી રહી છું... પીએમ આવાસ યોજનામાં તમે પાત્ર હોઈ શકો છો!",
    "File a Complaint": "ફરિયાદ નોંધાવવા ફોટો અપલોડ કરો અને લોકેશન શેર કરો.",
    "Get Certificate": "કયું પ્રમાણપત્ર જોઈએ? જાતિ, આવક કે નિવાસ? બસ કહો!",
    default: "સમજી ગઈ! તમારી મદદ માટે હાજર છું. શું જોઈએ?",
  },
  mr: {
    "Pay Electricity Bill": "छान! वीज बिल भरण्यासाठी हिरवे बटण दाबा. मी तुम्हाला स्टेप बाय स्टेप गाइड करेन.",
    "Check Scheme Eligibility": "तुमची पात्रता तपासत आहे... पीएम आवास योजनेत तुम्ही पात्र असू शकता!",
    "File a Complaint": "तक्रार नोंदवण्यासाठी फोटो अपलोड करा आणि लोकेशन शेअर करा.",
    "Get Certificate": "कोणते प्रमाणपत्र हवे? जाती, उत्पन्न की निवास? फक्त सांगा!",
    default: "समजले! तुमच्या मदतीसाठी तयार आहे. काय हवे?",
  },
  ta: {
    default: "புரிகிறது! உங்களுக்கு எந்த அரசு சேவையிலும் உதவ நான் இருக்கிறேன். என்ன வேண்டும்?",
    "Pay Electricity Bill": "நல்லது! மின் கட்டணம் செலுத்த பச்சை பொத்தானை அழுத்தவும்.",
    "Check Scheme Eligibility": "உங்கள் தகுதியை சரிபார்க்கிறேன்... PM ஆவாஸ் யோஜனாவில் நீங்கள் தகுதி பெறலாம்!",
    "File a Complaint": "புகார் பதிவு செய்ய புகைப்படம் பதிவேற்றி இடத்தை பகிரவும்.",
    "Get Certificate": "எந்த சான்றிதழ் வேண்டும்? சாதி, வருமானம் அல்லது வதிவிட? சொல்லுங்கள்!",
  },
  bn: {
    default: "বুঝলাম! আমি আপনাকে যেকোনো সরকারি সেবায় সাহায্য করতে এখানে আছি। আপনার কি দরকার?",
    "Pay Electricity Bill": "দারুণ! আপনার বিদ্যুৎ বিল পরিশোধ করতে সবুজ বোতাম টিপুন।",
    "Check Scheme Eligibility": "আপনার যোগ্যতা পরীক্ষা করছি... প্রধানমন্ত্রী আবাস যোজনায় আপনি যোগ্য হতে পারেন!",
    "File a Complaint": "অভিযোগ জানাতে একটি ছবি আপলোড করুন এবং আপনার অবস্থান শেয়ার করুন।",
    "Get Certificate": "কোন সার্টিফিকেট প্রয়োজন? জাতি, আয় না নিবাস? শুধু বলুন!",
  },
};

export default function AIAssistantEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputText, setInputText] = useState("");
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting message based on language
  useEffect(() => {
    setMessages([{
      id: "1",
      text: t("ai_greeting"),
      sender: "ai",
      timestamp: new Date(),
    }]);
  }, [lang, t]);

  // System Context for AI
  const getAIResponse = useCallback((action: string): string => {
    // Check for specific keywords to provide better context
    const lowerAction = action.toLowerCase();

    if (lowerAction.includes("bill") || lowerAction.includes("electricity") || lowerAction.includes("payment")) {
      return "You can pay your electricity bill by clicking the 'Pay Electricity Bill' button. I'll guide you through scanning the QR code.";
    }
    if (lowerAction.includes("complaint") || lowerAction.includes("issue")) {
      return "To file a complaint, use the 'File a Complaint' option. You can upload photo evidence and we'll automatically detect your location.";
    }
    if (lowerAction.includes("notification") || lowerAction.includes("alert")) {
      return "You can check your latest alerts in the Notifications section by clicking the bell icon.";
    }

    const langResponses = aiResponses[lang] || aiResponses.en;
    return langResponses[action] || langResponses.default || aiResponses.en.default;
  }, [lang]);

  const addAIResponse = useCallback((text: string) => {
    setIsSpeaking(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        text,
        sender: "ai",
        timestamp: new Date(),
      }]);
      setIsSpeaking(false);
      // Speak the response
      if ("speechSynthesis" in window) {
        const speechLangMap: Record<string, string> = {
          en: "en-IN", hi: "hi-IN", gu: "gu-IN", mr: "mr-IN",
          ta: "ta-IN", te: "te-IN", bn: "bn-IN", kn: "kn-IN",
          ml: "ml-IN", pa: "pa-IN",
        };
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechLangMap[lang] || "en-IN";
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    }, 1000);
  }, [lang]);

  const { isListening, startListening, stopListening, isSupported } = useVoiceRecognition({
    lang,
    onResult: (text) => {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      }]);
      addAIResponse(getAIResponse("default"));
    },
    onError: (error) => {
      console.log("Voice recognition error:", error);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickAction = (action: string) => {
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text: action,
      sender: "user",
      timestamp: new Date(),
    }]);
    addAIResponse(getAIResponse(action));
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    }]);
    setInputText("");
    addAIResponse(getAIResponse("default"));
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      {/* Floating Orb */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 group"
            aria-label="Open AI Assistant"
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 hsl(var(--secondary)/0.4)", "0 0 0 20px hsl(var(--secondary)/0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="relative w-20 h-20 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                background: "linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 100%)",
                boxShadow: "0 8px 32px -4px hsl(var(--secondary)/0.5), inset 0 2px 8px hsl(0 0% 100% / 0.2)",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            >
              <motion.div
                className="text-4xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                👩
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-card rounded-lg shadow-lg whitespace-nowrap border border-border"
            >
              <p className="text-sm font-medium">{t("need_help")} 🙏</p>
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 w-[420px] max-w-[calc(100vw-2rem)]"
          >
            <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary to-accent text-secondary-foreground p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative w-14 h-14 rounded-full bg-secondary-foreground/20 flex items-center justify-center"
                      animate={isSpeaking ? { scale: [1, 1.08, 1] } : { scale: [1, 1.02, 1] }}
                      transition={{ duration: isSpeaking ? 0.4 : 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.span
                        className="text-3xl"
                        animate={isSpeaking ? { y: [0, -2, 0] } : {}}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      >
                        👩
                      </motion.span>
                      {isSpeaking && (
                        <motion.div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-primary rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.4, delay: i * 0.1, repeat: Infinity }}
                            />
                          ))}
                        </motion.div>
                      )}
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-secondary" />
                    </motion.div>
                    <div>
                      <h3 className="font-heading text-lg font-bold">{t("ai_name")}</h3>
                      <p className="text-sm opacity-80 flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Your AI Assistant"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-secondary-foreground hover:bg-secondary-foreground/20">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-muted/30 to-background">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.sender === "user"
                      ? "bg-secondary text-secondary-foreground rounded-br-md"
                      : "bg-card shadow-md border border-border rounded-bl-md"
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="p-3 bg-muted/50 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.label}
                      onClick={() => handleQuickAction(action.label)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-card rounded-full text-xs font-medium border border-border hover:border-secondary hover:bg-secondary/5 transition-all"
                    >
                      <span>{action.icon}</span>
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border flex items-center gap-3 bg-card">
                <motion.button
                  onClick={toggleListening}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-success text-success-foreground"
                    }`}
                  disabled={!isSupported}
                  title={isSupported ? (isListening ? "Stop listening" : "Start voice") : "Voice not supported"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isListening && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-destructive"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.button>

                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={t("speak_query")}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="h-12 rounded-xl border-2 focus:border-secondary"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button size="icon" onClick={handleSendMessage} className="w-12 h-12 rounded-xl bg-secondary hover:bg-secondary/90" disabled={!inputText.trim()}>
                    <Send className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
