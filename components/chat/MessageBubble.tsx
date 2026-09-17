"use client";

import type { UIMessage } from "@/lib/types";
import { Bot, User } from "lucide-react";
import ApprovalActions from "../actions/ApprovalActions";

export default function MessageBubble({ message }: { message: UIMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-[75%] rounded-2xl bg-blue-600 text-white px-4 py-2.5 text-sm">
          {message.text}
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
          <User className="h-4 w-4 text-blue-600" />
        </div>
      </div>
    );
  }

  const answer = message.finalAnswer;

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-900/5">
        <Bot className="h-4 w-4 text-gray-700" />
      </div>

      <div className="max-w-[80%] rounded-2xl bg-gray-100 px-4 py-3 text-sm space-y-3">
        {!answer ? (
          <p className="text-gray-500 italic">{message.text}</p>
        ) : (
          <>
            <p className="text-gray-800 leading-relaxed">{answer.reasoning}</p>

            {answer.requiresApproval && answer.recommendedAction && (
              <ApprovalActions action={answer.recommendedAction} />
            )}
          </>
        )}
      </div>
    </div>
  );
}