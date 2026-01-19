"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { History, Loader2, FileText, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Proposal {
    id: string;
    jobDescription: string;
    generatedText: string;
    tone: string;
    createdAt: string;
}

interface ProposalHistoryProps {
    onSelectProposal: (proposal: string) => void;
}

export function ProposalHistory({ onSelectProposal }: ProposalHistoryProps) {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchProposals = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/proposals");
            if (!response.ok) throw new Error("Failed to fetch proposals");
            const data = await response.json();
            setProposals(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load history");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent loading the proposal when clicking delete
        if (!confirm("Are you sure you want to delete this proposal?")) return;

        try {
            const response = await fetch(`/api/proposals/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete");

            setProposals(proposals.filter(p => p.id !== id));
            toast.success("Proposal deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete proposal");
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchProposals();
        }
    }, [isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <History className="w-4 h-4" /> History
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Proposal History</SheetTitle>
                    <SheetDescription>
                        View and manage your previously generated proposals.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 h-full pb-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : proposals.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            No proposals found.
                        </div>
                    ) : (
                        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-4">
                            {proposals.map((proposal) => (
                                <div
                                    key={proposal.id}
                                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors group relative"
                                    onClick={() => {
                                        onSelectProposal(proposal.generatedText);
                                        setIsOpen(false);
                                        toast.success("Proposal loaded!");
                                    }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => handleDelete(e, proposal.id)}
                                        title="Delete proposal"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div className="flex justify-between items-start mb-2 pr-8">
                                        <span className="font-medium text-sm bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                                            {proposal.tone}
                                        </span>
                                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(proposal.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
                                        {proposal.jobDescription}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <FileText className="w-3 h-3" />
                                        <span>Click to load</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
