import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">ProposalAI</span>
        </div>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started <ArrowRight className="ml-2 w-4 h-4" /></Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 md:py-32 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Now supporting all major freelance platforms
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto text-balance">
            Win More Clients with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI-Crafted Proposals</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Stop wasting hours writing cover letters. Generate personalized, persuasive proposals in seconds that get you hired.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 text-base">
                Create Free Proposal
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                See How It Works
              </Button>
            </Link>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-muted/50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "1. Paste Job Description",
                  description: "Copy the job details from Upwork, Fiverr, or any other platform.",
                },
                {
                  title: "2. Add Your Details",
                  description: "Input your skills and portfolio links once. We remember them.",
                },
                {
                  title: "3. Get Winning Proposal",
                  description: "Our AI generates a tailored, persuasive proposal ready to send.",
                },
              ].map((step, i) => (
                <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 container mx-auto px-6">
          <div className="bg-blue-600 text-white rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to land your next gig?</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Join thousands of freelancers who have increased their hire rate with ProposalAI.
              </p>
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-blue-700 font-bold">
                  Start Writing for Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 container mx-auto px-6">
          <p>© {new Date().getFullYear()} ProposalAI. All rights reserved.</p>
          <p className="text-sm">
            Created by <a href="https://www.linkedin.com/in/es-salmiadam" target="_blank" rel="noreferrer" className="font-medium text-foreground hover:underline underline-offset-4">Es-salmi Adam</a>, <span className="font-medium text-foreground">Ayoub Mourid</span>, and <span className="font-medium text-foreground">Brahim Benrais</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
