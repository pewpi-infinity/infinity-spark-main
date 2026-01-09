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
- **Progression**: Result displayed → "Build this into a page?" prompt shown → user accepts/declines → if accepted, shows structure selection → then feature selection
- **Success criteria**: Clear decision point that doesn't force page creation

### Structure Selection System
- **Functionality**: Click-based cards presenting five page structure options: Read-only, Knowledge, Business, Tool/App, Multi-page Site
- **Purpose**: Lets users choose the intent and depth of their page through clear archetypes before diving into features
- **Trigger**: User accepts page promotion
- **Progression**: Promotion accepted → structure selection modal appears → user clicks one of five cards → structure preset applied → feature selection begins based on structure
- **Success criteria**: Structure choice is clear and visual, each option explains its purpose, selection feels decisive

### Choice-Driven Enhancement System
- **Functionality**: Sequential pop-up decisions for page features (charts, images, audio, video, files, widgets, navigation, monetization)
- **Purpose**: Lets users add only the features they need through explicit choices
- **Trigger**: User selects page structure
- **Progression**: Structure selected → series of feature choice dialogs → each "yes" adds capability → "no" moves to next option → build completes with selected features
- **Success criteria**: Pages contain only explicitly requested features, no bloat

### Intelligent Files Builder
- **Functionality**: Generates page structure, assets, and code based on selected features
- **Purpose**: Translates user choices into working page implementation without manual coding
- **Trigger**: User completes feature selection
- **Progression**: Choices collected → builder determines required assets → generates/retrieves files → assembles page structure → page becomes accessible as draft
- **Success criteria**: Generated pages are functional and include only selected features

### Real Page Publication System
- **Functionality**: Converts draft pages into live HTML files with permanent URLs through actual file creation and registry, verifies URL accessibility before declaring success
- **Purpose**: Transforms ephemeral content into real, shareable web pages with persistent URLs that actually work
- **Trigger**: User clicks "Publish Page" button on built page
- **Progression**: Publish initiated → HTML file generated with all selected features → metadata JSON created → page data stored in KV with file structure → URL verification attempted → if URL returns 200, marked as "Published" → if URL returns 404, marked as "Awaiting Pages Build" → live URL computed and displayed → user can view/share live page or download files
- **Success criteria**: Published pages have real URLs with verified accessibility, show correct status badge ("Published" with green checkmark only when URL verified, "Awaiting Pages Build" when pending), display live link, provide file structure view, allow file downloads, create proper /pages/{slug}/index.html structure

### Secondary Page Index
- **Functionality**: Maintains searchable catalog of built pages showing draft vs published status
- **Purpose**: Provides discoverability for built pages while preserving index minimalism
- **Trigger**: Page build completion (draft) or publication (live)
- **Progression**: Page built → added to secondary index as draft → when published, registry updated with URL → becomes fully discoverable
- **Success criteria**: Main index remains minimal, built pages are discoverable via index, published pages show live badges and URLs

### Contextual Revenue Integration
- **Functionality**: Automatically injects ad placement zones into promoted pages
- **Purpose**: Monetizes content through semantically matched advertisements
- **Trigger**: Page promotion with monetization option selected
- **Progression**: Page structure determined → ad zones identified → semantic matching applied → ads rendered based on page content and user context
- **Success criteria**: Ads feel native to content, vary by user, match page semantics

### Archive Search System
- **Functionality**: Comprehensive search across all existing tokens and pages with filtering and relevance scoring
- **Purpose**: Makes historical content discoverable and reusable without cluttering the main interface
- **Trigger**: User clicks "Search Archives" button on main search page or page index
- **Progression**: Archive search view opens → user enters search query → results filtered by type (all/tokens/pages) and promotion status → results ranked by relevance → user views individual tokens or pages
- **Success criteria**: Users can quickly find previously created tokens and pages, search highlights matching terms, filters work correctly

### Token Viewing
- **Functionality**: Dedicated view for individual token inspection showing query, content, metadata, promotion status, and analytics
- **Purpose**: Provides detailed access to token information, history, and engagement metrics
- **Trigger**: User selects a token from archive search results
- **Progression**: Token selected → dedicated view opens → view count incremented → displays full token details with analytics dashboard → user can share token → user can navigate back to search
- **Success criteria**: All token information is clearly displayed, promoted tokens show page link, analytics update on view, share tracking works

### Token Analytics Tracking
- **Functionality**: Automatic tracking of token engagement metrics including views, shares, promotions, and searches
- **Purpose**: Provides insight into token value and usage patterns
- **Trigger**: Various user interactions (viewing token, sharing, promoting to page, searching)
- **Progression**: User interaction occurs → corresponding analytics metric incremented → analytics persisted in KV → displayed in token view and search results
- **Success criteria**: Analytics accurately track engagement, display in readable format, persist across sessions

### Page Analytics Tracking
- **Functionality**: Automatic tracking of page metrics including views, edits, shares, and unique visitors
- **Purpose**: Shows page performance and engagement levels
- **Trigger**: Various user interactions (viewing page, editing, sharing)
- **Progression**: User interaction occurs → corresponding analytics metric incremented → analytics persisted in KV → displayed in page view and index
- **Success criteria**: Analytics accurately track all interactions, display in both compact and full dashboard formats, calculate engagement scores

### Analytics Dashboard
- **Functionality**: Visual display of token and page metrics with compact and full views
- **Purpose**: Makes engagement data accessible and understandable at a glance
- **Trigger**: User views token or page details, or browses search results
- **Progression**: Analytics data loaded → rendered as compact inline stats or full dashboard → shows total views, shares, promotions/edits, last viewed time, engagement score
- **Success criteria**: Metrics are clearly formatted, numbers abbreviated for large values (K/M), engagement score calculated correctly, compact view fits inline, full dashboard is comprehensive

## Edge Case Handling

- **Empty Search Query** - Show gentle prompt to enter a query before submission
- **Very Long Queries** - Accept and process, using LLM to extract core intent
- **Duplicate/Similar Searches** - Generate new token each time, link to previous results in secondary index
- **Structure Selection** - Present all five structure options visually, allow hover states, require explicit click to choose
- **Page Build Cancellation** - Allow exit at any point during structure or feature selection, preserve token and basic result
- **Failed Content Generation** - Gracefully show error, still mint token for query attempt
- **No Feature Selection** - If user declines all enhancements, create minimal content-only page based on structure
- **Publication Failure** - Show error toast, keep page in draft state, allow retry
- **URL Verification Failure** - Mark page as "Awaiting Pages Build" instead of "Published", show informative message about GitHub Pages build time
- **404 on Published URL** - System automatically checks URL accessibility, only shows "Published" status when URL returns 200
- **File Structure Display** - Show required /pages/{slug}/index.html path clearly, provide download option for published pages
- **Unpublished Pages** - Display "⚠️ Draft" badge, show publish button with explanation including file path
- **Published Pages** - Display "✅ Published" badge with checkmark only after URL verification, show live URL prominently, provide copy and open buttons
- **Awaiting Build Pages** - Display "⚠️ Awaiting Pages Build" badge, show expected URL, explain 2-3 minute build time, provide retry mechanism
- **URL Generation** - Compute URLs using GitHub Pages pattern: `https://pewpi-infinity.github.io/infinity-spark/pages/{slug}/` and verify with HEAD request
- **GitHub Pages Root Detection** - Automatically detect whether Pages is serving from / or /docs root and adjust file paths accordingly
- **Search for Existing Page** - Show existing page in results, offer to view or rebuild
- **Empty Archive Search** - Display message when no tokens or pages exist yet
- **No Archive Search Results** - Show helpful message when query matches nothing, suggest adjusting filters
- **Viewing Promoted Tokens** - Show link to associated page when viewing promoted token details, display promotion count in analytics
- **First Time Analytics** - Initialize analytics objects with zeros on first creation for tokens and pages
- **Analytics Display with Zero Values** - Show analytics dashboard even when metrics are zero to establish expectations
- **Compact Analytics in Lists** - Display abbreviated metrics inline in search results and index views
- **Share Tracking** - Increment share counter whether user uses native share or clipboard copy fallback

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
  - Eye for viewing pages and view counts
  - ArrowRight for progression
  - ShareNetwork for sharing functionality
  - TrendUp for analytics/engagement scores
  - Clock for last viewed timestamps
  - Users for unique visitor counts
  - PencilSimple for edit counts
  
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
