// AI Service for Portfolio Customization
// Reference: blueprint:javascript_openai
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface UserInput {
  name?: string;
  profession?: string;
  skills?: string[];
  bio?: string;
  experience?: string;
  interests?: string[];
}

interface GeneratedPortfolio {
  name: string;
  tagline: string;
  bio: string;
  profession: string;
  suggestedProjects: Array<{
    title: string;
    description: string;
    tags: string[];
  }>;
  suggestedSocialLinks: Array<{
    platform: string;
    placeholder: string;
  }>;
}

/**
 * Generate personalized portfolio content using AI
 */
export async function generatePortfolioContent(
  userInput: UserInput
): Promise<GeneratedPortfolio> {
  const prompt = `You are a professional portfolio builder assistant. Generate personalized portfolio content based on the user's information.

User Information:
- Name: ${userInput.name || 'Not provided'}
- Profession: ${userInput.profession || 'Not provided'}
- Skills: ${userInput.skills?.join(', ') || 'Not provided'}
- Bio: ${userInput.bio || 'Not provided'}
- Experience: ${userInput.experience || 'Not provided'}
- Interests: ${userInput.interests?.join(', ') || 'Not provided'}

Generate a complete portfolio with:
1. A professional tagline (max 100 characters)
2. An engaging bio (2-3 paragraphs, max 500 characters)
3. 3-5 suggested project ideas with titles, descriptions, and relevant tags
4. Suggested social media platforms based on their profession

Return the result in JSON format with this exact structure:
{
  "name": "user's name",
  "tagline": "professional tagline",
  "bio": "engaging bio",
  "profession": "profession category",
  "suggestedProjects": [
    {
      "title": "project title",
      "description": "project description",
      "tags": ["tag1", "tag2"]
    }
  ],
  "suggestedSocialLinks": [
    {
      "platform": "github/linkedin/twitter/etc",
      "placeholder": "suggested URL or handle"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a professional portfolio builder assistant. Generate personalized, engaging portfolio content. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error: any) {
    throw new Error(`AI generation failed: ${error.message}`);
  }
}

/**
 * Customize template HTML with user data
 */
export async function customizeTemplate(
  templateHtml: string,
  userData: {
    name: string;
    tagline?: string;
    bio?: string;
    profession?: string;
  }
): Promise<string> {
  const prompt = `You are a web template customization expert. I have an HTML template and user data. Replace placeholder content in the HTML with the user's actual data.

User Data:
- Name: ${userData.name}
- Tagline: ${userData.tagline || 'Not provided'}
- Bio: ${userData.bio || 'Not provided'}
- Profession: ${userData.profession || 'Not provided'}

Template HTML:
\`\`\`html
${templateHtml}
\`\`\`

Instructions:
1. Replace any placeholder names (like "John Doe", "Your Name", etc.) with the user's name
2. Replace any placeholder taglines with the user's tagline
3. Replace any placeholder bio/about text with the user's bio
4. Replace any profession/title placeholders with the user's profession
5. Keep all HTML structure, classes, and IDs intact
6. Return ONLY the modified HTML, no explanations

Return the customized HTML:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a web template customization expert. Modify HTML templates with user data while preserving structure."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    return response.choices[0].message.content || templateHtml;
  } catch (error: any) {
    console.error('Template customization failed:', error);
    return templateHtml; // Return original template on error
  }
}
