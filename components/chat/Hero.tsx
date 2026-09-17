"use client";

import { useState } from "react";
import { ArrowUp, Truck, Waves } from "lucide-react";

export default function LandingHero({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [message, setMessage] = useState("");
  const icons = [Truck, Waves];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Chat with Gyara</h1>
      <p className="text-sm text-gray-400 mb-6">
        Start by describing a supply chain notice
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm px-4 py-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="e.g. Shipment SC-4432 delayed 5 days due to customs hold..."
            rows={2}
            className="w-full resize-none outline-none text-sm"
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
            <button
              type="submit"
              disabled={!message.trim()}
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                message.trim() ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400"
              }`}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}