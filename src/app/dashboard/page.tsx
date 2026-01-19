"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { ProposalForm } from "@/components/proposal-form";
import { ProposalEditor } from "@/components/proposal-editor";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProposalHistory } from "@/components/proposal-history";

export default function Dashboard() {
    const [proposal, setProposal] = useState<string>("");

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header - Make it consistent with landing page but with UserButton */}
            <header className="px-6 py-4 flex items-center justify-between border-b bg-background sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">ProposalAI</span>
                </Link>
                <div className="flex items-center gap-4">
                    <ProposalHistory onSelectProposal={setProposal} />
                    <Button variant="ghost" size="sm" onClick={() => setProposal("")}>
                        <PlusCircle className="mr-2 h-4 w-4" /> New Proposal
                    </Button>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Job Details</CardTitle>
                                <CardDescription>Paste the job description to generate a tailored proposal.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ProposalForm onProposalGenerated={setProposal} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-6">
                        {proposal ? (
                            <Card className="border-none shadow-md h-full">
                                <CardHeader>
                                    <CardTitle>Your Proposal</CardTitle>
                                    <CardDescription>Review and edit before sending.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ProposalEditor proposal={proposal} />
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl bg-muted/20">
                                <FileText className="w-12 h-12 mb-4 opacity-20" />
                                <p>Your generated proposal will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <footer className="py-6 border-t text-center text-sm text-muted-foreground mt-auto bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/20">
                <p>
                    Created by <a href="https://www.linkedin.com/in/es-salmiadam" target="_blank" rel="noreferrer" className="font-medium text-foreground hover:underline underline-offset-4">Es-salmi Adam</a>, <span className="font-medium text-foreground">Ayoub Mourid</span>, and <span className="font-medium text-foreground">Brahim Benrais</span>
                </p>
            </footer>
        </div >
    );
}
