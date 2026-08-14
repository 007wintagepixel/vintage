"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLAYER_COLORS = {
  red: { main: "#EF4444", glow: "#F87171", light: "#FEF2F2" },
  green: { main: "#22C55E", glow: "#4ADE80", light: "#F0FDF4" },
  yellow: { main: "#EAB308", glow: "#FDE047", light: "#FEFCE8" },
  blue: { main: "#3B82F6", glow: "#60A5FA", light: "#EFF6FF" },
} as const;

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: keyof typeof PLAYER_COLORS;
  content: string;
  timestamp: Date;
}

interface ChatProps {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  currentUserId: string;
  _currentUserColor: keyof typeof PLAYER_COLORS;
}

export function Chat({
  messages,
  onSend,
  currentUserId,
  _currentUserColor,
}: ChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div
      className="game-chat"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="chat-header"
        style={{
          padding: 16,
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f9fafb",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1f2937" }}>
          Chat
        </h3>
        <span style={{ fontSize: 12, color: "#6b7280" }}>
          {messages.length} messages
        </span>
      </div>

      <div
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: "flex",
                flexDirection:
                  msg.senderId === currentUserId ? "row-reverse" : "row",
                gap: 8,
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${PLAYER_COLORS[msg.senderColor]?.glow || "#3B82F6"}, ${PLAYER_COLORS[msg.senderColor]?.main || "#3B82F6"})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {msg.senderName[0].toUpperCase()}
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  maxWidth: "70%",
                  padding: "10px 14px",
                  borderRadius:
                    msg.senderId === currentUserId
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  background:
                    msg.senderId === currentUserId ? "#3B82F6" : "#f3f4f6",
                  color: msg.senderId === currentUserId ? "#fff" : "#1f2937",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    marginBottom: 2,
                    opacity: 0.7,
                  }}
                >
                  {msg.senderName}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    marginTop: 4,
                    opacity: 0.6,
                    textAlign: "right",
                  }}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: 16,
          borderTop: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 24,
              border: "2px solid #e5e7eb",
              outline: "none",
              fontSize: 14,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3B82F6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              border: "none",
              color: "#fff",
              cursor: input.trim() ? "pointer" : "not-allowed",
              opacity: input.trim() ? 1 : 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M22 2L11 13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L15 22L11 13L2 9L22 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
