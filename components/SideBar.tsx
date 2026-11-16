"use client";

import { useState } from "react";
import { SquarePen, Trash2, Boxes, PanelLeftClose, Droplet, Clock } from "lucide-react";
import type { Thread } from "@/lib/types";

function getThreadIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("flood") || lower.includes("route") || lower.includes("road")) {
    return Droplet;
  }
  return Clock;
}

export default function ThreadSidebar({
  open,
  onToggleSidebar,
  threads,
  activeThreadId,
  onNewThread,
  onSelectThread,
  onDeleteThread,
}: {
  open: boolean;
  onToggleSidebar: () => void;
  threads: Thread[];
  activeThreadId: string | null;
  onNewThread: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");

  const filtered = threads.filter((t) =>
    t.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <nav
      className={`h-full flex-shrink-0 overflow-hidden border-r border-gray-200 bg-gray-50/50 transition-all duration-200 ${
        open ? "w-64" : "w-0"
      }`}
    >
      <div className="w-64 h-full flex flex-col">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5">
            <Boxes className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-900 text-sm">Gyara</span>
          </div>
          <button
            onClick={onToggleSidebar}
            className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md p-1.5 transition-colors"
          >
            <PanelLeftClose className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="p-3 pt-1 space-y-2">
          <button
            onClick={onNewThread}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white bg-gray-900"
          >
            <SquarePen className="h-4 w-4 text-gray-900" />
            New chat
          </button>

          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search chats..."
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="px-3 pb-1 pt-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 px-1">
            Chats
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-gray-400">No chats yet.</p>
          )}
          {filtered.map((thread) => {
            const active = thread.id === activeThreadId;
            const Icon = getThreadIcon(thread.title);
            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm ${
                  active ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                <span className="truncate flex-1">{thread.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(thread.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}