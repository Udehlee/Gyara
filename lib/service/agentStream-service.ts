import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { agentGraph } from "../agent/graph";
import type { FinalAnswer } from "../types";

export type AgentStreamEvent =
  | { type: "status"; message: string }
  | { type: "final"; finalAnswer: FinalAnswer };

function describeToolStart(toolName: string): string {
  const labels: Record<string, string> = {
    lookup_shipment: "Checking shipment status...",
    lookup_route: "Checking route status...",
    reroute_shipment: "Rerouting shipment...",
    create_reorder: "Creating reorder...",
    expedite_shipment: "Requesting expedite...",
    notify_human: "Notifying the team...",
  };
  return labels[toolName] ?? `Running ${toolName}...`;
}

export async function* streamAgentResponse(
  noticeText: string
): AsyncGenerator<AgentStreamEvent> {
  const stream = await agentGraph.stream(
    { messages: [new HumanMessage(noticeText)] },
    { streamMode: "updates", recursionLimit: 12 }
  );

  for await (const step of stream) {
    if (!step.agent) continue;

    const lastMsg = step.agent.messages[step.agent.messages.length - 1] as AIMessage;
    const toolCalls = lastMsg.tool_calls ?? [];

    for (const tc of toolCalls) {
      if (tc.name === "final_answer") {
        yield { type: "final", finalAnswer: tc.args as FinalAnswer };
        return;
      }
      yield { type: "status", message: describeToolStart(tc.name) };
    }

    if (toolCalls.length === 0 && lastMsg.content) {
      yield {
        type: "final",
        finalAnswer: {
          reasoning: String(lastMsg.content),
          severity: "low",
          recommendedAction: null,
          requiresApproval: false,
        },
      };
      return;
    }
  }
}