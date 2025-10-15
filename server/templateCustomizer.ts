// Template Customization Service
// Replaces placeholders in templates with user's actual data

import type { Portfolio, Project, SocialLink } from "@shared/schema";

export interface TemplateData {
  portfolio: Portfolio;
  projects?: Project[];
  socialLinks?: SocialLink[];
}

/**
 * Available template variables:
 * {{name}} - User's name
 * {{tagline}} - User's tagline
 * {{bio}} - User's bio
 * {{profession}} - User's profession
 * {{profilePhotoUrl}} - User's profile photo URL
 * {{subdomain}} - Portfolio subdomain
 * {{customDomain}} - Custom domain if set
 * {{projects}} - Loop through projects
 * {{socialLinks}} - Loop through social links
 */

export class TemplateCustomizer {
  /**
   * Replace simple variables in template
   */
  private static replaceVariables(
    content: string,
    portfolio: Portfolio
  ): string {
    let result = content;
    
    const variables: Record<string, string> = {
      name: portfolio.name || '',
      tagline: portfolio.tagline || '',
      bio: portfolio.bio || '',
      profession: portfolio.profession || '',
      profilePhotoUrl: portfolio.profilePhotoUrl || '/placeholder-avatar.png',
      subdomain: portfolio.subdomain || '',
      customDomain: portfolio.customDomain || '',
    };

    // Replace all {{variable}} patterns
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }

  /**
   * Replace project loops in template
   * Supports: <!-- PROJECTS_START -->...<!-- PROJECTS_END -->
   */
  private static replaceProjects(
    content: string,
    projects: Project[] = []
  ): string {
    const projectRegex = /<!--\s*PROJECTS_START\s*-->([\s\S]*?)<!--\s*PROJECTS_END\s*-->/g;
    
    return content.replace(projectRegex, (match, template) => {
      if (!projects || projects.length === 0) {
        return '<!-- No projects yet -->';
      }

      return projects.map(project => {
        let projectHtml = template;
        
        const projectVars: Record<string, string> = {
          'project.title': project.title || '',
          'project.description': project.description || '',
          'project.imageUrl': project.imageUrl || '/placeholder-project.png',
          'project.projectUrl': project.projectUrl || '#',
          'project.tags': project.tags?.join(', ') || '',
        };

        Object.entries(projectVars).forEach(([key, value]) => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          projectHtml = projectHtml.replace(regex, value);
        });

        return projectHtml;
      }).join('\n');
    });
  }

  /**
   * Replace social links loops in template
   * Supports: <!-- SOCIAL_LINKS_START -->...<!-- SOCIAL_LINKS_END -->
   */
  private static replaceSocialLinks(
    content: string,
    socialLinks: SocialLink[] = []
  ): string {
    const socialRegex = /<!--\s*SOCIAL_LINKS_START\s*-->([\s\S]*?)<!--\s*SOCIAL_LINKS_END\s*-->/g;
    
    return content.replace(socialRegex, (match, template) => {
      if (!socialLinks || socialLinks.length === 0) {
        return '<!-- No social links yet -->';
      }

      return socialLinks.map(link => {
        let linkHtml = template;
        
        const linkVars: Record<string, string> = {
          'social.platform': link.platform || '',
          'social.url': link.url || '#',
          'social.platformLower': link.platform?.toLowerCase() || '',
        };

        Object.entries(linkVars).forEach(([key, value]) => {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          linkHtml = linkHtml.replace(regex, value);
        });

        return linkHtml;
      }).join('\n');
    });
  }

  /**
   * Customize a complete template with user data
   */
  static customizeTemplate(
    htmlContent: string,
    cssContent: string,
    jsContent: string,
    data: TemplateData
  ): { html: string; css: string; js: string } {
    let html = htmlContent || '';
    let css = cssContent || '';
    let js = jsContent || '';

    // Replace variables in all content types
    html = this.replaceVariables(html, data.portfolio);
    html = this.replaceProjects(html, data.projects);
    html = this.replaceSocialLinks(html, data.socialLinks);

    css = this.replaceVariables(css, data.portfolio);
    js = this.replaceVariables(js, data.portfolio);

    return { html, css, js };
  }

  /**
   * Generate a complete HTML page with embedded CSS and JS
   */
  static generateCompletePage(
    htmlContent: string,
    cssContent: string,
    jsContent: string,
    data: TemplateData
  ): string {
    const customized = this.customizeTemplate(htmlContent, cssContent, jsContent, data);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.portfolio.name} - Portfolio</title>
    <meta name="description" content="${data.portfolio.tagline || data.portfolio.bio?.substring(0, 160) || ''}">
    <style>
        ${customized.css}
    </style>
</head>
<body>
    ${customized.html}
    <script>
        ${customized.js}
    </script>
</body>
</html>`;
  }

  /**
   * Create a sample template to demonstrate the variable system
   */
  static getSampleTemplate(): { html: string; css: string; js: string } {
    const html = `
<div class="portfolio-container">
    <header class="hero">
        <img src="{{profilePhotoUrl}}" alt="{{name}}" class="profile-photo">
        <h1>{{name}}</h1>
        <p class="tagline">{{tagline}}</p>
        <p class="profession">{{profession}}</p>
    </header>

    <section class="about">
        <h2>About Me</h2>
        <p>{{bio}}</p>
    </section>

    <section class="projects">
        <h2>Projects</h2>
        <div class="projects-grid">
            <!-- PROJECTS_START -->
            <div class="project-card">
                <img src="{{project.imageUrl}}" alt="{{project.title}}">
                <h3>{{project.title}}</h3>
                <p>{{project.description}}</p>
                <p class="tags">{{project.tags}}</p>
                <a href="{{project.projectUrl}}" target="_blank">View Project</a>
            </div>
            <!-- PROJECTS_END -->
        </div>
    </section>

    <section class="social">
        <h2>Connect With Me</h2>
        <div class="social-links">
            <!-- SOCIAL_LINKS_START -->
            <a href="{{social.url}}" target="_blank" class="social-link {{social.platformLower}}">
                {{social.platform}}
            </a>
            <!-- SOCIAL_LINKS_END -->
        </div>
    </section>
</div>
    `;

    const css = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 2rem;
}

.portfolio-container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.hero {
    text-align: center;
    padding: 2rem 0;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 3rem;
}

.profile-photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid #667eea;
    margin-bottom: 1rem;
}

h1 {
    font-size: 2.5rem;
    color: #667eea;
    margin-bottom: 0.5rem;
}

.tagline {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.profession {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: 0.9rem;
}

.about, .projects, .social {
    margin-bottom: 3rem;
}

h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1.5rem;
    border-left: 4px solid #667eea;
    padding-left: 1rem;
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.project-card {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 1.5rem;
    transition: transform 0.3s;
}

.project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.project-card h3 {
    color: #667eea;
    margin-bottom: 0.5rem;
}

.tags {
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
}

.project-card a {
    display: inline-block;
    margin-top: 1rem;
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
}

.social-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.social-link {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #667eea;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: background 0.3s;
}

.social-link:hover {
    background: #764ba2;
}
    `;

    const js = `
console.log('Portfolio for {{name}} loaded successfully!');
    `;

    return { html, css, js };
  }
}
