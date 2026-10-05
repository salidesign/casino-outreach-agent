export type LlmRequest = {
  system: string;
  user: string;
};

export type LlmResponse = {
  text: string;
};

export interface LlmProvider {
  generate(request: LlmRequest): Promise<LlmResponse>;
}

export class HttpLlmProvider implements LlmProvider {
  async generate(request: LlmRequest): Promise<LlmResponse> {
    const endpoint = process.env.LLM_API_URL;
    const apiKey = process.env.LLM_API_KEY;
    const model = process.env.LLM_MODEL ?? "default";

    if (!endpoint || !apiKey) {
      throw new Error("LLM_API_URL and LLM_API_KEY are required");
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.user }
        ]
      })
    });

    if (!response.ok) throw new Error(`LLM provider returned ${response.status}`);

    const data = await response.json() as {
      text?: string;
      choices?: Array<{ message?: { content?: string } }>;
    };

    const text = data.text ?? data.choices?.[0]?.message?.content;
    if (!text) throw new Error("LLM provider returned no text");

    return { text };
  }
}
