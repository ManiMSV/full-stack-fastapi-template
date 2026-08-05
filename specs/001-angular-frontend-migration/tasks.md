# Tasks: Angular Frontend Migration

**Input**: Design documents from `/specs/001-angular-frontend-migration/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), constitution.md (v1.1.0)

**Tests**: Included. Constitution v1.1.0 mandates Vitest unit tests (auth, theme, one CRUD feature) and the Playwright E2E suite is the parity contract (8 spec files, selectors may be updated).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app: `frontend/` (Angular project root), `frontend/src/app/` (application code), `frontend/tests/` (Playwright suite)
- React remnants live in `frontend/src/` until removed in Phase 1
- Backend is untouched (constitution principle I)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fresh Angular project replaces React; tooling configured

- [X] T001 Scaffold fresh Angular project in `frontend/` with `ng new` (standalone components, signals, latest stable, Vite/esbuild builder), reusing existing `frontend/index.html`, `frontend/public/`
- [X] T002 Remove React sources: `frontend/src/client/`, `frontend/src/components/`, `frontend/src/hooks/`, `frontend/src/routes/`, `frontend/src/lib/`, `frontend/src/main.tsx`, `frontend/src/routeTree.gen.ts`, `frontend/vite.config.ts`, `frontend/openapi-ts.config.ts`, `frontend/components.json`; keep `frontend/openapi.json`, `frontend/tests/`, `frontend/playwright.config.ts`
- [X] T003 Install and configure PrimeNG (Aura theme, light/dark presets) + Tailwind + @tanstack/angular-query in `frontend/package.json`, `frontend/angular.json`
- [X] T004 [P] Configure Biome for Angular sources (TS/HTML) in `frontend/biome.json` and repo root `biome.json`, ignore `frontend/dist/`
- [X] T005 [P] Configure Vitest unit testing in `frontend/angular.json` (test builder) and `frontend/vitest.config.ts`
- [X] T006 [P] Configure ng-openapi-gen: npm script `generate-client` and `frontend/ng-openapi-gen.json` outputting to `frontend/src/app/core/api/`
- [X] T007 Verify scaffold: `ng build` succeeds, `ng test` smoke test passes, `biome check` clean in `frontend/`

**Checkpoint**: Angular project builds and tests; React sources gone

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Generate Angular API services with `ng-openapi-gen` from `frontend/openapi.json` into `frontend/src/app/core/api/` (regenerate via `scripts/generate-client.sh` if stale)
- [X] T009 Implement auth service in `frontend/src/app/core/auth.service.ts` (token storage in localStorage, login/logout/me, session signal)
- [ ] T010 [P] Implement HTTP interceptor in `frontend/src/app/core/auth.interceptor.ts` (attach Bearer token, on 401 clear session and redirect to `/login`)
- [ ] T011 [P] Implement theme service in `frontend/src/app/core/theme.service.ts` (light/dark signal, localStorage persistence, applies PrimeNG dark theme class)
- [ ] T012 Implement auth guard and route skeleton in `frontend/src/app/app.routes.ts` (lazy-loaded feature routes, protected routes, wildcard -> 404, root redirect)
- [ ] T013 Build layout shell in `frontend/src/app/shared/layout/` (sidebar with nav entries and pending-count placeholders, header, `<router-outlet>`)
- [ ] T014 [P] Build shared UI states in `frontend/src/app/shared/ui/` (loading spinner, error state with retry, empty state)
- [ ] T015 Update Playwright harness in `frontend/tests/auth.setup.ts` and `frontend/tests/config.ts` (new app URL/route assumptions, storage key names)
- [ ] T016 Build 404 page in `frontend/src/app/shared/layout/not-found/not-found.component.ts` wired to wildcard route

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication flows (Priority: P1) 🎯 MVP

**Goal**: Signup, login, recover, and reset flows fully working with session persistence and route protection

**Independent Test**: Playwright specs `login.spec.ts`, `sign-up.spec.ts`, `reset-password.spec.ts` pass; unauthenticated visits redirect to login

### Tests for User Story 1 ⚠️

- [ ] T022 [P] [US1] Write Vitest unit tests for auth service (token persistence, login/logout, 401 handling) in `frontend/src/app/core/auth.service.spec.ts`
- [ ] T023 [US1] Update E2E specs `frontend/tests/login.spec.ts`, `frontend/tests/sign-up.spec.ts`, `frontend/tests/reset-password.spec.ts` (PrimeNG selector/DOM updates, intent unchanged)

### Implementation for User Story 1

- [ ] T017 [P] [US1] Implement login page in `frontend/src/app/features/auth/login/login.component.ts` (PrimeNG form, validation, error display)
- [ ] T018 [P] [US1] Implement signup page in `frontend/src/app/features/auth/signup/signup.component.ts` (validation matching current rules, auto-login on success)
- [ ] T019 [P] [US1] Implement recover-password page in `frontend/src/app/features/auth/recover-password/recover-password.component.ts`
- [ ] T020 [P] [US1] Implement reset-password page in `frontend/src/app/features/auth/reset-password/reset-password.component.ts`
- [ ] T021 [US1] Wire guard + redirects: protected routes redirect to `/login`, successful login lands on dashboard, logout clears session (depends on T009, T012)
- [ ] T024 [US1] Verify auth flows in browser with agent-browser (login, signup, recover, reset, logout, session expiry) and run constitution spec-compliance check against FR-001..FR-003, SC-003

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (auth E2E specs green)

---

## Phase 4: User Story 2 - Items management (Priority: P1)

**Goal**: Create, read, update, delete items with client-side validation

**Independent Test**: Playwright spec `items.spec.ts` passes

### Tests for User Story 2 ⚠️

- [ ] T029 [P] [US2] Write Vitest unit tests for items feature service (list, create, update, delete) in `frontend/src/app/features/items/items.service.spec.ts`
- [ ] T030 [US2] Update E2E spec `frontend/tests/items.spec.ts` (PrimeNG selector/DOM updates, intent unchanged)

### Implementation for User Story 2

- [ ] T025 [US2] Implement items data service in `frontend/src/app/features/items/items.service.ts` (TanStack Angular Query queries/mutations, invalidation)
- [ ] T026 [US2] Implement items list page in `frontend/src/app/features/items/items-list/items-list.component.ts` (table, loading/error/empty states)
- [ ] T027 [US2] Implement create-item dialog in `frontend/src/app/features/items/add-item/add-item.component.ts` (PrimeNG dialog + form, inline validation, duplicate-submit guard)
- [ ] T028 [US2] Implement edit + delete item in `frontend/src/app/features/items/edit-item/edit-item.component.ts` and delete confirm dialog (depends on T027)
- [ ] T031 [US2] Verify items flows in browser with agent-browser (create, edit, delete, invalid submission) and run constitution spec-compliance check against FR-004

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently (items E2E spec green)

---

## Phase 5: User Story 3 - Admin user management (Priority: P2)

**Goal**: Admins search, sort, paginate, create, edit, delete users

**Independent Test**: Playwright spec `admin.spec.ts` passes

### Tests for User Story 3 ⚠️

- [ ] T036 [US3] Update E2E spec `frontend/tests/admin.spec.ts` (PrimeNG table/dialog selector updates, intent unchanged)

### Implementation for User Story 3

- [ ] T032 [US3] Implement admin users data service in `frontend/src/app/features/admin/admin.service.ts` (query with search/sort/page params, mutations)
- [ ] T033 [US3] Implement user table in `frontend/src/app/features/admin/user-table/user-table.component.ts` (PrimeNG Table: search, sort, pagination)
- [ ] T034 [US3] Implement add-user dialog in `frontend/src/app/features/admin/add-user/add-user.component.ts` (validation, inline errors)
- [ ] T035 [US3] Implement edit + delete user in `frontend/src/app/features/admin/edit-user/edit-user.component.ts` and delete confirm dialog, guard against admin deleting own account (depends on T034)
- [ ] T037 [US3] Verify admin flows in browser with agent-browser (search, sort, paginate, add, edit, delete, self-delete guard) and run constitution spec-compliance check against FR-005

**Checkpoint**: All user stories so far independently functional (admin E2E spec green)

---

## Phase 6: User Story 4 - User settings (Priority: P2)

**Goal**: Profile, password, and appearance settings persist across reloads

**Independent Test**: Playwright spec `user-settings.spec.ts` passes

### Tests for User Story 4 ⚠️

- [ ] T041 [US4] Update E2E spec `frontend/tests/user-settings.spec.ts` (PrimeNG selector updates, intent unchanged)

### Implementation for User Story 4

- [ ] T038 [US4] Implement profile update form in `frontend/src/app/features/settings/profile/profile.component.ts` (name, email; persist and reflect after reload)
- [ ] T039 [US4] Implement password change form in `frontend/src/app/features/settings/password/password.component.ts`
- [ ] T040 [US4] Implement appearance settings in `frontend/src/app/features/settings/appearance/appearance.component.ts` (theme toggle wiring theme service, persists across reloads, applies to all pages)
- [ ] T042 [US4] Verify settings flows in browser with agent-browser (profile update, password change + re-login, theme toggle + reload persistence) and run constitution spec-compliance check against FR-006, FR-007, SC-004

**Checkpoint**: User Story 4 independently functional (user-settings E2E spec green)

---

## Phase 7: User Story 5 - Navigation shell and dashboard (Priority: P2)

**Goal**: Sidebar with live pending counts, dashboard landing, friendly 404, responsive behavior

**Independent Test**: Manual navigation walk; pending counts match API data; 404 on unknown URL; existing E2E suites still green

### Implementation for User Story 5

- [ ] T043 [US5] Wire live pending counts in sidebar in `frontend/src/app/shared/layout/sidebar/` (TanStack Query for pending items/users, invalidate on CRUD changes)
- [ ] T044 [US5] Implement dashboard landing page in `frontend/src/app/features/dashboard/dashboard.component.ts` (post-login landing per spec)
- [ ] T045 [US5] Implement responsive sidebar behavior in `frontend/src/app/shared/layout/sidebar/` (collapse on small screens, active state highlighting)
- [ ] T046 [US5] Verify shell in browser with agent-browser (nav all entries, active states, pending counts update after changes, unknown URL -> 404, small viewport) and run constitution spec-compliance check against FR-008, FR-010

**Checkpoint**: All user stories independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Deployment, docs, and full-suite validation

- [ ] T047 Update `frontend/Dockerfile` for Angular output (`frontend/dist/<project>/browser`) with SPA fallback; update `compose.yml` and CI workflows where frontend build/test commands change
- [ ] T048 Update `README.md` and `development.md` frontend commands (dev/build/test/generate-client)
- [ ] T049 Run full Playwright E2E suite in `frontend/tests/` until all 8 spec files pass
- [ ] T050 Run Biome lint + typecheck across repo; fix all findings
- [ ] T051 Full agent-browser verification pass across the app (auth, items, admin, settings, theme, 404) and final constitution spec-compliance sign-off (FR-001..FR-012, SC-001..SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (uses shared auth)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Uses live data only, no cross-story code dependencies

### Within Each User Story

- Tests (where included) MUST be written and FAIL before implementation
- Service before page before dialog
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Auth pages T017-T020 are independent files and can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all auth pages for User Story 1 together:
Task: "Implement login page in frontend/src/app/features/auth/login/login.component.ts"
Task: "Implement signup page in frontend/src/app/features/auth/signup/signup.component.ts"
Task: "Implement recover-password page in frontend/src/app/features/auth/recover-password/recover-password.component.ts"
Task: "Implement reset-password page in frontend/src/app/features/auth/reset-password/reset-password.component.ts"

# Launch tests for User Story 1 together:
Task: "Write Vitest unit tests for auth service in frontend/src/app/core/auth.service.spec.ts"
Task: "Update E2E specs frontend/tests/login.spec.ts, frontend/tests/sign-up.spec.ts, frontend/tests/reset-password.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (auth)
4. **STOP and VALIDATE**: Auth E2E specs + agent-browser verification
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (auth) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (items) → Test independently → Deploy/Demo
4. Add User Story 3 (admin) → Test independently → Deploy/Demo
5. Add User Story 4 (settings) → Test independently → Deploy/Demo
6. Add User Story 5 (shell) → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- After each task or logical group: STOP and wait for author approval of the code before committing. Once approved: commit, raise the PR, then let the author manually approve and merge it. Never commit, push, or open/merge a PR without explicit author approval.
- Stop at any checkpoint to validate story independently
- Constitution v1.1.0 principle VI: after every task, check the change against `specs/001-angular-frontend-migration/spec.md`; amend spec before deviating
- agent-browser (constitution V) is the browser-verification tool for all verification tasks
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
