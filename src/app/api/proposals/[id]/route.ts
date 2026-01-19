import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const { id } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const proposal = await prisma.proposal.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!proposal) {
            return new NextResponse("Proposal not found", { status: 404 });
        }

        if (proposal.user.clerkId !== userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.proposal.delete({
            where: { id },
        });

        return new NextResponse("Proposal deleted", { status: 200 });
    } catch (error) {
        console.error("[PROPOSAL_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
