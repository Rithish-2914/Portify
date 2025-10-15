# Portify Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based (Hybrid)
Drawing inspiration from template marketplace leaders (Webflow, Framer) combined with creative portfolio platforms (Dribbble, Behance) and modern SaaS UI (Linear, Stripe).

**Justification:** As a template marketplace targeting gamers, developers, and creatives, visual differentiation is crucial. The platform must feel cutting-edge while maintaining excellent usability for browsing 1000+ templates.

**Core Design Principles:**
- Template-First: Every design decision should showcase template quality
- Progressive Disclosure: Simple onboarding, powerful customization when needed
- Dark-Mode Native: Primary interface optimized for dark mode with light mode as alternative
- Visual Confidence: Bold typography, strong contrast, purposeful animations

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Base: 220 15% 8% (deep navy-black)
- Surface: 220 12% 12% (elevated cards/panels)
- Surface Elevated: 220 10% 16% (modals, dropdowns)
- Border Subtle: 220 8% 22%
- Border Default: 220 8% 28%

**Brand Colors:**
- Primary: 265 85% 62% (vibrant purple - main CTAs, active states)
- Primary Hover: 265 85% 68%
- Accent: 180 75% 55% (cyan - highlights, success states)
- Accent Subtle: 180 40% 25% (muted cyan for backgrounds)

**Semantic Colors:**
- Success: 145 65% 50%
- Warning: 35 90% 60%
- Error: 0 75% 58%
- Info: 210 85% 60%

**Text Hierarchy:**
- Primary Text: 220 8% 95%
- Secondary Text: 220 6% 70%
- Muted Text: 220 5% 50%
- Disabled: 220 5% 35%

**Light Mode:**
- Invert the luminosity values while maintaining hue/saturation relationships
- Background: 220 15% 98%
- Surface: 220 12% 100%
- Text Primary: 220 8% 12%

### B. Typography

**Font Families:**
- Headings: 'Inter', sans-serif (700, 800 weights)
- Body: 'Inter', sans-serif (400, 500, 600 weights)
- Code/Monospace: 'JetBrains Mono', monospace (for developer-focused areas)

**Type Scale:**
- Hero Display: text-6xl md:text-7xl lg:text-8xl (60-96px), font-bold, tracking-tight
- Page Heading: text-4xl md:text-5xl (36-48px), font-bold
- Section Heading: text-3xl md:text-4xl (30-36px), font-bold
- Card Title: text-xl md:text-2xl (20-24px), font-semibold
- Body Large: text-lg (18px), font-normal
- Body: text-base (16px), font-normal
- Body Small: text-sm (14px), font-normal
- Caption: text-xs (12px), font-medium

**Text Treatments:**
- Gradient Text for Hero: bg-gradient-to-r from-primary to-accent, bg-clip-text, text-transparent
- Uppercase Labels: uppercase, tracking-wide, text-xs, font-semibold
- Link States: underline-offset-4, hover:underline

### C. Layout System

**Spacing Primitives:** 
Use Tailwind units of 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm
- Micro spacing (gaps, padding): 1, 2, 3, 4
- Component spacing: 4, 6, 8
- Section spacing: 12, 16, 20, 24
- Hero/Major sections: 32

**Container Strategy:**
- Full-width sections: w-full with inner max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Content sections: max-w-6xl mx-auto px-4
- Narrow content (forms, text): max-w-2xl mx-auto

**Grid Systems:**
- Template Gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
- Feature Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Dashboard Layout: grid-cols-1 lg:grid-cols-4 gap-6 (sidebar + main content)

**Responsive Breakpoints:**
- Mobile: base (default)
- Tablet: md: (768px)
- Desktop: lg: (1024px)
- Wide: xl: (1280px)

### D. Component Library

**Navigation:**
- Sticky header with blur backdrop (backdrop-blur-xl bg-background/80)
- Logo + Nav Links + Auth buttons
- Mobile: Hamburger menu with slide-in drawer
- User avatar with dropdown for authenticated state

**Buttons:**
- Primary: bg-primary text-white, rounded-lg, px-6 py-3, font-semibold
- Secondary: bg-surface border-2 border-border, rounded-lg
- Ghost: hover:bg-surface/50, transparent default
- Icon buttons: Square aspect ratio, centered icon
- Button groups for template filters

**Cards (Template Preview):**
- Aspect ratio 16:9 for template thumbnails
- Hover state: scale-105 transform, border-primary glow
- Overlay on hover with "Preview" + "Use Template" actions
- Category badge in top-right corner
- Template name + creator below thumbnail
- Live preview on hover (iframe or video)

**Forms:**
- Input fields: bg-surface border border-border, rounded-lg, p-3
- Focus states: ring-2 ring-primary border-primary
- Labels: text-sm font-medium mb-2
- Helper text: text-xs text-muted
- File upload: Drag-and-drop zone with dashed border
- Profile photo upload: Circular crop preview

**Dashboard Components:**
- Stat cards: Grid of metrics with large numbers, trend indicators
- Analytics chart: Line/bar charts with gradient fills
- Recent activity feed: Timeline-style list
- Quick actions: Large icon buttons in grid
- Template switcher: Thumbnail carousel with active indicator

**Template Gallery:**
- Filter sidebar: Category chips, search input, sort dropdown
- Infinite scroll or pagination
- "Featured" section at top with larger cards
- Template count indicator
- Loading skeleton states for cards

**Modals/Overlays:**
- Full-screen template preview modal
- Semi-transparent backdrop (bg-black/60)
- Close button in top-right
- Template customization panel (slide-in from right)

**Data Display:**
- Tables: Minimal borders, alternating row backgrounds
- Lists: Hover states, icons for actions
- Empty states: Centered icon + message + CTA
- Loading states: Skeleton screens matching content layout

### E. Animations

Use sparingly and purposefully:

**Template Gallery:**
- Hover scale: transform hover:scale-105 transition-transform duration-200
- Stagger entrance: Templates fade in with slight delay between each

**Page Transitions:**
- Smooth fade between routes (opacity transition)

**Interactions:**
- Button press: active:scale-95
- Card selection: border color transition
- Dropdown menus: fade + slide down (translate-y-2)

**Loading:**
- Skeleton pulse: animate-pulse for loading states
- Progress indicators: Smooth width transitions for upload progress

**Dashboard:**
- Stat numbers: Count-up animation on mount (use library like react-countup)

**Avoid:**
- Parallax scrolling
- Complex cursor trails
- Auto-playing carousels
- Excessive micro-interactions

---

## Page-Specific Guidelines

### Landing Page (Marketing)

**Structure (8 sections):**

1. **Hero Section** (90vh):
   - Split layout: 60% left (content), 40% right (animated template preview showcase)
   - Headline: "Build Your Dream Portfolio in Minutes" (gradient text)
   - Subheadline: Feature count + user testimonial count
   - Dual CTA: "Start Building" (primary) + "Browse Templates" (secondary)
   - Background: Subtle grid pattern with radial gradient from primary color

2. **Template Categories Showcase** (full-width):
   - Horizontal scrolling carousel of 6 category cards
   - Each card: Large icon, category name, template count, "Explore" link
   - Cards use category-specific accent colors

3. **Features Grid** (3 columns):
   - Icon + Title + Description for each
   - Features: 1000+ Templates, AI Customization, Custom Domains, Analytics, No Code, Template Switching
   - Icons from Heroicons

4. **Template Gallery Preview**:
   - Grid of 6-8 featured templates
   - "View All Templates" CTA leading to full gallery
   - Live hover previews

5. **How It Works** (3 steps):
   - Timeline/step layout with numbered circles
   - Left-aligned: Step 1, 3 | Right-aligned: Step 2
   - Screenshots for each step

6. **Pricing Cards** (3 tiers):
   - Free, Pro, Creator
   - Feature comparison table below
   - Highlighted "Most Popular" badge on Pro

7. **Social Proof**:
   - User testimonials in 2-column grid
   - Portfolio examples carousel
   - User count + template count stats

8. **Final CTA**:
   - Centered, bold headline
   - Single primary CTA
   - Trust indicators below (security, uptime, support)

**Images:**
- Hero: Animated mockup showcase (multiple portfolio templates rotating/morphing)
- Features: Icon illustrations (use Heroicons)
- How It Works: Screenshot mockups of platform interface
- Template Preview: Actual template thumbnails from the 1000-portfolio collection
- Testimonials: User avatar photos

### Template Gallery

**Layout:**
- Left sidebar (20% width): Filters and categories
- Main content (80% width): Template grid
- Sticky filter bar at top with search + active filters
- Template cards in responsive grid
- Each card shows live preview on hover

### Onboarding Flow

**Multi-step form:**
- Progress indicator at top (4 steps)
- Step 1: Basic info (Name, tagline, bio)
- Step 2: Profile photo upload (circular crop)
- Step 3: Category selection (visual cards)
- Step 4: Template selection (mini gallery)
- Large "Create Portfolio" button at final step

### User Dashboard

**Layout:**
- Left sidebar: Navigation (Dashboard, My Portfolio, Templates, Analytics, Settings)
- Main area: Stats overview + recent activity
- Quick actions: "Switch Template", "Edit Content", "View Live"
- Analytics charts showing visitor data

**Responsive:** Sidebar collapses to hamburger on mobile

---

## Key Differentiators

- **Dark Mode Excellence:** Every component designed dark-first, not adapted
- **Template Showcase:** Gallery uses actual live previews, not static screenshots
- **Progressive Complexity:** Simple signup → advanced customization available when needed
- **Visual Hierarchy:** Bold typography and generous spacing guide users naturally
- **Performance:** Skeleton states, lazy loading for 1000+ templates
- **Personality:** Vibrant accent colors and confident design language appeal to creative users