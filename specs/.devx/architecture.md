# Architecture — AABC

> Auto-generated architecture overview. Update this file as the system evolves.

## Feature Map

### What are archived ideas?; New rewards program; Express checkout (+41 more)
- 44 user stories
- Stories: What are archived ideas?, New rewards program, Express checkout, Improve waiting list experience, Refactor user profile data, Explore VR travel features, [Happy Path] Improve waiting list experience, [Alt Data] "real-time position" satisfies: Improve waiting list experience, [Persistence] Data persists after session refresh for: Improve waiting list experience, [Downstream] After "Improve waiting list experience" — verify: downstream processes work correctly, [Criterion Violated] System rejects when: "Improve waiting list experience" is not met, [Invalid Type] "input field" rejects wrong data type, [Invalid Type] "text field" rejects wrong data type, [Invalid Type] "classification field" rejects wrong data type, [Missing Required] All required fields blank — system blocks submission, [Unauthorized Role] Non-authenticated user role cannot perform "Improve waiting list experience" actions, [Duplicate] System prevents creating duplicate of "Improve", [Concurrent Edit] System detects conflict when two users edit same record simultaneously, [Edge] "input field" — minimum boundary (1 char / minimum allowed value), [Edge] "text field" — maximum boundary (255 chars / max allowed value), [Edge] "classification field" — just beyond maximum (256 chars / one over limit), [Edge] whitespace-only input — "Improve waiting list experience", [Edge] Unicode and multi-byte characters — "Improve waiting list experience", [Edge] leading and trailing spaces — "Improve waiting list experience", [Edge] numeric zero as a value — "Improve waiting list experience", [Edge] special characters (!@#$%^&*) — "Improve waiting list experience", [Edge] empty string on optional field — "Improve waiting list experience", [Edge] rapid double-submit (click Save twice quickly) — "Improve waiting list experience", [Security] Reflected XSS via input fields, [Security] Stored XSS — malicious script saved and re-rendered, [Security] SQL injection via search/filter inputs, [Security] Horizontal privilege escalation — accessing another user's record, [Security] Vertical privilege escalation — read-only user calling write endpoint, [Security] CSRF — cross-site request forgery on state-changing action, [Security] IDOR — insecure direct object reference via sequential ID enumeration, [Security] Path traversal in any file/resource reference parameter, [A11y] Keyboard-only navigation — all interactive elements reachable without mouse, [A11y] Screen reader announces all controls, labels, errors, and state changes, [A11y] Colour contrast — all text meets WCAG 2.1 AA minimum 4.5:1 ratio, [A11y] Validation errors programmatically linked to fields (aria-describedby / WCAG 3.3.1), [A11y] Focus management after dynamic content updates (modals, alerts, toasts), [A11y] Zoom to 200% — layout usable without horizontal scrolling, [A11y] Touch target size — all interactive elements meet 44×44px minimum (WCAG 2.5.5), Enable customers to place food orders from nearby restaurants

## Guidelines

- Follow the specs in each feature folder for implementation details
- Each feature should be independently deployable where possible
- Shared logic should be extracted into common modules
- Follow the project's established patterns and conventions


## Data Models

> Document key data models here as they are implemented.

## API Contracts

> Document API endpoints here as they are implemented.

## Integration Points

> Document external integrations and dependencies here.
