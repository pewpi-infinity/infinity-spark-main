# Planning Guide

A minimalist search-driven engine that transforms queries into knowledge, tokens, and optionally into full web pages - all through progressive, choice-based expansion rather than predetermined templates.

**Experience Qualities**: 
1. **Focused** - The interface begins with radical simplicity (just search) and reveals complexity only through user choices
2. **Generative** - Every search produces tangible outputs (knowledge + token) before asking for any commitment
3. **Transformative** - Content evolves from ephemeral results to permanent pages through deliberate progressive enhancement

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a multi-state application with search processing, LLM-driven content generation, token minting, progressive page building, file system management, and monetization logic. It requires sophisticated state management across search → results → page promotion → building workflows.

## Essential Features

### Minimalist Search Interface
- **Functionality**: Single search input on index page with "INFINITY" branding above it
- **Purpose**: Provides the singular entry point for all app functionality - search is the genesis action
- **Trigger**: Page load presents empty search field
- **Progression**: User sees "INFINITY" title → enters search query → submits → navigates to result page
- **Success criteria**: Index page contains zero UI elements beyond title and search input

### Semantic Search Processing
- **Functionality**: Takes user input and generates structured knowledge using LLM analysis
- **Purpose**: Transforms raw queries into actionable content and context
- **Trigger**: Search submission
- **Progression**: Query submitted → LLM analyzes intent and content → generates structured response → renders result page with content
- **Success criteria**: Every search produces coherent, relevant content based on query semantics

### Automatic Token Minting
- **Functionality**: Creates a unique token identifier for every search result
- **Purpose**: Provides proof-of-knowledge and collectible artifact for each query
- **Trigger**: Immediately upon search result generation
- **Progression**: Search completes → token minted with unique ID → displayed on result page → stored in KV
- **Success criteria**: Every search produces a permanent, retrievable token with metadata

### Ephemeral Result Display
- **Functionality**: Shows generated content in clean, readable format without commitment
- **Purpose**: Allows users to consume knowledge without building infrastructure
- **Trigger**: Search completion
- **Progression**: Content generated → rendered in reading view → token displayed → user can exit or proceed to building
- **Success criteria**: Results are immediately readable and require no further action to be valuable

### Progressive Page Promotion
- **Functionality**: Presents choice to convert ephemeral result into permanent page
- **Purpose**: Gates complexity behind user intent - only build what users want
- **Trigger**: User reviews result content
- **Progression**: Result displayed → "Build this into a page?" prompt shown → user accepts/declines → if accepted, shows progressive options
- **Success criteria**: Clear decision point that doesn't force page creation

### Choice-Driven Enhancement System
- **Functionality**: Sequential pop-up decisions for page features (charts, images, audio, video, navigation, monetization)
- **Purpose**: Lets users add only the features they need through explicit choices
- **Trigger**: User accepts page promotion
- **Progression**: Promotion accepted → series of feature choice dialogs → each "yes" adds capability → "no" moves to next option → build completes with selected features
- **Success criteria**: Pages contain only explicitly requested features, no bloat

### Intelligent Files Builder
- **Functionality**: Generates page structure, assets, and code based on selected features
- **Purpose**: Translates user choices into working page implementation without manual coding
- **Trigger**: User completes feature selection
- **Progression**: Choices collected → builder determines required assets → generates/retrieves files → assembles page structure → page becomes accessible
- **Success criteria**: Generated pages are functional and include only selected features

### Secondary Page Index
- **Functionality**: Maintains searchable catalog of promoted pages without cluttering main index
- **Purpose**: Provides discoverability for built pages while preserving index minimalism
- **Trigger**: Page promotion completion
- **Progression**: Page built → added to secondary index → grouped semantically → becomes searchable
- **Success criteria**: Main index remains minimal, built pages are discoverable via search

### Contextual Revenue Integration
- **Functionality**: Automatically injects ad placement zones into promoted pages
- **Purpose**: Monetizes content through semantically matched advertisements
- **Trigger**: Page promotion with monetization option selected
- **Progression**: Page structure determined → ad zones identified → semantic matching applied → ads rendered based on page content and user context
- **Success criteria**: Ads feel native to content, vary by user, match page semantics

## Edge Case Handling

- **Empty Search Query** - Show gentle prompt to enter a query before submission
- **Very Long Queries** - Accept and process, using LLM to extract core intent
- **Duplicate/Similar Searches** - Generate new token each time, link to previous results in secondary index
- **Page Build Cancellation** - Allow exit at any point during feature selection, preserve token and basic result
- **Failed Content Generation** - Gracefully show error, still mint token for query attempt
- **No Feature Selection** - If user declines all enhancements, create minimal content-only page
- **Search for Existing Page** - Show existing page in results, offer to view or rebuild

## Design Direction

The design should evoke **digital mysticism meets utilitarian power** - a sense that simple actions trigger profound generative processes. It should feel like discovering a hidden engine that transforms thoughts into tangible digital artifacts. The interface is calm and sparse initially, then reveals depth through thoughtful transitions and clear decision points.

## Color Selection

A **cosmic minimalist** palette with deep space tones and luminous accents, suggesting infinite possibility emerging from void.

- **Primary Color**: Deep cosmic indigo `oklch(0.25 0.08 270)` - represents the infinite void from which content emerges
- **Secondary Colors**: 
  - Near-black space `oklch(0.15 0.02 270)` for backgrounds - creates depth and focus
  - Soft slate `oklch(0.45 0.02 250)` for muted UI elements - unobtrusive structure
- **Accent Color**: Luminous cyan `oklch(0.75 0.15 200)` - attention-grabbing highlight for tokens, CTAs, and generated moments
- **Foreground/Background Pairings**: 
  - Background (Near-black space #1b1b24): Bright white text (#FFFFFF) - Ratio 15.8:1 ✓
  - Primary (Cosmic indigo #2d2a4a): White text (#FFFFFF) - Ratio 9.2:1 ✓
  - Accent (Luminous cyan #3dd4e8): Deep space text (#1b1b24) - Ratio 9.8:1 ✓

## Font Selection

Typography should feel **technical yet mystical** - combining the precision of code with the wonder of discovery.

- **Primary Font**: Space Grotesk - A geometric sans with technical character but warm personality, perfect for the brand name and key UI
- **Secondary Font**: JetBrains Mono - Monospace for tokens, IDs, and generated metadata - reinforces the "engine" nature
- **Typographic Hierarchy**: 
  - H1 (INFINITY Title): Space Grotesk Bold/56px/tight letter-spacing (0.02em) - commanding presence
  - H2 (Section Headers): Space Grotesk Medium/32px/normal spacing - clear delineation
  - H3 (Feature Options): Space Grotesk Regular/20px/relaxed (1.4) - comfortable reading
  - Body (Content): Space Grotesk Regular/16px/relaxed (1.6) - optimal readability
  - Token/IDs: JetBrains Mono Regular/14px/mono spacing - technical precision
  - Search Input: Space Grotesk Regular/24px/normal - substantial interaction

## Animations

Animations should emphasize **moments of generation and transformation** - the feeling that content is being synthesized, tokens are being forged, and pages are materializing. Micro-interactions should feel responsive and precise, while major transitions (search → result, result → page) should have ceremonial weight that acknowledges the creative act.

- Search submission triggers a subtle pulse/ripple that suggests processing depth
- Token minting includes a brief crystallization effect (scale + opacity)
- Feature selection choices provide satisfying confirmation (checkmark bloom)
- Page promotion shows a gentle fade-expand that represents elevation from temporary to permanent
- All transitions use easing that feels organic (ease-out for user-triggered, ease-in-out for system responses)

## Component Selection

- **Components**: 
  - Input (Search) - Primary interaction, enlarged and centered with custom styling
  - Card - For result content display, tokens, and feature selection options
  - Dialog - For progressive enhancement questions and build decisions
  - Button - For all CTAs, with distinct variants (primary for "build", secondary for "skip", ghost for navigation)
  - Badge - For token display, status indicators, and metadata tags
  - Separator - For visual structure in result pages
  - Accordion - For collapsible sections in complex generated content
  - Checkbox - For multi-feature selection if presented in grouped view
  - Tabs - For organizing built pages in secondary index
  - Progress - For showing build process completion
  
- **Customizations**: 
  - Custom token component with hexagonal or crystalline visual treatment
  - Search input with dramatic sizing and cosmic glow effect on focus
  - Dialog with backdrop blur for progressive enhancement choices
  - Custom page preview cards showing miniature versions of built pages
  
- **States**: 
  - Search input: default (subtle glow), focused (bright cyan ring + increased glow), processing (animated gradient border), completed (success pulse)
  - Buttons: default, hover (lift + brightness increase), active (press down), disabled (muted + no interaction)
  - Token display: minted (scale-in animation), collected (static with hover lift), viewable (cursor pointer)
  
- **Icon Selection**: 
  - MagnifyingGlass for search
  - Sparkle for token minting
  - PlusCircle for adding features
  - Check for confirmation
  - X for declining options
  - ChartBar for analytics features
  - Image for media options
  - SpeakerHigh for audio
  - VideoCamera for video
  - Files for file attachments
  - NavigationArrow for nav features
  - CurrencyDollar for monetization
  - Eye for viewing pages
  - ArrowRight for progression
  
- **Spacing**: 
  - Search container: py-32 (dramatic vertical centering on index)
  - Content sections: gap-8 for major sections, gap-4 for related items
  - Card padding: p-6 for standard cards, p-8 for feature cards
  - Button padding: px-6 py-3 for primary actions, px-4 py-2 for secondary
  - Token containers: p-4 with gap-3 for metadata rows
  
- **Mobile**: 
  - Search input scales down to 18px text, maintains full width
  - Progressive dialogs become bottom sheets (using Drawer component)
  - Feature selection presented as single-column checklist rather than grid
  - Token display stacks vertically with full-width cards
  - Secondary index uses vertical tabs instead of horizontal
  - All touch targets minimum 44px for comfortable tapping
