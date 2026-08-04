# Feature Specification: Angular Frontend Migration

**Feature Branch**: `001-angular-frontend-migration`

**Created**: 2026-08-04

**Status**: Draft

**Input**: User description: "Replace the React frontend with Angular. Keep full feature parity, new design acceptable, dark mode required. Backend untouched."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authentication flows (Priority: P1)

Users sign up, log in, recover, and reset their passwords exactly as today. These flows gate every other part of the application, so they are the first complete vertical slice.

**Why this priority**: Without authentication no other feature is reachable; it exercises routing, forms, validation, API calls, and token persistence end to end.

**Independent Test**: Run the auth Playwright specs (login, sign-up, reset-password, and the auth setup used by other suites) against the new frontend; all must pass.

**Acceptance Scenarios**:

1. **Given** a new user with valid details, **When** they complete signup, **Then** they are logged in and land on the dashboard
2. **Given** an existing user, **When** they submit valid credentials on the login form, **Then** they are authenticated and routed to the dashboard
3. **Given** an unauthenticated visitor on any protected page, **When** the page loads, **Then** they are redirected to the login page
4. **Given** a logged-out user who forgot their password, **When** they request a reset link and set a new password, **Then** they can log in with the new password
5. **Given** a logged-in user, **When** they log out, **Then** their session is cleared and they return to the login page

---

### User Story 2 - Items management (Priority: P1)

Users create, view, edit, and delete items, with the same behaviors and validations as the current application.

**Why this priority**: Items CRUD is the core demonstration feature of the application and the second full CRUD vertical slice.

**Independent Test**: Run the items Playwright spec; it must pass against the new frontend.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create an item with a valid title, **Then** the item appears in the list
2. **Given** an item in the list, **When** the user edits its title, **Then** the updated title is shown
3. **Given** an item in the list, **When** the user deletes it, **Then** it is removed from the list
4. **Given** an invalid submission, **When** the user submits the form, **Then** inline validation errors are shown and nothing is saved

---

### User Story 3 - Admin user management (Priority: P2)

Administrators view a sortable, searchable, paginated user table and add, edit, and delete users.

**Why this priority**: Admin functionality is a differentiator but only reachable by privileged users; the data table widget is the most complex UI in the application.

**Independent Test**: Run the admin Playwright spec; it must pass.

**Acceptance Scenarios**:

1. **Given** an admin user, **When** they open the user management page, **Then** they see a paginated table of all users with current pending count
2. **Given** the user table, **When** the admin searches, sorts, or pages, **Then** results update without a full page reload
3. **Given** an admin, **When** they add, edit, or delete a user, **Then** the table reflects the change and confirmations appear where required

---

### User Story 4 - User settings (Priority: P2)

Users update their profile (name, email, password) and appearance (theme) from a settings page, and changes persist.

**Why this priority**: Settings touches profile data plus the dark mode requirement and is independently testable.

**Independent Test**: Run the user-settings Playwright spec; it must pass.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they update their profile, **Then** the new values persist and are shown after reload
2. **Given** an authenticated user, **When** they change their password, **Then** they can log in with the new password
3. **Given** an authenticated user, **When** they toggle the theme, **Then** the choice persists across reloads and applies to all pages

---

### User Story 5 - Navigation shell and dashboard (Priority: P2)

Users navigate via a sidebar that reflects pending counts, and land on a dashboard after login. Broken URLs show a friendly 404 page.

**Why this priority**: The shell ties the whole application together; pending counts depend on live API data.

**Independent Test**: Manual walk of the app plus the existing E2E suites that exercise navigation.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they navigate via the sidebar, **Then** each entry opens the correct page and active state is highlighted
2. **Given** a user with pending items or users, **When** the sidebar loads, **Then** pending counts match the API data and update after changes
3. **Given** any user, **When** they open an unknown URL, **Then** a friendly 404 page is shown with a way back

---

### Edge Cases

- What happens when the API is unreachable or returns an error? Loading and error states must be shown, with a retry path, on every data-driven page
- What happens when a session token expires mid-use? The user is returned to login without data loss or errors
- What happens when an admin edits or deletes their own account? A clear, non-crashing outcome with appropriate confirmation
- How does the app behave at small screen sizes? The sidebar must remain usable (collapse or equivalent)
- What happens on double-submit of a create/edit form? Duplicate submissions are prevented and a single request is sent

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide signup, login, password recovery, and password reset flows equivalent to the current application
- **FR-002**: System MUST protect all authenticated pages from unauthenticated access by redirecting to login
- **FR-003**: System MUST persist the session across browser reloads until logout or expiry
- **FR-004**: Users MUST be able to create, read, update, and delete items with client-side validation matching current rules
- **FR-005**: Administrators MUST be able to view, search, sort, paginate, create, edit, and delete users
- **FR-006**: Users MUST be able to update profile name, email, and password from settings
- **FR-007**: Users MUST be able to switch between light and dark themes; the choice MUST persist across sessions
- **FR-008**: System MUST display pending item and pending user counts in the navigation shell, updated from live data
- **FR-009**: System MUST show clear loading, empty, and error states on all data-driven views with a retry option
- **FR-010**: System MUST show a friendly 404 page for unknown URLs
- **FR-011**: System MUST prevent duplicate form submissions and show inline validation errors
- **FR-012**: System MUST include automated end-to-end coverage equivalent to the current suite (auth, items, admin, settings, password reset)

### Key Entities *(include if feature involves data)*

- **Item**: User-owned title; created and updated timestamps; backend-assigned identifier
- **User**: Account with name, email, role (user/admin), active status, pending flag; backend manages password hashing
- **Pending record**: Items awaiting approval and users awaiting activation, surfaced as counts in navigation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 existing Playwright spec files pass against the new frontend
- **SC-002**: 100% of the current feature list (auth x4, items CRUD, admin user CRUD, settings, sidebar counts, dark mode, 404) is reachable and functional
- **SC-003**: Users can complete login in under 3 seconds on a typical connection, with no full-page reloads during navigation
- **SC-004**: Theme choice and session survive browser reload in 100% of user visits
- **SC-005**: No backend endpoint, schema, or behavior changes are shipped as part of this work

## Assumptions

- The existing backend and its OpenAPI contract remain the source of truth and are reused unchanged
- A new visual design is acceptable; only feature behavior and dark mode are required to match
- The automated E2E suite is the definition of parity; selector-level changes to the tests are permitted, test intent is not
- Mobile responsiveness is maintained to the current standard (usable sidebar behavior); no new responsive targets
- User data, sessions, and security semantics (e.g., JWT expiry) are unchanged
- This migration is a frontend-only rewrite; deployment (Docker/nginx) is updated only as needed to serve the new build
