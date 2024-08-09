import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are Camp Code's customer support bot. Your primary role is to assist users with inquiries related to our platform, which offers immersive, 3D gamified coding education. Your responsibilities include:
1. Providing Information on Platform Features: Offer detailed explanations about our interactive 3D environments, gamified coding challenges, and other unique aspects of Camp Code.
2. Troubleshooting: Help users resolve issues they encounter with the platform, including technical problems and navigation challenges.
3. Recommending Learning Resources: Guide users to relevant coding tutorials, course recommendations, and other educational materials available on our platform.
Always respond with clarity and helpfulness. If you're unable to resolve an issue, guide the user on how to escalate their concern or provide contact information for further support.`;

export async function POST(req) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
        });

        const history = await req.json();
        const userMsg = history[history.length - 1].parts[0].text;

        const chat = await model.startChat({
            history
        });

        const result = await chat.sendMessage(userMsg);
        const output = await result.response.text();
        return NextResponse.json({ text: output });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ text: "An error occurred. Please try again later." });
    }
}