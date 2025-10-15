import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Layout,
  TrendingUp,
} from "lucide-react";
import type { Template } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have admin permissions",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, toast, setLocation]);

  const { data: templates = [], isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    enabled: isAuthenticated && user?.isAdmin,
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/templates/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  if (isLoading || templatesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalTemplates = templates.length;
  const totalUsage = templates.reduce((sum, t) => sum + (t.usageCount || 0), 0);
  const featuredTemplates = templates.filter(t => t.isFeatured).length;

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Admin Panel
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" asChild data-testid="button-user-dashboard">
              <Link href="/dashboard">User Dashboard</Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-logout">
              <a href="/api/logout">Log Out</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 md:px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage templates, users, and platform settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <Layout className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTemplates}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Times templates used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Eye className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{featuredTemplates}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Highlighted templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Quick Actions</h2>
            <Button asChild data-testid="button-create-template">
              <Link href="/template-upload">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Link>
            </Button>
          </div>
        </div>

        {/* Templates by Category */}
        <div className="space-y-8">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize flex items-center justify-between">
                  <span>{category} Templates</span>
                  <Badge variant="secondary">{categoryTemplates.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          {template.isFeatured && (
                            <Badge variant="default" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description || "No description"}
                        </p>
                        {template.usageCount !== null && template.usageCount > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Used {template.usageCount} times
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {template.previewUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(template.previewUrl || '', '_blank')}
                            data-testid={`button-preview-${template.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this template?')) {
                              deleteTemplateMutation.mutate(template.id);
                            }
                          }}
                          disabled={deleteTemplateMutation.isPending}
                          data-testid={`button-delete-${template.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Layout className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first template to get started
              </p>
              <Button asChild>
                <Link href="/template-upload">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
