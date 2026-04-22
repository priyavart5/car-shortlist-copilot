import type { CarPreferences, Recommendation, RecommendationResponse } from "@/types/car";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

type AiItem = {
  carId: string;
  explanation: string;
};

function getApiKey() {
  return process.env.OPENAI_API_KEY || process.env.OPEN_AI_API || null;
}

function extractOutputText(data: unknown) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("output_text" in data && typeof data.output_text === "string") {
    return data.output_text;
  }

  if (!("output" in data) || !Array.isArray(data.output)) {
    return null;
  }

  const textParts: string[] = [];

  for (const item of data.output) {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
      continue;
    }

    for (const contentItem of item.content) {
      if (
        contentItem &&
        typeof contentItem === "object" &&
        "text" in contentItem &&
        typeof contentItem.text === "string"
      ) {
        textParts.push(contentItem.text);
      }
    }
  }

  return textParts.join("").trim() || null;
}

export async function enrichRecommendationsWithAi(
  preferences: CarPreferences,
  response: RecommendationResponse,
): Promise<RecommendationResponse> {
  const apiKey = getApiKey();
  if (!apiKey || response.matches.length === 0) {
    return response;
  }

  const compactPayload = response.matches.map((match) => ({
    carId: match.car.id,
    name: match.car.name,
    priceLakh: match.car.priceLakh,
    score: match.score,
    reasons: match.reasons,
    tradeoff: match.tradeoff,
    tags: match.car.tags.slice(0, 4),
  }));

  try {
    const openAiResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You write concise car recommendation explanations. Return only valid JSON. Keep each explanation to 2 sentences max, grounded in the provided score, reasons, and tradeoff. Do not invent specifications.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  preferences,
                  recommendations: compactPayload,
                  outputFormat: [{ carId: "string", explanation: "string" }],
                }),
              },
            ],
          },
        ],
        max_output_tokens: 350,
      }),
    });

    if (!openAiResponse.ok) {
      return response;
    }

    const data = (await openAiResponse.json()) as unknown;
    const outputText = extractOutputText(data);

    if (!outputText) {
      return response;
    }

    const parsed = JSON.parse(outputText) as AiItem[];
    const explanationById = new Map(parsed.map((item) => [item.carId, item.explanation]));

    const matches: Recommendation[] = response.matches.map((match) => {
      const explanation = explanationById.get(match.car.id);
      if (!explanation) {
        return match;
      }

      return {
        ...match,
        explanation,
        explanationSource: "ai",
      };
    });

    return {
      ...response,
      matches,
      explanationMode: "ai",
    };
  } catch {
    return response;
  }
}
