# Backlogged Features & Improvements

This document tracks features and improvements that have been deprioritized from current phases and moved to future development cycles. Each entry includes a rationale for backlogging and tentative phase assignment.

## PHASE4 Backlogged Items

### Message Rewriting Capabilities
- **Original Phase:** N/A (New idea)
- **Tentative New Phase:** PHASE5
- **Rationale:** This is a powerful feature that would enhance the guardian's capabilities, but requires significant changes to the message processing system and should be developed after the current migration work is complete.
- **Details:**
  - Add UI controls for manual message rewriting in pending messages view
  - Implement backend support for modifying messages before forwarding
  - Create a framework for automated/intelligent message transformation
  - Develop guard profiles that can automatically rewrite certain message types
  - Support for content filtering, redaction, and enhancement through rewriting
  - Consider privacy and security implications of message modification
  - Add comprehensive logging for all message modifications
  - Create templates for common rewriting scenarios

### Rust Core JSON Schema Validation
- **Original Phase:** PHASE4
- **Tentative New Phase:** PHASE5
- **Rationale:** The Monaco Editor implementation with frontend validation delivers immediate UX improvements. Backend validation would be valuable but requires significant work in the core libraries that would delay the user benefits of improved JSON editing.
- **Details:**
  - Implement JSON Schema validation in Rust core libraries
  - Create schema synchronization between frontend and backend
  - Add advanced validation rules (cross-entity references, etc.)
  - Enable server-side validation before persistence
  - Implement detailed error messaging between frontend and backend
  - Consider using crates like `jsonschema` or `valico` for Rust validation

## Phase 2 Backlogged Items

### Responsive Header Optimization
- **Original Phase:** Phase 2
- **Tentative New Phase:** Phase 3
- **Rationale:** While the current header implementation works well for standard desktop sizes, additional optimization for smaller screens would improve the mobile experience. Backlogged due to budget constraints in Phase 2.
- **Details:**
  - Create mobile-specific layout for header navigation
  - Implement collapsible menu for small screens
  - Adjust spacing and text size for better mobile readability
  - Test across standard mobile breakpoints

### Advanced Theme Accessibility
- **Original Phase:** Phase 2
- **Tentative New Phase:** Phase 3
- **Rationale:** Basic accessibility is implemented through Radix UI primitives, but more comprehensive testing and improvements would enhance the application for all users. Backlogged due to time constraints.
- **Details:**
  - Conduct comprehensive contrast testing in both themes
  - Enhance keyboard navigation patterns
  - Improve focus state visibility
  - Add additional ARIA attributes for theme-specific elements

### Component-Specific Theme Refinements
- **Original Phase:** Phase 2
- **Tentative New Phase:** Phase 3
- **Rationale:** While core components work in both themes, some edge cases and component combinations could benefit from theme-specific adjustments. Backlogged to focus on delivering core functionality.
- **Details:**
  - Review and refine all form component dark mode styles
  - Enhance data visualization components in dark mode
  - Create theme-specific adjustments for complex UI patterns
  - Address edge cases for component combinations

### Theme Transition Performance
- **Original Phase:** Phase 2
- **Tentative New Phase:** Future optimization
- **Rationale:** Current theme transitions work but could be optimized for performance on lower-end devices. Backlogged as the current implementation meets basic requirements.
- **Details:**
  - Optimize CSS transition properties for better performance
  - Consider hardware acceleration for smoother animations
  - Reduce transition flash on initial page load
  - Explore selective transitions for critical elements only

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

### Error Handling Improvements
- **Original Phase:** Phase 1
- **Tentative New Phase:** Phase 2
- **Rationale:** The basic error handling functionality works well, but more detailed error messages and recovery suggestions would be enhancements rather than critical fixes.
- **Details:**
  - Create more descriptive error messages
  - Add recovery suggestions for common errors
  - Create error code reference system
  - Implement contextual error handling

## Phase 3 Backlogged Items

### Checkbox and Radio Button Styling
- **Original Phase:** Phase 3
- **Tentative New Phase:** Future enhancement (if needed)
- **Rationale:** After reviewing the codebase, we found that the application doesn't currently use checkboxes or radio buttons in any forms. While we have a checkbox component defined, it's not being used anywhere. This task is backlogged until these form elements are actually needed in the application.
- **Details:**
  - Create cyberpunk-styled checkbox component with glow effects
  - Implement angular radio button with cyberpunk aesthetic
  - Ensure both components maintain accessibility
  - Add animation for state changes

### Data Visualization Component Enhancement
- **Original Phase:** Phase 3
- **Tentative New Phase:** Future styling phase
- **Rationale:** While enhancing data visualization components would improve the aesthetic, the current components are functional and meet the immediate needs. This task is backlogged to prioritize view transitions for a more immediate impact on user experience.
- **Details:**
  - Apply cyberpunk styling to charts and graphs
  - Add subtle glow effects to data points
  - Create neon accent colors for different data series
  - Implement angular styling for chart containers

### Tooltip and Notification Styling
- **Original Phase:** Phase 3
- **Tentative New Phase:** Future styling phase
- **Rationale:** The current tooltip and notification systems are functional but lack the cyberpunk aesthetic. This enhancement would be nice to have but is not critical for the current phase.
- **Details:**
  - Create cyberpunk-styled tooltips with angular corners
  - Add subtle glow effects to notifications
  - Implement animated transitions for tooltips and notifications
  - Ensure consistent styling with other cyberpunk components

### Performance Testing and Optimization
- **Original Phase:** Phase 3
- **Tentative New Phase:** Future optimization phase
- **Rationale:** While performance is important, the current implementation appears to perform well on standard devices. A dedicated optimization phase would be more effective once all styling features are in place.
- **Details:**
  - Test performance across different devices and browsers
  - Optimize animations and transitions for lower-end devices
  - Reduce unnecessary re-renders in complex components
  - Implement performance monitoring metrics

### Enhanced Page Transitions
- **Original Phase:** Phase 3
- **Tentative New Phase:** Future enhancement phase
- **Rationale:** Multiple approaches to page transitions were attempted but ultimately removed in favor of direct page switching for a clean, native desktop application feel. The more complex transitions resulted in visual inconsistencies that detracted from the professional experience.
- **Details:**
  - Research hardware-accelerated animation techniques
  - Explore canvas-based transitions that avoid DOM reflow issues
  - Consider simpler cross-fades with better performance characteristics
  - Investigate native desktop application transition patterns
  - Test extensively across different performance profiles