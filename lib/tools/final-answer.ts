import type { AgentTool } from "../types";

export const finalAnswerTool: AgentTool = {
  name: "final_answer",
  description:
    "Call this as your last step to deliver your conclusion. This ends the turn — do not call any other tool after this.",
  parameters: {
    type: "object",
    properties: {
      reasoning: { type: "string" },
      severity: { type: "string", enum: ["low", "medium", "high"] },
      recommendedAction: {
        type: ["object", "null"],
        description:
          "Example: { \"kind\": \"reroute_shipment\", \"shipmentId\": \"SC-2291\", \"details\": { \"newRouteId\": \"R-12\" } }. The field must be named 'kind', not 'action'. Route/shipment/supplier-specific values (like newRouteId) must be nested inside 'details', never as top-level fields.",
        properties: {
          kind: {
            type: "string",
            enum: ["reroute_shipment", "expedite_shipment", "create_reorder", "notify_only"],
          },
          shipmentId: { type: "string" },
          details: {
            type: "object",
            description:
              "Action-specific fields go here, e.g. { \"newRouteId\": \"R-12\" } for a reroute, or { \"supplierId\": \"SUP-02\" } for a reorder.",
            additionalProperties: true,
          },
        },
        required: ["kind", "shipmentId", "details"],
        additionalProperties: false,
      },
      requiresApproval: { type: "boolean" },
    },
    required: ["reasoning", "severity", "recommendedAction", "requiresApproval"],
    additionalProperties: false,
  },
  execute: async (args) => JSON.stringify(args),
};