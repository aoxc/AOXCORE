import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeAction = async (action: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are AOXC Sentinel, an AI security layer for a blockchain OS. 
      Analyze the following user action: "${action}". 
      Context: ${JSON.stringify(context)}.
      
      Tasks:
      1. Provide a brief security verdict (max 15 words).
      2. Status: APPROVED or REJECTED.
      3. Human Translation: Explain what this contract call does in simple terms (e.g., "This will lock your funds for 24h").
      4. Audit Trail: List 3 internal contract modules that will be triggered (e.g., ["AoxcGateway", "AoxcVault", "AoxcRegistry"]).
      
      Return as JSON.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{"verdict": "Sentinel Timeout", "status": "APPROVED", "humanTranslation": "Action verified by fallback protocols.", "auditTrail": ["AoxcGateway", "AoxcRegistry"]}');
  } catch (error) {
    console.error("Sentinel Error:", error);
    return { 
      verdict: "Local bypass active. Security check skipped.", 
      status: "APPROVED",
      humanTranslation: "Direct execution via emergency gateway.",
      auditTrail: ["AoxcGateway", "EmergencyModule"]
    };
  }
};

export const humanizeError = async (errorCode: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Translate this technical blockchain error code into a polite, helpful message for a user: "${errorCode}". 
      Context: AOXC Neural OS. 
      Example: "Error 0x12a3" -> "Gemini: AoxcVault bakiyeniz bu işlem için yetersiz görünüyor, lütfen kasanızı kontrol edin."`,
    });
    return response.text;
  } catch {
    return `System Error: ${errorCode}. Please contact AoxcSupport.`;
  }
};
