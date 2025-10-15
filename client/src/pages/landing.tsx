import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Palette, 
  Rocket, 
  Code, 
  Zap, 
  Globe,
  Check,
  ArrowRight,
  Star,
  Users,
  Layout,
  Wand2,
  Layers,
  Box,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const categories = [
    { name: "Minimal", icon: Layout, count: "200+" },
    { name: "3D", icon: Box, count: "150+" },
    { name: "Animated", icon: Zap, count: "180+" },
    { name: "Visual", icon: Palette, count: "220+" },
    { name: "Futuristic", icon: Rocket, count: "140+" },
    { name: "Gamer", icon: Code, count: "110+" },
  ];

  const features = [
    {
      icon: Layout,
      title: "1000+ Templates",
      description: "Choose from a massive collection of professionally designed portfolio templates",
    },
    {
      icon: Wand2,
      title: "AI Customization",
      description: "Smart suggestions for colors, layouts, and content based on your profile",
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Free subdomain or connect your own domain for a professional presence",
    },
    {
      icon: Users,
      title: "Analytics",
      description: "Track visitors, engagement, and portfolio performance in real-time",
    },
    {
      icon: Code,
      title: "No Code Required",
      description: "Build stunning portfolios without writing a single line of code",
    },
    {
      icon: Zap,
      title: "Template Switching",
      description: "Change your portfolio design anytime with one click - no data loss",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "2-3 basic templates",
        "Free subdomain",
        "Basic analytics",
        "Project showcase",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$10",
      period: "/month",
      features: [
        "All 1000+ templates",
        "3D & animated styles",
        "Custom domain",
        "Advanced analytics",
        "AI resume builder",
        "Priority support",
      ],
      cta: "Start Pro Trial",
      highlighted: true,
    },
    {
      name: "Creator",
      price: "$25",
      period: "/month",
      features: [
        "Everything in Pro",
        "Template marketplace access",
        "Sell your templates",
        "Revenue sharing",
        "Creator tools",
      ],
      cta: "Join Creators",
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-2xl"
      >
        <div className="container flex h-20 items-center justify-between px-4 md:px-6">
          <Link href="/">
            <motion.span 
              className="text-3xl font-bold tracking-tighter text-white"
              whileHover={{ scale: 1.05 }}
            >
              Portify
            </motion.span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10" data-testid="button-login">
              <a href="/auth">Log In</a>
            </Button>
            <Button asChild className="bg-white text-black hover:bg-white/90" data-testid="button-signup">
              <a href="/auth">Get Started</a>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with 3D Grid */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated 3D Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="container relative px-4 md:px-6 z-10">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="outline" className="mb-8 border-white/20 bg-white/5 text-white backdrop-blur-sm" data-testid="badge-hero">
                <Sparkles className="mr-2 h-3 w-3" />
                1000+ Professional Templates
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 text-6xl font-black tracking-tighter md:text-7xl lg:text-8xl"
            >
              Build Your Dream{" "}
              <span className="inline-block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Portfolio
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto mb-12 max-w-2xl text-xl text-white/70 md:text-2xl"
            >
              Choose from 1000+ stunning templates. No code required. 
              Perfect for developers, designers, gamers, and creators.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button asChild size="lg" className="bg-white text-black text-lg px-8 py-6 hover:bg-white/90 group" data-testid="button-hero-cta">
                <a href="/auth">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 bg-white/5 text-white text-lg px-8 py-6 hover:bg-white/10 backdrop-blur-sm" data-testid="button-browse-templates">
                <a href="/templates">
                  Browse Templates
                </a>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 flex items-center justify-center gap-12 text-sm text-white/50"
            >
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-white text-white" />
                <span>10,000+ portfolios created</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-white" />
                <span>5,000+ active users</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </section>

      {/* 3D Floating Category Cards */}
      <section className="relative py-32 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <h2 className="mb-6 text-5xl font-black tracking-tighter md:text-6xl">Explore by Category</h2>
            <p className="text-xl text-white/60">
              Find the perfect template for your style and profession
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                data-testid={`card-category-${category.name.toLowerCase()}`}
              >
                <div className="perspective-1000">
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all duration-300 cursor-pointer transform-gpu preserve-3d">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center relative z-10">
                      <motion.div 
                        className="mb-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm group-hover:bg-white/20 transition-colors preserve-3d"
                        whileHover={{ rotateY: 180 }}
                        transition={{ duration: 0.6 }}
                      >
                        <category.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <h3 className="mb-2 font-bold text-lg">{category.name}</h3>
                      <p className="text-sm text-white/50">{category.count}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features with Floating Cards */}
      <section className="relative py-32 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <h2 className="mb-6 text-5xl font-black tracking-tighter md:text-6xl">Everything You Need</h2>
            <p className="text-xl text-white/60">
              Powerful features to make your portfolio stand out
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div className="perspective-1000" data-testid={`card-feature-${index}`}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="preserve-3d h-full"
                >
                  <Card className="relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:bg-white/10 transition-all duration-300 transform-gpu">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-8 relative z-10">
                      <div className="mb-6 inline-flex rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                      <p className="text-white/60 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing with 3D Cards */}
      <section className="relative py-32 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 text-center"
          >
            <h2 className="mb-6 text-5xl font-black tracking-tighter md:text-6xl">Choose Your Plan</h2>
            <p className="text-xl text-white/60">
              Start free, upgrade when you need more
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ 
                  y: -20,
                  transition: { duration: 0.3 }
                }}
                data-testid={`card-pricing-${plan.name.toLowerCase()}`}
              >
                <Card 
                  className={`relative h-full overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 transform-gpu ${
                    plan.highlighted ? 'border-white/40 bg-white/10 shadow-2xl shadow-white/20' : 'hover:border-white/30'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                  )}
                  {plan.highlighted && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black border-0">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-8 relative z-10">
                    <h3 className="mb-3 text-3xl font-black">{plan.name}</h3>
                    <div className="mb-8">
                      <span className="text-6xl font-black">{plan.price}</span>
                      <span className="text-white/50 text-lg">{plan.period}</span>
                    </div>
                    <Button 
                      asChild
                      className={`mb-8 w-full py-6 text-lg ${
                        plan.highlighted 
                          ? "bg-white text-black hover:bg-white/90" 
                          : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                      data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                    >
                      <a href="/auth">{plan.cta}</a>
                    </Button>
                    <ul className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-6 w-6 shrink-0 text-white mt-0.5" />
                          <span className="text-white/80">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 border-t border-white/10">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="mb-8 text-5xl font-black tracking-tighter md:text-6xl lg:text-7xl">
              Ready to Build Your Portfolio?
            </h2>
            <p className="mb-12 text-xl text-white/60">
              Join thousands of creators who have already built their dream portfolio
            </p>
            <Button asChild size="lg" className="bg-white text-black text-lg px-12 py-6 hover:bg-white/90 group" data-testid="button-final-cta">
              <a href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="mt-6 text-sm text-white/40">
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/40">
              © 2025 Portify. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-white/40">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
