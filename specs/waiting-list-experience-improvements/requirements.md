# Implementation Requirements Checklist

**Purpose**: Provide an implementation acceptance checklist that agents can execute one item at a time.
**Feature**: What are archived ideas?; New rewards program; Express checkout (+41 more)

## Functional Acceptance Criteria

### Archived Ideas (US AABC-1)
- [ ] System provides a merge function that consolidates similar/duplicate ideas into one, archiving the others
- [ ] Archived ideas are hidden from the active project view but remain in persistent storage
- [ ] Archived ideas can be restored to active status at any time
- [ ] Archiving does not delete any idea data

### New Rewards Program (US AABC-2)
- [ ] Rewards program is generally available to all customers (moved from Beta)
- [ ] System tracks and associates reward accrual with user activity on the travel booking platform
- [ ] Reward benefits increase proportionally with platform usage

### Express Checkout (US AABC-3)
- [ ] Authenticated returning users can select "Check out" and reuse information from a previous purchase
- [ ] Previously stored user details (payment, contact, travel documents) are pre-populated at checkout
- [ ] Users can confirm or edit pre-populated details before final submission
- [ ] Checkout flow is shortened compared to first-time purchase flow

### Improve Waiting List Experience (US AABC-4)
- [ ] When a user subscribes to a waiting list, the system displays their real-time position on the list
- [ ] A countdown to the start of the event is displayed to subscribed users
- [ ] A checklist of preparation steps is shown in case a spot becomes free
- [ ] Information updates are delivered in real-time or near-real-time without requiring page refresh

### Refactor User Profile Data (US AABC-5)
- [ ] User profile data architecture is refactored to eliminate timeout risks and improve maintainability
- [ ] Scope includes new and existing user profiles
- [ ] Service provider data and travel agency data are explicitly out of scope
- [ ] Data migration preserves all existing user profile data without loss

### Explore VR Travel Features (US AABC-6)
- [ ] **Open Question (BLOCKING)**: No description, acceptance criteria, or scope defined for VR travel features. This must not be implemented as an assumption; feature is held at needs-clarification.

### Food Ordering from Nearby Restaurants (US AABC-44)
- [ ] System uses geolocation to detect customer's current location and displays only restaurants within geographic proximity
- [ ] Restaurant listing loads with response time under 2 seconds
- [ ] Customers can browse dynamic menus per restaurant and add items to cart
- [ ] Order submission validates order contents and blocks submission when mandatory fields or constraints are not met
- [ ] Successful order submission displays a confirmation to the customer
- [ ] API endpoints: `GET /restaurants?location=` for listing, `POST /orders` for submission
- [ ] Authentication is required for order placement
- [ ] Input sanitization applied to all user inputs
- [ ] Payment processing and order tracking are explicitly out of scope

### Waiting List Form — Happy Path (US AABC-7)
- [ ] Authenticated user can navigate to the waiting list module, which loads with all fields and controls visible
- [ ] User can open a record for editing with current values displayed
- [ ] System accepts valid input, processes it, and provides clear positive feedback
- [ ] Workflow completes without errors or warnings

### Waiting List — Real-Time Position Value (US AABC-8)
- [ ] The "real-time position" value is accepted, stored exactly without truncation or transformation, and reflected correctly in downstream processes

### Waiting List — Data Persistence (US AABC-9)
- [ ] Data persists after logout/login cycle — all field values are identical after re-authentication
- [ ] Data persists after page refresh (F5) — no data loss
- [ ] Downstream processes continue to reflect correct data after session refresh

### Waiting List — Downstream Process Verification (US AABC-10)
- [ ] Downstream modules/processes that depend on waiting list data function correctly when upstream data is valid
- [ ] Incorrect or missing upstream data blocks downstream processing
- [ ] Audit trail records the connection between upstream action and downstream effect

### Waiting List — Criterion Violation Rejection (US AABC-11)
- [ ] System blocks save/submit when data violates the "Improve waiting list experience" criterion
- [ ] A specific, actionable error message is displayed referencing what is wrong and how to fix it
- [ ] No partial or invalid data is persisted on failed validation

### Duplicate Prevention (US AABC-17)
- [ ] System detects and blocks creation of duplicate records based on unique identifier
- [ ] Specific duplicate-record error identifies the conflicting value
- [ ] Modifying the unique field to a new value allows successful record creation

### Concurrent Edit Conflict Detection (US AABC-18)
- [ ] Optimistic locking or equivalent conflict detection is implemented
- [ ] When two sessions edit the same record, the second save attempt receives a conflict warning
- [ ] Stale data is never silently overwritten
- [ ] After refreshing to latest state, the conflicting session can successfully save

## UI Acceptance Criteria

### Waiting List Form — Field States and Validation Pattern
- [ ] Form fields render in default state with 1px #CBD5E0 border, #FFFFFF background, and placeholder text indicating expected data type
- [ ] On focus, field border transitions to 2px #3B82F6 with box-shadow `0 0 0 3px rgba(59,130,246,0.15)` over 150ms ease-in-out
- [ ] On error (blur or submit with invalid type), field border transitions to 2px #E53E3E, background tints to #FFF5F5, shake animation plays (translateX keyframes over 400ms ease-out)
- [ ] Inline error message slides in below the field (200ms ease-out, 100ms delay) with exclamation icon and text stating expected data type
- [ ] On correction (valid input replaces invalid), error message slides out, border transitions to 2px #38A169, background to #F0FFF4, checkmark icon fades in with scale animation (250ms ease-out)
- [ ] After 2000ms, corrected state returns to default neutral (border #CBD5E0, white background, checkmark fades out)
- [ ] On successful form submission, button transitions to green (#38A169) with "Saved ✓" text, and a success toast slides up from bottom-center (300ms ease-out, auto-dismisses after 4000ms)

### Form Layout
- [ ] Form container is a centered card, 640px wide, border-radius 12px, padding 40px, with subtle box-shadow
- [ ] Input fields are 44px height, border-radius 8px, with 20px reserved vertical space below each for error messages
- [ ] Submit button is full-width within card, 48px height, border-radius 8px, Inter SemiBold 16px
- [ ] Top navigation bar is 64px height, full-width, with logo placeholder left-aligned and avatar right-aligned

### Accessibility (US AABC-37 through US AABC-43)
- [ ] All animations respect `prefers-reduced-motion` media query: shake is skipped, slide/scale transitions replaced with instant opacity changes (≤150ms), toast appears/disappears without positional movement
- [ ] All interactive elements are reachable and operable via keyboard alone (Tab, Shift+Tab, Enter, Space, Arrow keys) with no focus traps
- [ ] Screen reader announces all form labels, buttons, error messages, and dynamic state changes correctly
- [ ] All text meets WCAG 2.1 AA minimum 4.5:1 colour contrast ratio
- [ ] Validation errors are programmatically linked to their fields via `aria-describedby` (WCAG 3.3.1)
- [ ] Focus moves to new dynamic content (modals, toasts) on open and returns to trigger element on close
- [ ] Layout remains usable without horizontal scrolling at 200% zoom on 1280px viewport
- [ ] All interactive elements (buttons, links, inputs) meet 44×44px minimum touch target size (WCAG 2.5.5)

### Responsive Behavior
- [ ] Assignee-facing experiences are mobile-responsive per Golden Repo guidance

## API and Integration Acceptance Criteria

### Restaurant/Food Ordering API
- [ ] `GET /restaurants?location={lat,lng}` returns filtered list of nearby restaurants with response time <2s (p95)
- [ ] `POST /orders` accepts order payload, validates contents, and returns confirmation or validation error
- [ ] API uses plural nouns for resource paths per Golden Repo conventions
- [ ] Responses follow consistent structure with appropriate HTTP status codes
- [ ] Pagination supported for restaurant listings
- [ ] Correlation/request IDs included in all requests and responses

### Waiting List API
- [ ] Waiting list subscription endpoint accepts authenticated requests and returns real-time position data
- [ ] API validates all input at system boundaries before processing
- [ ] Error responses follow standardized format: `{ errorCode, message, correlationId }`
- [ ] 403 Forbidden returned for unauthorized access attempts (US AABC-16)

### General API Standards
- [ ] All APIs documented with OpenAPI/Swagger where applicable
- [ ] Backward compatibility maintained for existing contracts
- [ ] Request payloads validated; meaningful validation errors returned
- [ ] Never expose passwords, tokens, or sensitive information in API responses

## Business Logic and Data Acceptance Criteria

### Input Validation
- [ ] Type validation rejects wrong data types for input fields, text fields, and classification fields with specific error messages (US AABC-12, 13, 14)
- [ ] All required fields must be filled before submission is allowed; each missing field shows its own error (US AABC-15)
- [ ] No partial/orphan records created on validation failure
- [ ] Input field accepts minimum boundary value (1 character) without error (US AABC-19)
- [ ] Text field accepts maximum boundary value (255 characters) without error (US AABC-20)
- [ ] Classification field rejects values exceeding maximum (256+ characters) with max-length error (US AABC-21)

### Edge Case Handling
- [ ] Whitespace-only input is trimmed and rejected or normalized — not stored as valid data (US AABC-22)
- [ ] Unicode and multi-byte characters (e.g., 测试 тест テスト) are stored and displayed without corruption (US AABC-23)
- [ ] Leading and trailing spaces are trimmed before persistence (US AABC-24)
- [ ] Numeric zero is treated as a valid value, not as empty/null (US AABC-25)
- [ ] Special characters (!@#$%^&*) are handled per business rules without causing crashes (US AABC-26)
- [ ] Empty string on optional fields is accepted; record still saves (US AABC-27)
- [ ] Rapid double-submit (two clicks within 50ms) creates only one record; second submission is ignored or rejected (US AABC-28)

### Authorization
- [ ] Non-authenticated or read-only users cannot access or modify waiting list features; system returns 403 (US AABC-16)
- [ ] Access control enforced through identity platform (SSO, claims, delegated access) per Golden Repo guidance

### Data Persistence
- [ ] User profile data, waiting list subscriptions, and order data persist correctly across sessions
- [ ] Audit trail records creator, date/time for all state-changing operations
- [ ] Immutable audit trail maintained for assignment/order activity

## Non-Functional Acceptance Criteria

### Security (US AABC-29 through US AABC-36)
- [ ] Reflected XSS: Script tags in input fields are sanitized/escaped and never executed in browser DOM
- [ ] Stored XSS: Saved data is HTML-escaped on render; no script execution on page load
- [ ] SQL Injection: Parameterized queries prevent injection; database structure unchanged by malicious input
- [ ] Horizontal privilege escalation: System returns 403 when user attempts to access another user's record via URL/ID manipulation
- [ ] Vertical privilege escalation: Read-only users calling write endpoints receive 403; action blocked and logged
- [ ] CSRF: State-changing requests rejected when CSRF token is missing or invalid
- [ ] IDOR: Object-level authorization enforced; 403 returned for unauthorized sequential ID enumeration
- [ ] Path traversal: Traversal paths (e.g., `../../etc/passwd`) rejected; server file system not exposed
- [ ] All blocked security attempts are logged with appropriate severity in server-side audit logs
- [ ] No stack traces, database errors, credentials, or internal implementation details exposed to end users

### Performance
- [ ] Restaurant listing response time <2 seconds (p95)
- [ ] Form interactions (validation, submission) respond within acceptable latency per Golden Repo targets

### Observability
- [ ] Structured logging with correlation IDs for all requests
- [ ] Security-relevant events logged appropriately
- [ ] Integration failures and exceptions logged with correlation IDs

### Reliability
- [ ] System remains stable after edge-case inputs — no crashes, hangs, or data corruption
- [ ] If a dependency cannot be loaded, system falls back gracefully per Golden Repo resilience guidance

### Architecture
- [ ] Monolith architecture style as specified; no unnecessary service decomposition
- [ ] Separation of concerns: UI, business logic, data access, and integration logic appropriately layered
- [ ] No hard-coded business rules; validation rules and configuration are data-driven where variation is expected
- [ ] No secrets or hard-coded credentials in code

## Traceability

- [ ] Every implemented change maps back to a specific user story (AABC-1 through AABC-44) and its acceptance criteria or test steps
- [ ] Every non-blocking Open Question that was implemented has a recorded decision + one-line rationale in specs/1710768500/assumptions.md
- [ ] No BLOCKING Open Question was implemented as an assumption — specifically US AABC-6 (Explore VR Travel Features) must remain at needs-clarification until scope is defined
- [ ] **Open Question (non-blocking)**: Exact field definitions (which fields are "input field", "text field", "classification field") are not specified — if implemented, record the assumed mapping in specs/1710768500/assumptions.md
- [ ] **Open Question (non-blocking)**: Geolocation proximity radius for restaurant filtering is not defined — if a default is chosen, record in assumptions.md
- [ ] **Open Question (non-blocking)**: Data migration approach for user profile refactor (Solution A vs Solution B) is unresolved — if a decision is made during implementation, record rationale in assumptions.md

## Notes

- Never resolve an Open Question silently. In an unattended run, record the chosen assumption + rationale in specs/1710768500/assumptions.md; blocking questions must instead hold the feature at needs-clarification.
- Mark an item complete only after verifying actual implementation code and behavior.
- US AABC-6 (Explore VR Travel Features) has no defined scope or acceptance criteria and must not be implemented until clarified.
- The design prompt content describes the visual specification for the waiting list form validation pattern — implement the described states, transitions, and accessibility behaviors as specified.