"use client";

import { PanelLeftOpen } from "lucide-react";

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  threadTitle,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  threadTitle?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
      {!sidebarOpen && (
        <button
          onClick={onToggleSidebar}
          aria-label="Open sidebar"
          className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md p-1.5 transition-colors flex-shrink-0"
        >
          <PanelLeftOpen className="h-4.5 w-4.5" />
        </button>
      )}
      {threadTitle && (
        <span className="text-sm font-medium text-gray-700 truncate">{threadTitle}</span>
      )}
    </div>
  );
}