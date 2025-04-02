# Backlogged Features & Improvements

This document tracks features and improvements that have been deprioritized from current phases and moved to future development cycles. Each entry includes a rationale for backlogging and tentative phase assignment.

## UI & Component Library

### Accessibility Audit
- **Original Phase:** Phase 1 Interject
- **Tentative New Phase:** Phase 2
- **Rationale:** While accessibility is important, the Radix UI primitives already provide strong baseline accessibility. A full audit can be conducted after core functionality is complete.
- **Details:**
  - Comprehensive review of components for accessibility issues
  - Automated testing with tools like Axe or Lighthouse
  - Screen reader testing (NVDA, VoiceOver)
  - Documentation of accessibility features

### Component Unit Tests
- **Original Phase:** Phase 1 Interject
- **Tentative New Phase:** Phase 2
- **Rationale:** The component library is functioning well in actual usage. Unit tests will provide additional quality assurance but can be implemented after core application features are complete.
- **Details:**
  - React Testing Library implementation
  - Interaction testing (clicks, keyboard navigation)
  - Verification of accessibility attributes
  - Test coverage targets