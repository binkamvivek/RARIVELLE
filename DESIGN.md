---
name: hermes-luxury-spec
version: 1.0.0
author: Design Lead
tokens:
  colors:
    primary: "#F37021"      # Iconic Hermès Orange
    background: "#FDFBF7"   # Warm, canvas-like off-white
    text: "#1C1B1A"         # Deep charcoal/soft black
    surface: "#FFFFFF"      # Pure white for content cards
    border: "#EAE6DF"       # Muted earth-toned separation borders
  typography:
    fontFamily:
      serif: "'Courier New', 'Courier', 'Georgia', serif"    # Editorial typewriter vibe
      sans: "'Helvetica Neue', 'Arial', sans-serif"          # Clean UI navigation
    fontSize:
      display: "2.5rem"
      body: "1rem"
---

# Hermès Visual Identity & Rationale

## Core Design Philosophy
The interface shifts away from rigid, hyper-optimized grid e-commerce layouts toward a narrative digital space. It balances deep editorial typography with ample white space, treating product grids like curated fine art gallery displays.

## Component Specifications

### 1. Navigation Header
- **Background:** Transparent shifting to {tokens.colors.background} on scroll.
- **Typography:** {tokens.colors.text}, uppercase case, letter-spacing tracking-widest.
- **Alignment:** Clean centered brand mark with minimalist left/right utility icons.

### 2. Product Showcase Grid
- **Layout:** Generous padding (padding: 4rem 2rem) with asymmetrical item placement.
- **Imagery:** High-fashion photography mixed cleanly with hand-drawn, lithographic sketches.
- **Borders:** Thin {tokens.colors.border} frame structures around item details.
