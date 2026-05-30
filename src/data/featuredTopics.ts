/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DifficultyLevel } from '../types';

export interface TopicItem {
  id: string;
  title: string;
  category: 'Business' | 'Tech' | 'Creative' | 'Freelancing' | 'SaaS';
  difficulty: DifficultyLevel;
  estimatedHours: number;
  modulesCount: number;
  popularityScore: number; // 1-100 scale
  description: string;
  coverGradient: string;
  image: string;
}

export const FEATURED_CATEGORIES = [
  "Amazon KDP",
  "YouTube Automation",
  "Graphic Design",
  "Freelancing",
  "Web Development",
  "Digital Marketing",
  "Copywriting",
  "AI Tools",
  "SaaS Building",
  "Data Analytics",
  "Cybersecurity",
  "Video Editing",
  "E-commerce",
  "Dropshipping",
  "UI/UX Design"
];

export const DISCOVER_DIVISIONS = {
  popular: ["Amazon KDP", "YouTube Automation", "Graphic Design", "Freelancing", "Affiliate Marketing", "SEO", "Blogging", "Content Creation"],
  trending: ["Social Media Marketing", "AI Automation", "Web Design", "Coding", "Cybersecurity", "Data Science", "Product Management", "UX Design"],
  careers: ["Web Development", "Data Analytics", "Cybersecurity", "Product Management"],
  business: ["E-commerce", "Dropshipping", "Digital Marketing", "Amazon KDP", "YouTube Automation"],
  creative: ["UI/UX Design", "Graphic Design", "Video Editing", "Copywriting", "Blogging"],
  technology: ["AI Tools", "SaaS Building", "Coding", "AI Automation"]
};

export const INSTANT_SUGGESTIONS = [
  "Amazon KDP",
  "YouTube Automation",
  "Affiliate Marketing",
  "Web Development",
  "Prompt Engineering",
  "UI/UX Figma Masterclass",
  "SEO Optimization for Blogging",
  "Freelance Copywriting Secrets",
  "Cybersecurity Zero to Hero",
  "Dropshipping with Shopify",
  "SaaS Building with Next.js",
  "Graphic Design Principles"
];

export const STATIC_TOPICS: TopicItem[] = [
  {
    id: "t1",
    title: "Amazon KDP",
    category: "Business",
    difficulty: "Beginner",
    estimatedHours: 45,
    modulesCount: 5,
    popularityScore: 98,
    description: "Launch a passive income stream publishing journals, planners, and books on Amazon Kindle Direct Publishing.",
    coverGradient: "from-amber-500 via-orange-500 to-yellow-600",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t2",
    title: "YouTube Automation",
    category: "Business",
    difficulty: "Beginner",
    estimatedHours: 50,
    modulesCount: 6,
    popularityScore: 96,
    description: "Build, automate, and monetize faceless channels. Master visual scripting, editing delegation, and SEO tricks.",
    coverGradient: "from-red-500 via-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t3",
    title: "Graphic Design",
    category: "Creative",
    difficulty: "Beginner",
    estimatedHours: 35,
    modulesCount: 4,
    popularityScore: 91,
    description: "Learn foundational grids, color theory, font selection, and custom illustration frameworks in Illustrator.",
    coverGradient: "from-purple-500 via-indigo-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t4",
    title: "Freelancing",
    category: "Freelancing",
    difficulty: "Intermediate",
    estimatedHours: 32,
    modulesCount: 4,
    popularityScore: 94,
    description: "Cold outreach, client retention, portfolio building, and scaling your hourly rate beyond $100/hr.",
    coverGradient: "from-emerald-500 via-teal-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t5",
    title: "Web Development",
    category: "Tech",
    difficulty: "Beginner",
    estimatedHours: 85,
    modulesCount: 8,
    popularityScore: 99,
    description: "TypeScript, React, Node.js, databases, and responsive server side rendering systems from absolute scratch.",
    coverGradient: "from-blue-600 via-cyan-500 to-indigo-700",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t6",
    title: "Digital Marketing",
    category: "Business",
    difficulty: "Intermediate",
    estimatedHours: 40,
    modulesCount: 5,
    popularityScore: 89,
    description: "SaaS conversion metrics, Google Ads funnel setups, retargeting logic, and viral content syndication models.",
    coverGradient: "from-violet-500 via-purple-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t7",
    title: "Copywriting",
    category: "Creative",
    difficulty: "Beginner",
    estimatedHours: 24,
    modulesCount: 3,
    popularityScore: 87,
    description: "Write direct-response copies, landing page headlines, and emails that consistently trigger high conversion events.",
    coverGradient: "from-amber-600 via-yellow-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t8",
    title: "AI Tools",
    category: "SaaS",
    difficulty: "Beginner",
    estimatedHours: 28,
    modulesCount: 4,
    popularityScore: 95,
    description: "Master prompt engineering, pipeline chains, custom AI integrations, and model fine-tuning workflows.",
    coverGradient: "from-fuchsia-600 via-indigo-500 to-violet-700",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t9",
    title: "SaaS Building",
    category: "SaaS",
    difficulty: "Advanced",
    estimatedHours: 65,
    modulesCount: 7,
    popularityScore: 93,
    description: "Ship working features, handle stripe payment hooks, optimize authentication systems, and cloud-scale databases.",
    coverGradient: "from-zinc-800 via-zinc-900 to-black",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "t10",
    title: "Cybersecurity",
    category: "Tech",
    difficulty: "Advanced",
    estimatedHours: 72,
    modulesCount: 6,
    popularityScore: 90,
    description: "Penetration audits, network inspection, ethical vulnerability scanning, and secure firewall configuration protocols.",
    coverGradient: "from-slate-800 via-slate-900 to-zinc-950",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
  }
];
