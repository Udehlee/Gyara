"use client";

import { useState } from "react";
import { X, Check, ChevronRight, Loader2, Route } from "lucide-react";
import type { ProposedAction } from "@/lib/types";

export default function ApprovalActions({ action }: { action: ProposedAction }) {
  const [status, setStatus] = useState<"pending" | "loading" | "approved" | "rejected" | "error">("pending");
  const [expanded, setExpanded] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);

  async function handleApprove() {
    setStatus("loading");
    try {
      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      });

      if (!res.ok) {
        throw new Error("Action failed");
      }

      const data = await res.json();
      setResultText(data.result);
      setStatus("approved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/60 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-900/5">
          <Route className="h-3.5 w-3.5 text-gray-600" />
        </div>
        <ChevronRight
          className={`h-3.5 w-3.5 text-gray-400 transition-transform flex-shrink-0 ${
            expanded ? "rotate-90" : ""
          }`}
        />
        <span className="text-sm font-medium text-gray-800 truncate">
          {formatActionKind(action.kind)}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-2 -mt-1">
          <div className="rounded-md bg-white border border-gray-100 px-3 py-2 text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">shipmentId</span>
              <span className="font-mono">{action.shipmentId}</span>
            </div>
            {Object.entries(action.details).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-400">{key}</span>
                <span className="font-mono">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 pb-3">
        {status === "pending" || status === "loading" ? (
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("rejected")}
              disabled={status === "loading"}
              className="flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <X className="h-3 w-3" />
              reject
            </button>
            <button
              onClick={handleApprove}
              disabled={status === "loading"}
              className="flex items-center gap-1 rounded-full border border-green-200 bg-white px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              {status === "loading" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
              accept
            </button>
          </div>
        ) : status === "approved" ? (
          <div className="text-xs font-medium text-green-700 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Allowed and executed
            </div>
            {resultText && <p className="text-gray-500 font-normal">{resultText}</p>}
          </div>
        ) : status === "error" ? (
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
            <X className="h-3.5 w-3.5" /> Failed to execute, try again
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
            <X className="h-3.5 w-3.5" /> Denied
          </div>
        )}
      </div>
    </div>
  );
}

function formatActionKind(kind: string) {
  return kind.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}