"use client";

import { useState } from "react";
import Header from  "@/components/Header";
import ThreadSidebar from "@/components/SideBar";
import ChatWindow from "@/components/chat/ChatWindow";
import type { Thread, UIMessage } from "@/lib/types";

function newThread(): Thread {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    messages: [],
    createdAt: new Date().toISOString(),
  };
}

export default function Home() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? null;

  function handleNewThread() {
    const t = newThread();
    setThreads((prev) => [t, ...prev]);
    setActiveThreadId(t.id);
  }

  function handleDeleteThread(id: string) {
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (activeThreadId === id) setActiveThreadId(null);
  }

  async function handleSend(text: string) {
    let threadId = activeThreadId;

    if (!threadId) {
      const t = newThread();
      threadId = t.id;
      setThreads((prev) => [t, ...prev]);
      setActiveThreadId(t.id);
    }

    // Only auto-open sidebar on desktop screens (>= 768px); keep closed on mobile
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    const userMsg: UIMessage = { id: crypto.randomUUID(), role: "user", text };
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, userMsg],
              title: t.messages.length === 0 ? text.slice(0, 40) : t.title,
            }
          : t
      )
    );

    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const event = JSON.parse(part.slice(6));

          if (event.type === "status") {
            setStatusMessage(event.message);
          } else if (event.type === "final") {
            setThreads((prev) =>
              prev.map((t) =>
                t.id === threadId
                  ? {
                      ...t,
                      messages: [
                        ...t.messages,
                        {
                          id: crypto.randomUUID(),
                          role: "agent",
                          text: "",
                          finalAnswer: event.finalAnswer,
                        },
                      ],
                    }
                  : t
              )
            );
          } else if (event.type === "error") {
            setThreads((prev) =>
              prev.map((t) =>
                t.id === threadId
                  ? {
                      ...t,
                      messages: [
                        ...t.messages,
                        { id: crypto.randomUUID(), role: "agent", text: event.message },
                      ],
                    }
                  : t
              )
            );
          }
        }
      }
    } catch {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  {
                    id: crypto.randomUUID(),
                    role: "agent",
                    text: "Something went wrong reaching the agent.",
                  },
                ],
              }
            : t
        )
      );
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  }

  return (
    <main className="flex h-screen">
      <ThreadSidebar
        open={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        threads={threads}
        activeThreadId={activeThreadId}
        onNewThread={handleNewThread}
        onSelectThread={setActiveThreadId}
        onDeleteThread={handleDeleteThread}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} threadTitle={activeThread?.title}/>
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={activeThread?.messages ?? []}
            loading={loading}
            statusMessage={statusMessage}
            onSend={handleSend}
          />
        </div>
      </div>
    </main>
  );
}