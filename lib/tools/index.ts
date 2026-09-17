import { finalAnswerTool } from "./final-answer";
import { lookupShipmentTool } from "./lookup-shipment";
import { lookupRouteTool } from "./lookup-route";
import { rerouteShipmentTool } from "./reroute-shipment";
import { createReorderTool } from "./create-order";
import { expediteShipmentTool } from "./expedite-shipment";
import { notifyHumanTool } from "./notify-human";

export const allTools = [
  finalAnswerTool,
  lookupShipmentTool,
  lookupRouteTool,
  rerouteShipmentTool,
  createReorderTool,
  expediteShipmentTool,
  notifyHumanTool,
];