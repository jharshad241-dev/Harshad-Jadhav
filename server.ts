import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { HAIRSTYLES_DATA, BEARD_STYLES_DATA, INITIAL_PAYMENT_SETTINGS } from "./src/data/saloonData.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // In-memory payment settings for Vaibhav Jadhav
  let currentPaymentSettings = { ...INITIAL_PAYMENT_SETTINGS };


  app.use(express.json({ limit: "15mb" }));

  // API Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Vaibhav Jadhav Music API", timestamp: new Date().toISOString() });
  });

  // AI Song Meaning & Spiritual Context Endpoint
  app.post("/api/ai/lyrics-meaning", async (req, res) => {
    try {
      const { songTitle, artist, userPrompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      const fallbackText = `✨ **Spiritual Insight for "${songTitle || 'Devotional Geet'}"**:

1. **Divine Essence**: Expresses pure devotion and total surrender to the Supreme.
2. **Cultural Significance**: Rooted in centuries-old Maharashtrian Varkari & Bhakti traditions.
3. **Core Message**: Focuses on inner tranquility, gratitude, and spiritual devotion.
4. **Ideal Listening Hours**: Perfect for the 9:00 AM Morning or 7:00 PM Evening Bhakti Geet broadcast.`;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({ success: true, source: "simulation", insight: fallbackText });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      const prompt = `You are an expert music scholar on Marathi and Hindi devotional songs (Bhakti Geet, Abhangs, Lavani, Classics).
Song Title: ${songTitle}
Artist: ${artist}
User Question: ${userPrompt}

Provide a concise, beautifully formatted summary in 3-4 bullet points describing the song's spiritual meaning, devotional context, or lyrics translation. Keep tone respectful, inspiring, and elegant.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const insight = response.text || fallbackText;
      return res.json({ success: true, source: "gemini", insight });
    } catch (err: any) {
      console.warn("AI Lyrics API Warning:", err?.message || err);
      return res.json({
        success: true,
        source: "fallback",
        insight: `✨ **Devotional Summary for ${req.body?.songTitle || 'Bhakti Song'}**:\n\n• **Spiritual Essence**: Celebrates divine love and inner peacefulness.\n• **Tradition**: Authentic Marathi & Hindi Bhakti Geet tradition.\n• **Daily Schedule**: Included in the 9 AM / 7 PM automatic Vaibhav Jadhav Music station.`
      });
    }
  });

  // Get Hairstyles Catalog
  app.get("/api/hairstyles", (_req, res) => {
    res.json({ success: true, count: HAIRSTYLES_DATA.length, data: HAIRSTYLES_DATA });
  });

  // Get Beard Styles Catalog
  app.get("/api/beard-styles", (_req, res) => {
    res.json({ success: true, count: BEARD_STYLES_DATA.length, data: BEARD_STYLES_DATA });
  });

  // AI Face Analysis Endpoint using Gemini API
  app.post("/api/analyze-face", async (req, res) => {
    try {
      const { imageBase64, userNotes } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      
      // Default fallback mock analysis generator if API key is not present or error occurs
      const mockResult = {
        faceShape: "Oval",
        jawline: "Defined & Angular",
        chinShape: "Rounded Square",
        foreheadWidth: "Medium Balanced",
        cheekboneWidth: "Prominent High",
        hairline: "Normal",
        hairDensity: "Thick",
        hairTexture: "Straight",
        beardDensity: "Dense Uniform",
        beardGrowthPattern: "Jaw-line & Chin heavy",
        skinTone: "Warm Medium",
        symmetry: 96,
        ageGroup: "24-32",
        groomingScore: 92,
        aiInsights: [
          "Oval face structure allows maximum versatility across both high-volume pompadours and skin fade crops.",
          "High cheekbone symmetry provides strong jawline definition when paired with 3mm - 5mm stubble.",
          "Thick straight hair density is ideal for pompadours, textured quiffs, and slicked back tapers."
        ],
        keyStrengths: ["Symmetrical Oval Proportion", "Strong Jawline Angle", "Dense Hair Follicle Count"],
        recommendedHairStyleIds: ["hs-1", "hs-2", "hs-4"],
        recommendedBeardStyleIds: ["bs-1", "bs-2", "bs-4"],
        timestamp: new Date().toISOString()
      };

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Return structured intelligent analysis
        return res.json({ success: true, source: "simulation", analysis: mockResult });
      }

      // Initialize Gemini AI client
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      if (imageBase64 && imageBase64.startsWith("data:image")) {
        const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const mimeType = matches[1];
          const base64Data = matches[2];

          const prompt = `Analyze this face image for hair styling and grooming recommendations. Return ONLY a valid JSON object matching this schema:
          {
            "faceShape": "Oval" | "Round" | "Square" | "Rectangle" | "Diamond" | "Heart" | "Triangle" | "Oblong",
            "jawline": "description",
            "chinShape": "description",
            "foreheadWidth": "description",
            "cheekboneWidth": "description",
            "hairline": "Normal" | "Widow's Peak" | "Receding" | "High",
            "hairDensity": "Thick" | "Medium" | "Fine" | "Thinning",
            "hairTexture": "Straight" | "Wavy" | "Curly" | "Coily",
            "beardDensity": "description",
            "beardGrowthPattern": "description",
            "skinTone": "description",
            "symmetry": number (85-99),
            "ageGroup": "description",
            "groomingScore": number (70-98),
            "aiInsights": ["string", "string", "string"],
            "keyStrengths": ["string", "string", "string"],
            "recommendedHairStyleIds": ["hs-1", "hs-2"],
            "recommendedBeardStyleIds": ["bs-1", "bs-2"]
          }`;

          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType, data: base64Data } }
                ]
              }
            ]
          });

          const textResponse = response.text || "";
          // Extract JSON block
          const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json({ success: true, source: "gemini-3.6-flash", analysis: parsed });
          }
        }
      }

      return res.json({ success: true, source: "simulation", analysis: mockResult });
    } catch (error: any) {
      console.error("Gemini API Error:", error?.message || error);
      // Graceful fallback to rich mock data
      return res.json({
        success: true,
        source: "fallback",
        analysis: {
          faceShape: "Oval",
          jawline: "Well Defined",
          chinShape: "Square",
          foreheadWidth: "Balanced",
          cheekboneWidth: "High",
          hairline: "Normal",
          hairDensity: "Thick",
          hairTexture: "Wavy",
          beardDensity: "Dense",
          beardGrowthPattern: "Full Jaw",
          skinTone: "Warm Tan",
          symmetry: 95,
          ageGroup: "25-30",
          groomingScore: 90,
          aiInsights: [
            "Your balanced face proportions work magnificently with tapered fades and textured tops.",
            "Wavy hair texture provides natural volume without heavy styling paste."
          ],
          keyStrengths: ["Facial Symmetry", "Natural Hair Density"],
          recommendedHairStyleIds: ["hs-1", "hs-4"],
          recommendedBeardStyleIds: ["bs-1", "bs-2"],
          timestamp: new Date().toISOString()
        }
      });
    }
  });

  // Spotify Link Parser & Metadata Endpoint
  app.post("/api/spotify/parse", (req, res) => {
    try {
      const { input } = req.body;
      if (!input) {
        return res.status(400).json({ success: false, error: "Input Spotify URL or track ID required" });
      }

      // Match track ID from various Spotify URL formats (e.g., https://open.spotify.com/track/3n3Pp32S33G2 or spotify:track:3n3Pp32S33G2)
      const match = input.match(/(?:track\/|track:)([a-zA-Z0-9]{22})/);
      const trackId = match ? match[1] : (/^[a-zA-Z0-9]{22}$/.test(input.trim()) ? input.trim() : null);

      if (!trackId) {
        return res.status(400).json({ success: false, error: "Invalid Spotify URL or Track ID format. Please paste a valid Spotify track link." });
      }

      const spotifyUrl = `https://open.spotify.com/track/${trackId}`;
      const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;

      return res.json({
        success: true,
        trackId,
        spotifyUrl,
        spotifyEmbedUrl
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || "Failed to parse Spotify link" });
    }
  });
  app.get("/api/payment-settings", (_req, res) => {
    res.json({ success: true, settings: currentPaymentSettings });
  });

  app.post("/api/payment-settings", (req, res) => {
    const newSettings = req.body;
    currentPaymentSettings = { ...currentPaymentSettings, ...newSettings };
    res.json({ success: true, settings: currentPaymentSettings });
  });

  // Store in-memory appointments
  const appointments: any[] = [];


  app.get("/api/bookings", (_req, res) => {
    res.json({ success: true, data: appointments });
  });

  app.post("/api/bookings", (req, res) => {
    const bookingData = req.body;
    const newBooking = {
      id: `VBH-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
      bookingQr: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VAIBHAV-SALOON-${Date.now()}`,
      ...bookingData
    };
    appointments.unshift(newBooking);
    res.json({ success: true, booking: newBooking });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vaibhav AI Saloon Server running on http://localhost:${PORT}`);
  });
}

startServer();
