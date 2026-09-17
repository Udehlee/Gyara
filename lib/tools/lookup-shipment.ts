import type { AgentTool } from "../types";
import { supabase } from "../supabase/supabase";

export const lookupShipmentTool: AgentTool = {
  name: "lookup_shipment",
  description:
    "Looks up a shipment's status, contents (SKUs), route, and due date by its shipment ID.",
  parameters: {
    type: "object",
    properties: {
      shipmentId: { type: "string", description: "e.g. 'SC-2291'" },
    },
    required: ["shipmentId"],
  },

  // Fetches the current record for a shipment
  // The agent uses this record for its reasoning and 
  //  not guessing on whats a shipment or its due date
  execute: async ({ shipmentId }) => {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .eq("shipment_id", shipmentId)
      .single();

      console.log("Supabase result:", data);
      console.log("Supabase error:", error);

    if (error || !data) {
      return `No shipment found with ID ${shipmentId}.`;
    }
    return JSON.stringify(data);
  },
};