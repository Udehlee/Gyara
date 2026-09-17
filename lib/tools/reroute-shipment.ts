import { supabase } from "../supabase/supabase";
import type { AgentTool } from "../types";

export const rerouteShipmentTool: AgentTool = {
  name: "reroute_shipment",
  description:
    "Reroutes a shipment to a new route ID. Use this to resolve a disrupted route affecting a shipment.",
  parameters: {
    type: "object",
    properties: {
      shipmentId: { type: "string" },
      newRouteId: { type: "string" },
    },
    required: ["shipmentId", "newRouteId"],
  },

  // Moves a shipment onto a new route by updating its record
  execute: async ({ shipmentId, newRouteId }) => {
    const { data, error } = await supabase
      .from("shipments")
      .update({ route_id: newRouteId })
      .eq("shipment_id", shipmentId)
      .select()
      .single();

    if (error || !data) {
      return `Failed to reroute shipment ${shipmentId}: ${error?.message ?? "unknown error"}.`;
    }

    return `Rerouted shipment ${shipmentId} to route ${newRouteId}. Shipment record updated.`;
  },
};