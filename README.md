# The Bench

The Bench is a highly creative, minimalist Project and Idea Tracker Progressive Web App (PWA) designed to help you organize your app ideas, target audiences, and tech stacks in a private workspace.

## Features

- Private Workspaces: Secure authentication via Clerk ensures your ideas belong only to you.
- Idea Management: Create, edit, and categorize your project ideas seamlessly.
- Project Status Tracking: Track your projects through states like Idea, In Progress, Paused, and Shipped.
- Tech Stack & Audience: Clearly define the target audience and technology stack for each idea.
- Neo-Brutalist Design: A unique, vibrant, and interactive user interface built with Tailwind CSS.
- Progressive Web App (PWA): Installable on desktop and mobile devices for offline capabilities and native feel.

## Tech Stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS V4
- Database ORM: Prisma V7
- Database: PostgreSQL (Vercel Postgres)
- Authentication: Clerk
- PWA Integration: Serwist

## Getting Started

### Prerequisites

You need Node.js and npm installed on your machine. You will also need a PostgreSQL database and a Clerk account for authentication.

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
# Prisma Database URLs
DATABASE_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### Installation

1. Clone the repository and install the dependencies:

```bash
npm install
```

2. Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the application running locally.

## Deployment

This application is optimized for deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically handle the build process. Ensure all environment variables are correctly configured in your Vercel project settings.
