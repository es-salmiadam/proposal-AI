"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Mail, Check, Loader2, Download, FileText as FileTextIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProposalEditorProps {
    proposal: string;
}

export function ProposalEditor({ proposal }: ProposalEditorProps) {
    const [content, setContent] = useState(proposal);
    const [copied, setCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setContent(proposal);
    }, [proposal]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("Proposal copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendEmail = async () => {
        setIsSending(true);
        try {
            const response = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ proposal: content }),
            });

            if (!response.ok) throw new Error("Failed to send email");

            toast.success("Email sent successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to send email");
        } finally {
            setIsSending(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Split text into lines to fit page width
        const splitText = doc.splitTextToSize(content, 180);

        // Add text to PDF
        doc.setFontSize(11);
        doc.text(splitText, 15, 20);

        doc.save("proposal.pdf");
        toast.success("PDF downloaded!");
    };

    const handleDownloadWord = () => {
        const blob = new Blob([content], { type: "application/msword" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "proposal.doc";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Word document downloaded!");
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Generated Proposal</h3>
                <div className="flex flex-wrap gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDownloadPDF}>
                                <FileTextIcon className="w-4 h-4 mr-2" /> PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadWord}>
                                <FileTextIcon className="w-4 h-4 mr-2" /> DOC
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={isSending}>
                        {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                        Email Me
                    </Button>
                </div>
            </div>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm leading-relaxed p-6"
            />
        </div>
    );
}
