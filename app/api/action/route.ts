import { allTools } from "@/lib/tools";
import { supabase } from "@/lib/supabase/supabase";
import type { ProposedAction, ActionOutcome } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const action: ProposedAction = await req.json();

    if (!action?.kind || !action?.shipmentId) {
      return Response.json({ error: "Invalid action payload." }, { status: 400 });
    }

    const tool = allTools.find((t) => t.name === action.kind);
    if (!tool) {
      return Response.json({ error: `Unknown action: ${action.kind}` }, { status: 400 });
    }

    const result = await tool.execute({
      shipmentId: action.shipmentId,
      ...action.details,
    });

    // Log the outcome to Supabase
    const outcome: ActionOutcome = {
      noticeId: action.shipmentId, 
      actionKind: action.kind,
      status: "approved",
      resultSummary: result,
      loggedAt: new Date().toISOString(),
    };

    const { error: logError } = await supabase.from("action_outcomes").insert({
      notice_id: outcome.noticeId,
      action_kind: outcome.actionKind,
      status: outcome.status,
      result_summary: outcome.resultSummary,
      logged_at: outcome.loggedAt,
    });

    if (logError) {
      console.error("Failed to log action outcome:", logError);
    }

    return Response.json({ result });
  } catch (err) {
    console.error("Error in /api/action:", err);
    return Response.json({ error: "Failed to execute action." }, { status: 500 });
  }
}