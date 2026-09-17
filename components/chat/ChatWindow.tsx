"use client";

import type { UIMessage } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import MessageInputBar from "../MessageInput";
import LandingHero from "./Hero";

export default function ChatWindow({
  messages,
  loading,
  statusMessage,
  onSend,
}: {
  messages: UIMessage[];
  loading: boolean;
  statusMessage?: string | null;
  onSend: (text: string) => void;
}) {
  if (messages.length === 0) {
    return <LandingHero onSend={onSend} />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900/5">
              <span className="text-xs">🤖</span>
            </div>
            <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-400 italic">
              {statusMessage ?? "Thinking..."}
            </div>
          </div>
        )}
      </div>
      <MessageInputBar onSend={onSend} isLoading={loading} />
    </div>
  );
}