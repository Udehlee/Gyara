import type { AgentTool } from "../types";

// Flags something for a human to look at, without taking any action.
export const notifyHumanTool: AgentTool = {
  name: "notify_human",
  description:
    "Sends a notification to the ops team without taking an action. Use this when something needs attention but isn't clear-cut enough to act on.",
  parameters: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
    required: ["message"],
  },
  execute: async ({ message }) => {
    return `Notification sent to ops team: "${message}"`;
  },
};