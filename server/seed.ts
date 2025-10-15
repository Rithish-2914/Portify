// Seed script to populate initial template data
import { db } from "./db";
import { templates } from "@shared/schema";

const sampleTemplates = [
  // Minimal Templates
  {
    name: "Focus",
    category: "minimal",
    description: "Clean, resume-style one-page portfolio. Perfect for developers and students.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Clarity",
    category: "minimal",
    description: "Simple and elegant portfolio with focus on content.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&q=80",
  },
  {
    name: "Essence",
    category: "minimal",
    description: "Minimalist design that puts your work front and center.",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },

  // 3D Templates
  {
    name: "Orbit",
    category: "3d",
    description: "Floating cards with space background. Interactive 3D elements using React Three Fiber.",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Prism",
    category: "3d",
    description: "Geometric 3D shapes that respond to mouse movement.",
    thumbnailUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80",
  },
  {
    name: "Dimension",
    category: "3d",
    description: "Layered 3D cards with depth and parallax effects.",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80",
  },

  // Animated Templates
  {
    name: "Pulse",
    category: "animated",
    description: "Smooth text and icon animations. Perfect for entrepreneurs.",
    thumbnailUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Flow",
    category: "animated",
    description: "Fluid transitions and micro-interactions throughout.",
    thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
  },
  {
    name: "Motion",
    category: "animated",
    description: "Dynamic animations that bring your portfolio to life.",
    thumbnailUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
  },

  // Visual Templates
  {
    name: "Canvas",
    category: "visual",
    description: "Image-heavy grid layout with parallax. Perfect for designers.",
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Gallery",
    category: "visual",
    description: "Masonry-style portfolio showcasing visual work.",
    thumbnailUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
  },
  {
    name: "Showcase",
    category: "visual",
    description: "Full-screen project displays with smooth scrolling.",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  },

  // Futuristic Templates
  {
    name: "NeonGrid",
    category: "futuristic",
    description: "Cyberpunk-inspired UI with neon glow effects.",
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    isFeatured: true,
  },
  {
    name: "Cyber",
    category: "futuristic",
    description: "Dark theme with glowing accents and tech aesthetics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  },
  {
    name: "Matrix",
    category: "futuristic",
    description: "Digital rain effects with matrix-style elements.",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
  },

  // Gamer Templates
  {
    name: "Arena",
    category: "gamer",
    description: "Dark neon theme with avatar showcasing. Perfect for streamers.",
    thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  },
  {
    name: "Victory",
    category: "gamer",
    description: "Gaming-focused portfolio with achievement displays.",
    thumbnailUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80",
  },
  {
    name: "Level Up",
    category: "gamer",
    description: "Gamified portfolio with progress bars and stats.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&q=80",
  },

  // Startup Templates
  {
    name: "Pitch",
    category: "startup",
    description: "Modern pitch-deck inspired layout. Great for founders.",
    thumbnailUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
  },
  {
    name: "Launch",
    category: "startup",
    description: "Product-focused portfolio with feature highlights.",
    thumbnailUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  },

  // Designer Templates
  {
    name: "Artisan",
    category: "designer",
    description: "Creative layout showcasing design process and work.",
    thumbnailUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
  },
  {
    name: "Palette",
    category: "designer",
    description: "Color-focused design with mood board aesthetics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80",
  },
  {
    name: "Blueprint",
    category: "designer",
    description: "Technical design showcase with wireframe aesthetics.",
    thumbnailUrl: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&q=80",
  },
  {
    name: "Spark",
    category: "startup",
    description: "Energetic startup portfolio with bold typography.",
    thumbnailUrl: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&q=80",
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Insert sample templates
    console.log(`📦 Inserting ${sampleTemplates.length} templates...`);
    
    for (const template of sampleTemplates) {
      await db.insert(templates).values(template);
    }

    console.log("✅ Seed completed successfully!");
    console.log(`   - ${sampleTemplates.length} templates added`);
    console.log(`   - ${sampleTemplates.filter(t => t.isFeatured).length} featured templates`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
