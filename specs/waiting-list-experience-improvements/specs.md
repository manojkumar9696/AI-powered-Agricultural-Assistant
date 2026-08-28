# Feature: What are archived ideas?; New rewards program; Express checkout (+41 more)
Status: NEW
Owner: Astra
Last Updated: 2026-08-28

## Summary

This feature encompasses a collection of capabilities for a travel booking platform, including: archiving and restoring ideas for project management, a customer rewards program to increase platform adoption, express checkout for returning customers, improved waiting list experience with real-time position tracking, user profile data refactoring, and food ordering from nearby restaurants. The primary business problems addressed are increasing user engagement and retention, streamlining checkout for returning customers, improving transparency in waiting list processes, and expanding platform capabilities to include food ordering. The expected outcomes include increased bookings per user, higher returning-user rates, reduced checkout friction, improved waiting list subscription rates, and successful food order placement from geographically proximate restaurants.

## Scope

### In Scope

- **Archived Ideas**: Merging similar ideas, archiving duplicates, restoring archived ideas, keeping projects clean without permanent deletion
- **Rewards Program**: Customer loyalty/rewards program that incentivizes platform usage, graduated benefits based on usage, general availability rollout (validated via 16-week beta showing +17% bookings, +24% returning users)
- **Express Checkout**: Reuse of previously provided purchase information for returning customers during flight checkout
- **Improve Waiting List Experience**: Real-time position display, countdown to event start, preparation checklist for when a spot becomes free, inline form validation with type-checking
- **Refactor User Profile Data**: Data migration for user profiles (new and existing users) to resolve architectural difficulties and potential timeouts
- **Food Ordering**: Geolocation-based restaurant discovery, dynamic menu display, cart management, order submission with validation, order confirmation
- **Waiting List Form Validation UX**: Multi-state field validation pattern (default, focus, error, corrected, submitted/persisted states)

### Out of Scope

- Payment processing and order tracking for food orders
- Restaurant backend management
- Service provider data migration
- Travel agency data migration
- VR travel features (exploratory only, no description provided)
- Advanced food ordering customization (future story)

## Application Type & Platform Context

The application is a **mixed platform** (web + potential mobile) based on the following source evidence:

- Desktop web page design specified at 1440×900 pixels with responsive considerations (zoom to 200%, touch target sizing at 44×44px minimum)
- Page refresh (F5) and session persistence testing indicates browser-based web application
- Geolocation integration for food ordering suggests mobile/responsive web capability
- Architecture style specified as **monolith**

The design prompts explicitly reference desktop web layouts with navigation bars, form containers, and toast notifications consistent with a web application. Touch target requirements (WCAG 2.5.5) suggest mobile/responsive support is expected.

## Actors and Permissions

| Actor | Role | Permissions | Source Evidence |
|---|---|---|---|
| Authenticated User | Primary platform user | Access waiting list features, create/edit/submit records, place food orders, use express checkout, participate in rewards program | US AABC-7, US AABC-16 |
| Non-authenticated / Read-only User | Restricted user | Cannot access or modify waiting list features; receives 403 on write attempts | US AABC-16 |
| Returning Customer | Authenticated user with purchase history | Reuse previous purchase information during checkout | US AABC-3 |
| System User | Automated system persona | Process food orders, validate geolocation, manage restaurant listings | US AABC-44 |

### Access Control Rules

- Non-authenticated users must be denied access to state-changing actions with a 403 or equivalent response
- Horizontal privilege escalation must be prevented (users cannot access other users' records)
- Vertical privilege escalation must be prevented (read-only users cannot call write endpoints)
- Object-level authorization must be enforced for all record access

## Feature Development Intent

This is feature-development work that requires building multiple new capabilities and refactoring existing infrastructure:

1. **New Behavior**: Rewards program, express checkout, waiting list real-time tracking, food ordering from nearby restaurants, idea archiving/restoration
2. **Refactoring**: User profile data architecture migration to resolve performance and maintainability issues
3. **UX Enhancement**: Inline form validation pattern with multi-state visual feedback for the waiting list form
4. **Outcome**: Increased platform adoption (measured by bookings/user and returning users), reduced checkout friction, improved waiting list engagement, and expanded service offerings

## UI Design & Interaction Contract

### Waiting List Form — Validation Pattern

The waiting list form implements a unified inline type-validation interaction pattern with five distinct visual states:

#### Screen States

| State | Border | Background | Box Shadow | Additional Elements |
|---|---|---|---|---|
| Default | 1px solid #CBD5E0 | #FFFFFF | none | Placeholder text in #A0AEC0 |
| Focus | 2px solid #3B82F6 | #FFFFFF | 0 0 0 3px rgba(59,130,246,0.15) | Cursor indicator |
| Error | 2px solid #E53E3E | #FFF5F5 | 0 0 0 3px rgba(229,62,62,0.1) | Shake animation, inline error message with exclamation icon |
| Corrected | 2px solid #38A169 | #F0FFF4 | 0 0 0 3px rgba(56,161,105,0.1) | Checkmark icon (18px, #38A169); auto-reverts to default after 2000ms |
| Submitted | 1px solid #CBD5E0 | #FFFFFF | none | Success toast at bottom-center |

#### Layout Specifications

- **Page**: 1440×900px, white (#FFFFFF) background
- **Navigation Bar**: Full-width, 64px height, #FFFFFF background, bottom border 1px solid #E2E8F0, left-aligned logo (32×32), right-aligned avatar (36px diameter, #CBD5E0)
- **Page Title**: "Waiting List" in Inter Bold 28px, color #1A202C; subheading in Inter Regular 16px, color #718096
- **Form Container**: Centered card, 640px width, border 1px solid #E2E8F0, border-radius 12px, padding 40px, box-shadow 0 1px 3px rgba(0,0,0,0.08)
- **Input Fields**: Height 44px, border-radius 8px, padding-left 14px; labels in Inter Medium 14px, color #4A5568
- **Submit Button**: Full-width, 48px height, #3B82F6 background, border-radius 8px, "Save & Continue" in Inter SemiBold 16px, #FFFFFF
- **Success Toast**: Fixed bottom-center, 360×52px, #1A202C background, border-radius 10px, white checkmark icon + confirmation text in Inter Medium 14px

#### Animation & Transition Specifications

| Transition | Duration | Easing | Notes |
|---|---|---|---|
| Default → Focus | 150ms | ease-in-out | Border color + box-shadow fade |
| Focus/Default → Error | 150ms (border) + 400ms (shake) | ease-in-out (border), ease-out (shake) | Shake: translateX [0, -4px, 4px, -3px, 3px, -1px, 1px, 0]; error message slides down 200ms ease-out with 100ms delay |
| Error → Corrected | 200ms (border/bg) + 250ms (checkmark) | ease-in-out (border), ease-out (icon) | Error slides up 150ms ease-in; checkmark scales 0.8→1.0 with 100ms delay |
| Corrected → Default | 300ms | — | Auto-triggers after 2000ms timeout |
| Submit → Success | 200ms (button) + 300ms (toast) | ease-out | Toast slides up with 200ms delay; auto-dismisses after 4000ms |

#### Error Message Format

- Icon: 16px circle with exclamation mark, filled #E53E3E with white exclamation
- Text: "Please enter a valid [expected type]. This field accepts [type description] only." in Inter Regular 13px, color #E53E3E
- Classification field error: "Please enter a valid classification. Select from available options or enter matching text."

#### Accessibility Requirements (Design-Level)

- All animations respect `prefers-reduced-motion` media query
- When reduced motion is preferred: shake animation is skipped, slide/scale transitions replaced with instant opacity changes (150ms max), success timeout auto-dismiss functions without positional movement
- Validation errors must be programmatically linked to fields via `aria-describedby` (WCAG 3.3.1)
- Focus moves to new content on modal/toast open; returns to trigger element on close
- All interactive elements must meet 44×44px minimum touch target (WCAG 2.5.5)
- All text must meet WCAG 2.1 AA minimum 4.5:1 contrast ratio
- Layout must remain usable without horizontal scrolling at 200% zoom on 1280px viewport

### Food Ordering Flow

- Customer accesses app/website
- System detects location and lists nearby restaurants
- Customer browses menus and adds items to cart
- System validates order constraints
- Customer submits order
- Confirmation is displayed

## API Contract

### Food Ordering Endpoints (Source-Supported)

| Operation | Method | Path | Description |
|---|---|---|---|
| List nearby restaurants | GET | /restaurants?location={lat,lng} | Returns restaurants within customer's geographic proximity |
| Place order | POST | /orders | Submits a food order with cart contents |

#### GET /restaurants

- **Input**: Location coordinates (query parameter)
- **Output**: List of restaurants filtered by geographic proximity
- **Performance**: Response time under 2 seconds
- **Security**: Authentication required, input sanitization

#### POST /orders

- **Input**: Order contents (menu items, quantities, customizations), customer reference
- **Output**: Order confirmation
- **Validation**: Order contents validated; submission blocked if mandatory fields or constraints not met
- **Security**: Authentication required, input sanitization, GDPR compliance

### General API Conventions (per Golden Repo)

- Use plural nouns for resource paths
- Return consistent response structures
- Include correlation/request IDs in all requests and responses
- Use appropriate HTTP status codes (403 for unauthorized access)
- Validate request payloads at system boundaries
- Use pagination for large collections
- Parameterized queries to prevent SQL injection
- CSRF token validation on state-changing actions
- Never expose stack traces, database errors, or internal implementation details

## Business Logic & Rules

### Idea Archiving

- When multiple similar ideas exist, the merge function keeps one active and archives others
- Archived ideas are not deleted; they can always be restored
- Archiving serves as a project cleanliness mechanism without data loss

### Rewards Program

- Customers receive graduated benefits based on platform usage frequency
- Program incentivizes increased booking frequency and platform return visits
- Validated metrics: +17% bookings/user, +24% returning users after 16-week beta
- Program transitions from Beta to General Availability

### Express Checkout

- Returning customers can reuse information from previous purchases
- Applies to flight checkout flow
- System must identify returning customers and retrieve their stored purchase details
- Reduces time-to-purchase by eliminating redundant data entry

### Waiting List Experience

- Users subscribing to a waiting list receive:
  - Real-time position on the waiting list
  - Countdown to event start
  - Preparation checklist for when a spot becomes free
- Validation hypothesis: increase in waiting list subscriptions (globally and per customer)

### Food Ordering

- System displays only restaurants within customer's current geographic proximity
- Location filtering must be accurate
- Order submission blocked if mandatory fields or constraints are not met
- Success metric: 90%+ order placement success rate

### Form Validation Rules

- Required fields must all be populated before submission is allowed
- Each required field shows its own specific error message when blank
- Type validation triggers on blur or submit attempt
- Whitespace-only input must be trimmed and rejected (treated as empty)
- Leading/trailing spaces must be trimmed before save
- Numeric zero must be treated as a valid value (not empty/null)
- Unicode and multi-byte characters must be stored and displayed without corruption
- Special characters must be sanitized, rejected, or stored per business rules without causing crashes
- Empty strings on optional fields must be accepted
- Duplicate records must be detected and blocked based on unique identifiers
- Rapid double-submit must result in only one record created

### Concurrency Control

- Optimistic locking or conflict detection required when two users edit the same record simultaneously
- Stale data must not silently overwrite newer changes
- User with stale data receives a conflict warning and must refresh before saving

### User Profile Refactoring

- Two solution options under evaluation:
  - Solution A: Migrate data to newer application with new database
  - Solution B: Create new architecture in existing database and migrate data
- Scope: User profiles for new and existing users
- Knowledge gap: Complexity assessment needed for both migration approaches

## Data Model & Validation

### Waiting List Subscription

| Field | Type | Constraints | Source |
|---|---|---|---|
| Position | Numeric (real-time) | Must update in real-time; zero is valid | US AABC-4 |
| Event countdown | Temporal | Countdown to event start | US AABC-4 |
| Preparation checklist | Structured list | Items to prepare if spot becomes free | US AABC-4 |

### Waiting List Form Fields

| Field | Type | Constraints | Source |
|---|---|---|---|
| Input field (text) | Text | Min 1 char; max 255 chars; type validation on blur/submit | US AABC-12, US AABC-19, US AABC-20 |
| Classification field | Classification/Select | Max 255 chars; rejects values beyond 256 chars; must match available options | US AABC-14, US AABC-21 |

### Food Order

| Field | Type | Constraints | Source |
|---|---|---|---|
| Customer location | Geographic coordinates | Required for restaurant filtering | US AABC-44 |
| Restaurant selection | Reference | Must be within geographic proximity | US AABC-44 |
| Menu items (cart) | Collection | At least one item required for submission | US AABC-44 |
| Order confirmation | System-generated | Displayed on successful submission | US AABC-44 |

### Validation Rules Summary

| Rule | Behavior | Priority |
|---|---|---|
| Required field blank | Block submission; show per-field error | P0 |
| Wrong data type | Reject with type-specific error message | P1 |
| Exceeds max length (256+ chars) | Reject with max-length error | P2 |
| Whitespace-only | Trim and reject as empty | P2 |
| Leading/trailing spaces | Trim before save | P2 |
| Duplicate unique identifier | Block creation; show duplicate error | P1 |
| No partial/invalid data persistence | Database unchanged on failed validation | P0 |

## Functional Requirements

| ID | Requirement | Source |
|---|---|---|
| FR-01 | The system shall allow merging of similar ideas, keeping one active and archiving others | US AABC-1 |
| FR-02 | Archived ideas shall be restorable to active status at any time | US AABC-1 |
| FR-03 | The rewards program shall provide graduated benefits based on platform usage | US AABC-2 |
| FR-04 | The rewards program shall be generally available to all customers | US AABC-2 |
| FR-05 | Express checkout shall allow returning customers to reuse previously provided purchase information | US AABC-3 |
| FR-06 | The system shall display real-time waiting list position to subscribed users | US AABC-4 |
| FR-07 | The system shall display a countdown to event start for waiting list subscribers | US AABC-4 |
| FR-08 | The system shall display a preparation checklist for waiting list subscribers | US AABC-4 |
| FR-09 | Form fields shall validate data type on blur or submit attempt | US AABC-12, AABC-13, AABC-14 |
| FR-10 | Invalid type entry shall display an inline error message specifying the expected data type | US AABC-12, AABC-13, AABC-14 |
| FR-11 | The system shall block form submission when all required fields are blank, showing individual errors per field | US AABC-15 |
| FR-12 | Non-authenticated users shall receive 403 when attempting to access or modify protected features | US AABC-16 |
| FR-13 | The system shall detect and block duplicate record creation based on unique identifiers | US AABC-17 |
| FR-14 | The system shall detect concurrent edit conflicts and warn the second user before allowing save | US AABC-18 |
| FR-15 | Input fields shall accept minimum boundary values (1 character) | US AABC-19 |
| FR-16 | Text fields shall accept maximum boundary values (255 characters) | US AABC-20 |
| FR-17 | Classification fields shall reject values exceeding maximum length (256+ characters) | US AABC-21 |
| FR-18 | The system shall trim whitespace-only input and treat it as empty/invalid for required fields | US AABC-22 |
| FR-19 | The system shall store and display Unicode/multi-byte characters without corruption | US AABC-23 |
| FR-20 | The system shall trim leading and trailing spaces before persisting values | US AABC-24 |
| FR-21 | Numeric zero shall be treated as a valid value, not as empty/null | US AABC-25 |
| FR-22 | Special characters shall be handled without system crash or data corruption | US AABC-26 |
| FR-23 | Empty strings on optional fields shall be accepted without blocking submission | US AABC-27 |
| FR-24 | Rapid double-submit shall result in only one record being created | US AABC-28 |
| FR-25 | The system shall display only restaurants within the customer's current geographic proximity | US AABC-44 |
| FR-26 | Customers shall be able to add menu items to cart and submit orders with confirmation displayed | US AABC-44 |
| FR-27 | The system shall validate order contents and prevent submission if mandatory fields or constraints are not met | US AABC-44 |
| FR-28 | Data satisfying waiting list criteria shall persist across logout/login and page refresh | US AABC-9 |
| FR-29 | Downstream processes shall correctly reflect upstream waiting list data | US AABC-10 |
| FR-30 | The system shall provide an audit trail showing connection between upstream actions and downstream effects | US AABC-10 |

## Non-Functional Requirements

| ID | Category | Requirement | Source |
|---|---|---|---|
| NFR-01 | Performance | Restaurant listing response time under 2 seconds | US AABC-44 |
| NFR-02 | Performance | 90%+ order placement success rate | US AABC-44 |
| NFR-03 | Security | All input fields must sanitize against reflected XSS | US AABC-29 |
| NFR-04 | Security | Stored data must be HTML-escaped on render to prevent stored XSS | US AABC-30 |
| NFR-05 | Security | All database queries must use parameterized queries to prevent SQL injection | US AABC-31 |
| NFR-06 | Security | Horizontal privilege escalation must be prevented with object-level authorization | US AABC-32 |
| NFR-07 | Security | Vertical privilege escalation must be prevented; read-only users cannot call write endpoints | US AABC-33 |
| NFR-08 | Security | CSRF protection via token validation on all state-changing actions | US AABC-34 |
| NFR-09 | Security | IDOR prevention via object-level authorization on sequential ID access | US AABC-35 |
| NFR-10 | Security | Path traversal must be rejected; server file system must not be exposed | US AABC-36 |
| NFR-11 | Security | Security events must be logged with appropriate severity | US AABC-29–36 |
| NFR-12 | Accessibility | All interactive elements reachable via keyboard-only navigation (no focus traps) | US AABC-37 |
| NFR-13 | Accessibility | Screen reader must announce all controls, labels, errors, and state changes | US AABC-38 |
| NFR-14 | Accessibility | All text must meet WCAG 2.1 AA minimum 4.5:1 contrast ratio | US AABC-39 |
| NFR-15 | Accessibility | Validation errors must be programmatically linked to fields via aria-describedby (WCAG 3.3.1) | US AABC-40 |
| NFR-16 | Accessibility | Focus must be managed correctly after dynamic content updates (modals, toasts) | US AABC-41 |
| NFR-17 | Accessibility | Layout must be usable without horizontal scrolling at 200% zoom | US AABC-42 |
| NFR-18 | Accessibility | All interactive elements must meet 44×44px minimum touch target (WCAG 2.5.5) | US AABC-43 |
| NFR-19 | Accessibility | All animations must respect prefers-reduced-motion media query | Design Prompt |
| NFR-20 | Reliability | No partial or invalid data shall be persisted on failed validation | US AABC-11, AABC-15 |
| NFR-21 | Reliability | System must remain stable after edge-case inputs (no crash, hang, or data corruption) | US AABC-19–28 |
| NFR-22 | Observability | Include correlation IDs in all API requests and responses | Golden Repo |
| NFR-23 | Observability | Log security-relevant events with structured logging | Golden Repo |
| NFR-24 | Compliance | GDPR compliance for food ordering (location data, personal data) | US AABC-44 |

## Acceptance Scenarios

### Archived Ideas

**Scenario: Merge similar ideas and archive duplicates**
- Given multiple similar ideas exist in a project
- When a user selects the merge function on duplicate ideas
- Then one idea remains active and the others are archived

**Scenario: Restore an archived idea**
- Given an idea has been archived
- When a user selects the restore action on the archived idea
- Then the idea is returned to active status

### Rewards Program

**Scenario: Rewards program available to all customers**
- Given the rewards program has been validated in beta
- When a customer accesses the platform
- Then the rewards program benefits are available to them based on their usage level

### Express Checkout

**Scenario: Returning customer reuses previous purchase information**
- Given a returning customer has previously completed a purchase
- When they select "Check out" on a new flight purchase
- Then their previously provided information is pre-populated
- And they can complete the purchase without re-entering details

### Waiting List — Happy Path

**Scenario: User subscribes to waiting list and receives real-time information**
- Given an authenticated user is viewing a travel plan with a waiting list
- When they subscribe to the waiting list
- Then they see their real-time position on the waiting list
- And they see a countdown to the event start
- And they see a preparation checklist

### Waiting List Form — Type Validation

**Scenario: Field rejects wrong data type with inline error**
- Given an authenticated user is on the Waiting List form
- When they enter an invalid data type into a field and blur or submit
- Then the field border transitions to red (#E53E3E)
- And a shake animation plays (unless prefers-reduced-motion is active)
- And an inline error message appears stating the expected data type

**Scenario: Field accepts correct data type after correction**
- Given a field is in error state with an invalid value
- When the user enters a valid value and blurs
- Then the error message slides out
- And the border transitions to green (#38A169) with a checkmark
- And after 2000ms the field returns to default state

**Scenario: Form submission succeeds with valid data**
- Given all fields contain valid data
- When the user clicks "Save & Continue"
- Then the button transitions to green with "Saved ✓" text
- And a success toast appears at bottom-center confirming data is saved
- And the toast auto-dismisses after 4000ms

### Waiting List Form — Required Fields

**Scenario: System blocks submission when all required fields are blank**
- Given an authenticated user opens a new waiting list form
- When they attempt to submit without entering any data
- Then the system blocks submission
- And each required field displays its own specific error message
- And no record is created in the database

### Authorization

**Scenario: Non-authenticated user denied access**
- Given a user without the authenticated user role
- When they attempt to access or modify waiting list features
- Then the system returns 403 Forbidden
- And no data is changed

### Concurrent Editing

**Scenario: Conflict detected on simultaneous edit**
- Given two authenticated users have the same record open for editing
- When the first user saves successfully and the second user attempts to save stale data
- Then the second user receives a conflict warning
- And their changes are not silently overwritten
- And after refreshing, the second user can apply and save their changes

### Duplicate Prevention

**Scenario: System blocks duplicate record creation**
- Given a record with a unique identifier already exists
- When a user attempts to create a new record with the same unique identifier
- Then the system displays a duplicate-record error identifying the conflicting value
- And the duplicate record is not created

### Data Persistence

**Scenario: Data persists after session refresh**
- Given an authenticated user has saved waiting list data
- When they log out, log back in, and navigate to the record
- Then all field values are identical to what was saved
- And values persist across page refresh (F5)

### Food Ordering

**Scenario: Customer orders food from nearby restaurant**
- Given an authenticated customer with location detected
- When the system lists nearby restaurants
- Then only restaurants within geographic proximity are displayed
- And the customer can browse menus, add items to cart, and submit an order
- And a confirmation is displayed upon successful submission

**Scenario: Food order blocked when constraints not met**
- Given a customer has items in cart but mandatory fields are incomplete
- When they attempt to submit the order
- Then the system validates order contents
- And prevents submission with appropriate error messaging

### Security

**Scenario: XSS payload is sanitized**
- Given an authenticated user enters a script tag in an input field
- When the form is submitted
- Then the script is sanitized/escaped and not executed in the browser DOM
- And a security event is logged

**Scenario: SQL injection is prevented**
- Given an authenticated user enters SQL injection payload in a search/filter input
- When the query is processed
- Then parameterized queries prevent injection
- And the database structure remains unchanged

**Scenario: CSRF attack is rejected**
- Given a cross-origin POST request is made without a valid CSRF token
- When the server processes the request
- Then the request is rejected
- And a security event is logged

### Edge Cases

**Scenario: Rapid double-submit creates only one record**
- Given a user clicks Save twice within 50ms
- When the system processes the submissions
- Then only one record is created
- And the system remains stable

**Scenario: Unicode characters stored correctly**
- Given a user enters multi-byte characters (e.g., "测试 тест テスト")
- When the data is saved and retrieved
- Then the characters are stored and displayed without corruption

## Traceability Matrix

| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| US AABC-1 | FR-01, FR-02 | Ideas can be merged/archived and restored | Merge scenario, Restore scenario |
| US AABC-2 | FR-03, FR-04 | Rewards program GA with validated metrics | Rewards availability scenario |
| US AABC-3 | FR-05 | Returning customer reuses previous info | Express checkout scenario |
| US AABC-4 | FR-06, FR-07, FR-08 | Real-time position, countdown, checklist displayed | Waiting list happy path |
| US AABC-5 | User profile refactoring | Migration approach selected and executed | Open Question (solution selection) |
| US AABC-7 | FR-06–FR-08 | Happy path for waiting list improvement | US AABC-7 test steps |
| US AABC-8 | FR-06 | "real-time position" value stored exactly | Alt data scenario |
| US AABC-9 | FR-28 | Data persists after logout/login and refresh | Persistence scenario |
| US AABC-10 | FR-29, FR-30 | Downstream processes reflect data; audit trail complete | Downstream scenario |
| US AABC-11 | NFR-20 | System blocks save when criterion violated; no partial data | Criterion violated scenario |
| US AABC-12 | FR-09, FR-10 | Input field rejects wrong type with error | Type validation scenario (input) |
| US AABC-13 | FR-09, FR-10 | Text field rejects wrong type with error | Type validation scenario (text) |
| US AABC-14 | FR-09, FR-10 | Classification field rejects wrong type with error | Type validation scenario (classification) |
| US AABC-15 | FR-11, NFR-20 | All required fields blank blocks submission | Required fields scenario |
| US AABC-16 | FR-12 | Non-authenticated user gets 403 | Authorization scenario |
| US AABC-17 | FR-13 | Duplicate record blocked | Duplicate prevention scenario |
| US AABC-18 | FR-14 | Concurrent edit conflict detected | Concurrent editing scenario |
| US AABC-19 | FR-15 | Min boundary (1 char) accepted | Edge case — min boundary |
| US AABC-20 | FR-16 | Max boundary (255 chars) accepted | Edge case — max boundary |
| US AABC-21 | FR-17 | Over-max (256 chars) rejected | Edge case — over max |
| US AABC-22 | FR-18 | Whitespace-only trimmed and rejected | Edge case — whitespace |
| US AABC-23 | FR-19 | Unicode stored without corruption | Edge case — unicode |
| US AABC-24 | FR-20 | Leading/trailing spaces trimmed | Edge case — trim |
| US AABC-25 | FR-21 | Zero treated as valid numeric | Edge case — zero |
| US AABC-26 | FR-22 | Special chars handled without crash | Edge case — special chars |
| US AABC-27 | FR-23 | Empty optional field accepted | Edge case — empty optional |
| US AABC-28 | FR-24 | Double-submit creates one record | Edge case — double submit |
| US AABC-29 | NFR-03 | Reflected XSS sanitized | Security — XSS reflected |
| US AABC-30 | NFR-04 | Stored XSS escaped on render | Security — XSS stored |
| US AABC-31 | NFR-05 | SQL injection prevented | Security — SQLi |
| US AABC-32 | NFR-06 | Horizontal privilege escalation blocked | Security — horizontal escalation |
| US AABC-33 | NFR-07 | Vertical privilege escalation blocked | Security — vertical escalation |
| US AABC-34 | NFR-08 | CSRF rejected without valid token | Security — CSRF |
| US AABC-35 | NFR-09 | IDOR prevented via authorization | Security — IDOR |
| US AABC-36 | NFR-10 | Path traversal rejected | Security — path traversal |
| US AABC-37 | NFR-12 | Keyboard navigation complete | A11y — keyboard |
| US AABC-38 | NFR-13 | Screen reader announces all elements | A11y — screen reader |
| US AABC-39 | NFR-14 | Contrast ratio ≥ 4.5:1 | A11y — contrast |
| US AABC-40 | NFR-15 | aria-describedby links errors to fields | A11y — error linking |
| US AABC-41 | NFR-16 | Focus managed on dynamic updates | A11y — focus management |
| US AABC-42 | NFR-17 | No horizontal scroll at 200% zoom | A11y — zoom |
| US AABC-43 | NFR-18 | Touch targets ≥ 44×44px | A11y — touch targets |
| US AABC-44 | FR-25, FR-26, FR-27 | Geolocation filtering, cart/order, validation | Food ordering scenarios |

## Open Questions

| # | Category | Question | Impact |
|---|---|---|---|
| 1 | Business | What are the specific tiers/levels of the rewards program and what benefits does each tier provide? | Cannot implement rewards logic without tier definitions |
| 2 | Business | What constitutes "geographic proximity" for restaurant filtering — what is the radius or boundary? | Affects restaurant listing accuracy |
| 3 | Data | Which solution (A or B) has been selected for user profile data migration? What is the complexity assessment outcome? | Blocks refactoring implementation |
| 4 | API | What are the specific API endpoints for the rewards program, express checkout, and waiting list features? | Cannot define integration contracts |
| 5 | API | What is the response schema for GET /restaurants and POST /orders? | Cannot validate API implementation |
| 6 | Business | What specific information from previous purchases is reused in express checkout (payment method, address, passenger details, all)? | Affects data retrieval scope |
| 7 | Data | What is the unique identifier for waiting list records that drives duplicate detection? | Cannot implement duplicate prevention |
| 8 | Business | What are the "mandatory fields or constraints" for food order validation beyond cart non-empty? | Cannot implement complete order validation |
| 9 | Platform | Is the food ordering feature web-only, mobile-only, or both? What are the geolocation permission flows? | Affects UX and technical implementation |
| 10 | Business | What does "real-time position" mean technically — WebSocket push, polling interval, or on-page-load refresh? | Affects architecture and performance |
| 11 | UI | What are the specific screens/flows for rewards program, express checkout, and food ordering? No design prompts provided for these features. | Cannot define UI contracts for these features |
| 12 | Business | What are the VR travel features being explored (US AABC-6)? No description provided. | Cannot scope or plan |
| 13 | Security | What is the specific API endpoint path for the waiting list write operations (referenced in vertical privilege escalation test)? | Cannot configure security tests precisely |
| 14 | Data | What is the data retention policy for archived ideas, waiting list subscriptions, and order history? | Affects storage and compliance |
| 15 | Integration | What restaurant and menu database(s) are the data sources for food ordering? | Affects integration architecture |
| 16 | Business | How does the preparation checklist content get defined — is it per-event, per-travel-plan, or system-wide? | Affects content management approach |

## Source References

- **Feature ID**: 1710768500
- **User Stories**: US AABC-1 through US AABC-44
- **Architecture Style**: Monolith (user-selected)
- **Design Prompts**: Waiting List Form validation pattern (attached to US AABC-13 and US AABC-14)
- **Acceptance Criteria**: US AABC-44 (food ordering — 5 criteria)
- **Golden Repo Conventions Applied**:
  - REST resource naming (plural nouns)
  - Input validation at system boundaries
  - Error response standards (meaningful, consistent, actionable with correlation IDs)
  - Security controls (XSS, SQLi, CSRF, IDOR, path traversal prevention)
  - Accessibility as non-functional requirement on every story
  - Structured logging and observability
  - No secrets in code; no sensitive data exposure in responses
  - Automated test coverage expectations (positive, negative, boundary, exception scenarios)
  - Given/When/Then acceptance criteria format