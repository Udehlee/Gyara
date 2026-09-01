import type { OpenAI } from "openai";
type ChatCompletionMessageParam = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export interface ShipmentRecord {
    shipmentId: string;
    orderId:  string;
    routeId: string;
    skus: string[]; //stock keeping unit
    dueDate: string;
    status: "in-transit" | "delayed" | "delivered"
}

export interface RouteRecord {
    routeId: string;
    origin: string;
    destination: string;
    status: "clear" | "disrupted";
    alternateRoute: string[];
}

export interface SupplierRecord {
    supplierId: string;
    name: string;
    reliabilityScore: number;
    backupSupplierId?: string;
}

export interface AgentTool {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    execute: (args: Record<string, unknown>) => Promise<string>;
}

export interface ChatAgentState{
    messages: ChatCompletionMessageParam[];
    interations: number;
}

export interface ProposedAction {
  kind: "reroute_shipment" | "expedite_shipment" | "create_reorder" | "notify_only";
  shipmentId: string;
  details: Record<string, string | number>;
}

export interface FinalAnswer {
  reasoning: string;
  severity: "low" | "medium" | "high";
  recommendedAction: ProposedAction | null;
  requiresApproval: boolean;
}

export type FeedBackStatus = "Approved" | "edited" | "rejected" | "auto-resolved"

export interface ActionOutcome {
    noticeId: string;
    actionKind: string;
    status: FeedBackStatus;
    resultSummary: string;
    loggedAt: string;
}

export interface UIMessage {
  id: string;
  role: "user" | "agent";
  text: string;           // the user text message
  finalAnswer?: FinalAnswer; // this is only present for agent messages
}

export interface Thread {
  id: string;
  title: string;
  messages: UIMessage[];
  createdAt: string;
}