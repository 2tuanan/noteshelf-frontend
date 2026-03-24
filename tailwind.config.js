/** @type {import('tailwindcss').Config} */
// =============================================================================
// NOTESHELF — WARM MINIMAL DESIGN TOKEN SYSTEM
// =============================================================================
//
// SEMANTIC TOKEN REFERENCE
// ─────────────────────────────────────────────────────────────────────────────
// SURFACES
//   bg-surface             / dark:bg-dark          — page background
//   bg-surface-raised      / dark:bg-dark-raised   — card / panel background
//   bg-surface-overlay     / dark:bg-dark-overlay  — popover / modal bg
//   bg-surface-inset       / dark:bg-dark-inset    — input bg, sunken areas
//
// TEXT
//   text-ink               / dark:text-ink-inverse            — primary body text
//   text-ink-secondary     / dark:text-ink-inverse-secondary  — muted / supporting
//   text-ink-tertiary      / dark:text-ink-inverse-tertiary   — placeholders, captions
//
// ACCENT  (#F3B114)
//   bg-accent / text-accent          — primary brand color
//   bg-accent-hover                  — button hover state
//   bg-accent-pressed                — button active/click state
//   bg-accent-subtle                 — very light tint (AI badge bg)
//   text-accent-fg                   — warm ink text on accent background
//
// BORDERS
//   border-border          / dark:border-dark-border          — standard border
//   border-border-subtle   / dark:border-dark-border-subtle   — section dividers
//
// SHADOWS
//   shadow-card            / dark:shadow-card-dark   — note cards
//   shadow-elevated        / dark:shadow-elevated-dark — dropdowns, tooltips
//   shadow-panel                                      — AI panel, modal
//   shadow-focus                                      — focus ring (amber glow)
//
// RADIUS
//   rounded-card   (12px)  — note cards
//   rounded-panel  (16px)  — AI panels, modals, drawers
//   rounded-button (8px)   — standard buttons
//   rounded-input  (8px)   — text inputs, selects
//   rounded-badge  (full)  — pill tags / badges
//
// SPACING TOKENS  (p-{token}, m-{token}, gap-{token})
//   card-x / card-y        — note card h/v padding
//   section                — gap between page sections
//   btn-x / btn-y          — standard button padding
//   btn-sm-x / btn-sm-y    — small button padding
//   input-x / input-y      — input field padding
//   header                 — header bar height (64px)
//   panel-x / panel-y      — AI panel / drawer inner padding
//
// TYPOGRAPHY SCALE  (text-{scale})
//   display    36px / 700  — hero titles
//   heading    24px / 600  — section headers, page titles
//   subheading 18px / 600  — card titles, subsections
//   body       14px / 400  — default body copy
//   small      13px / 400  — meta info, timestamps
//   caption    12px / 400  — labels, badge text
// =============================================================================

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {

      // ── Fonts ─────────────────────────────────────────────────────────────
      fontFamily: {
        mclaren:    ['McLaren', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },

      // ── Color Tokens ──────────────────────────────────────────────────────
      colors: {

        // Primary brand accent — amber/orange family (centered on #F3B114)
        accent: {
          50:      '#FFFBEB',
          100:     '#FEF3C7',
          200:     '#FDE68A',
          subtle:  '#FEF9EE',  // very light tint: AI badge bg, tag highlights
          DEFAULT: '#F3B114',  // ★ exact brand color
          hover:   '#E0A212',  // button :hover
          pressed: '#C9900F',  // button :active
          fg:      '#1A1714',  // text/icon color ON accent background
        },

        // Surface — light mode (soft cream / warm white)
        surface: {
          DEFAULT: '#FAFAF7',  // page canvas — warm white (not pure #fff)
          raised:  '#FFFFFF',  // cards, modals, panels sit on this
          overlay: '#FFF8F0',  // popovers, dropdowns — warm tint
          inset:   '#F3EFE7',  // search input bg, sidebar, code blocks
        },

        // Surface — dark mode (warm slate — NOT cold gray-900)
        dark: {
          DEFAULT:         '#1E1C1A',  // page canvas — warm near-black
          raised:          '#272421',  // cards, panels
          overlay:         '#302C28',  // dropdowns, tooltips, modals
          inset:           '#3A3530',  // input bg, nested areas
          border:          '#3D3834',  // standard border in dark mode
          'border-subtle': '#2D2A27',  // very low-contrast section divider
        },

        // Text / Ink
        ink: {
          DEFAULT:              '#1A1714',  // light: primary body copy
          secondary:            '#706B65',  // light: muted / supporting
          tertiary:             '#9C9792',  // light: placeholders, captions
          inverse:              '#F5F0E8',  // dark: primary body copy
          'inverse-secondary':  '#A39D96',  // dark: muted / supporting
          'inverse-tertiary':   '#6B6560',  // dark: placeholders, captions
        },

        // Borders — light mode
        border: {
          DEFAULT: '#E0D9CE',  // standard component border
          subtle:  '#EDE9E1',  // very low-contrast section dividers
          strong:  '#C8C0B0',  // emphasized border (focused card outline)
        },

        // Tag / badge palette — warm-adjusted
        tag: {
          blue:          '#DBEAFE',
          'blue-text':   '#1D4ED8',
          green:         '#D1FAE5',
          'green-text':  '#065F46',
          purple:        '#EDE9FE',
          'purple-text': '#6D28D9',
          amber:         '#FEF3C7',
          'amber-text':  '#B45309',
          pink:          '#FCE7F3',
          'pink-text':   '#9D174D',
        },

        // Status (keep standard for clarity)
        success: '#22C55E',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },

      // ── Border Radius ──────────────────────────────────────────────────────
      borderRadius: {
        card:   '12px',    // note cards — main content container
        panel:  '16px',    // AI chat panel, modals, full-page drawers
        button: '8px',     // standard CTA / action buttons
        input:  '8px',     // text inputs, textareas, selects
        badge:  '9999px',  // pill tags and badges (full pill)
      },

      // ── Box Shadows — subtle only, no heavy drops ───────────────────────────
      boxShadow: {
        // Light mode — warm tint on shadows (use ink color base, not pure black)
        card:     '0 1px 3px 0 rgba(26, 23, 20, 0.07), 0 1px 2px -1px rgba(26, 23, 20, 0.05)',
        elevated: '0 4px 12px 0 rgba(26, 23, 20, 0.10), 0 2px 4px -2px rgba(26, 23, 20, 0.06)',
        panel:    '0 8px 24px 0 rgba(26, 23, 20, 0.12), 0 4px 8px -4px rgba(26, 23, 20, 0.08)',
        // Dark mode — deeper but still restrained
        'card-dark':     '0 1px 4px 0 rgba(0, 0, 0, 0.32), 0 1px 2px -1px rgba(0, 0, 0, 0.24)',
        'elevated-dark': '0 4px 14px 0 rgba(0, 0, 0, 0.42), 0 2px 4px -2px rgba(0, 0, 0, 0.30)',
        'panel-dark':    '0 8px 28px 0 rgba(0, 0, 0, 0.50), 0 4px 8px -4px rgba(0, 0, 0, 0.36)',
        // Focus ring — amber glow matching accent
        focus:    '0 0 0 3px rgba(243, 177, 20, 0.35)',
        none:     'none',
      },

      // ── Typography Scale ───────────────────────────────────────────────────
      // Format: [fontSize, { lineHeight, letterSpacing, fontWeight }]
      fontSize: {
        display:    ['2.25rem',   { lineHeight: '2.75rem',  letterSpacing: '-0.02em', fontWeight: '700' }],
        heading:    ['1.5rem',    { lineHeight: '2rem',     letterSpacing: '-0.01em', fontWeight: '600' }],
        subheading: ['1.125rem',  { lineHeight: '1.75rem',  letterSpacing: '0em',     fontWeight: '600' }],
        body:       ['0.875rem',  { lineHeight: '1.5rem',   letterSpacing: '0em',     fontWeight: '400' }],
        small:      ['0.8125rem', { lineHeight: '1.25rem',  letterSpacing: '0em',     fontWeight: '400' }],
        caption:    ['0.75rem',   { lineHeight: '1rem',     letterSpacing: '0.01em',  fontWeight: '400' }],
      },

      // ── Spacing Tokens ─────────────────────────────────────────────────────
      // Use with: p-{token}, px-{token}, gap-{token}, h-{token}, etc.
      spacing: {
        'card-x':    '16px',  // note card horizontal padding
        'card-y':    '14px',  // note card vertical padding
        'section':   '32px',  // gap between major page sections
        'btn-x':     '16px',  // standard button horizontal padding
        'btn-y':     '8px',   // standard button vertical padding
        'btn-sm-x':  '12px',  // small button horizontal padding
        'btn-sm-y':  '6px',   // small button vertical padding
        'input-x':   '12px',  // input field horizontal padding
        'input-y':   '10px',  // input field vertical padding
        'header':    '64px',  // fixed header bar height
        'panel-x':   '20px',  // AI panel / drawer horizontal padding
        'panel-y':   '16px',  // AI panel / drawer vertical padding
      },

    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
