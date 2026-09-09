# Feature: Shopping Website User Interaction
Status: NEW
Owner: Astra
Last Updated: 2026-09-09

## Summary
Feature 77599, **Shopping Website User Interaction**, establishes the baseline customer-facing shopping experience for a retail e-commerce website. The feature enables users to:

- browse purchasable products in a catalog,
- open a dedicated product detail page for an item,
- add items to a session-bound shopping cart,
- review and update cart contents.

The business outcome is a usable, secure, auditable, and traceable web shopping baseline that supports product presentation and item selection for purchase. The source explicitly constrains scope to product presentation, product detail interaction, and cart-oriented item selection flows.

## Scope
### In Scope
Based on the feature description and selected in-scope user stories, this feature includes:

- Public catalog browsing for active, non-deleted, purchasable products
- Paginated catalog retrieval using validated `page` and `pageSize`
- Rendering catalog product information including:
  - `productName`
  - `sku`
  - `price`
  - `currency`
  - `availability`
- Dedicated product detail page access by valid product identifier
- Product detail rendering for active purchasable products including:
  - `productName`
  - `sku`
  - `category`
  - `price`
  - `currency`
  - `availability`
  - supporting product details
- Direct URL, refresh, and browser back/forward restoration for catalog, product detail, and cart page state
- Add-to-cart from supported product views using `productId` or `skuId`
- Session-bound cart creation when none exists
- Cart review for active session carts
- Cart quantity updates for owned cart items
- Cart item removal for owned cart items
- Cart totals display for current cart contents
- Validation, audit, telemetry, HTTPS, rate limiting, CSRF protection, secure session handling, sanitized error handling, and safe public interaction patterns where stated by source stories

### Out of Scope
The source explicitly excludes the following from this feature scope:

- Ratings, reviews, recommendation widgets, and social proof elements
- Rich product media requirements beyond safe degradation of optional media
- Cart checkout submission, payment processing, and order confirmation
- Wishlist, saved-for-later, and bundle purchase flows
- Tax, shipping, coupon, loyalty, and promotional pricing rules beyond current line and cart totals in US 77631
- Back-office catalog management, publication workflows, and merchandising workflows
- Cross-device saved carts outside the active shopping session
- Checkout information capture, payment authorization, order placement, and post-purchase confirmation stories included in source context but outside the constrained epic scope described for this feature
- Test management, draft plan, suite assignment, and scope issue work items from unrelated design-state stories

## Application Type & Platform Context
### Application Type
Mixed web application and backend/API support.

### Source Evidence
The source states:

- “establish a usable, compliant, and traceable **web shopping experience** baseline”
- “customer-facing **web capability** to present products”
- `GET /api/catalog/products` is explicitly required
- Product detail requests, cart mutations, and session/cart retrieval imply supporting server-side/API behavior

### Platform Context
- Customer-facing web shopping experience
- Public browsing flows for catalog and product detail
- Session-based cart behavior tied to current browser session
- Backend services or server-side capabilities for validation, inventory checks, pricing retrieval, and cart persistence

### Open Question
- The source labels application type as “mixed” but does not define whether the UI is server-rendered web, SPA, or another web delivery pattern.

## Actors and Permissions
### Actors
- **Shopping website user**
- **Shopper**

The source uses these personas interchangeably for the customer-facing shopping flows in this feature area.

### Permissions and Access Constraints
#### Public/Unauthenticated Access
Supported by source for:
- Catalog browsing
- Product detail access

Constraints:
- Public access must use HTTPS
- Public catalog endpoint must apply rate limiting
- Requests must use sanitized handling and safe error responses
- Product data returned must be limited to active, non-deleted, purchasable items

#### Session-Bound Cart Access
Supported by source for:
- Adding to cart
- Viewing cart
- Updating quantities
- Removing cart items

Constraints:
- Cart must be associated with the current browser session
- Cart ownership must be enforced server-side by session
- Another session’s cart data must not be exposed
- Secure session cookie binding is required
- CSRF protection is required for cart mutations
- TLS/HTTPS transport is required

### Open Questions
- Whether authenticated users are in scope for this feature’s cart behavior is not explicitly defined; current selected cart stories primarily define active browser session behavior.
- Whether guest and authenticated cart merging behavior is needed is not defined.

## Feature Development Intent
This is feature-development work to build the foundational shopping interaction capabilities that do not currently exist. The source states there is no implemented catalog browsing flow, no product detail experience, and no defined reliable cart creation/review/update behavior.

The delivered behavior must enable a user to move through the early shopping journey:

1. Discover active purchasable products in a catalog
2. Inspect an individual product in a dedicated detail page
3. Select an item for purchase by adding it to a session cart
4. Review and maintain cart accuracy before later checkout capabilities are introduced

The required outcome is a production-ready baseline with controlled invalid states, secure public interaction, server-side validation, auditability, telemetry, and session-consistent behavior across refresh and navigation events.

## UI Design & Interaction Contract
### Catalog Browsing
The catalog UI shall support:

- A public catalog route with optional `page` and `pageSize` query parameters
- Product card rendering for each returned product
- Visible fields per card:
  - product name
  - SKU reference
  - price
  - currency
  - availability
- Pagination controls that update the browser URL to the selected page context
- Refresh and browser back/forward behavior that restores the same page and result set context
- A defined empty-state message when no eligible products exist for the requested page
- No incomplete product cards or placeholder price values when no products are available
- Controlled invalid-parameter/error states without exposing internal exception details in the UI

The source mentions responsive browsing, so the UI must support browsing behavior appropriate to web use across responsive layouts, but no specific breakpoints or component patterns are provided.

### Product Detail Page
The product detail UI shall support:

- Navigation from a catalog item to a dedicated product detail page using product identifier context
- Direct URL access to the product detail route
- Browser refresh and back/forward navigation that restores:
  - the same valid product state, or
  - the same controlled not-found/unavailable outcome
- Display of:
  - `productName`
  - `sku`
  - `category`
  - `price`
  - `currency`
  - `availability`
  - supporting product details
- Controlled not-found or unavailable state for malformed, unknown, inactive, deleted, or not purchasable identifiers
- Safe degradation when optional assets such as media are unavailable, without blocking the base page

### Add-to-Cart Interaction
Supported UI behavior includes:

- Add-to-cart initiation from catalog cards and product detail pages
- Default quantity of `1` or explicitly entered quantity
- Immediate response reflecting mutation outcome
- Updated cart item count after successful add
- Success or validation feedback after add attempt
- No cart state change when validation fails

The source does not define exact control labels, placement, or message copy.

### Cart Review and Update Page
The cart UI shall support:

- Direct navigation to a cart page for the active session
- Page refresh and direct cart URL access with the same current cart state preserved during the active session
- Display of each cart line with:
  - product name
  - quantity
  - unit price
  - line total
- Display of current cart total
- Editable quantity control for each cart line
- Remove control for each cart line
- Immediate cart refresh after quantity change or removal
- Confirmation or error feedback after mutations
- Preservation of current cart state when an update or removal fails

### Validation and Error Presentation
The UI shall present controlled, client-safe outcomes for:

- Invalid catalog query parameters
- Empty catalog results
- Invalid or unavailable product detail requests
- Invalid cart quantity submissions
- Out-of-stock cart add/update attempts
- Stale or nonexistent `cartItemId` references

The source requires:
- field-level validation only for checkout information stories, which are out of current constrained scope
- no raw internal exception details in UI
- sanitized error responses

### Accessibility Expectations
The source does not provide explicit accessibility requirements.

### Open Questions
- Exact catalog route, product detail route, and cart route paths are not specified.
- Exact empty-state and validation message copy is not specified.
- Specific accessibility conformance targets are not specified.
- Whether cart feedback is inline, toast-based, modal, or banner-based is not specified.
- Whether catalog pagination displays total pages/count is not specified.

## API Contract
Only source-supported operations are included below.

### GET /api/catalog/products
#### Purpose
Retrieve a paginated catalog of active, non-deleted, purchasable products.

#### Inputs
Query parameters:
- `page`
- `pageSize`

#### Validation
- `page` and `pageSize` must be present with valid values when provided
- Reject when missing, non-numeric, less than `1`, or greater than configured maximum
- Must return a controlled client-safe response
- Must not expose internal exception details in API body

#### Output
For each returned product, include:
- `productName`
- `sku`
- `price`
- `currency`
- `availability`

Source technical considerations also indicate `productId` is part of retrieval/joined data.

#### Filtering Rules
Return only products that are:
- active
- non-deleted
- purchasable

#### Security and Operations
- HTTPS required
- Public endpoint rate limiting required
- Sanitized query handling and output encoding required
- Telemetry required for:
  - successful retrieval
  - empty result
  - invalid parameter
  - downstream failure

### Product Detail Retrieval Operation
The source defines product detail requests but does not provide a named endpoint or method.

#### Purpose
Retrieve product detail data for a supplied product identifier.

#### Inputs
- Product identifier in route context or direct URL context

#### Validation
- Server-side identifier validation is required
- Must reject malformed, unknown, inactive, deleted, or not purchasable products with controlled not-found or unavailable outcome

#### Output for Valid Active Purchasable Product
Must populate:
- `productName`
- `sku`
- `category`
- `price`
- `currency`
- `availability`
- supporting product details

#### Additional Contract Rules
- Price and availability must match currently published catalog data for the same product during the active session
- HTTPS required
- Sanitized error responses required
- Telemetry required for:
  - successful views
  - validation failures
  - not-found/unavailable outcomes
  - dependency failures

### Add-to-Cart Operation
The source defines behavior but not a specific endpoint or method.

#### Purpose
Add a valid product selection to the current session cart.

#### Inputs
- `productId` or `skuId`
- `quantity`
- request identity key / idempotency key

#### Validation
- Identifier must be valid
- Product/SKU must be active and purchasable
- `quantity` must be a positive integer
- `quantity` must not be missing, non-numeric, zero, negative, or greater than available inventory

#### Behavior
- If no active cart exists for the current browser session, create one
- Associate new cart to that session
- Apply only one cart mutation for repeated submissions with same request identity key
- Persist cart and audit changes transactionally

#### Output
- Updated cart item count
- Consistent retry-safe response for duplicate attempts with same request identity key

#### Security and Operations
- CSRF protection required
- Secure session cookie binding required
- Server-side cart ownership checks required
- TLS transport required
- Audit entry required for each add attempt with:
  - `cartId`
  - `productId` or `skuId`
  - requested quantity
  - timestamp
  - request identity
  - outcome code
- Must exclude payment data and unnecessary personal information
- Observability must log:
  - requestId or idempotencyKey
  - cartId
  - productId or skuId
  - quantity
  - response code
  - duplicate-suppression outcome

### Cart Retrieval Operation
The source defines cart page retrieval behavior but not a specific endpoint or method.

#### Purpose
Return the current active session cart and cart lines.

#### Output
For each cart item:
- product name
- quantity
- unit price
- line total

Also include:
- current cart total

#### Security and Operations
- Must enforce session ownership
- Must not expose another session’s cart data
- Telemetry/logging required for cart retrieval
- Active session cart state must remain available after refresh and direct cart URL access

### Cart Quantity Update Operation
The source defines behavior but not a specific endpoint or method.

#### Inputs
- `cartItemId`
- new quantity

#### Validation
- `cartItemId` must exist and be owned by active session
- quantity must be positive integer
- quantity must not be non-positive or non-integer
- inventory sufficiency must be revalidated

#### Behavior
- Update line quantity when valid
- Recalculate affected totals in response
- Leave persisted cart contents unchanged when validation fails

#### Audit
Each quantity update must write an audit event with:
- `cartId`
- `cartItemId`
- timestamp
- old quantity
- new quantity
- outcome code

### Cart Remove Operation
The source defines behavior but not a specific endpoint or method.

#### Inputs
- `cartItemId`

#### Validation
- `cartItemId` must exist and be owned by active session

#### Behavior
- Delete cart line
- Return refreshed cart contents and updated cart total

#### Audit
Each removal must write an audit event with:
- `cartId`
- `cartItemId`
- timestamp
- outcome code

### Open Questions
- Exact endpoint paths and HTTP methods for product detail, add-to-cart, cart retrieval, cart quantity update, and cart removal are not specified.
- Response schemas, status codes, and error code structures for cart operations are not explicitly defined.
- Configured maximum `pageSize` value is not specified.
- Whether `productId` and `skuId` may both be submitted or exactly one is required is not specified.
- The shape of “supporting product details” is not defined.
- Correlation ID propagation format is not specified.

## Business Logic & Rules
- Only active, non-deleted, purchasable products are eligible for catalog display.
- Product detail may only render for active purchasable products.
- Malformed, unknown, inactive, deleted, or not purchasable product identifiers must produce controlled not-found or unavailable outcomes.
- Product detail price and availability must match the currently published catalog data for the same product during the active session.
- Optional media/assets must degrade safely and must not block base product detail rendering.
- Add-to-cart accepts a valid active `productId` or `skuId` with in-stock positive integer quantity.
- First successful add-to-cart in a browser session creates a new cart if none exists.
- Cart is associated to the current browser session.
- Invalid add-to-cart quantity must not change any cart or cart item record.
- Add-to-cart requests must be idempotent by request identity key; repeated identical requests with the same key must produce only one mutation.
- Cart page returns each cart item with product name, quantity, unit price, line total, and current cart total.
- Valid cart quantity changes update the specific owned cart line and recalculate totals.
- Valid remove actions delete the owned cart line and recalculate totals.
- Invalid quantity update, stale/nonexistent `cartItemId`, or insufficient stock on update must be rejected without changing persisted cart contents.
- Cart state persists for the active session across refresh and direct cart URL access.
- Audit records are required for:
  - add-to-cart attempts
  - quantity updates
  - removals
- Audit records must exclude payment data and unnecessary personal information.
- Public interaction must be HTTPS protected.
- Public catalog access must be rate limited.
- Mutating cart operations must use CSRF protection and secure session ownership enforcement.

## Data Model & Validation
Only source-supported entities and fields are listed.

### Product/Catalog Data
Relevant source entities/signals:
- Products
- ProductSkus
- ProductPrices
- ProductInventory
- CatalogCategories
- ProductMedia

Supported fields:
- `productId`
- `productName`
- `sku`
- `skuId`
- `category`
- `price`
- `currency`
- `availability`

Validation and quality constraints:
- Product must be active
- Product must be non-deleted for catalog listing
- Product must be purchasable
- Product identifier format rules must be enforced server-side
- Catalog responses must not include incomplete product cards or placeholder price values

### Cart Data
Relevant entities/signals:
- Cart
- CartItems
- SessionStore

Supported fields:
- `cartId`
- `cartItemId`
- `productId` or `skuId`
- quantity
- unit price
- line total
- cart total

Validation rules:
- Cart must belong to current browser session
- `cartItemId` must exist for update/remove
- Quantity must be a positive integer
- Quantity must not exceed available inventory
- Invalid quantity or stale line references must not mutate persisted cart contents

### Audit Data
Supported audit fields:
- `cartId`
- `cartItemId` where applicable
- `productId` or `skuId`
- requested quantity
- old quantity
- new quantity
- timestamp
- request identity
- outcome code

Data constraints:
- Exclude payment data
- Exclude unnecessary personal information

### Telemetry/Observability Data
Supported telemetry/logging fields:
- `correlationId`
- `responseTimeMs`
- requestId or idempotencyKey
- cartId
- productId or skuId
- quantity
- response code
- duplicate-suppression outcome
- result count
- page load duration
- invalid parameter events
- empty-result events
- upstream/downstream failure events

### Open Questions
- No complete cart response schema is specified.
- No explicit retention period for carts, audits, or telemetry is specified.
- No canonical identifier format for `productId`, `skuId`, or `cartItemId` is specified.
- “Supporting product details” fields are not enumerated.

## Functional Requirements
### Catalog
FR-1. The system shall provide a public catalog retrieval flow for purchasable products.  
FR-2. The system shall process `GET /api/catalog/products` using `page` and `pageSize` query parameters.  
FR-3. The system shall return only products that are active, non-deleted, and purchasable in catalog results.  
FR-4. The system shall include `productName`, `sku`, `price`, `currency`, and `availability` for each returned catalog item.  
FR-5. The system shall return a controlled client-safe response when `page` or `pageSize` is missing, non-numeric, less than 1, or greater than the configured maximum.  
FR-6. The system shall not expose internal exception details in catalog UI or API responses.  
FR-7. When no eligible products exist for the requested page, the system shall display a defined empty-state message and render no incomplete product cards or placeholder price values.  
FR-8. When the user navigates between catalog pages, the browser URL shall update to the selected page context.  
FR-9. On refresh or browser back-forward navigation, the system shall restore the same catalog page and result set context or the same controlled invalid-parameter/error state.  
FR-10. The catalog endpoint shall be served over HTTPS.  
FR-11. The catalog endpoint shall apply rate limiting.  
FR-12. The system shall emit telemetry for catalog success, empty result, invalid parameter, and downstream failure outcomes.

### Product Detail
FR-13. The system shall provide a dedicated product detail page for a valid product route or direct URL.  
FR-14. For an active purchasable product, the product detail page shall display `productName`, `sku`, `category`, `price`, `currency`, `availability`, and supporting product details.  
FR-15. When the same product is visible in the catalog and opened in detail during the active session, the detail page price and availability shall match the currently published catalog data for that product.  
FR-16. When the product identifier is malformed, unknown, inactive, deleted, or not purchasable, the system shall return a controlled not-found or unavailable state and shall not render partial product content.  
FR-17. The product detail page shall support direct URL access, browser refresh, and back-forward navigation while restoring the same product state or the same controlled not-found/unavailable outcome.  
FR-18. Product detail requests shall enforce server-side identifier validation.  
FR-19. Product detail requests shall require HTTPS transport.  
FR-20. Product detail error responses shall be sanitized.  
FR-21. The system shall emit telemetry for successful product views, validation failures, not-found/unavailable outcomes, and dependency failures.  
FR-22. Optional media or similar assets shall degrade safely without blocking base product detail rendering.

### Add to Cart
FR-23. The system shall accept add-to-cart requests from catalog cards and product detail pages using `productId` or `skuId`.  
FR-24. When the request contains a valid active `productId` or `skuId` and an in-stock positive integer quantity, the system shall add the item to the current session cart.  
FR-25. After a successful add-to-cart mutation, the system shall return the updated cart item count.  
FR-26. If no active cart exists for the current browser session, the first successful add-to-cart request shall create a new cart record associated to that session.  
FR-27. If quantity is missing, non-numeric, zero, negative, or greater than available inventory, the system shall reject the request with a validation error and shall not change any cart or cart item record.  
FR-28. Add-to-cart processing shall validate identifier format, active status, purchasable eligibility, quantity rules, and available inventory before mutation.  
FR-29. When the same add-to-cart request is submitted multiple times with the same request identity key, the system shall apply only one cart mutation.  
FR-30. For repeated add-to-cart submissions with the same request identity key, the system shall return a consistent retry-safe response.  
FR-31. Each add-to-cart attempt shall write an audit entry containing `cartId`, `productId` or `skuId`, requested quantity, timestamp, request identity, and outcome code.  
FR-32. Add-to-cart audit entries shall exclude payment data and unnecessary personal information.  
FR-33. Add-to-cart operations shall enforce CSRF protection, secure session cookie binding, TLS transport, and server-side cart ownership checks.

### Cart Review and Update
FR-34. When the cart page is opened for an active session with an existing cart, the system shall return and display each cart item with product name, quantity, unit price, line total, and current cart total.  
FR-35. The cart page shall remain available for the active session after browser refresh and direct navigation to the cart URL.  
FR-36. When a valid quantity change is submitted for an existing `cartItemId` owned by the active session and sufficient inventory exists, the system shall update that line quantity and recalculate affected totals in the response.  
FR-37. When a remove action is submitted for an existing `cartItemId` owned by the active session, the system shall delete that cart line and return refreshed cart contents and updated cart total.  
FR-38. If a quantity update uses a non-positive or non-integer quantity, references a stale or nonexistent `cartItemId`, or requests more stock than available, the system shall reject the change and leave persisted cart contents unchanged.  
FR-39. Cart retrieval, quantity update, and remove operations shall enforce session ownership and shall not expose another session’s cart data.  
FR-40. Each quantity update or removal shall write an audit event with `cartId`, `cartItemId`, timestamp, old and new quantity where applicable, and outcome code.  
FR-41. Cart mutation operations shall use CSRF protection, secure session cookies, TLS transport, and sanitized item identifiers.

## Non-Functional Requirements
NFR-1. The feature shall support a customer-facing web shopping experience baseline.  
NFR-2. Public catalog and product detail access shall use HTTPS/TLS transport.  
NFR-3. The public catalog endpoint shall apply rate limiting.  
NFR-4. The system shall use sanitized error handling and shall not expose internal exception details to users or API consumers.  
NFR-5. The system shall use output encoding and sanitized query/identifier handling where public input is accepted.  
NFR-6. Cart mutation operations shall enforce CSRF protection.  
NFR-7. The system shall enforce secure session cookie binding for session-bound cart behavior.  
NFR-8. The system shall enforce server-side cart ownership checks to prevent cross-session access.  
NFR-9. The system shall emit telemetry and structured observability data for catalog retrieval, product detail access, cart retrieval, cart mutations, validation failures, empty results, not-found/unavailable states, duplicate suppression outcomes, and dependency failures.  
NFR-10. Catalog first load performance should target under 2 seconds under standard browsing load.  
NFR-11. Subsequent catalog page navigation should target under 1.5 seconds.  
NFR-12. Product detail page loads should target under 2 seconds for standard page loads.  
NFR-13. Add-to-cart requests should complete within 1.5 seconds under expected conditions.  
NFR-14. Cart retrieval should complete within 1.5 seconds.  
NFR-15. Standard cart update or remove operations should complete within 1 second.  
NFR-16. The system shall support retry-safe and conflict-safe behavior for repeated clicks, retries, and concurrent tab interactions where specified.  
NFR-17. Audit records shall be written for cart mutations and shall exclude payment data and unnecessary personal information.  
NFR-18. Caching support should be used for repeated product reads and where catalog size is high, if implemented within the approved architecture.

## Acceptance Scenarios
### Catalog Browsing
#### Scenario 1: Retrieve first catalog page successfully
Given a user accesses the public catalog route with valid `page` and `pageSize` values  
When the system processes `GET /api/catalog/products`  
Then the response contains only active, non-deleted, purchasable products  
And each returned item includes `productName`, `sku`, `price`, `currency`, and `availability`  
And the catalog page renders those products

#### Scenario 2: Handle invalid catalog pagination parameters
Given a user requests the catalog with missing, non-numeric, less-than-1, or over-limit `page` or `pageSize` values  
When the system validates the request  
Then the system returns a controlled client-safe response  
And no internal exception details are exposed in the UI or API body

#### Scenario 3: Show empty state when no eligible products exist
Given a valid catalog request for a page with no eligible products  
When the system returns no catalog items  
Then the catalog page displays the defined empty-state message  
And no incomplete product cards are rendered  
And no placeholder price values are shown

#### Scenario 4: Preserve catalog navigation state
Given a user navigates to a specific catalog page  
When the user refreshes the browser or uses back-forward navigation  
Then the browser URL retains the selected page context  
And the same page and result set context is restored

### Product Detail
#### Scenario 5: Open product detail for a valid active product
Given a valid product detail route for an active purchasable product  
When the system retrieves product data  
Then the dedicated product detail page is returned  
And it displays `productName`, `sku`, `category`, `price`, `currency`, `availability`, and supporting product details

#### Scenario 6: Keep detail price and availability aligned with catalog
Given the same product is visible in the catalog during the active session  
When the user opens that product in the detail view  
Then the detail page displays price and availability matching the currently published catalog data for that product

#### Scenario 7: Handle invalid or unavailable product identifier
Given the supplied product identifier is malformed, unknown, inactive, deleted, or not purchasable  
When the system processes the product detail request  
Then the system returns a controlled not-found or unavailable state  
And partial product content is not rendered

#### Scenario 8: Preserve product detail state on direct access and refresh
Given a user opens a product detail page by direct URL or from the catalog  
When the user refreshes the page or uses browser back-forward navigation  
Then the same product state is restored  
Or the same controlled not-found/unavailable outcome is restored

### Add to Cart
#### Scenario 9: Add valid item to existing session cart
Given an active browser session with an existing cart  
And the request contains a valid active `productId` or `skuId` and an in-stock positive integer quantity  
When the user submits add-to-cart  
Then the system adds the item to the current session cart  
And returns the updated cart item count

#### Scenario 10: Create cart on first successful add
Given the current browser session has no active cart  
And the request contains a valid active `productId` or `skuId` and an in-stock positive integer quantity  
When the user submits add-to-cart  
Then the system creates a new cart record  
And associates it to the current session  
And stores the requested line item in the new cart  
And returns the updated cart item count

#### Scenario 11: Reject invalid quantity on add
Given an add-to-cart request with missing, non-numeric, zero, negative, or over-inventory quantity  
When the system validates the request  
Then the system rejects the request with a validation error  
And no cart or cart item record is changed

#### Scenario 12: Suppress duplicate add-to-cart mutation
Given the same valid add-to-cart request is submitted multiple times with the same request identity key  
When the system processes the repeated submissions  
Then only one cart mutation is applied  
And subsequent attempts return a consistent retry-safe response

#### Scenario 13: Audit add-to-cart attempts
Given any add-to-cart attempt is processed  
When the system records the operation  
Then an audit entry is written with `cartId`, `productId` or `skuId`, requested quantity, timestamp, request identity, and outcome code  
And the audit record excludes payment data and unnecessary personal information

### Cart Review and Update
#### Scenario 14: View active session cart
Given an active session with an existing cart  
When the user opens the cart page  
Then the system displays each cart item with product name, quantity, unit price, and line total  
And displays the current cart total

#### Scenario 15: Update cart quantity successfully
Given an active session cart containing an existing `cartItemId` owned by that session  
And sufficient inventory exists for the requested new quantity  
When the user submits a valid positive integer quantity change  
Then the system updates the cart line quantity  
And recalculates affected totals in the response  
And writes an audit event for the update

#### Scenario 16: Remove cart item successfully
Given an active session cart containing an existing `cartItemId` owned by that session  
When the user submits a remove action  
Then the system deletes that cart line  
And returns refreshed cart contents and updated cart total  
And writes an audit event for the removal

#### Scenario 17: Reject invalid cart quantity update
Given a quantity update request with a non-positive or non-integer quantity, stale or nonexistent `cartItemId`, or requested quantity above available stock  
When the system validates the request  
Then the system rejects the change  
And leaves persisted cart contents unchanged

#### Scenario 18: Preserve cart state across refresh and direct navigation
Given an active session with cart contents  
When the user refreshes the cart page or navigates directly to the cart URL during the same session  
Then the same current cart state remains available

## Traceability Matrix
| Source ID | Requirement | Acceptance Criteria | Test Coverage |
|---|---|---|---|
| US 77604 AC1 | FR-2, FR-3, FR-4 | GET /api/catalog/products returns only active, non-deleted, purchasable products with productName, sku, price, currency, availability | API test for valid page/pageSize and returned fields/filtering |
| US 77604 AC2 | FR-5, FR-6 | Invalid or missing page/pageSize returns controlled client-safe response with no internal details | API/UI negative tests for missing, non-numeric, <1, over-limit values |
| US 77604 AC3 | FR-7 | Empty eligible result page displays empty-state and no incomplete cards or placeholder price values | UI test for empty result rendering |
| US 77604 AC4 | FR-8, FR-9 | URL updates on pagination and refresh/back-forward restores same page context | UI/browser navigation test |
| US 77604 AC5 | FR-10, FR-11, FR-12 | HTTPS, rate limiting, telemetry for success/empty/invalid/downstream failure | Security/config and observability tests |
| US 77613 AC1 | FR-13, FR-14 | Valid product detail route returns dedicated page with required fields for active purchasable product | UI/API detail retrieval test |
| US 77613 AC2 | FR-15 | Detail price and availability match current catalog data in active session | Cross-page consistency test |
| US 77613 AC3 | FR-16 | Invalid, unknown, inactive, deleted, or not purchasable identifier returns controlled not-found/unavailable and no partial content | Negative detail access test |
| US 77613 AC4 | FR-17 | Direct URL, refresh, and back-forward restore same product state or same controlled failure state | Browser navigation test |
| US 77613 AC5 | FR-18, FR-19, FR-20, FR-21 | Server-side identifier validation, HTTPS, sanitized errors, telemetry for success/failure outcomes | Validation, security, and telemetry tests |
| US 77622 AC1 | FR-23, FR-24, FR-25 | Valid active productId/skuId and in-stock positive integer quantity adds item to current session cart and returns updated count | Add-to-cart happy path test |
| US 77622 AC2 | FR-26 | First successful add creates new cart and associates it to current browser session | Session cart creation test |
| US 77622 AC3 | FR-27, FR-28 | Invalid quantity is rejected and no cart/cart item record changes | Validation and persistence integrity test |
| US 77622 AC4 | FR-29, FR-30 | Same request identity key results in only one mutation and retry-safe response | Idempotency/retry test |
| US 77622 AC5 | FR-31, FR-32 | Each add attempt writes required audit fields and excludes payment/unnecessary personal data | Audit record verification test |
| US 77631 AC1 | FR-34 | Cart page shows each item with product name, quantity, unit price, line total, and current cart total | Cart retrieval/rendering test |
| US 77631 AC2 | FR-36 | Valid quantity change updates line and recalculates totals | Cart update happy path test |
| US 77631 AC3 | FR-37 | Valid remove action deletes line and returns refreshed contents and updated total | Cart remove happy path test |
| US 77631 AC4 | FR-38 | Invalid quantity, stale/nonexistent cartItemId, or insufficient stock rejects change and preserves persisted cart contents | Cart update negative test |
| US 77631 AC5 | FR-35, FR-40 | Cart remains available across refresh/direct URL; quantity update and removal write audit event | Session persistence and audit tests |
| Feature 77599 Description | FR-1, FR-13, FR-23, FR-34 | Baseline supports product presentation, product detail interaction, and item selection through cart-oriented flows | End-to-end feature flow tests |
| US 77604 Technical Considerations | NFR-2, NFR-3, NFR-4, NFR-9, NFR-10, NFR-11 | HTTPS, rate limiting, sanitized handling, observability, performance targets | Security, logging, and performance tests |
| US 77613 Technical Considerations | FR-22, NFR-4, NFR-9, NFR-12 | Safe degradation of optional assets, sanitized errors, observability, product detail performance | Resilience and performance tests |
| US 77622 Technical Considerations | FR-33, NFR-6, NFR-7, NFR-8, NFR-13, NFR-16, NFR-17 | CSRF, secure session binding, ownership, performance, retry safety, audit constraints | Security and concurrency tests |
| US 77631 Technical Considerations | FR-39, FR-41, NFR-14, NFR-15, NFR-16 | Session ownership, CSRF/TLS, performance, conflict-safe behavior across tabs | Security, performance, and concurrency tests |

## Open Questions
1. What are the exact route paths for:
   - catalog page,
   - product detail page,
   - cart page?
2. What is the exact endpoint and method for product detail retrieval?
3. What are the exact endpoints and methods for:
   - add-to-cart,
   - cart retrieval,
   - cart quantity update,
   - cart removal?
4. What HTTP status codes and error body schemas are required for:
   - invalid catalog parameters,
   - not-found product,
   - unavailable product,
   - validation failures on cart mutation,
   - stale `cartItemId`,
   - inventory failures,
   - dependency failures?
5. What is the configured maximum allowed `pageSize`?
6. What is the canonical validation format for `productId`, `skuId`, and `cartItemId`?
7. What exact fields are included in “supporting product details” on the product detail page?
8. What exact empty-state and validation message text should be displayed to users?
9. Is authenticated-user cart behavior in scope now, or only browser-session guest cart behavior?
10. If authenticated users are supported, is cart merge behavior between guest and authenticated sessions required?
11. What is the cart item count definition for add-to-cart response: total units or total distinct cart lines?
12. For add-to-cart requests, may both `productId` and `skuId` be provided, or must exactly one be supplied?
13. What response body shape is required for cart retrieval and cart mutation responses?
14. Are there explicit accessibility standards or conformance requirements for these web interactions?
15. What telemetry/event naming conventions must be used within the monolith implementation?
16. What are the retention and access requirements for cart audit records and telemetry logs?
17. What correlation ID generation/propagation standard applies to these requests?

## Source References
- Feature ID 77599 — Shopping Website User Interaction
- Feature Reference 77599
- User-selected Architecture Style: monolith
- User Story US 77604 — As a Shopping website user, I want to browse purchasable products in the catalog so that I can discover items available for shopping
- User Story US 77613 — As a Shopping website user, I want to open a product detail page so that I can review a purchasable item before selecting it
- User Story US 77622 — As a Shopping website user, I want to add a product to my shopping cart so that I can select items for purchase
- User Story US 77631 — As a Shopping website user, I want to review and update my shopping cart so that my selected items remain accurate before purchase
- Derived Source Signals — Application Type: mixed
- Derived Source Signals — Design Guidelines Extracted From Source

Unapplied but reviewed as out of constrained feature scope:
- US 77664 — cart review and begin checkout
- US 77673 — checkout shipping and billing information
- US 77682 — payment
- US 77691 — order confirmation
- US 77645, US 77646, US 77647, US 77653, US 77654, US 77655, US 77661, US 77662, US 77663 — unrelated design-state work items outside this shopping interaction scope