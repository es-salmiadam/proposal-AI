"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ProposalFormProps {
    onProposalGenerated: (text: string) => void;
}

export function ProposalForm({ onProposalGenerated }: ProposalFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        jobDescription: "",
        skills: "",
        portfolio: "",
        tone: "professional",
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.jobDescription) {
            toast.error("Please enter a job description");
            return;
        }

        setIsLoading(true);
        try {
            const data = new FormData();
            data.append("jobDescription", formData.jobDescription);
            data.append("skills", formData.skills);
            data.append("portfolio", formData.portfolio);
            data.append("tone", formData.tone);
            data.append("model", "meta-llama/llama-3.3-70b-instruct:free"); // Hardcoded Llama 3.3
            if (resumeFile) {
                data.append("resume", resumeFile);
            }

            const response = await fetch("/api/generate", {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                // Try to parse JSON error, fallback to text, then status text
                const text = await response.text();
                let errorMessage = response.statusText || "Failed to generate proposal";

                try {
                    const json = JSON.parse(text);
                    if (json.error) errorMessage = json.error;
                } catch {
                    // If parsing fails, use the raw text if it's short, otherwise fallback
                    if (text.length < 100) errorMessage = text;
                    if (response.status === 504) errorMessage = "Timeout: AI generation took too long.";
                }

                throw new Error(errorMessage);
            }

            const result = await response.json();
            onProposalGenerated(result.proposal);
            toast.success("Proposal generated successfully!");
        } catch (error) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="job">Job Description</Label>
                <Textarea
                    id="job"
                    placeholder="Paste the job posting here..."
                    className="min-h-[150px]"
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF or Text) <span className="text-xs text-muted-foreground ml-2">(Optional)</span></Label>
                <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="skills">My Skills (Optional)</Label>
                    <Input
                        id="skills"
                        placeholder="React, Node.js, Design..."
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                    <Input
                        id="portfolio"
                        placeholder="https://mysite.com"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                    value={formData.tone}
                    onValueChange={(value) => setFormData({ ...formData, tone: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="persuasive">Bold & Persuasive</SelectItem>
                        <SelectItem value="urgent">Short & Urgent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>

                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" /> Generate Proposal
                    </>
                )}
            </Button>
        </form>
    );
}
