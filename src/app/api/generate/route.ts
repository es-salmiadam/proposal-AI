import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/db";
// @ts-ignore
const pdfParse = require("pdf-parse");

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const jobDescription = formData.get("jobDescription") as string;
        const tone = formData.get("tone") as string;
        const skills = formData.get("skills") as string;
        const portfolio = formData.get("portfolio") as string;
        const resumeFile = formData.get("resume") as File | null;

        if (!jobDescription) {
            return new NextResponse("Job description is required", { status: 400 });
        }

        let resumeText = "";

        if (resumeFile) {
            try {
                const arrayBuffer = await resumeFile.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                if (resumeFile.type === "application/pdf") {
                    const data = await pdfParse(buffer);
                    resumeText = data.text;
                } else {
                    // Assuming text/plain or markdown
                    resumeText = buffer.toString("utf-8");
                }
            } catch (error) {
                console.error("Error parsing resume:", error);
                // Continue without resume if parsing fails, but log it
            }
        }

        const prompt = `
        You are a professional freelance copywriter. Write a winning proposal for the following job description.

        JOB DESCRIPTION:
        ${jobDescription}

        MY SKILLS:
        ${skills || "See resume"}
        
        MY PORTFOLIO:
        ${portfolio || "See resume"}

        MY RESUME CONTENT:
        ${resumeText ? resumeText.slice(0, 10000) : "Not provided"}

        MY NAME:
        ${user.firstName} ${user.lastName}

        TONE:
        ${tone || "Professional"}

        INSTRUCTIONS:
        1. **Analyze the Job Description**: Identify the client's core pain points and requirements.
        2. **Extract & Prove**: Do NOT just say "I have experience." You MUST explicitly mention 2-3 specific skills, specific past project examples, or certifications found in the "MY RESUME CONTENT" or "MY PORTFOLIO" sections above that directly relate to this job. Prove you can do the work.
        3. **Weave the Narrative**: Naturally integrate these extracted details into the proposal. For example, "My experience at [Company] building [Project] makes me a perfect fit because..."
        4. **Call to Action**: End with a confident next step.
        5. **Sign Off**: EXTREMELY IMPORTANT: You MUST sign off the proposal with "Best regards," followed by my actual name provided above in the "MY NAME" section. Do NOT use placeholders.
        6. **Formatting**: Use a professional structure (Greeting, Problem Understanding, My Solution/Proof, Closing).
        7. **Portfolio**: If a portfolio link is provided, explicitly invite them to click it to see relevant examples.
        `;

        console.log("Sending prompt to AI...");

        const selectedModel = formData.get("model") as string;

        const allModels = [
            "meta-llama/llama-3.3-70b-instruct:free",
            "deepseek/deepseek-r1-distill-llama-70b:free",
            "google/gemini-2.0-flash-exp:free",
            "qwen/qwen-2.5-72b-instruct:free",
            "qwen/qwen3-coder:free"
        ];

        // Prioritize selected model, then filter out duplicates to create fallback list
        const models = [
            selectedModel,
            ...allModels.filter(m => m !== selectedModel)
        ].filter(Boolean);

        let generatedText = "";
        let modelError = null;

        for (const model of models) {
            try {
                console.log(`Attempting generation with model: ${model}`);
                const completion = await openai.chat.completions.create({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                });

                if (completion.choices[0]?.message?.content) {
                    generatedText = completion.choices[0].message.content;
                    console.log(`Success with model: ${model}`);
                    break;
                }
            } catch (error) {
                console.warn(`Model ${model} failed:`, error);
                modelError = error;
                // Continue to next model
            }
        }

        if (!generatedText) {
            throw modelError || new Error("All AI models failed to generate a response. Please try again later.");
        }

        // Sync user to DB (Basic implementation)
        const email = user.emailAddresses[0]?.emailAddress;

        // Update user profile
        await prisma.user.upsert({
            where: { clerkId: userId },
            update: {
                email: email,
                skills: skills,
                portfolio: portfolio,
            },
            create: {
                clerkId: userId,
                email: email || "",
                name: `${user.firstName} ${user.lastName}`,
                skills: skills,
                portfolio: portfolio,
            },
        });

        // Save the proposal
        const userRecord = await prisma.user.findUnique({ where: { clerkId: userId } });
        if (userRecord) {
            await prisma.proposal.create({
                data: {
                    userId: userRecord.id,
                    jobDescription: jobDescription,
                    generatedText: generatedText,
                    tone: tone,
                }
            });
        }

        return NextResponse.json({ proposal: generatedText });

    } catch (error) {
        console.error("[PROPOSAL_GENERATE_ERROR]", error);
        // Return the actual error message for debugging purposes (in dev)
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
