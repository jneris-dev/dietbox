import OpenAI from "openai";

import { buildSystemPrompt, buildUserPrompt, buildDocsSystemPrompt } from "./prompt";
import type { DietPlanRequest } from "./types";

export async function generateDietPlan(input: DietPlanRequest) {
  console.log("Gerando plano de dieta para:", input);
  
  return input
};