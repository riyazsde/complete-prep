import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatBotAiAssignement = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY || "";
  const typingIntervalRef = useRef(null);
  const abortTypingRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      abortTypingRef.current = true;
    };
  }, []);

  const pushMessage = (msg) => setMessages((prev) => [...prev, { ...msg, ts: Date.now() }]);

  const replaceMessageAt = (index, partial) =>
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, ...partial, ts: Date.now() } : m)));

  const findLastAssistantIndex = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] && arr[i].role === "assistant") return i;
    }
    return -1;
  };

  const animateAssistantTyping = (fullText) =>
    new Promise((resolve) => {
      abortTypingRef.current = false;

      setMessages((prev) => {
        const lastAssistantIndex = findLastAssistantIndex(prev);
        const targetIndex = lastAssistantIndex >= 0 ? lastAssistantIndex : prev.length - 1;
        return prev.map((m, i) => (i === targetIndex ? { ...m, content: "", meta: { typing: true }, ts: Date.now() } : m));
      });

      setTimeout(() => {
        setMessages((prev) => {
          const lastAssistantIndex = findLastAssistantIndex(prev);
          const targetIndex = lastAssistantIndex >= 0 ? lastAssistantIndex : prev.length - 1;

          let charIdx = 0;
          const speed = Math.max(8, Math.floor(35 - Math.min(20, fullText.length / 10)));

          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

          typingIntervalRef.current = setInterval(() => {
            if (abortTypingRef.current) {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
              replaceMessageAt(targetIndex, { content: fullText, meta: { typing: false } });
              resolve();
              return;
            }

            charIdx += 1;
            const partial = fullText.slice(0, charIdx);
            replaceMessageAt(targetIndex, { content: partial, meta: { typing: true } });

            if (charIdx >= fullText.length) {
              clearInterval(typingIntervalRef.current);
              typingIntervalRef.current = null;
              replaceMessageAt(targetIndex, { content: fullText, meta: { typing: false } });
              resolve();
            }
          }, speed);

          return prev;
        });
      }, 50);
    });

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    pushMessage({ role: "user", content: text });
    setInput("");
    setLoading(true);
    abortTypingRef.current = true;
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    pushMessage({ role: "assistant", content: "", meta: { typing: true } });

    if (!OPENAI_KEY) {
      setMessages((prev) => {
        const idx = prev.length - 1;
        return prev.map((m, i) =>
          i === idx
            ? { ...m, content: "OpenAI API key is not configured. Set REACT_APP_OPENAI_KEY in your .env file.", meta: { typing: false }, ts: Date.now() }
            : m
        );
      });
      setLoading(false);
      return;
    }

    try {
      const messagesForApi = [
        {
          role: "system",
          content: `You are “Assignment Mentor Pro,” an expert tutor and problem-solver.
Your job: answer assignment-related questions with accurate, ready-to-use outputs while teaching the approach clearly.

Response rules:
1. Be concise, accurate, and practical.
2. Always structure replies as:
   - Direct Answer
   - How to Solve (steps, logic, or reasoning)
   - Checks & Edge Cases (validation, edge scenarios, tests)
3. For coding questions:
   - Provide clean, production-ready code using modern standards.
   - No inline comments; explanations after code.
   - Use modular, readable, and optimized approaches.
4. For analytical or academic questions:
   - Show formulas clearly, provide results with units or proof.
5. Maintain a professional, clear, and teaching-oriented tone.`,
        },
        ...messages.filter(Boolean).map((m) => ({ role: m.role, content: m.content || "" })),
        { role: "user", content: text },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-5",
          messages: messagesForApi,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        setMessages((prev) => {
          const lastIndex = prev.length - 1;
          return prev.map((m, i) =>
            i === lastIndex ? { ...m, content: `Error: ${errText || res.statusText}`, meta: { typing: false }, ts: Date.now() } : m
          );
        });
        setLoading(false);
        return;
      }

      const data = await res.json();
      const aiText = data?.choices?.[0]?.message?.content?.trim() || "No response";

      setMessages((prev) => {
        const lastAssistantIndex = findLastAssistantIndex(prev);
        const target = lastAssistantIndex >= 0 ? lastAssistantIndex : prev.length - 1;
        return prev.map((m, i) => (i === target ? { ...m, content: "", meta: { typing: true }, ts: Date.now() } : m));
      });

      await animateAssistantTyping(aiText);
    } catch (err) {
      setMessages((prev) => {
        const lastIndex = prev.length - 1;
        return prev.map((m, i) =>
          i === lastIndex ? { ...m, content: "Network error. Please try again.", meta: { typing: false }, ts: Date.now() } : m
        );
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderTime = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 p-4">
      <div className="w-full max-w-5xl h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white p-4 flex justify-between items-center font-semibold">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Icon icon="mdi:robot" width="20" height="20" />
            </div>
            <div className="text-lg">Prepo Ai</div>
            <div className="text-xs text-white/80 ml-2">Assignment Mentor Pro</div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/user/assignment-assistance-ai")}
              title="Close"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <Icon icon="ic:round-close" width="20" height="20" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
                  {!isUser && (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                      <Icon icon="mdi:robot" width="18" height="18" />
                    </div>
                  )}

                  <div className="flex flex-col items-end">
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                        isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                      }`}
                      style={{ lineHeight: 1.45 }}
                    >
                      {msg.content || (msg.meta?.typing ? null : "")}
                      {msg.meta?.typing && (
                        <span className="inline-flex items-center ml-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse mr-[3px]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse mr-[3px]" style={{ animationDelay: "0.12s" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.24s" }} />
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-400">
                      {isUser ? "You" : "Prepo Ai"} • {renderTime(msg.ts)}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                      <span className="uppercase text-xs">U</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl text-sm bg-white border border-gray-200 rounded-bl-none inline-flex items-center gap-3 shadow-sm">
                <div className="flex flex-col">
                  <div className="w-28 h-3 bg-gray-200 rounded-full animate-pulse mb-2" />
                  <div className="w-16 h-3 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="text-xs text-gray-500">Prepo Ai is thinking...</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="border-t p-4 flex items-center gap-3 bg-white">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            rows="1"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl disabled:opacity-50 hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="mdi:send" width="16" height="16" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotAiAssignement;
