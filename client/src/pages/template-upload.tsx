import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ArrowLeft, Upload, Eye, Code, FileJson } from "lucide-react";
import { templateCategories } from "@shared/schema";
import { ThemeToggle } from "@/components/theme-toggle";

const templateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  previewUrl: z.string().url().optional().or(z.literal("")),
  htmlContent: z.string().min(1, "HTML content is required"),
  cssContent: z.string().optional(),
  jsContent: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export default function TemplateUpload() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [previewMode, setPreviewMode] = useState<"split" | "full">("split");

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "Admin access required to upload templates",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, user, toast, setLocation]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Block render for non-admins - return null to prevent UI from showing
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      category: "minimal",
      description: "",
      thumbnailUrl: "",
      previewUrl: "",
      htmlContent: "",
      cssContent: "",
      jsContent: "",
      isFeatured: false,
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      return await apiRequest("POST", "/api/templates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template created successfully!",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const loadSampleTemplate = async () => {
    try {
      const response = await fetch("/api/templates/sample/demo");
      const sample = await response.json();
      
      form.setValue("htmlContent", sample.html);
      form.setValue("cssContent", sample.css);
      form.setValue("jsContent", sample.js);
      form.setValue("name", "Sample Portfolio Template");
      form.setValue("description", "A sample template demonstrating the variable system");
      
      toast({
        title: "Sample loaded",
        description: "Sample template has been loaded. You can now edit and save it.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load sample template",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: TemplateFormData) => {
    createTemplateMutation.mutate(data);
  };

  const generatePreview = () => {
    const html = form.watch("htmlContent");
    const css = form.watch("cssContent");
    const js = form.watch("jsContent");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Preview</title>
    <style>${css}</style>
</head>
<body>
    ${html}
    <script>${js}</script>
</body>
</html>
    `;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild data-testid="button-back">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Link href="/">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Portify
              </span>
            </Link>
            <span className="text-sm text-muted-foreground">/ Template Upload</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Security Warning */}
        <Card className="mb-4 border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 text-destructive">⚠️</div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-destructive">Security Warning</h3>
                <p className="text-sm text-muted-foreground">
                  Only upload templates from trusted sources. Malicious HTML/JavaScript code can execute in users' browsers.
                  In production, template uploads should be restricted to administrators only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <FileJson className="h-6 w-6 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Template Variable System</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Use the following variables in your HTML to dynamically insert user data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="font-mono bg-background/50 p-2 rounded">
                    <code>{"{{name}}"}</code> - User's name
                  </div>
                  <div className="font-mono bg-background/50 p-2 rounded">
                    <code>{"{{tagline}}"}</code> - User's tagline
                  </div>
                  <div className="font-mono bg-background/50 p-2 rounded">
                    <code>{"{{bio}}"}</code> - User's bio
                  </div>
                  <div className="font-mono bg-background/50 p-2 rounded">
                    <code>{"{{profession}}"}</code> - User's profession
                  </div>
                  <div className="font-mono bg-background/50 p-2 rounded">
                    <code>{"{{profilePhotoUrl}}"}</code> - Profile photo
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  For projects use: <code className="bg-background/50 px-1 rounded">{"<!-- PROJECTS_START -->...<!-- PROJECTS_END -->"}</code> with variables like <code className="bg-background/50 px-1 rounded">{"{{project.title}}"}</code>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  For social links use: <code className="bg-background/50 px-1 rounded">{"<!-- SOCIAL_LINKS_START -->...<!-- SOCIAL_LINKS_END -->"}</code> with variables like <code className="bg-background/50 px-1 rounded">{"{{social.platform}}"}</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Template
              </CardTitle>
              <CardDescription>
                Create a new portfolio template with custom HTML, CSS, and JS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Basic Info */}
                <div>
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Modern Developer Portfolio"
                    data-testid="input-template-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.watch("category")}
                    onValueChange={(value) => form.setValue("category", value)}
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {templateCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="A modern, minimal portfolio template perfect for developers..."
                    data-testid="textarea-description"
                  />
                </div>

                <div>
                  <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
                  <Input
                    id="thumbnailUrl"
                    {...form.register("thumbnailUrl")}
                    placeholder="https://example.com/thumbnail.png"
                    data-testid="input-thumbnail-url"
                  />
                </div>

                {/* Code Tabs */}
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="js">JavaScript</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="html" className="mt-4">
                    <Textarea
                      {...form.register("htmlContent")}
                      placeholder="Enter HTML content with template variables..."
                      className="min-h-[300px] font-mono text-sm"
                      data-testid="textarea-html"
                    />
                    {form.formState.errors.htmlContent && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.htmlContent.message}</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="css" className="mt-4">
                    <Textarea
                      {...form.register("cssContent")}
                      placeholder="Enter CSS styles..."
                      className="min-h-[300px] font-mono text-sm"
                      data-testid="textarea-css"
                    />
                  </TabsContent>
                  
                  <TabsContent value="js" className="mt-4">
                    <Textarea
                      {...form.register("jsContent")}
                      placeholder="Enter JavaScript code..."
                      className="min-h-[300px] font-mono text-sm"
                      data-testid="textarea-js"
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={loadSampleTemplate}
                    data-testid="button-load-sample"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Load Sample
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createTemplateMutation.isPending}
                    data-testid="button-create-template"
                  >
                    {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(previewMode === "split" ? "full" : "split")}
                  data-testid="button-toggle-preview"
                >
                  {previewMode === "split" ? "Full" : "Split"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                <iframe
                  srcDoc={generatePreview()}
                  className="w-full h-[600px]"
                  title="Template Preview"
                  sandbox="allow-scripts"
                  data-testid="iframe-preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
