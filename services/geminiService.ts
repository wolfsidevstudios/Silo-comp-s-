
import { GoogleGenAI, Type } from "@google/genai";
import { Coordinates, DirectionCountries } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getCountriesInDirections = async (
  { latitude, longitude }: Coordinates
): Promise<DirectionCountries> => {
  try {
    const prompt = `
      Given the current GPS coordinates latitude ${latitude} and longitude ${longitude}, 
      identify the first country you would encounter if you traveled directly North, South, East, and West from this point.
      If the direction leads into a large body of water (like an ocean or sea) for a significant distance, state "Ocean" or the specific sea name.
      Provide the response as a JSON object with keys "north", "south", "east", and "west".
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            north: { type: Type.STRING, description: "Country or Ocean to the North" },
            south: { type: Type.STRING, description: "Country or Ocean to the South" },
            east: { type: Type.STRING, description: "Country or Ocean to the East" },
            west: { type: Type.STRING, description: "Country or Ocean to the West" },
          },
          required: ["north", "south", "east", "west"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    return parsedData as DirectionCountries;

  } catch (error) {
    console.error("Error fetching country data from Gemini API:", error);
    throw new Error("Failed to determine surrounding countries. The AI may be busy or an error occurred.");
  }
};
