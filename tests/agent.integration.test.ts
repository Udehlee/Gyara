import { describe, it, expect } from "vitest";
import { resolveNoticeGraph } from "../lib/agent/resolve-notice";

describe("Gyara agent (LangGraph)", () => {
  it("recommends a reroute for a disrupted route", async () => {
    const result = await resolveNoticeGraph(
      "Flooding reported near Trade Fair Complex, road on route R-03 impassable."
    );

    expect(result.recommendedAction?.kind).toBe("reroute_shipment");
    expect(result.recommendedAction?.shipmentId).toBe("SC-7810");
    expect(result.requiresApproval).toBe(true);
  }, 40000);

  it("takes no action when a delay doesn't breach the due date", async () => {
    const result = await resolveNoticeGraph(
      "Shipment SC-4432 delayed 9 days due to customs hold."
    );

    expect(result.recommendedAction).toBeNull();
    expect(result.requiresApproval).toBe(false);
  }, 40000);

  it("recommends expedite or reorder when a delay clearly breaches the due date", async () => {
    const result = await resolveNoticeGraph(
      "Shipment SC-4432 delayed 15 days due to customs hold."
    );

    expect(["expedite_shipment", "create_reorder"]).toContain(
      result.recommendedAction?.kind
    );
    expect(result.recommendedAction?.shipmentId).toBe("SC-4432");
    expect(result.requiresApproval).toBe(true);
  }, 40000);
});