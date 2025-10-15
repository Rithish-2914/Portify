import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Globe,
  User,
  Briefcase,
  Link as LinkIcon,
} from "lucide-react";
import type { Portfolio, Project, SocialLink, InsertProject, InsertSocialLink } from "@shared/schema";

const profileSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(10),
  bio: z.string().min(20),
  profession: z.string(),
});

type ProfileData = z.infer<typeof profileSchema>;

const socialPlatforms = [
  "GitHub", "LinkedIn", "Twitter", "Instagram", "Dribbble", "Behance", "YouTube", "Website"
];

export default function Editor() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [newProject, setNewProject] = useState({ title: "", description: "", projectUrl: "" });
  const [newSocial, setNewSocial] = useState({ platform: "", url: "" });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: portfolios = [] } = useQuery<Portfolio[]>({
    queryKey: ["/api/portfolios"],
    enabled: isAuthenticated,
  });

  const portfolio = portfolios[0];

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects", portfolio?.id],
    enabled: !!portfolio?.id,
  });

  const { data: socialLinks = [] } = useQuery<SocialLink[]>({
    queryKey: ["/api/social-links", portfolio?.id],
    enabled: !!portfolio?.id,
  });

  const form = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: portfolio?.name || "",
      tagline: portfolio?.tagline || "",
      bio: portfolio?.bio || "",
      profession: portfolio?.profession || "",
    },
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: async (data: Partial<Portfolio>) => {
      return await apiRequest("PATCH", `/api/portfolios/${portfolio?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      toast({ title: "Saved!", description: "Profile updated successfully" });
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
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    },
  });

  const addProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      return await apiRequest("POST", "/api/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setNewProject({ title: "", description: "", projectUrl: "" });
      toast({ title: "Success!", description: "Project added" });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/projects/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Deleted", description: "Project removed" });
    },
  });

  const addSocialLinkMutation = useMutation({
    mutationFn: async (data: InsertSocialLink) => {
      return await apiRequest("POST", "/api/social-links", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      setNewSocial({ platform: "", url: "" });
      toast({ title: "Success!", description: "Social link added" });
    },
  });

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/social-links/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/social-links"] });
      toast({ title: "Deleted", description: "Social link removed" });
    },
  });

  const handleSaveProfile = form.handleSubmit((data) => {
    updatePortfolioMutation.mutate(data);
  });

  const handleAddProject = () => {
    if (!newProject.title || !portfolio?.id) return;
    
    addProjectMutation.mutate({
      portfolioId: portfolio.id,
      title: newProject.title,
      description: newProject.description,
      projectUrl: newProject.projectUrl,
      displayOrder: projects.length,
    });
  };

  const handleAddSocialLink = () => {
    if (!newSocial.platform || !newSocial.url || !portfolio?.id) return;
    
    addSocialLinkMutation.mutate({
      portfolioId: portfolio.id,
      platform: newSocial.platform,
      url: newSocial.url,
      displayOrder: socialLinks.length,
    });
  };

  if (authLoading || !portfolio) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")} data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Portfolio Editor</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" data-testid="button-preview">
              <a href={`https://${portfolio.subdomain}.portify.io`} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl px-4 py-8 md:px-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="social" data-testid="tab-social">
              <LinkIcon className="mr-2 h-4 w-4" />
              Social Links
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    data-testid="input-name"
                    {...form.register("name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    data-testid="input-tagline"
                    {...form.register("tagline")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    data-testid="input-bio"
                    {...form.register("bio")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    data-testid="input-profession"
                    {...form.register("profession")}
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={updatePortfolioMutation.isPending}
                  data-testid="button-save-profile"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updatePortfolioMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    placeholder="My Awesome Project"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    data-testid="input-project-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of the project..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    data-testid="input-project-description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project URL</Label>
                  <Input
                    placeholder="https://..."
                    value={newProject.projectUrl}
                    onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
                    data-testid="input-project-url"
                  />
                </div>
                <Button 
                  onClick={handleAddProject}
                  disabled={!newProject.title || addProjectMutation.isPending}
                  data-testid="button-add-project"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {projects.map((project) => (
                <Card key={project.id} className="border-2">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid={`text-project-${project.id}`}>{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      {project.projectUrl && (
                        <a 
                          href={project.projectUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          {project.projectUrl}
                        </a>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProjectMutation.mutate(project.id)}
                      data-testid={`button-delete-project-${project.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Add Social Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                    data-testid="select-platform"
                  >
                    <option value="">Select platform</option>
                    {socialPlatforms.map((platform) => (
                      <option key={platform} value={platform.toLowerCase()}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    placeholder="https://..."
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    data-testid="input-social-url"
                  />
                </div>
                <Button 
                  onClick={handleAddSocialLink}
                  disabled={!newSocial.platform || !newSocial.url || addSocialLinkMutation.isPending}
                  data-testid="button-add-social"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {socialLinks.map((link) => (
                <Card key={link.id} className="border-2">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <h3 className="font-semibold capitalize" data-testid={`text-social-${link.id}`}>{link.platform}</h3>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSocialLinkMutation.mutate(link.id)}
                      data-testid={`button-delete-social-${link.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
