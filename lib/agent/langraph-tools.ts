import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { lookupShipmentTool } from "../tools/lookup-shipment";
import { lookupRouteTool } from "../tools/lookup-route";
import { rerouteShipmentTool } from "../tools/reroute-shipment";
import { createReorderTool } from "../tools/create-order";
import { expediteShipmentTool } from "../tools/expedite-shipment";
import { notifyHumanTool } from "../tools/notify-human";

export const lookupShipment = tool(
  async ({ shipmentId }) =>
    lookupShipmentTool.execute({ shipmentId }),
  {
    name: "lookup_shipment",
    description: lookupShipmentTool.description,
    schema: z.object({
      shipmentId: z.string().describe("e.g. 'SC-2291'"),
    }),
  }
);

export const lookupRoute = tool(
  async ({ routeId }) =>
    lookupRouteTool.execute({ routeId }),
  {
    name: "lookup_route",
    description: lookupRouteTool.description,
    schema: z.object({
      routeId: z.string().describe("e.g. 'R-03'"),
    }),
  }
);

export const rerouteShipment = tool(
  async ({ shipmentId, newRouteId }) =>
    rerouteShipmentTool.execute({
      shipmentId,
      newRouteId,
    }),
  {
    name: "reroute_shipment",
    description: rerouteShipmentTool.description,
    schema: z.object({
      shipmentId: z.string(),
      newRouteId: z.string(),
    }),
  }
);

export const createReorder = tool(
  async ({ orderId, supplierId }) =>
    createReorderTool.execute({
      orderId,
      supplierId,
    }),
  {
    name: "create_reorder",
    description: createReorderTool.description,
    schema: z.object({
      orderId: z.string(),
      supplierId: z.string().optional(),
    }),
  }
);

export const expediteShipment = tool(
  async ({ shipmentId }) =>
    expediteShipmentTool.execute({ shipmentId }),
  {
    name: "expedite_shipment",
    description: expediteShipmentTool.description,
    schema: z.object({
      shipmentId: z.string(),
    }),
  }
);

export const notifyHuman = tool(
  async ({ message }) =>
    notifyHumanTool.execute({ message }),
  {
    name: "notify_human",
    description: notifyHumanTool.description,
    schema: z.object({
      message: z.string(),
    }),
  }
);

const proposedActionSchema = z.object({
  kind: z.enum([
    "reroute_shipment",
    "expedite_shipment",
    "create_reorder",
    "notify_only",
  ]),

  shipmentId: z.string(),

  details: z.record(
    z.string(),
    z.union([z.string(), z.number()])
  ),
});

export const finalAnswer = tool(
  async (args) => JSON.stringify(args),
  {
    name: "final_answer",

    description:
      "Return the final analysis of the operational notice. Use this only when you have finished investigating.",

    schema: z.object({
      reasoning: z.string(),

      severity: z.enum(["low", "medium", "high"]),

      recommendedAction: proposedActionSchema.nullable(),

      requiresApproval: z.boolean(),
    }),
  }
);

export const langgraphTools = [
  lookupShipment,
  lookupRoute,
  rerouteShipment,
  createReorder,
  expediteShipment,
  notifyHuman,
  finalAnswer,
];