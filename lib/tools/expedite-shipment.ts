import { supabase } from "../supabase/supabase";
import type { AgentTool } from "../types";

export const expediteShipmentTool: AgentTool = {
  name: "expedite_shipment",
  description: "Requests expedited handling for a delayed shipment to reduce its arrival time.",
  parameters: {
    type: "object",
    properties: {
      shipmentId: { type: "string" },
    },
    required: ["shipmentId"],
  },

  // Marks a delayed shipment as moving again under priority handling
  // There's no separate expedited status yet, so it's set back to in-transit
  execute: async ({ shipmentId }) => {
    const { data, error } = await supabase
      .from("shipments")
      .update({ status: "in-transit" }) // flips it out of "delayed" — expedited handling now underway
      .eq("shipment_id", shipmentId)
      .select()
      .single();

    if (error || !data) {
      return `Failed to expedite shipment ${shipmentId}: ${error?.message ?? "shipment not found"}.`;
    }

    return `Expedite requested for shipment ${shipmentId}. Status updated to in-transit with priority handling.`;
  },
};