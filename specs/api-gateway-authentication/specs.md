# Feature: RESTful API Integration Framework
Status: NEW
Owner: Astra
Last Updated: 2026-08-20

## Summary
The RESTful API Integration Framework establishes secure, standardized external API access for integrations with advertising platforms. Based on the selected user stories, this feature specifically delivers OAuth 2.0 bearer-token authentication at the API gateway for external integration endpoints so that only authorized clients can access services used for campaign management and performance tracking.

The feature addresses the current gap where the API gateway operates without authentication and allows unrestricted access to service endpoints. The expected outcome is that every request to in-scope external API endpoints is authenticated through OAuth 2.0 token validation, invalid or expired tokens are rejected, authentication events are auditable through correlation-ID-based logging, and authentication processing meets the required latency targets.

## Scope
### In Scope
- OAuth 2.0 bearer token authentication for API gateway access to external integration endpoints.
- Validation of bearer tokens on every request.
- Rejection of invalid or expired tokens.
- Support for JWT self-validation.
- Support for token introspection endpoint validation.
- Authorization server integration via OIDC discovery endpoint.
- Enforcement of required token scopes and client permissions where required by the requested endpoint.
- Standardized `401 Unauthorized` responses with proper `WWW-Authenticate` headers.
- Logging of all authentication attempts with correlation IDs for audit tracking.
- Correlation ID injection for authentication audit trails.
- Token caching with TTL based on token expiration claims.
- Client credentials flow support for service-to-service authentication.
- Rate limiting on authentication endpoints to help prevent brute-force attempts.
- Secure storage of client secrets in a vault service.
- Performance targets for token validation:
  - Cached tokens: complete validation within 50ms.
  - Uncached tokens: complete validation within 200ms.

### Out of Scope
- API key authentication.
- Custom authorization policies beyond OAuth scopes.
- Token refresh flow implementation.
- Any campaign management or performance tracking business operations beyond the authentication framework described in the source.
- Any UI screens, dashboards, or end-user-facing workflows not described in the source.

## Application Type & Platform Context
**Application Type:** API/service

**Source Evidence:**
- "RESTful API Integration Framework"
- "Establish comprehensive RESTful API architecture for external integrations with advertising platforms."
- "Implement OAuth 2.0 authentication for the API gateway to establish secure access control for all external integration endpoints."
- "Client includes bearer token in Authorization header when calling API"
- "Valid requests proceed to backend services with authenticated context"

**Platform Context:**
- Architecture style selected by the user: monolith.
- The feature operates at the API gateway boundary for external service-to-service integrations.

**Open Question**
- Is the gateway implemented as part of the monolith runtime or as a separately deployed edge component within the monolithic system boundary?

## Actors and Permissions
### Actors
- **API Developer / Client Application**
  - Requests an OAuth token from the authorization server.
  - Calls the API using a bearer token in the `Authorization` header.
- **API Gateway**
  - Extracts bearer tokens from incoming requests.
  - Validates tokens through JWT self-validation and/or token introspection.
  - Verifies signature, expiration, and required scopes.
  - Rejects unauthorized requests.
  - Logs authentication attempts with correlation IDs.
  - Forwards valid requests with authenticated context to backend services.
- **Authorization Server**
  - Issues OAuth tokens.
  - Provides OIDC discovery metadata.
  - Supports token introspection for real-time validation.
- **Backend Services**
  - Receive requests only after successful authentication and with authenticated context.

### Permissions and Access Constraints
- Only authorized clients with valid OAuth 2.0 bearer tokens may access in-scope API services.
- Requests with invalid or expired tokens must be rejected.
- Access enforcement is based on token scopes and client permissions as described in the story.
- Authentication applies to all external integration endpoints within scope.

**Open Questions**
- What specific scopes are required per endpoint or resource group?
- What client permissions model applies beyond token scope validation?
- Are there any endpoints intentionally exempt from authentication, such as health or discovery endpoints?

## Feature Development Intent
This is feature-development work to add missing authentication capabilities at the API gateway for the RESTful API Integration Framework. The current state has no authentication and allows unrestricted access. The required change is to build and enforce OAuth 2.0 bearer-token authentication for all in-scope external integration requests.

The delivered outcome must ensure:
- Every request is authenticated.
- Invalid or expired tokens are denied consistently.
- Valid requests are forwarded with authenticated context.
- Authentication processing is observable through audit logging with correlation IDs.
- The gateway supports both JWT self-validation and authorization-server-backed token introspection.
- The implementation meets the required response-time thresholds for cached and uncached token validation.

## UI Design & Interaction Contract
No end-user UI, screen, or visual design requirements are supported by the source.

### Request/Response Interaction Contract
The source defines an API interaction flow:
1. Client application requests an OAuth token from the authorization server.
2. Client includes the bearer token in the `Authorization` header when calling the API.
3. API gateway extracts and validates the token.
4. Gateway verifies token signature, expiration, and required scopes.
5. Valid requests proceed to backend services with authenticated context.
6. Invalid requests receive `401 Unauthorized` with proper error details and `WWW-Authenticate` headers.
7. All authentication events are logged with correlation IDs for audit.

### Error Interaction Requirements
- Unauthorized requests must receive standardized `401` responses.
- `401` responses must include proper `WWW-Authenticate` headers.

### Accessibility Expectations
No UI accessibility requirements are supported by the source.

**Open Questions**
- What standardized error body format is required for unauthorized responses, if any, beyond status code and `WWW-Authenticate` header?
- Should correlation IDs be returned to clients in response headers, or are they only required for logging?

## API Contract
### Inbound Authentication Requirements
- In-scope API requests must present an OAuth 2.0 bearer token in the `Authorization` header.
- The API gateway must validate the bearer token on every request.
- The gateway must reject requests when the token is invalid or expired.
- The gateway must verify:
  - token validity,
  - token expiration,
  - token signature for JWT self-validation,
  - required scopes,
  - client permissions as enforced by the gateway.

### Supported Validation Modes
The gateway must support both:
- **JWT self-validation**
- **Token introspection endpoint validation**

### Authorization Server Integration
- The gateway must integrate with the authorization server via an **OIDC discovery endpoint**.
- Token introspection must be supported for real-time validation.

### Outbound/Forwarding Behavior
- For valid requests, the gateway must allow the request to proceed to backend services with authenticated context.

### Error Contract
For authentication failures:
- Return HTTP `401 Unauthorized`.
- Include proper `WWW-Authenticate` headers.
- Reject invalid or expired tokens.

### Logging and Audit Contract
- The gateway must log all authentication attempts.
- Each logged authentication attempt must include a correlation ID for audit tracking.

### Performance Contract
- Cached token validation must complete within **50ms**.
- Uncached token validation must complete within **200ms**.

### Security and Integration Constraints
- Authentication endpoints must be rate-limited to help prevent brute-force attempts.
- Client secrets must be stored securely in a vault service.

**Open Questions**
- Which requests should use JWT self-validation vs introspection, and what selection logic governs the choice?
- What claims from the token must be propagated as authenticated context to backend services?
- What exact OIDC discovery metadata fields are required by the gateway implementation?
- What are the rate-limit thresholds and behaviors for authentication-related traffic?
- What token introspection request/response contract is expected from the authorization server in this environment?

## Business Logic & Rules
- Every in-scope external API request must be authenticated before reaching backend services.
- A bearer token is required for authenticated access.
- If a token is invalid, the request must be rejected with `401 Unauthorized`.
- If a token is expired, the request must be rejected with `401 Unauthorized`.
- If a token lacks required scope for the requested operation, the gateway must enforce access policies based on token scopes and client permissions.
- The gateway must support two validation approaches:
  - JWT self-validation through signature verification.
  - Introspection-based validation through the authorization server.
- Token caching is permitted and TTL must be based on token expiration claims.
- All authentication attempts, whether successful or unsuccessful, must be logged with correlation IDs.
- Validated requests must continue to backend services with authenticated context.
- Authentication-related processing must satisfy:
  - 50ms max validation time for cached tokens.
  - 200ms max validation time for uncached tokens.
- Authentication endpoints must be rate-limited to reduce brute-force risk.
- API key authentication must not be implemented as part of this feature.
- Token refresh behavior must not be implemented as part of this feature.
- Custom authorization policies beyond OAuth scopes must not be implemented as part of this feature.

**Open Questions**
- What response should be returned for insufficient scope if different from generic `401` handling?
- What is the expected behavior when the introspection endpoint is unavailable?
- What is the fallback behavior if OIDC discovery fails or returns incomplete metadata?

## Data Model & Validation
### Data Elements Explicitly Supported by Source
- **Bearer token**
  - Supplied in the `Authorization` header.
  - Must be validated on every request.
- **JWT token properties**
  - Signature must be verified for self-validation.
  - Expiration must be checked.
  - Scopes must be checked where required.
- **Token cache entry**
  - TTL must be based on token expiration claims.
- **Correlation ID**
  - Must be associated with every authentication attempt log entry.
- **Client secret**
  - Must be stored securely in a vault service.
- **Authenticated context**
  - Must be passed to backend services for valid requests.

### Validation Rules
- Token must not be expired.
- Token must be valid according to JWT self-validation or introspection.
- Token must satisfy required scopes for the requested access.
- Invalid or expired tokens must be rejected.
- Authentication attempt logs must include correlation IDs.

### Data Quality / Retention
- Audit logging is required for all authentication attempts.
- No retention period, schema, or storage format is specified in the source.

**Open Questions**
- What token claims are mandatory beyond signature, expiration, and scope?
- What exact structure should authenticated context take when forwarded to backend services?
- What log schema is required for audit entries beyond inclusion of correlation ID?
- What retention period applies to authentication audit logs?
- How should correlation IDs be generated when absent from an incoming request?

## Functional Requirements
1. The system shall require OAuth 2.0 bearer-token authentication for all in-scope external integration API requests.
2. The API gateway shall extract the bearer token from the `Authorization` header of each incoming request.
3. The system shall validate the bearer token on every request before allowing access to backend services.
4. The system shall reject requests containing invalid tokens.
5. The system shall reject requests containing expired tokens.
6. The API gateway shall support JWT self-validation, including JWT signature verification.
7. The API gateway shall support token introspection endpoint validation for real-time token validation.
8. The API gateway shall integrate with the authorization server via an OIDC discovery endpoint.
9. The system shall verify required scopes during authentication processing for protected requests.
10. The system shall enforce access policies based on token scopes and client permissions as described by the source.
11. The system shall allow valid authenticated requests to proceed to backend services.
12. The system shall pass authenticated context to backend services for valid requests.
13. The system shall return standardized HTTP `401 Unauthorized` responses for authentication failures caused by invalid or expired tokens.
14. The system shall include proper `WWW-Authenticate` headers in `401 Unauthorized` authentication responses.
15. The API gateway shall log all authentication attempts for audit tracking.
16. Each authentication-attempt log entry shall include a correlation ID.
17. The system shall support correlation ID injection for authentication audit trails.
18. Token validation for cached tokens shall complete within 50ms.
19. Token validation for uncached tokens shall complete within 200ms.
20. The system shall cache token validation results using TTL derived from token expiration claims.
21. The system shall support client credentials flow for service-to-service authentication.
22. Authentication-related endpoints or flows shall be rate-limited to help prevent brute-force attempts.
23. Client secrets used for authorization-server integration shall be stored securely in a vault service.
24. The feature shall not implement API key authentication.
25. The feature shall not implement token refresh flow support.
26. The feature shall not implement custom authorization policies beyond OAuth scopes.

## Non-Functional Requirements
### Performance
- Cached token validation must complete within 50ms.
- Uncached token validation must complete within 200ms.
- The implementation must support the stated success metric of authenticating API requests within 50ms overhead, subject to the explicit acceptance criteria above.

### Reliability
- Authentication must be applied consistently to every in-scope request before backend access is granted.

### Security
- Access must be restricted to authorized clients using OAuth 2.0 bearer tokens.
- Invalid and expired tokens must be rejected.
- JWT signature verification must be supported.
- Token introspection must be supported.
- Required scopes and client permissions must be enforced as supported by the source.
- Client secrets must be stored securely in a vault service.
- Authentication-related traffic must be rate-limited to reduce brute-force risk.

### Observability / Auditability
- All authentication attempts must be logged.
- Audit logs must include correlation IDs.

### Compliance
- No explicit regulatory or compliance framework is specified in the source.

### Accessibility
- No accessibility requirement is specified for this API/service feature.

### Operational
- The system must integrate with an authorization server using OIDC discovery.
- The architecture context is monolith.

**Open Questions**
- What availability or error-budget expectations apply to the authentication path?
- What monitoring, alerting, or operational dashboards are required for token validation failures, latency breaches, or introspection outages?

## Acceptance Scenarios
### Scenario 1: Valid JWT bearer token allows access
**Given** an external client calls an in-scope API endpoint with an OAuth 2.0 bearer token in the `Authorization` header  
**And** the gateway can self-validate the JWT signature  
**And** the token is valid, unexpired, and contains required scope  
**When** the API gateway authenticates the request  
**Then** the request is allowed to proceed to backend services  
**And** authenticated context is forwarded  
**And** the authentication attempt is logged with a correlation ID

### Scenario 2: Expired token is rejected
**Given** an external client calls an in-scope API endpoint with an expired bearer token  
**When** the API gateway validates the token  
**Then** the gateway rejects the request  
**And** returns HTTP `401 Unauthorized`  
**And** includes a proper `WWW-Authenticate` header  
**And** logs the authentication attempt with a correlation ID

### Scenario 3: Invalid token is rejected
**Given** an external client calls an in-scope API endpoint with an invalid bearer token  
**When** the API gateway validates the token  
**Then** the gateway rejects the request  
**And** returns HTTP `401 Unauthorized`  
**And** includes a proper `WWW-Authenticate` header  
**And** logs the authentication attempt with a correlation ID

### Scenario 4: Token introspection validates an uncached token
**Given** an external client calls an in-scope API endpoint with a bearer token not available in cache  
**And** the gateway uses token introspection for validation  
**When** the API gateway validates the token with the authorization server  
**Then** validation completes within 200ms  
**And** the request is allowed only if the token is valid, unexpired, and authorized  
**And** the authentication attempt is logged with a correlation ID

### Scenario 5: Cached token validation meets latency target
**Given** an external client calls an in-scope API endpoint with a bearer token whose validation result is cached  
**When** the API gateway validates the token  
**Then** validation completes within 50ms  
**And** the request outcome reflects the cached token validity state  
**And** the authentication attempt is logged with a correlation ID

### Scenario 6: Missing required scope is denied
**Given** an external client calls a protected API endpoint with a valid, unexpired bearer token  
**And** the token does not contain the required scope for that endpoint  
**When** the API gateway enforces scope-based access policies  
**Then** the request is denied  
**And** the authentication/authorization attempt is logged with a correlation ID

### Scenario 7: Authentication logging captures every attempt
**Given** an authentication attempt occurs for an in-scope API request  
**When** the gateway processes the request  
**Then** an audit log entry is created  
**And** the log entry includes a correlation ID  
**And** this applies to both successful and failed authentication attempts

### Scenario 8: OIDC discovery is used for authorization server integration
**Given** the API gateway is configured to integrate with an authorization server  
**When** the gateway initializes or refreshes its authorization server metadata  
**Then** it uses the OIDC discovery endpoint to obtain required integration metadata

## Traceability Matrix
| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| Feature 65663 | FR-1 Require OAuth 2.0 bearer-token authentication for in-scope external integration API requests | Secures external integrations with standardized RESTful API access | Integration test covering authenticated access requirement on protected endpoints |
| US 65665 / US 65673 | FR-3 Validate bearer token on every request | AC1 System validates OAuth tokens and rejects requests with invalid or expired tokens | Request-level authentication test across multiple protected endpoints |
| US 65665 / US 65673 | FR-4 Reject invalid tokens | AC1 System validates OAuth tokens and rejects requests with invalid or expired tokens | Negative test with malformed/invalid token |
| US 65665 / US 65673 | FR-5 Reject expired tokens | AC1 System validates OAuth tokens and rejects requests with invalid or expired tokens | Negative test with expired token |
| US 65665 / US 65673 | FR-15 Log all authentication attempts | AC2 API gateway logs all authentication attempts with correlation IDs for audit tracking | Audit logging test for success and failure cases |
| US 65665 / US 65673 | FR-16 Include correlation ID in each authentication log | AC2 API gateway logs all authentication attempts with correlation IDs for audit tracking | Log schema/assertion test validating correlation ID presence |
| US 65665 / US 65673 | FR-13 Return standardized 401 responses for invalid or expired token failures | AC3 System returns standardized 401 responses with proper WWW-Authenticate headers | API response contract test for unauthorized requests |
| US 65665 / US 65673 | FR-14 Include proper WWW-Authenticate headers | AC3 System returns standardized 401 responses with proper WWW-Authenticate headers | Header validation test on 401 responses |
| US 65665 / US 65673 | FR-18 Cached token validation within 50ms | AC4 Token validation completes within 50ms for cached tokens | Performance test using cached token path |
| US 65665 / US 65673 | FR-19 Uncached token validation within 200ms | AC4 Token validation completes within 50ms for cached tokens and 200ms for uncached | Performance test using uncached/introspection or fresh-validation path |
| US 65665 / US 65673 | FR-6 Support JWT self-validation | AC5 Gateway supports both JWT self-validation and token introspection endpoints | Unit/integration test verifying JWT signature validation path |
| US 65665 / US 65673 | FR-7 Support token introspection endpoint validation | AC5 Gateway supports both JWT self-validation and token introspection endpoints | Integration test verifying introspection validation path |
| US 65665 / US 65673 | FR-8 Integrate with authorization server using OIDC discovery | Story description: Authorization server integration via OIDC discovery endpoint | Integration/configuration test validating discovery-based metadata retrieval |
| US 65665 / US 65673 | FR-20 Cache token validation with TTL based on expiration claims | Story description: Token caching with TTL based on token expiration claims | Unit/integration test for TTL derivation from token expiration |
| US 65665 / US 65673 | FR-21 Support client credentials flow for service-to-service authentication | Story description: Client credential flow support for service-to-service authentication | Integration test using machine-to-machine token acquisition and API access |
| US 65665 / US 65673 | FR-22 Rate-limit authentication-related endpoints or flows | Story description: Rate limiting on authentication endpoints to prevent brute force | Security test for rate-limit enforcement behavior |
| US 65665 / US 65673 | FR-23 Store client secrets securely in vault service | Story description: Secure storage of client secrets in vault service | Configuration/security validation test for secret source |
| US 65665 / US 65673 | FR-24 Exclude API key authentication | Out of Scope: API key authentication | Scope validation / non-implementation review |
| US 65665 / US 65673 | FR-25 Exclude token refresh flow | Out of Scope: Token refresh flow implementation | Scope validation / non-implementation review |
| US 65665 / US 65673 | FR-26 Exclude custom authorization policies beyond OAuth scopes | Out of Scope: Custom authorization policies beyond OAuth scopes | Scope validation / non-implementation review |

## Open Questions
1. What exact external integration endpoints are in scope for mandatory authentication?
2. Are any endpoints exempt from authentication, such as health checks, readiness probes, or OIDC metadata access?
3. What specific scopes are required for each endpoint or resource category?
4. What client permissions model must be enforced in addition to OAuth scopes?
5. What exact behavior and HTTP response should apply for insufficient scope or insufficient client permission?
6. What standardized response body schema should be returned with `401 Unauthorized` responses?
7. Should correlation IDs be accepted from incoming requests, generated by the gateway, or both?
8. Should the gateway return the correlation ID to the client in a response header?
9. What fields must be included in the authenticated context forwarded to backend services?
10. What criteria determine whether JWT self-validation or token introspection is used for a given request?
11. What fallback behavior is required if the token introspection endpoint is unavailable?
12. What fallback behavior is required if OIDC discovery is unavailable or returns invalid metadata?
13. What rate-limit thresholds, windows, and response behavior are required for authentication-related requests?
14. What token claims are mandatory beyond signature, expiration, and scope?
15. What audit log schema, destination, and retention period are required?
16. Is there a required format or propagation standard for correlation IDs across gateway and backend services?
17. Does "all external integration endpoints" include only advertising-platform integrations, or all external APIs exposed by the platform?
18. Is the API gateway a dedicated component or a logical gateway layer within the monolith deployment?
19. What operational monitoring and alerting are required for latency threshold breaches, auth failures, and authorization-server dependency failures?
20. What specific success metric measurement method should be used for the stated "100% of API requests authenticated within 50ms overhead" goal?

## Source References
- **Feature**
  - Feature ID 65663
  - Feature Reference 65663
  - Feature Title: RESTful API Integration Framework
  - Feature State: New
  - User-selected Architecture Style: monolith

- **User Stories**
  - US 65665: As an API Developer, I want to configure API gateway authentication so that only authorized clients access our services
  - US 65673: As an API Developer, I want to configure API gateway authentication so that only authorized clients access our services

- **Acceptance Criteria Used**
  - AC1: System validates OAuth tokens and rejects requests with invalid or expired tokens
  - AC2: API gateway logs all authentication attempts with correlation IDs for audit tracking
  - AC3: System returns standardized 401 responses with proper WWW-Authenticate headers
  - AC4: Token validation completes within 50ms for cached tokens and 200ms for uncached
  - AC5: Gateway supports both JWT self-validation and token introspection endpoints

- **Additional Story Source References**
  - Authorization server integration via OIDC discovery endpoint
  - Client credential flow support for service-to-service authentication
  - Correlation ID injection for authentication audit trails
  - Token caching with TTL based on token expiration claims
  - Rate limiting on authentication endpoints to prevent brute force
  - Secure storage of client secrets in vault service
  - Out of scope exclusions:
    - API key authentication
    - Custom authorization policies beyond OAuth scopes
    - Token refresh flow implementation

- **Golden Repo Convention References Used**
  - None explicitly provided in source context beyond application type signal extraction.