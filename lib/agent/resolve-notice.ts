import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { agentGraph } from "./graph";
import type { FinalAnswer } from "../types";

export async function resolveNoticeGraph(noticeText: string): Promise<FinalAnswer> {
  const result = await agentGraph.invoke(
    { messages: [new HumanMessage(noticeText)] },
    { recursionLimit: 12 }
  );

  const messages = result.messages;
  const lastMsg = messages[messages.length - 1] as AIMessage;
  const toolCalls = lastMsg.tool_calls ?? [];

  const finalAnswerCall = toolCalls.find((tc) => tc.name === "final_answer");
  if (finalAnswerCall) {
    return finalAnswerCall.args as FinalAnswer;
  }

  return {
    reasoning: String(lastMsg.content) || "The agent did not return a structured answer.",
    severity: "low",
    recommendedAction: null,
    requiresApproval: false,
  };
}