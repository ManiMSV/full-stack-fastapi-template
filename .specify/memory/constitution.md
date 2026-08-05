<!--
Sync Impact Report (v1.1.0 → v1.2.0)
- Version change: 1.1.0 → 1.2.0 (MINOR)
- Modified principles:
  - Title: Angular Frontend Migration Constitution → Full-Stack FastAPI Template
    Constitution (generalized to govern all project work)
  - Governance: added merge-gate and message-compliance expectations
- Added sections:
  - Development Workflow (VII. One Issue per Branch, VIII. Branch + PR Review
    Gate, IX. What/Where/How Messages)
- Removed sections: none
- Deferred TODOs: none
-->

# Full-Stack FastAPI Template Constitution

## Core Principles

### I. Frontend-Only Scope
Backend (FastAPI + SQLModel) is untouchable. The OpenAPI contract is the single source of truth between backend and frontend. No backend schema, endpoint, or behavior changes are permitted in this work.

### II. Big-Bang Rewrite
The React frontend is deleted and replaced by a fresh Angular project. No React/Angular coexistence. The Playwright E2E suite is the parity contract: test intent must survive, but selectors and DOM expectations may be updated for the new stack.

### III. Angular Idiom
Latest stable Angular (standalone components, signals, control flow) with @tanstack/angular-query for server state. Generated API client via ng-openapi-gen from `frontend/openapi.json`. No hand-written API clients.

### IV. UI Library
PrimeNG for widgets (forms, tables, dialogs, dropdowns, toasts). Custom layout shell (sidebar, header) is hand-built with Tailwind. A new design is acceptable; dark mode is still required via PrimeNG theme switching.

### V. Tooling Consistency
Biome remains the lint/format tool for the whole repository. ESLint may be added only for Angular template files if required. Vitest for unit tests. Angular CLI is the build system.

Browser and E2E testing MUST use agent-browser. Agent-browser is the tool for exploratory testing, dogfooding, QA, and any manual verification of the running application; no alternative browser automation is used for verification.

### VI. Spec Compliance
Every codebase modification, including refactors, fixes, and tooling changes, MUST be checked against the active feature spec (`specs/` directory, referenced by `.specify/feature.json`) before it is considered complete. If a change cannot be reconciled with the spec, the spec MUST be amended first (via the Spec Kit workflow); implementing past the spec is a violation.

Rationale: specs are the contract with stakeholders; drift accumulates silently unless every change is validated against them.

## Feature Parity

The rewritten frontend must preserve: login, signup, recover password, reset password, dashboard, items CRUD, admin user CRUD with data table (sort, paginate, search), user settings (profile, password, appearance), sidebar pending counts, dark mode, 404 page, loading and error states.

## Development Workflow

### VII. One Issue per Branch
Every change is tied to exactly one issue. A branch MUST never contain work for more than one issue, and unrelated changes (fixes, refactors, formatting) MUST NOT ride along — they are filed as their own issues. Multiple issues may be in flight in parallel, but each lives on its own branch.

Rationale: single-purpose branches keep reviews tractable, reverts clean, and history trustworthy.

### VIII. Branch + PR Review Gate
Every issue is worked on a dedicated branch named `issue/{number}-{short-slug}`. Merging into main happens ONLY through a pull request approved by the maintainer. If the maintainer has not reviewed, the work waits — there is no time-based override, self-approval, or direct push.

### IX. What/Where/How Messages
Every commit message and every PR body MUST state:
- What — the change that was made;
- Where — the files, modules, or components touched;
- How — the approach or mechanism used.

A message missing any of the three is incomplete and MUST be corrected before merge.

## Governance

- The Playwright E2E suite (8 spec files) must pass before the migration is considered complete.
- Unit tests (Vitest) required for auth service, theme service, and at least one CRUD feature.
- Lint and typecheck must be green at every phase boundary.
- Compliance review: at every phase boundary and before any commit, changes are verified against the active spec's functional requirements and success criteria. Unverified changes are not merged.
- At merge time the maintainer verifies: single-issue branch scope, branch naming (`issue/{number}-{short-slug}`), and What/Where/How completeness in the PR body and every commit message.
- Browser-level verification of implemented features uses agent-browser before sign-off.
- This constitution supersedes ad-hoc decisions; amendments require documentation and approval.

**Version**: 1.2.0 | **Ratified**: 2026-08-04 | **Last Amended**: 2026-08-05
