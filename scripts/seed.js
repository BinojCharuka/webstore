const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const uri = "mongodb+srv://binojcharuka5_db_user:5X1RLZD6jvjrdDy7@cluster0.ocyyjuz.mongodb.net/charu-studio?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("charu-studio");

    // 1. Seed Admin User
    const users = database.collection("users");
    const existing = await users.findOne({ email: "admin@charudesign.studio" });
    if (!existing) {
      const passwordHash = await bcrypt.hash("admin123", 10);
      const result = await users.insertOne({
        email: "admin@charudesign.studio",
        passwordHash,
        name: "Charu Admin",
      });
      console.log("Admin user seeded successfully:", result.insertedId);
    } else {
      console.log("Admin user already exists!");
    }

    // 2. Seed Packages
    const packagesCollection = database.collection("packages");
    const existingPackages = await packagesCollection.countDocuments();
    if (existingPackages === 0) {
      const initialPackages = [
        {
          name: "Starter Portfolio", price: "$799", period: "one-time",
          desc: "Perfect for creatives launching their first professional presence online.",
          popular: false,
          features: ["Up to 5 custom pages", "Responsive design", "Contact form", "Basic SEO setup", "1 revision round", "2-week delivery"],
        },
        {
          name: "Pro Portfolio", price: "$1,499", period: "one-time",
          desc: "Full-featured with animations, CMS integration, and priority delivery.",
          popular: true,
          features: ["Up to 12 custom pages", "Advanced animations", "CMS integration", "Analytics dashboard", "Performance optimization", "3 revision rounds", "Priority support"],
        },
        {
          name: "Advanced LMS Setup", price: "$3,200", period: "one-time",
          desc: "End-to-end learning platform engineered for scale and engagement.",
          popular: false,
          features: ["Full LMS architecture", "Student & admin dashboards", "Course builder", "Payment gateway", "Certificate system", "Video hosting", "Unlimited revisions"],
        },
        {
          name: "Custom Front-End", price: "$2,100", period: "one-time",
          desc: "Bespoke front-end system for SaaS, agencies, or corporate brands.",
          popular: false,
          features: ["Unlimited pages", "Design system", "Headless CMS setup", "Full SEO architecture", "< 90 Lighthouse", "3 revision rounds", "30-day post-launch support"],
        },
      ];
      await packagesCollection.insertMany(initialPackages);
      console.log("Packages seeded successfully!");
    } else {
      console.log("Packages already seeded!");
    }

    // 3. Seed Projects
    const projectsCollection = database.collection("projects");
    const existingProjects = await projectsCollection.countDocuments();
    if (existingProjects === 0) {
      const initialProjects = [
        {
          title: "Lumina LMS", subtitle: "Learning Redefined",
          category: "lms", tags: ["LMS", "Next.js", "MongoDB"],
          img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&h=560&fit=crop&auto=format",
          desc: "A comprehensive learning management system with adaptive student dashboards and real-time analytics.",
          year: "2024", color: "#aaff00",
          techStack: ["Next.js", "Tailwind CSS", "MongoDB", "TypeScript"],
          caseStudyDetails: {
            timeline: "8 weeks",
            users: "4,200+",
            completionRate: "89%",
            lighthouse: "98/100",
            problem: "The client was running courses across three disconnected platforms — Notion for content, Zoom for live sessions, Stripe manually for payments. Student drop-off sat at 42%. They needed a unified, branded system that felt premium and kept learners engaged through to certification.",
            approach: "A full-stack LMS built with Next.js 14 App Router — server components for performance, MongoDB for flexible course schema, Clerk for bulletproof auth. Gamification mechanics, adaptive pathways, and a mobile-first dashboard reduced drop-off to 11% within 60 days.",
            features: [
              { title: "Student Dashboard", desc: "Personalized learning paths, progress tracking, streaks, and achievement badges.", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&h=420&fit=crop&auto=format" },
              { title: "Admin Panel", desc: "Full course management, user analytics, revenue reporting, and content scheduling.", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=420&fit=crop&auto=format" },
              { title: "Live Sessions", desc: "Integrated video sessions with recording, Q&A, and real-time collaborative boards.", img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=700&h=420&fit=crop&auto=format" }
            ]
          }
        },
        {
          title: "Nexus Portfolio", subtitle: "Creative Director",
          category: "portfolio", tags: ["Portfolio", "React", "GSAP"],
          img: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=900&h=560&fit=crop&auto=format",
          desc: "An award-winning portfolio for a Berlin-based creative director with 3D scroll experiences.",
          year: "2024", color: "#7c3aed",
          techStack: ["React", "GSAP", "Tailwind CSS", "Framer Motion"],
          caseStudyDetails: {
            timeline: "4 weeks",
            users: "10,000+ monthly visits",
            completionRate: "N/A",
            lighthouse: "99/100",
            problem: "The client needed a portfolio that visually represents their high-end artistic direction, with transitions and interactions that feel like a luxury digital gallery without degrading performance.",
            approach: "We used GSAP ScrollTrigger for 3D translation effects, optimization of heavy assets to WebP/AVIF formats, and clean component organization in React to ensure smooth rendering at 60fps.",
            features: [
              { title: "3D Grid Gallery", desc: "Smooth scroll-based camera shifts showing media cards in a pseudo-3D space.", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&h=420&fit=crop&auto=format" }
            ]
          }
        },
        {
          title: "Orion SaaS", subtitle: "Dashboard Platform",
          category: "frontend", tags: ["Front-End", "TypeScript", "Tailwind"],
          img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop&auto=format",
          desc: "Full-featured SaaS dashboard with real-time data, multi-tenant architecture and analytics.",
          year: "2023", color: "#0ea5e9",
          techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"],
          caseStudyDetails: {
            timeline: "12 weeks",
            users: "1,500 enterprise seats",
            completionRate: "95% SLA met",
            lighthouse: "95/100",
            problem: "Enterprise clients were complaining about sluggish loading times for real-time charts displaying millions of transaction rows.",
            approach: "Implemented server-side pagination, web workers for client-side calculations, and lightweight Canvas-based charting modules.",
            features: [
              { title: "Real-time Analytics", desc: "A dashboard with instant reload, customized filtering options, and CSV/PDF export.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=420&fit=crop&auto=format" }
            ]
          }
        }
      ];
      await projectsCollection.insertMany(initialProjects);
      console.log("Projects seeded successfully!");
    } else {
      console.log("Projects already seeded!");
    }

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await client.close();
  }
}

run();
