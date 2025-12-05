import { GoogleGenAI } from "@google/genai";
import { ReferenceImage, ThumbnailStyle } from "../types";

export const generateThumbnail = async (
  concept: string,
  style: ThumbnailStyle,
  referenceImage: ReferenceImage
): Promise<string> => {
  // Ensure API key is selected via the specialized UI flow for Pro Image models
  // The actual key is injected into process.env.API_KEY automatically after selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const stylePromptMap: Record<ThumbnailStyle, string> = {
    [ThumbnailStyle.REALISTIC]: "photorealistic, 8k resolution, cinematic lighting, professional photography, highly detailed texture, depth of field",
    [ThumbnailStyle.CARTOON_3D]: "3D render style, Pixar-like animation, vibrant colors, soft shading, exaggerated expressions, cute but professional",
    [ThumbnailStyle.COMIC_BOOK]: "comic book art style, bold black outlines, halftone patterns, dramatic action lines, pop art colors",
    [ThumbnailStyle.NEON_CYBERPUNK]: "cyberpunk aesthetic, neon lighting, dark background, glowing effects, futuristic, gamer vibe, high contrast",
    [ThumbnailStyle.EXPRESSIVE_ILLUSTRATION]: "digital illustration, expressive brush strokes, artistic, vibrant, exaggerated emotion, concept art",
    [ThumbnailStyle.MINIMALIST]: "minimalist design, flat colors, clean vector art, plenty of negative space, modern aesthetic"
  };

  const selectedStyleKeywords = stylePromptMap[style];

  // Constructing a robust prompt for the model
  const prompt = `
    Generate a high-quality YouTube thumbnail image.
    
    CONCEPT: ${concept}
    STYLE: ${selectedStyleKeywords}
    
    INSTRUCTIONS:
    1. The main subject of the thumbnail MUST be a character based on the provided reference image. Keep the likeness, hair color, and general features recognizable, but adapt the clothing and lighting to fit the requested STYLE and CONCEPT.
    2. The expression should be exaggerated and engaging (surprised, happy, determined, etc.) fitting the concept.
    3. The composition should be dynamic, following the rule of thirds, suitable for a small YouTube thumbnail format.
    4. Background should be relevant to the '${concept}' but slightly blurred or less detailed than the character to ensure the subject pops.
    5. High saturation and contrast to stand out on a white or dark background.
    6. Aspect Ratio 16:9.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Using Pro Image for best face adherence and quality
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: referenceImage.mimeType,
              data: referenceImage.base64,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K", // 1K is usually sufficient for thumbnails and faster
        }
      },
    });

    // Extract image
    let base64Image = "";
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image generated.");
    }

    return `data:image/png;base64,${base64Image}`;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};