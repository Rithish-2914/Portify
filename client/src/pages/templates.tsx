import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  ArrowLeft,
  Sparkles,
  Layout,
  Zap,
  Palette,
  Rocket,
  Code,
  Eye,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Template } from "@shared/schema";

const categories = [
  { value: "all", label: "All Templates", count: "1000+" },
  { value: "minimal", label: "Minimal", count: "200+" },
  { value: "3d", label: "3D", count: "150+" },
  { value: "animated", label: "Animated", count: "180+" },
  { value: "visual", label: "Visual", count: "220+" },
  { value: "futuristic", label: "Futuristic", count: "140+" },
  { value: "gamer", label: "Gamer", count: "110+" },
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allTemplates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const filteredTemplates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
                         template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild data-testid="button-back">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portify
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/api/login">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold md:text-5xl">Template Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Browse 1000+ professionally designed portfolio templates
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-templates"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by:</span>
          </div>
        </div>

        {/* Category Chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="hover-elevate active-elevate-2"
              data-testid={`button-category-${category.value}`}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video animate-pulse bg-muted" />
                <CardContent className="p-4">
                  <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className="group overflow-hidden border-2 hover-elevate active-elevate-2 cursor-pointer transition-all"
                data-testid={`card-template-${template.id}`}
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {template.thumbnailUrl ? (
                    <img 
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Layout className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" data-testid={`button-preview-${template.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button size="sm" data-testid={`button-use-template-${template.id}`}>
                      Use Template
                    </Button>
                  </div>

                  {/* Category Badge */}
                  <Badge 
                    className="absolute top-2 right-2 capitalize"
                    data-testid={`badge-category-${template.id}`}
                  >
                    {template.category}
                  </Badge>

                  {template.isFeatured && (
                    <Badge 
                      variant="default"
                      className="absolute top-2 left-2"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="mb-1 font-semibold line-clamp-1" data-testid={`text-template-name-${template.id}`}>
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description || "Professional portfolio template"}
                  </p>
                  {template.usageCount !== null && template.usageCount !== undefined && template.usageCount > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Used by {template.usageCount.toLocaleString()}+ users
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
