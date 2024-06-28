import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";

const vertex_ai = new VertexAI({
  project: "integrated-hawk-426419-p0",
  location: "southamerica-east1",
});
const model = "gemini-1.5-flash-001";

async function generateContent(fileContent: string, userMessage: string) {
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 1,
      topP: 0.95,
    },
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: "responde la pregunta de los usuarios en formato Markdown. Se breve en tus respuestas no mas de 50 palabras",
        },
      ],
    },
  });

  const document = {
    inlineData: {
      mimeType: "application/pdf",
      data: fileContent,
    },
  };
  const req = {
    contents: [
      {
        role: "user",
        parts: [document, { text: `${userMessage}` }],
      },
    ],
  };
  const streamingResp = await generativeModel.generateContentStream(req);
  return streamingResp;
}

export default generateContent;
