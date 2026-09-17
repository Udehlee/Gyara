import type { AgentTool } from "../types";
import { supabase } from "../supabase/supabase";

export const lookupRouteTool: AgentTool = {
  name: "lookup_route",
  description:
    "Looks up a route's status by route ID, and which shipments currently use it. Use this for external events like floods or road closures",
  parameters: {
    type: "object",
    properties: {
      routeId: { type: "string", description: "e.g. 'R-03'" },
    },
    required: ["routeId"],
  },

  // Checks a route's status and finds every shipment currently on it
  // Turns a vague notice report into a specific list of affected shipments.
  execute: async ({ routeId }) => {
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("*")
      .eq("route_id", routeId)
      .single();

      console.log("Route result:", route);
      console.log("Route error:", routeError);

    if (routeError || !route) {
      return `No route found with ID ${routeId}.`;
    }

    const { data: affectedShipments } = await supabase
      .from("shipments")
      .select("*")
      .eq("route_id", routeId);

    return JSON.stringify({ route, affectedShipments: affectedShipments ?? [] });
  },
};