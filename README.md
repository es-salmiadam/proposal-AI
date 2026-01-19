# 🚀 AI-Powered Freelancer Proposal Generator

**Win more clients with AI-crafted proposals that actually get read.**

ProposalAI is a modern, full-stack SaaS application designed to help freelancers save time and increase their hire rate. it intelligently analyzes job descriptions and generates personalized, persuasive cover letters using your specific skills, portfolio, and resume.

![Proposal Generator Dashboard](https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2070)

## ✨ Key Features

-   **🧠 Smart AI Generation**: Powered by **Llama 3.3 70B** for high-quality, human-like writing.
-   **📄 Resume Parsing**: Upload your PDF or text resume, and the AI extracts your most relevant experience to prove you're the right fit.
-   **🎨 Professional Formatting**: Generates structured proposals with a proper greeting, problem understanding, solution, and call to action.
-   **💾 Proposal History**: Automatically saves your generated proposals. View, manage, and restore them anytime.
-   **📥 Export Options**: Download your proposals as **PDF** or **DOC** files with one click.
-   **📧 Email Integration**: Send proposals directly to yourself or clients via Resend.
-   **🔒 Secure Authentication**: Robust user management with **Clerk**.
-   **⚡ Modern UI**: Built with **Next.js 15**, **Tailwind CSS**, and **shadcn/ui** for a beautiful, responsive experience.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Database**: [Neon Postgres](https://neon.tech/) & [Prisma ORM](https://www.prisma.io/)
-   **Auth**: [Clerk](https://clerk.com/)
-   **AI**: [OpenRouter API](https://openrouter.ai/) (Llama 3.3, DeepSeek R1, etc.)
-   **Email**: [Resend](https://resend.com/)
-   **Deployment**: [Vercel](https://vercel.com/)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/proposal-ai.git
    cd proposal-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env.local` file and add the following keys:
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
    CLERK_SECRET_KEY=...
    DATABASE_URL=...
    OPENROUTER_API_KEY=...
    RESEND_API_KEY=...
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to see the app in action.

## 👥 Authors

-   **Es-salmi Adam** - [LinkedIn](https://www.linkedin.com/in/es-salmiadam)
-   **Ayoub Mourid**
-   **Brahim Benrais**

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
