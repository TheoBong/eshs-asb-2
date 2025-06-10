# ESHS ASB Universal Theme Guide

This document explains how to apply the universal theme consistently across all pages in the ESHS ASB website (except the home page).

## Basic Theme Principles

1. **Dark Mode by Default**: The website uses a dark theme as its base. This is applied using the CSS class `dark` on the HTML tag.

2. **School Colors**:
   - Primary: ESHS Blue (#1e88e5)
   - Secondary: ESHS Gold (#f9c74f)

3. **Page-Specific Accent Colors**:
   - Theater pages: Amber/Orange
   - Shop pages: Blue
   - Activities pages: Green
   - Information pages: Purple

## Component Usage

### Recommended Components

Use these themed components from `@/components/ThemedComponents.tsx`:

```tsx
// Import the components
import { 
  ThemedPageWrapper, 
  PrimaryButton, 
  SecondaryButton, 
  OutlineButton,
  ThemedCard,
  ThemedTopBar
} from "@/components/ThemedComponents";

// Page wrapper (controls the background gradient)
<ThemedPageWrapper pageType="theater">
  {/* Your page content */}
</ThemedPageWrapper>

// Buttons
<PrimaryButton>Blue Button</PrimaryButton>
<SecondaryButton>Gold Button</SecondaryButton>
<OutlineButton>Outline Button</OutlineButton>

// Cards
<ThemedCard>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Your card content here
  </CardContent>
</ThemedCard>
```

// Top Bar (for consistent page headers and back navigation)
// Place this at the top of your page content, inside ThemedPageWrapper
<ThemedTopBar title="Page Title Here" />
// To hide the back button (e.g., for a main section page):
<ThemedTopBar title="Section Home" showBackButton={false} />

### CSS Classes

You can also use these CSS classes directly:

```tsx
// Button styles
<Button className="btn-primary">Blue Button</Button>
<Button className="btn-secondary">Gold Button</Button>
<Button variant="outline" className="btn-outline">Outline Button</Button>

// Card styles
<Card className="card-themed">Card Content</Card>

// Theater-specific
<Button className="theater-action">Theater Action</Button>
<div className="theater-accent">Theater Accent Element</div>
```

## Page Backgrounds

Each page type has a unique gradient background:

```tsx
<ThemedPageWrapper pageType="default"> // Black base
<ThemedPageWrapper pageType="theater"> // Black to amber/brown gradient
<ThemedPageWrapper pageType="shop"> // Black to blue gradient
<ThemedPageWrapper pageType="activities"> // Black to green gradient
<ThemedPageWrapper pageType="information"> // Black to purple gradient
```

## General Guidelines

1. Use the school blue color for primary actions
2. Use the school gold color for secondary/highlight actions
3. Use dark backgrounds with light text
4. Apply consistent spacing and typography
5. Wrap each page in the appropriate `ThemedPageWrapper`.
6. Add a `ThemedTopBar` to each page, immediately inside the `ThemedPageWrapper`.
7. Use `ThemedCard` for content containers to get rounded corners and blur effects.

By following this guide, we ensure a unified and professional look across the entire website.


db.createUser(
  {
    user: "tester",
    pwd:  "tester123",   // or cleartext password
    roles: [ { role: "readWrite", db: "test" }]
  }
)