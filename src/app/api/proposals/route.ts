import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return NextResponse.json([]);
        }

        const proposals = await prisma.proposal.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20, // Limit to last 20 for now
        });

        return NextResponse.json(proposals);
    } catch (error) {
        console.error("[PROPOSALS_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
