import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Upload,
  Code,
  Palette,
  Gamepad2,
  Rocket,
  Sparkles,
  GraduationCap,
  Briefcase,
  User,
} from "lucide-react";
import type { Template, InsertPortfolio } from "@shared/schema";

const professions = [
  { value: "developer", label: "Developer", icon: Code, color: "from-blue-500 to-cyan-500" },
  { value: "designer", label: "Designer", icon: Palette, color: "from-purple-500 to-pink-500" },
  { value: "gamer", label: "Gamer", icon: Gamepad2, color: "from-orange-500 to-red-500" },
  { value: "entrepreneur", label: "Entrepreneur", icon: Rocket, color: "from-green-500 to-emerald-500" },
  { value: "artist", label: "Artist", icon: Sparkles, color: "from-violet-500 to-purple-500" },
  { value: "student", label: "Student", icon: GraduationCap, color: "from-yellow-500 to-orange-500" },
  { value: "creator", label: "Creator", icon: Briefcase, color: "from-pink-500 to-rose-500" },
  { value: "other", label: "Other", icon: User, color: "from-gray-500 to-slate-500" },
];

const basicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    bio: "",
    profilePhotoUrl: "",
    profession: "",
    templateId: "",
  });

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const form = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formData.name,
      tagline: formData.tagline,
      bio: formData.bio,
    },
  });

  const createPortfolioMutation = useMutation({
    mutationFn: async (data: InsertPortfolio) => {
      return await apiRequest("POST", "/api/portfolios", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolios"] });
      toast({
        title: "Portfolio Created!",
        description: "Your portfolio has been created successfully",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger();
      if (!isValid) return;
      
      setFormData(prev => ({
        ...prev,
        name: form.getValues("name"),
        tagline: form.getValues("tagline"),
        bio: form.getValues("bio"),
      }));
    }
    
    if (step === 4) {
      // Create portfolio
      // Generate unique subdomain with timestamp to avoid duplicates
      const baseSubdomain = formData.name.toLowerCase().replace(/\s+/g, "-");
      const uniqueSuffix = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const subdomain = `${baseSubdomain}-${uniqueSuffix}`;
      
      const portfolioData: InsertPortfolio = {
        userId: "", // Will be set by backend
        name: formData.name,
        tagline: formData.tagline,
        bio: formData.bio,
        profilePhotoUrl: formData.profilePhotoUrl,
        profession: formData.profession,
        templateId: formData.templateId,
        subdomain,
        isPublished: false,
      };
      
      createPortfolioMutation.mutate(portfolioData);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const progress = (step / 4) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-3xl border-2">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Create Your Portfolio</CardTitle>
            <Badge variant="secondary" data-testid="badge-step">
              Step {step} of 4
            </Badge>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-onboarding" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4" data-testid="step-basic-info">
              <div>
                <h3 className="mb-4 text-lg font-semibold">Tell us about yourself</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  data-testid="input-name"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline *</Label>
                <Input
                  id="tagline"
                  placeholder="Full-stack developer & UI/UX enthusiast"
                  data-testid="input-tagline"
                  {...form.register("tagline")}
                />
                {form.formState.errors.tagline && (
                  <p className="text-sm text-destructive">{form.formState.errors.tagline.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your skills, and what you do..."
                  rows={4}
                  data-testid="input-bio"
                  {...form.register("bio")}
                />
                {form.formState.errors.bio && (
                  <p className="text-sm text-destructive">{form.formState.errors.bio.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Profile Photo */}
          {step === 2 && (
            <div className="space-y-4" data-testid="step-photo">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Upload your profile photo</h3>
                <p className="text-sm text-muted-foreground">
                  This helps personalize your portfolio
                </p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12">
                {formData.profilePhotoUrl ? (
                  <div className="text-center">
                    <img 
                      src={formData.profilePhotoUrl} 
                      alt="Profile" 
                      className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => setFormData(prev => ({ ...prev, profilePhotoUrl: "" }))}
                      data-testid="button-remove-photo"
                    >
                      Remove Photo
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-sm font-medium">Upload a profile photo</p>
                    <p className="mb-4 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="max-w-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app, upload to storage and get URL
                          const url = URL.createObjectURL(file);
                          setFormData(prev => ({ ...prev, profilePhotoUrl: url }));
                        }
                      }}
                      data-testid="input-photo-upload"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Profession */}
          {step === 3 && (
            <div className="space-y-4" data-testid="step-profession">
              <div>
                <h3 className="mb-2 text-lg font-semibold">What do you do?</h3>
                <p className="text-sm text-muted-foreground">
                  This helps us suggest the best templates for you
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {professions.map((profession) => (
                  <Card
                    key={profession.value}
                    className={`cursor-pointer border-2 transition-all hover-elevate active-elevate-2 ${
                      formData.profession === profession.value ? 'border-primary' : ''
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, profession: profession.value }))}
                    data-testid={`card-profession-${profession.value}`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`rounded-full bg-gradient-to-br ${profession.color} p-3`}>
                        <profession.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{profession.label}</h4>
                      </div>
                      {formData.profession === profession.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Template Selection */}
          {step === 4 && (
            <div className="space-y-4" data-testid="step-template">
              <div>
                <h3 className="mb-2 text-lg font-semibold">Choose your template</h3>
                <p className="text-sm text-muted-foreground">
                  You can change this anytime from your dashboard
                </p>
              </div>

              <div className="grid max-h-96 gap-4 overflow-y-auto pr-2 md:grid-cols-2">
                {templates.slice(0, 10).map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer border-2 transition-all hover-elevate active-elevate-2 ${
                      formData.templateId === template.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, templateId: template.id }))}
                    data-testid={`card-template-${template.id}`}
                  >
                    <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                      {template.thumbnailUrl && (
                        <img 
                          src={template.thumbnailUrl}
                          alt={template.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      {formData.templateId === template.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                          <Check className="h-8 w-8 text-primary" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2 capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-semibold line-clamp-1">{template.name}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={step === 1}
              data-testid="button-prev"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNextStep}
              disabled={
                (step === 3 && !formData.profession) ||
                (step === 4 && !formData.templateId) ||
                createPortfolioMutation.isPending
              }
              data-testid="button-next"
            >
              {step === 4 ? (
                createPortfolioMutation.isPending ? (
                  "Creating..."
                ) : (
                  <>
                    Create Portfolio
                    <Check className="ml-2 h-4 w-4" />
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
