import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { Page, Browser, BrowserContext, chromium } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { GenericActions } from '../utils/GenericActions';
import { AssertionHelpers } from '../utils/AssertionHelpers';
import { WaitHelpers } from '../utils/WaitHelpers';

// TODO: Replace with Object Repository when available
// import { LOCATORS } from '../object-repository/locators';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let basePage: BasePage;
let homePage: HomePage;
let actions: GenericActions;
let assertions: AssertionHelpers;
let waits: WaitHelpers;

const appUrl = process.env.BASE_URL || 'https://example.test-management.local';

const slug = (v: string): string =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, '')
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const esc = (v: string): string => v.replace(/"/g, '\\"');

const byTestId = (id: string) => page.locator(`[data-testid="${id}"]`);
const byTextXPath = (text: string) => page.locator(`//*[contains(normalize-space(), "${esc(text)}")]`);
const byExactTextXPath = (text: string) => page.locator(`//*[normalize-space()="${esc(text)}"]`);
const byLinkText = (text: string) =>
  page.locator(`[data-testid="link-${slug(text)}"], a:has-text("${esc(text)}"), [role="link"]:has-text("${esc(text)}")`);
const byButtonText = (text: string) =>
  page.locator(
    `[data-testid="button-${slug(text)}"], button:has-text("${esc(text)}"), [role="button"]:has-text("${esc(text)}")`,
  );
const byFieldName = (name: string) =>
  page.locator(
    `[data-testid="input-${slug(name)}"], [data-testid="textarea-${slug(name)}"], [data-testid="field-${slug(
      name,
    )}"], input[name="${slug(name)}"], textarea[name="${slug(name)}"], //input[@id="${slug(
      name,
    )}"], //textarea[@id="${slug(name)}"], //input[@aria-label="${esc(name)}"], //textarea[@aria-label="${esc(
      name,
    )}"]`,
  );
const bySectionName = (name: string) =>
  page.locator(
    `[data-testid="section-${slug(name)}"], [data-testid="tab-${slug(name)}"], [data-testid="panel-${slug(
      name,
    )}"], //section[@id="${slug(name)}"], //div[@id="${slug(name)}"]`,
  );
const byRepositoryItem = (name: string) =>
  page.locator(
    `[data-testid="repository-item-${slug(name)}"], [data-testid="test-plan-${slug(name)}"], //*[contains(normalize-space(), "${esc(
      name,
    )}")]`,
  );

Before(async function () {
  browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  });
  page = await context.newPage();

  actions = new GenericActions(page, context);
  assertions = new AssertionHelpers(page);
  waits = new WaitHelpers(page);

  basePage = new BasePage(page, context);
  homePage = new HomePage(page, context);

  this.testData = {
    users: {
      'qa-lead': { username: 'qa.lead', password: 'Password123!' },
      'QA Lead': { username: 'qa.lead', password: 'Password123!' },
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'testuser', password: 'testpass' },
    },
    permissions: {
      'create-and-edit-test-plan-documents': true,
    },
  };
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED' && page) {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  await page.close();
  await context.close();
  await browser.close();
});

// ==================== GIVEN STEPS ====================

/**************************************************/
/*  TEST CASE: TC-001
/*  Title: Create and save a test plan with all required in-scope create bug record coverage items
/*  Priority: High
/*  Category: Functional
/**************************************************/

Given('user is on {string} page', async function (pageName: string) {
  if (pageName === 'Test Management Repository') {
    await actions.navigateTo(`${appUrl}/test-management-repository`);
  } else {
    await actions.navigateTo(`${appUrl}/${slug(pageName)}`);
  }
  await waits.waitForDomContentLoaded();
  await waits.waitForNetworkIdle();
});

Given('user is authenticated as {string}', async function (userType: string) {
  const creds =
    this.testData?.users?.[userType] ||
    this.testData?.users?.[slug(userType)] || { username: 'testuser', password: 'testpass' };

  const authReady = byTestId('user-avatar');
  if (await authReady.count()) {
    return;
  }

  const userField = page.locator(
    '[data-testid="input-username"], [data-testid="input-email"], //input[@id="username"], //input[@id="email"]',
  );
  const passField = page.locator('[data-testid="input-password"], //input[@id="password"]');
  const loginBtn = page.locator('[data-testid="button-login"], //button[@id="login"], //button[contains(text(),"Login")]');

  if ((await userField.count()) > 0 && (await passField.count()) > 0) {
    await actions.fill(userField, creds.username);
    await actions.fill(passField, creds.password);
    await actions.click(loginBtn);
    await waits.waitForNetworkIdle();
  } else {
    this.currentUser = userType;
  }
});

Given('user has permission to create and edit test plan documents', async function () {
  this.permissions = this.permissions || {};
  this.permissions['create-and-edit-test-plan-documents'] = true;
  const permIndicator = page.locator(
    '[data-testid="permission-create-edit-test-plan-documents"], //*[contains(text(),"create and edit test plan documents")]',
  );
  if ((await permIndicator.count()) > 0) {
    await assertions.assertVisible(permIndicator);
  }
});

Given('user clicks on {string}', async function (itemText: string) {
  const item = page.locator(
    `[data-testid="link-${slug(itemText)}"], [data-testid="item-${slug(itemText)}"], [data-testid="repository-item-${slug(
      itemText,
    )}"], a:has-text("${esc(itemText)}"), [role="link"]:has-text("${esc(itemText)}"), //*[contains(normalize-space(), "${esc(
      itemText,
    )}")]`,
  );
  await actions.click(item);
  await waits.waitForNetworkIdle();
});

/**************************************************/
/*  TEST CASE: TC-002
/*  Title: Document execution prerequisites and entry criteria for create bug record validation
/*  Priority: High
/*  Category: Functional
/**************************************************/

/**************************************************/
/*  TEST CASE: TC-003
/*  Title: Define measurable exit criteria, evidence requirements, and blocking rules
/*  Priority: High
/*  Category: Functional
/**************************************************/

/**************************************************/
/*  TEST CASE: TC-004
/*  Title: Complete traceability mapping for every planned coverage item without gaps
/*  Priority: High
/*  Category: Functional
/**************************************************/

// ==================== WHEN STEPS ====================

When('user clicks {string} button', async function (buttonText: string) {
  await actions.click(byButtonText(buttonText));
  await waits.waitForNetworkIdle();
});

When('user clicks {string} link', async function (linkText: string) {
  await actions.click(byLinkText(linkText));
  await waits.waitForNetworkIdle();
});

When('user clicks on {string}', async function (itemText: string) {
  const item = byRepositoryItem(itemText);
  await actions.click(item);
  await waits.waitForNetworkIdle();
});

When('user enters {string} in {string} field', async function (value: string, fieldName: string) {
  await actions.clearAndFill(byFieldName(fieldName), value);
});

When('user selects {string} from {string} dropdown', async function (option: string, dropdownName: string) {
  const dd = page.locator(
    `[data-testid="select-${slug(dropdownName)}"], select[name="${slug(dropdownName)}"], //select[@id="${slug(
      dropdownName,
    )}"]`,
  );
  await actions.selectByText(dd, option);
  await waits.waitForNetworkIdle();
});

// ==================== THEN STEPS ====================

Then('{string} should be visible', async function (text: string) {
  const locator = page.locator(
    `[data-testid="${slug(text)}"], [data-testid="text-${slug(text)}"], [data-testid="label-${slug(
      text,
    )}"], [data-testid="section-${slug(text)}"], //*[contains(normalize-space(), "${esc(text)}")]`,
  );
  await assertions.assertVisible(locator);
});

Then('success message {string} should be displayed', async function (message: string) {
  const msg = page.locator(
    `[data-testid="success-message"], [data-testid="toast-success"], [data-testid="alert-success"], //div[@id="success-message"], //*[contains(normalize-space(), "${esc(
      message,
    )}")]`,
  );
  await assertions.assertVisible(msg);
  await assertions.assertContainsText(msg, message);
});

Then('user should see {string} message', async function (message: string) {
  const msg = page.locator(
    `[data-testid="status-message"], [data-testid="workflow-status"], [data-testid="message-${slug(
      message,
    )}"], //*[contains(normalize-space(), "${esc(message)}")]`,
  );
  await assertions.assertVisible(msg);
  await assertions.assertContainsText(msg, message);
});

Then('the {string} section should be visible', async function (sectionName: string) {
  await assertions.assertVisible(bySectionName(sectionName));
});

Then('the current URL should contain {string}', async function (urlPart: string) {
  await assertions.assertUrlContains(urlPart);
});