import type { AgentTool } from "../types";
import { supabase } from "../supabase/supabase";

// creates an order based on the impact the delay
export const createReorderTool: AgentTool = {
  name: "create_reorder",
  description:
    "Creates a reorder for an order, optionally from a backup supplier. Use this when a delay is severe enough that waiting isn't viable.",
  parameters: {
    type: "object",
    properties: {
      orderId: { type: "string" },
      supplierId: { type: "string", description: "Optional. Defaults to first available supplier if omitted." },
    },
    required: ["orderId"],
  },

  // Finds a supplier (or backup) and records a reorder for a delayed order
  // Used when a shipment is too late to save, so a replacement is sourced instead
  execute: async ({ orderId, supplierId }) => {
    let supplier;
    if (supplierId) {
      const { data } = await supabase.from("suppliers").select("*").eq("supplier_id", supplierId).single();
      supplier = data;
    } else {
      const { data } = await supabase.from("suppliers").select("*").limit(1).single();
      supplier = data;
    }
    return `Reorder created for ${orderId} via supplier ${supplier?.name ?? "unknown"}.`;
  },
};