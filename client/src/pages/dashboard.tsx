import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Eye,
  Edit,
  Palette,
  Share2,
  BarChart3,
  Globe,
  Plus,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { Portfolio } from "@shared/schema";
import { TemplateSwitcher } from "@/components/template-switcher";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: portfolios = [], isLoading: portfoliosLoading } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
    enabled: isAuthenticated,
  });

  const mainPortfolio = portfolios[0]; // Assuming first portfolio is the main one

  // Redirect to onboarding if no portfolio exists
  useEffect(() => {
    if (!portfoliosLoading && portfolios.length === 0) {
      setLocation("/onboarding");
    }
  }, [portfolios, portfoliosLoading, setLocation]);

  const stats = [
    { 
      title: "Total Views", 
      value: "1,234", 
      change: "+12.3%", 
      icon: Eye,
      trend: "up" 
    },
    { 
      title: "Engagement Rate", 
      value: "8.5%", 
      change: "+2.1%", 
      icon: BarChart3,
      trend: "up" 
    },
    { 
      title: "Portfolio Status", 
      value: mainPortfolio?.isPublished ? "Published" : "Draft", 
      icon: Globe,
      badge: mainPortfolio?.isPublished ? "success" : "secondary"
    },
  ];

  const quickActions = [
    {
      title: "Edit Content",
      description: "Update your bio, projects, and links",
      icon: Edit,
      href: "/editor",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Switch Template",
      description: "Change your portfolio design",
      icon: Palette,
      action: "switch-template",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Share Portfolio",
      description: "Get your shareable link",
      icon: Share2,
      action: "share",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const handleShare = () => {
    if (mainPortfolio?.subdomain) {
      const url = `https://${mainPortfolio.subdomain}.portify.io`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Portfolio link copied to clipboard",
      });
    }
  };

  if (isLoading || portfoliosLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting to onboarding
  if (!portfoliosLoading && portfolios.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/dashboard">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Portify
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild variant="ghost" data-testid="button-view-live">
              <a 
                href={`https://${mainPortfolio?.subdomain}.portify.io`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live
              </a>
            </Button>
            <Button asChild variant="outline" data-testid="button-logout">
              <a href="/api/logout">Log Out</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold" data-testid="text-welcome">
            Welcome back, {user?.firstName || "Creator"}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your portfolio and track your growth
          </p>
        </div>

        {/* Portfolio Preview Card */}
        <Card className="mb-8 border-2">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {mainPortfolio?.profilePhotoUrl && (
                  <img 
                    src={mainPortfolio.profilePhotoUrl}
                    alt={mainPortfolio.name}
                    className="h-16 w-16 rounded-full object-cover"
                    data-testid="img-profile"
                  />
                )}
                <div>
                  <h2 className="mb-1 text-2xl font-bold" data-testid="text-portfolio-name">
                    {mainPortfolio?.name}
                  </h2>
                  <p className="text-muted-foreground" data-testid="text-tagline">
                    {mainPortfolio?.tagline}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {mainPortfolio?.subdomain}.portify.io
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline" data-testid="button-edit-portfolio">
                  <Link href="/editor">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Portfolio
                  </Link>
                </Button>
                {mainPortfolio?.isPublished ? (
                  <Button asChild data-testid="button-view-portfolio">
                    <a 
                      href={`https://${mainPortfolio?.subdomain}.portify.io`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      View Portfolio
                    </a>
                  </Button>
                ) : (
                  <Button data-testid="button-publish">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Publish Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2" data-testid={`card-stat-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                    {stat.value}
                  </div>
                  {stat.change && (
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  )}
                  {stat.badge && (
                    <Badge variant={stat.badge === 'success' ? 'default' : 'secondary'}>
                      {stat.value}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.map((action, index) => {
              if (action.action === "switch-template") {
                return (
                  <TemplateSwitcher
                    key={index}
                    portfolio={mainPortfolio}
                    trigger={
                      <Card
                        className="group cursor-pointer border-2 hover-elevate active-elevate-2 transition-all w-full"
                        data-testid={`card-action-${index}`}
                      >
                        <CardContent className="p-6">
                          <div className={`mb-4 inline-flex rounded-full bg-gradient-to-br ${action.color} p-3`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="mb-2 text-lg font-semibold">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </CardContent>
                      </Card>
                    }
                  />
                );
              }
              return (
                <Card
                  key={index}
                  className="group cursor-pointer border-2 hover-elevate active-elevate-2 transition-all"
                  onClick={() => action.action === "share" ? handleShare() : setLocation(action.href!)}
                  data-testid={`card-action-${index}`}
                >
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex rounded-full bg-gradient-to-br ${action.color} p-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">Portfolio created</p>
                  <p className="text-xs text-muted-foreground">Today at 10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-muted" />
                <div className="flex-1">
                  <p className="text-sm">Template selected</p>
                  <p className="text-xs text-muted-foreground">Today at 10:25 AM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
