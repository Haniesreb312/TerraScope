
import { GoogleGenAI, Type } from "@google/genai";
import { CountryProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface NewsSource {
  title: string;
  uri: string;
}

export interface NewsResult {
  content: string;
  sources: NewsSource[];
}

export const fetchCountryProfile = async (countryName: string, language: string = 'English'): Promise<CountryProfile> => {
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model: model,
    contents: `Generate a comprehensive data profile for the country: ${countryName}. 
    Ensure the economic data includes estimated GDP growth trends for the last 5 years. 
    Provide realistic data based on your knowledge base.
    
    IMPORTANT: Provide all text content (descriptions, fun facts, landmark descriptions, safety messages, climate info, etc.) in ${language}.
    
    IMPORTANT: Provide precise latitude and longitude coordinates for both the country's center and its capital city.
    IMPORTANT: Provide the ISO 3166-1 alpha-2 two-letter country code.
    IMPORTANT: Include a relevant emoji for each landmark.
    IMPORTANT: Provide a valid URL for an official website, Wikipedia page, or reputable travel guide for each landmark.
    IMPORTANT: Provide detailed currency information including the symbol (e.g., $, €, £) and ISO code.
    IMPORTANT: Provide a list of timezones covering the country (e.g., "UTC-05:00", "UTC+01:00").
    IMPORTANT: Provide local emergency phone numbers for Police, Ambulance, and Fire.
    IMPORTANT: Provide a current safety risk score (0.0 to 5.0, where 0 is safe and 5 is extreme danger).
    IMPORTANT: Provide a brief travel advisory summary based on general geopolitical knowledge.
    IMPORTANT: Provide a list of specific regions to avoid or exercise caution in (if any).
    IMPORTANT: Provide a list of common health risks or recommended vaccinations.
    IMPORTANT: Provide a brief summary of general visa requirements for tourists.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Common name of the country" },
          officialName: { type: Type.STRING, description: "Official full name" },
          isoAlpha2: { type: Type.STRING, description: "ISO 3166-1 alpha-2 two-letter country code (e.g., US, JP, BR)" },
          capital: { type: Type.STRING },
          population: { type: Type.STRING, description: "Formatted population string (e.g. '67 Million')" },
          currency: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Currency name (e.g. United States Dollar)" },
              code: { type: Type.STRING, description: "ISO 4217 code (e.g. USD)" },
              symbol: { type: Type.STRING, description: "Currency symbol (e.g. $)" }
            }
          },
          languages: { type: Type.ARRAY, items: { type: Type.STRING } },
          region: { type: Type.STRING },
          description: { type: Type.STRING, description: "A concise 2-3 sentence overview." },
          funFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
          economicHistory: {
            type: Type.ARRAY,
            description: "Last 5 years of economic data",
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                gdp: { type: Type.NUMBER, description: "GDP Growth rate in percentage" },
                inflation: { type: Type.NUMBER, description: "Inflation rate in percentage" }
              }
            }
          },
          landmarks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, description: "Nature, Historical, Urban, etc." },
                emoji: { type: Type.STRING, description: "A single emoji icon representing this landmark" },
                url: { type: Type.STRING, description: "URL to official site or reputable info page" }
              }
            }
          },
          climate: { type: Type.STRING },
          internetTLD: { type: Type.STRING },
          callingCode: { type: Type.STRING },
          timezones: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of timezones (e.g. UTC+09:00)"
          },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              latitude: { type: Type.NUMBER },
              longitude: { type: Type.NUMBER }
            },
            description: "Geographic center of the country"
          },
          capitalCoordinates: {
            type: Type.OBJECT,
            properties: {
              latitude: { type: Type.NUMBER },
              longitude: { type: Type.NUMBER }
            },
            description: "Geographic coordinates of the capital city"
          },
          emergencyNumbers: {
            type: Type.OBJECT,
            properties: {
              police: { type: Type.STRING, description: "Police emergency number" },
              ambulance: { type: Type.STRING, description: "Ambulance emergency number" },
              fire: { type: Type.STRING, description: "Fire department emergency number" }
            }
          },
          safetyAdvisory: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Safety risk score from 0 (Safe) to 5 (Extreme)" },
              message: { type: Type.STRING, description: "Brief travel advisory summary" },
              regionsToAvoid: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Specific regions to avoid or exercise caution" 
              },
              healthRisks: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "Health risks or required vaccinations" 
              },
              visaInfo: { type: Type.STRING, description: "General visa requirement summary" }
            },
            required: ["score", "message", "regionsToAvoid", "healthRisks", "visaInfo"]
          }
        },
        required: ["name", "isoAlpha2", "capital", "population", "currency", "description", "economicHistory", "landmarks", "coordinates", "capitalCoordinates", "timezones", "emergencyNumbers", "safetyAdvisory"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No data returned from Gemini");
  }
  
  return JSON.parse(text) as CountryProfile;
};

export const translateContent = async (
  description: string, 
  funFacts: string[], 
  targetLanguage: string
): Promise<{ description: string; funFacts: string[] }> => {
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model: model,
    contents: `Translate the following country description and funFacts into ${targetLanguage}.
    
    Description: ${description}
    
    Fun Facts:
    ${JSON.stringify(funFacts)}
    
    Return valid JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          funFacts: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["description", "funFacts"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Translation failed");
  return JSON.parse(text);
};

export const fetchCountryNews = async (countryName: string, language: string = 'English'): Promise<NewsResult> => {
  const model = "gemini-2.5-flash";
  
  // Note: When using googleSearch tool, we cannot use responseSchema or responseMimeType
  const response = await ai.models.generateContent({
    model: model,
    contents: `What are the top 5 current news headlines for ${countryName} today? 
    Provide a concise bulleted list of headlines with a very brief one-sentence summary for each. 
    IMPORTANT: Provide the headlines and summaries in ${language}.
    Do not include standard markdown links in the text, as sources will be extracted from metadata.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const content = response.text || "No news found.";
  
  // Extract sources from grounding metadata
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const sources = chunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web && web.uri && web.title);

  // Deduplicate sources by URI
  const uniqueSources = Array.from(new Map(sources.map((s:any) => [s.uri, s])).values()) as NewsSource[];

  return { content, sources: uniqueSources };
};