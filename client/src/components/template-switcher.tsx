import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Palette, 
  Check, 
  Search,
  Sparkles,
  Layout,
} from "lucide-react";
import type { Template, Portfolio } from "@shared/schema";

interface TemplateSwitcherProps {
  portfolio: Portfolio;
  trigger?: React.ReactNode;
}

const categories = ["all", "minimal", "3d", "animated", "visual", "futuristic", "gamer"];

export function TemplateSwitcher({ portfolio, trigger }: TemplateSwitcherProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allTemplates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const templates = allTemplates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = !searchQuery || 
                         template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const switchTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await apiRequest("PATCH", `/api/portfolios/${portfolio.id}`, {
        templateId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      toast({
        title: "Template Changed!",
        description: "Your portfolio template has been updated successfully",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "Session expired. Please log in again.",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to switch template. Please try again.",
        variant: "destructive",
      });
    },
  });


  const handleSwitchTemplate = (templateId: string) => {
    switchTemplateMutation.mutate(templateId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" data-testid="button-open-template-switcher">
            <Palette className="mr-2 h-4 w-4" />
            Switch Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Switch Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-templates-switcher"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize hover-elevate active-elevate-2"
                data-testid={`button-category-${category}`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Current Template */}
          {portfolio.templateId && (
            <div className="rounded-lg border-2 border-primary/50 bg-primary/5 p-3">
              <p className="text-sm font-medium text-muted-foreground mb-2">Current Template</p>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="font-semibold">
                  {allTemplates.find(t => t.id === portfolio.templateId)?.name || "Unknown Template"}
                </span>
              </div>
            </div>
          )}

          {/* Templates Grid */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video animate-pulse bg-muted" />
                  <CardContent className="p-4">
                    <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`group overflow-hidden border-2 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                    portfolio.templateId === template.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleSwitchTemplate(template.id)}
                  data-testid={`card-template-switcher-${template.id}`}
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

                    {portfolio.templateId === template.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                        <div className="rounded-full bg-primary p-2">
                          <Check className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                    )}

                    <Badge className="absolute top-2 right-2 capitalize">
                      {template.category}
                    </Badge>

                    {template.isFeatured && (
                      <Badge variant="default" className="absolute top-2 left-2">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold line-clamp-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {template.description || "Professional portfolio template"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
