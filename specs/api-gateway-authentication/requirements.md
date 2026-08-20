# Implementation Requirements Checklist

**Purpose**: Provide an implementation acceptance checklist that agents can execute one item at a time.  
**Feature**: RESTful API Integration Framework

## Functional Acceptance Criteria

- [ ] OAuth 2.0 bearer-token authentication is enforced on all external integration API gateway entry points covered by this feature
- [ ] Requests with invalid, expired, malformed, or missing bearer tokens are rejected before reaching backend services
- [ ] Valid authenticated requests are forwarded with authenticated client/token context available to downstream application handling
- [ ] Required token checks are implemented for signature/validity, expiration, and required scopes where source-supported
- [ ] The gateway supports both JWT self-validation and authorization-server token introspection validation paths
- [ ] OIDC discovery is used to obtain authorization-server metadata where source-supported
- [ ] Client credentials flow support for service-to-service access is implemented where required for external clients to obtain usable bearer tokens
- [ ] Standardized 401 Unauthorized responses are returned for authentication failures, including proper `WWW-Authenticate` headers
- [ ] Authentication attempts are logged for both success and failure paths with correlation IDs for audit tracking
- [ ] Primary flow is implemented and verifiable: token supplied, token validated, scope checked, request allowed
- [ ] Failure flows are implemented and verifiable: missing token, invalid token, expired token, insufficient scope, introspection/JWKS validation failure, authorization-server unavailability
- [ ] Alternate validation flow is implemented and verifiable for both cached-token validation and uncached-token validation

## UI Acceptance Criteria

- [ ] API-facing error responses follow existing service response conventions while preserving the required standardized 401 behavior
- [ ] Authentication failure payloads expose useful machine-readable error details without leaking secrets or internal validation details
- [ ] Correlation IDs are included or propagated in API interactions and are discoverable by operators through response headers or logging conventions where supported by the service
- [ ] Existing API design conventions for header handling, status codes, and error schema are followed consistently across protected endpoints
- [ ] Any configuration surfaces or operational endpoints introduced for this feature follow existing local admin/configuration UI or API conventions if such surfaces exist

## API and Integration Acceptance Criteria

- [ ] The gateway accepts bearer tokens from the `Authorization` header using the OAuth 2.0 Bearer scheme
- [ ] JWT self-validation verifies token signature against trusted issuer keys and validates issuer/audience/expiry claims where source-supported
- [ ] Token introspection integration calls the configured authorization-server introspection endpoint and enforces the returned active/inactive token status
- [ ] Authorization-server connectivity is configured via discovery metadata rather than hard-coded endpoints where source-supported
- [ ] Token-validation caching is implemented with TTL bounded by token expiration claims
- [ ] Cached-token validation meets the 50ms target and uncached-token validation meets the 200ms target under verification conditions
- [ ] Authentication endpoint or validation path rate limiting is implemented where source-supported to reduce brute-force abuse
- [ ] Client secrets or equivalent sensitive integration credentials are stored and retrieved through the project’s vault/secret-management mechanism where source-supported
- [ ] Backend services receive only the authenticated context required for authorization/auditing and do not require direct access to raw secrets
- [ ] Existing API contracts remain backward-compatible except for the intentional addition of authentication requirements on covered endpoints

## Business Logic and Data Acceptance Criteria

- [ ] Token validation logic enforces rejection of expired tokens based on token claims or introspection response
- [ ] Scope-based access enforcement is implemented only to the extent source-supported; custom authorization policies beyond OAuth scopes are not introduced
- [ ] Token cache entries expire no later than the token’s actual expiration time
- [ ] Correlation IDs are generated or propagated consistently across authentication processing and audit logging
- [ ] Authentication audit records include enough data to trace request outcome, correlation ID, validation method, and failure reason without storing sensitive secrets
- [ ] Error handling covers malformed authorization headers, unsupported token types, invalid signatures, inactive introspection responses, cache misses, and upstream authorization-server errors
- [ ] API key authentication is not implemented as part of this feature
- [ ] Token refresh flow is not implemented as part of this feature
- [ ] If required scopes per endpoint are not defined in the source, no endpoint-specific scope assumptions are implemented; this remains an open clarification item until explicitly specified

## Non-Functional Acceptance Criteria

- [ ] Authentication is applied consistently so that no protected external integration endpoint is left anonymously accessible
- [ ] Authentication logging supports auditability and incident investigation through correlation IDs on all access attempts
- [ ] Performance verification demonstrates token validation within 50ms for cached tokens and 200ms for uncached tokens
- [ ] Reliability behavior is defined and implemented for authorization-server dependency failures, including safe rejection behavior when token validity cannot be established
- [ ] Sensitive values such as client secrets, private keys, and introspection credentials are never hard-coded, logged, or exposed in error responses
- [ ] Observability is implemented for authentication success/failure counts, validation-path usage, latency, and upstream authorization-server dependency issues where supported by local conventions
- [ ] Implementation follows the selected monolith architecture style and existing local gateway/service conventions
- [ ] Tests or verification steps cover the highest-risk behavior: valid token acceptance, invalid token rejection, expired token rejection, scope enforcement, JWT validation, introspection validation, cache behavior, logging, headers, and latency targets

## Traceability

- [ ] Every implemented change maps back to the feature’s authentication requirements and the user-story acceptance criteria for token validation, logging, 401 handling, latency, and dual validation support
- [ ] Duplicate user stories with the same acceptance criteria are implemented once in shared feature behavior and traced appropriately without divergent behavior
- [ ] Every non-blocking Open Question that was implemented has a recorded decision + one-line rationale in `specs/<slug>/assumptions.md` (no Open Question is silently assumed)
- [ ] No BLOCKING Open Question was implemented as an assumption; unresolved blocking details such as exact protected endpoint scope, required endpoint-to-scope mappings, or concrete authorization-server environment specifics must hold completion until clarified if they are required for release

## Notes

- Never resolve an Open Question silently. In an unattended run, record the chosen assumption + rationale in `specs/<slug>/assumptions.md`; blocking questions must instead hold the feature at needs-clarification.
- Mark an item complete only after verifying actual implementation code and behavior.