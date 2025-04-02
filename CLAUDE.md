# Important

All reference for current work is located in `./_context_library`. Use this to directory to understand:

- How to develop user tasks
- Current phase of work, and implementation progress
- Application design decisions (software, as well as UI/UX)

**Note:**

- All project management record keeping should be placed in `./_context_library`.
- This directory will be empty during your onboarding process.

### Onboarding Process

- Focuses primarily on discovery, and note taking in `./_context_library/DISCOVERY.md`.
- As you work on tasks, you will add implementation notes and progress updates to `./_context_library/PHASE{N}.md`.

### Planning Process

- Review `./_context_library/GOALS.md` to understand critical objectives for both Tauri app and core library
- Consult `./_context_library/DEVELOPMENT_PLAN.md` for overall development strategy
- Create detailed phase plans in `./_context_library/PHASE{N}.md` files

- For planning component development (React):
- ALWAYS use `./_context_library/STYLING_GUIDE.md` as your source of truth for styling
- Use Tailwind CSS v4 utility classes for component-specific styling
- App.css should contain:
  - Theme variables (@theme directive)
  - Reset styles and base element styling
  - Reusable UI patterns (buttons, cards, form elements)
  - DO NOT add page-specific or niche component styles to App.css
- Keep component files small and modular - use composition for reusability
- Use strongly typed TypeScript/TSX throughout

---

# About this project

We are working on MCP Guardian.

MCP Guardian is a tool to help govern and _firewall_ MCP servers.

The current implementation is:

- A core lib `./mcp-guardian-core`
- A MCP server proxy `./mcp-guardian-proxy`

The current interfaces are:

- A Tauri (Rust) based desktop application `./mcp-guardian`
- A CLI `./mcp-guardian-cli`

The scope of work primarily focuses on the Tauri application.

The documentation for MCP Guardian is located in `./docs`.

## Development Process

## Testing, Linting, and Validation

### Validation Scripts

The following validation scripts are available in package.json:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "tauri": "tauri",
  "typecheck": "tsc --noEmit",
  "lint:rust": "cd src-tauri && cargo clippy",
  "check:rust": "cd src-tauri && cargo check",
  "validate": "npm run typecheck && npm run check:rust && npm run lint:rust"
}
```

### Frontend (TypeScript/React)

- TypeCheck: `npm run typecheck` - Validate TypeScript types without emitting files
- Build: `npm run build` - Compile TypeScript and bundle the application

#### Components

Always aim to keep component files small and modular. We can not afford long files.

### Backend (Rust)

- Check: `npm run check:rust` - Validate Rust syntax without building
- Test: `cd src-tauri && cargo test` - Run Rust tests
- Clippy: `npm run lint:rust` - Run Rust linter for best practices and code quality

### Complete Validation

- Run TypeScript & Rust Checks: `npm run validate` - Run TypeScript checks and Rust linting/checking
- Run Full Build: `npm run build` - Verify that the application builds successfully

### After Code Changes

1. ALWAYS run `npm run validate` to check for type errors and code issues before committing
2. ALWAYS run `npm run build` to ensure the application builds successfully
3. Fix any type errors, linting warnings, or build errors before proceeding
4. Test the application with `npm run tauri dev` before committing changes
5. Add appropriate tests for new functionality

> **IMPORTANT**: Do not commit code that fails validation or doesn't build. Both the validate script and build must pass without errors.

## Code Style

- Use strongly typed TypeScript/TSX throughout
- Follow strict mode, no unused locals/parameters
- Use React 18 with functional components only
- Components should have explicit type definitions
- Error handling: use try/catch with appropriate user messages
- File naming: kebab-case for components, camelCase for utilities

## Development Status

- Current work is tracked in PHASE1.md (Core Infrastructure & Basic Application Flow)
- See PHASE_DOCS_GUIDE.md for guidelines on using phase documentation
- Update phase documents with progress notes and completed tasks
- Mark tasks with:
  - [ ] (not started)
  - [/] (in progress)
  - [x] (complete)
  - [-] (backlogged/deferred to future phase)
- Deprioritized features are tracked in BACKLOGGED.md

### Backlogging Process

- IMPORTANT: Always confirm with the user before backlogging any feature
- Only backlog non-critical features that can be deferred to future phases
- For each backlogged item:
  1. Mark it with [-] in the phase document
  2. Add detailed entry to BACKLOGGED.md with rationale
  3. Reference the backlogged status in phase progress notes

## Git Workflow

- Use Git for version control and tracking changes
- Make small, focused commits with descriptive messages
- Create feature branches for significant additions
- Use commits to document development progress
- IMPORTANT: This is a local repository only - DO NOT attempt to push to remote
- Run `git status` before commits to verify changes
- Consider using `git diff` to review changes before committing

## Playwright MCP Tool

You have access to the Playwright MCP Tool. Playwright MCP will launch Chrome browser with the new profile, located at `~/Library/Caches/ms-playwright/mcp-chrome-profile` on macOS. All the logged in information will be stored in that profile, you can delete it between sessions if you'd like to clear the offline state.

This MCP is setup to use: Snapshot Mode (default): Uses accessibility snapshots for better performance and reliability.

With playwright you can:
**Playwright MCP Browser Automation Tools:**
`browser_navigate(url)` • `browser_go_back()` • `browser_go_forward()` • `browser_click(element, ref)` • `browser_hover(element, ref)` • `browser_drag(startElement, startRef, endElement, endRef)` • `browser_type(element, ref, text, submit)` • `browser_select_option(element, ref, values[])` • `browser_choose_file(paths[])` • `browser_press_key(key)` • `browser_snapshot()` • `browser_save_as_pdf()` • `browser_take_screenshot(raw)` • `browser_wait(time)` • `browser_close()`

Use playwright to search the web for information, or use it to test the application (sparingly).

## ProjectManagement Guidelines

### ProjectManagement Files

- **./CLAUDE.md**: (ROOT LEVEL) Project-specific guidelines and commands
- **./\_context_library/GOALS.md**: Critical objectives for both Tauri app and enterprise core library
- **./\_context_library/DEVELOPMENT_PLAN.md**: Overall development strategy and phasing
- **./\_context_library/DISCOVERY.md**: Technical and business analysis of the project
- **./\_context_library/PHASE{N}.md**: Implementation notes for each development phase

### ProjectManagement Coordination Process

All project management record keeping should be placed in `./_context_library`.

1. **When starting a new task**:

   - Check PHASE{N}.md to understand task requirements and context
   - Use CLAUDE.md for coding standards and project conventions

2. **During implementation**:

   - Mark tasks as in-progress [/] in `./_context_library/PHASE{N}.md`
   - Create or update `./_context_library/CLAUDE_TROUBLESHOOT.md` when encountering issues
   - Reference appropriate documentation in code comments

3. **After completing a task**:
   - Mark tasks as complete [x] in `./_context_library/PHASE{N}.md`
   - Add implementation notes with timestamps
   - Update other documents if implementation deviates from plan

### When Adding Dependencies

1. Research thoroughly before adding new dependencies:

   - Use Playwright to check current stable versions
   - Verify compatibility with existing dependencies
   - Check required feature flags and configuration
   - Create small examples before full implementation

2. When encountering significant issues:
   - Document in `./_context_library/CLAUDE_TROUBLESHOOT.md` with detailed explanations
   - Include error messages, root causes, and resolutions
   - Note any workarounds or simplifications needed for MVP
