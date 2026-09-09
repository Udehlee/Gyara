import OpenAI from "openai";

if (!process.env.GROQ_API_KEY) {
  throw new Error("missing GROQ_API_KEY in env");
}

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const AGENT_MODEL = "openai/gpt-oss-120b";
