import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TripInput, EstimationResult } from "../types";

// Define the response schema strictly to ensure valid JSON output
const estimationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tripDistanceKm: {
      type: Type.NUMBER,
      description: "The estimated one-way distance of the trip in kilometers.",
    },
    primaryEstimate: {
      type: Type.OBJECT,
      properties: {
        vehicleType: { type: Type.STRING },
        fuelType: { type: Type.STRING },
        estimatedConsumption: { type: Type.STRING, description: "e.g., '5.5 L' or '12 kWh'" },
        estimatedCost: { type: Type.NUMBER, description: "Total cost in INR" },
        co2Emissions: { type: Type.NUMBER, description: "Total CO2 emissions in kg" },
        efficiency: { type: Type.STRING, description: "e.g., '18 km/L'" },
      },
      required: ["vehicleType", "fuelType", "estimatedConsumption", "estimatedCost", "co2Emissions", "efficiency"],
    },
    comparison: {
      type: Type.ARRAY,
      description: "Comparison with 2 other relevant vehicle types (e.g., if user chose Car, compare with EV and Bike/Public). Total 3 items including user choice or distinct alternatives.",
      items: {
        type: Type.OBJECT,
        properties: {
          vehicleType: { type: Type.STRING },
          fuelType: { type: Type.STRING },
          estimatedConsumption: { type: Type.STRING },
          estimatedCost: { type: Type.NUMBER },
          co2Emissions: { type: Type.NUMBER },
          efficiency: { type: Type.STRING },
        },
        required: ["vehicleType", "fuelType", "estimatedConsumption", "estimatedCost", "co2Emissions", "efficiency"],
      },
    },
    assumptions: {
      type: Type.OBJECT,
      properties: {
        fuelPrice: { type: Type.NUMBER, description: "Price per unit (L or kWh) used for calculation" },
        fuelUnit: { type: Type.STRING, description: "e.g., 'INR/L' or 'INR/kWh'" },
        mileageAssumption: { type: Type.STRING },
        description: { type: Type.STRING, description: "Brief text about how conditions affected the result" },
      },
      required: ["fuelPrice", "fuelUnit", "mileageAssumption", "description"],
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 actionable tips to save cost/energy for this specific trip.",
    },
  },
  required: ["tripDistanceKm", "primaryEstimate", "comparison", "assumptions", "tips"],
};

export const estimateTrip = async (input: TripInput): Promise<EstimationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let promptContext = "";
  
  if (input.inputType === 'route') {
    promptContext = `The trip is from ${input.origin} to ${input.destination}. Estimate the driving distance via the most common route.`;
  } else {
    promptContext = `The trip distance is exactly ${input.distance} km.`;
  }

  const prompt = `
    Act as an expert automotive engineer and environmental scientist specialized in Indian transport.
    
    Calculate trip energy/fuel consumption, cost (in INR), and CO2 emissions.
    
    Input Details:
    - Context: ${promptContext}
    - Vehicle: ${input.vehicleType}
    - Fuel: ${input.fuelType}
    - Conditions: ${input.roadCondition} roads, Driving Style: ${input.drivingStyle}, AC: ${input.isAcOn ? 'On' : 'Off'}.
    
    Requirements:
    1. Use realistic current fuel prices in India (approx: Petrol ₹100/L, Diesel ₹90/L, CNG ₹80/kg, EV ₹10/kWh domestic or ₹20/kWh public - assume a mix or standard).
    2. Adjust mileage based on driving style (Aggressive = -20% efficiency, Eco = +10% efficiency) and AC usage (-10% to -15% efficiency).
    3. For the comparison array, provide the user's vehicle result PLUS 2 distinct alternatives (e.g., if user chose Petrol Car, compare with Electric Car and a Two-wheeler or Diesel option).
    4. Return strictly valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: estimationSchema,
        temperature: 0.3, // Low temperature for consistent math/facts
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data received from AI service.");
    }
    
    const data = JSON.parse(jsonText) as EstimationResult;
    return data;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to calculate estimation. Please check your network or try again.");
  }
};