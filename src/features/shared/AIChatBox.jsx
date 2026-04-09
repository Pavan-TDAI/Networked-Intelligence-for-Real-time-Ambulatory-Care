import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";

const SAMPLE_RESPONSES = {
  greeting: "Hello! I'm NIRA AI, your healthcare assistant. I can help with:\n• Symptom pre-screening\n• Appointment guidance\n• Medication information\n• Lab result explanations\n\nHow can I help you today?",
  symptoms: "Based on what you've described, I'd recommend scheduling an appointment. Common causes might include viral infection or seasonal allergies. Would you like me to help book an appointment with a doctor?",
  medication: "I can look up drug information, check for common interactions, and explain dosage guidelines. Please note this is informational only — always follow your doctor's prescription.",
  appointment: "I can help you find available slots. Would you like to see doctors available today, or search by specialty?",
  default: "I understand. Let me help you with that. Could you provide a bit more detail so I can assist you better?"
};

function getAIResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("help")) return SAMPLE_RESPONSES.greeting;
  if (lower.includes("symptom") || lower.includes("pain") || lower.includes("fever") || lower.includes("headache") || lower.includes("cough")) return SAMPLE_RESPONSES.symptoms;
  if (lower.includes("medicine") || lower.includes("drug") || lower.includes("medication") || lower.includes("dose")) return SAMPLE_RESPONSES.medication;
  if (lower.includes("appointment") || lower.includes("book") || lower.includes("schedule") || lower.includes("doctor")) return SAMPLE_RESPONSES.appointment;
  return SAMPLE_RESPONSES.default;
}

export function AIChatBox() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm NIRA AI. How can I assist you today?", time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text, time: new Date() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "ai", text: getAIResponse(text), time: new Date() }]);
    }, 800 + Math.random() * 1200);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors",
          open ? "bg-red-500 hover:bg-red-600" : "bg-brand-midnight hover:bg-brand-midnight/90"
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/60 bg-surface shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/60 bg-brand-midnight px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/20">
                <Sparkles className="h-4 w-4 text-cyan-300" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">NIRA AI Assistant</div>
                <div className="text-xs text-cyan-300/70">Powered by AI • Always available</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "ai" && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-tide/10">
                      <Bot className="h-3.5 w-3.5 text-brand-tide" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "rounded-br-md bg-brand-midnight text-white"
                        : "rounded-bl-md bg-white/80 text-ink shadow-soft"
                    )}
                  >
                    {msg.text.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j < msg.text.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-midnight/10">
                      <User className="h-3.5 w-3.5 text-brand-midnight" />
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-tide/10">
                    <Bot className="h-3.5 w-3.5 text-brand-tide" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-white/80 px-4 py-3 shadow-soft">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-tide/50" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-tide/50" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-tide/50" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/60 bg-white/50 p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask NIRA AI anything..."
                  className="flex-1 rounded-xl border border-white/60 bg-white/80 px-4 py-2.5 text-sm text-ink placeholder-muted shadow-soft outline-none focus:border-brand-tide/40 focus:ring-1 focus:ring-brand-tide/20"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-midnight text-white shadow-soft transition hover:bg-brand-midnight/90 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
