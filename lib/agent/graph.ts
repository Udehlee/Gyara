import { StateGraph, MessagesAnnotation, END, START } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { SystemMessage, AIMessage } from "@langchain/core/messages";
import { SYSTEM_PROMPT } from "./prompt";
import { langgraphTools } from "./langraph-tools";
import { AGENT_MODEL } from "../llm";

if (!process.env.GROQ_API_KEY) {
  throw new Error("missing GROQ_API_KEY in env");
}

// Only set up the model the first time it's actually needed
// not when this file is first loaded. 
// This way, if setup ever fails, it fails during a real request (easy to catch)
//  instead of crashing the app
let boundModel: ReturnType<ChatGroq["bindTools"]> | null = null;

function getModel() {
  if (!boundModel) {
    boundModel = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: AGENT_MODEL,
    }).bindTools(langgraphTools);
  }
  return boundModel;
}

// Sends the conversation so far to the model and gets its next response
async function callModel(state: typeof MessagesAnnotation.State) {
  console.log("Step", state.messages.length);
  const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];

  const model = getModel();
  const response = await model.invoke(messages);

  return { messages: [response] };
}

// shouldContinue Decides what happens next
//  stop if the agent is done, otherwise run a tool.
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const last = state.messages[state.messages.length - 1] as AIMessage;
  const toolCalls = last.tool_calls ?? [];

  if (toolCalls.length === 0) return END;
  if (toolCalls.some((tc) => tc.name === "final_answer")) return END;
  return "tools";
}

const toolNode = new ToolNode(langgraphTools);

// The actual agent flow
// ask the model - maybe run a tool - ask again - repeat until done.
export const agentGraph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue, { tools: "tools", [END]: END })
  .addEdge("tools", "agent")
  .compile();