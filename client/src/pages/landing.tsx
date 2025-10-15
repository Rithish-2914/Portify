import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  const categories = [
    { name: "Minimal", icon: Layout, count: "200+", color: "from-blue-500 to-cyan-500" },
    { name: "3D", icon: Sparkles, count: "150+", color: "from-purple-500 to-pink-500" },
    { name: "Animated", icon: Zap, count: "180+", color: "from-orange-500 to-red-500" },
    { name: "Visual", icon: Palette, count: "220+", color: "from-green-500 to-emerald-500" },
    { name: "Futuristic", icon: Rocket, count: "140+", color: "from-violet-500 to-purple-500" },
    { name: "Gamer", icon: Code, count: "110+", color: "from-pink-500 to-rose-500" },
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

  const steps = [
    {
      number: "01",
      title: "Sign Up & Profile",
      description: "Create your account and fill in your basic information, bio, and upload your photo",
    },
    {
      number: "02",
      title: "Choose Template",
      description: "Browse 1000+ templates and select the perfect design for your portfolio",
    },
    {
      number: "03",
      title: "Publish Instantly",
      description: "Your portfolio goes live with a custom subdomain - share it with the world",
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Portify
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost" data-testid="button-login">
              <a href="/auth">Log In</a>
            </Button>
            <Button asChild data-testid="button-signup">
              <a href="/auth">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6" data-testid="badge-hero">
              <Sparkles className="mr-2 h-3 w-3" />
              1000+ Professional Templates
            </Badge>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Build Your Dream{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portfolio
              </span>
              {" "}in Minutes
            </h1>
            
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Choose from 1000+ stunning templates. No code required. 
              Perfect for developers, designers, gamers, and creators.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base" data-testid="button-hero-cta">
                <a href="/auth">
                  Start Building Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base" data-testid="button-browse-templates">
                <a href="/templates">
                  Browse Templates
                </a>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>10,000+ portfolios created</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                <span>5,000+ active users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Categories */}
      <section className="border-t py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Explore by Category</h2>
            <p className="text-lg text-muted-foreground">
              Find the perfect template for your style and profession
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <Card 
                key={index}
                className="group cursor-pointer border-2 hover-elevate active-elevate-2 transition-all"
                data-testid={`card-category-${category.name.toLowerCase()}`}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className={`mb-4 rounded-full bg-gradient-to-br ${category.color} p-3`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-1 font-semibold">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to make your portfolio stand out
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2" data-testid={`card-feature-${index}`}>
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to your perfect portfolio
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="mb-8 flex gap-6 last:mb-0"
                data-testid={`step-${index}`}
              >
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mt-2 h-full w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative border-2 ${plan.highlighted ? 'border-primary shadow-lg' : ''}`}
                data-testid={`card-pricing-${plan.name.toLowerCase()}`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6">
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <Button 
                    asChild
                    className="mb-6 w-full" 
                    variant={plan.highlighted ? "default" : "outline"}
                    data-testid={`button-pricing-${plan.name.toLowerCase()}`}
                  >
                    <a href="/auth">{plan.cta}</a>
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Ready to Build Your Portfolio?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of creators who have already built their dream portfolio
            </p>
            <Button asChild size="lg" className="text-base" data-testid="button-final-cta">
              <a href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Portify. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
