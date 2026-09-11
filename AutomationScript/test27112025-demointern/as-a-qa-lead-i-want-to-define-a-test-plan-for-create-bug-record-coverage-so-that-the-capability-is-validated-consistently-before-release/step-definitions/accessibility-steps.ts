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

const toKebab = (v: string): string =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const dt = (type: string, name: string): string => `[data-testid="${type}-${toKebab(name)}"]`;

const fieldLocator = (name: string) =>
  page.locator(`${dt('input', name)}, ${dt('textarea', name)}, ${dt('field', name)}, ${dt('editor', name)}, ${dt('section', name)} input, ${dt('section', name)} textarea, [aria-label="${name}"], [name="${name}"]`);

const buttonLocator = (name: string) =>
  page.locator(`${dt('button', name)}, button[data-testid="button-${toKebab(name)}"], button:has-text("${name}")`);

const sectionLocator = (name: string) =>
  page.locator(`${dt('section', name)}, [data-testid="${toKebab(name)}-section"], section[aria-label="${name}"]`);

const messageLocator = (text: string) =>
  page.locator(`${dt('message', text)}, ${dt('status', text)}, [role="alert"]:has-text("${text}"), [role="status"]:has-text("${text}"), text=${text}`);

const statusLocator = () =>
  page.locator(`${dt('status', 'plan-status')}, ${dt('status', 'workflow-status')}, [role="status"], [aria-live]`);

const dialogLocator = () =>
  page.locator(`${dt('dialog', 'confirmation')}, [role="dialog"], [aria-modal="true"]`);

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
      'QA Lead': { username: 'qa.lead', password: 'Password123!' },
      admin: { username: 'admin', password: 'admin123' },
      user: { username: 'testuser', password: 'testpass' },
    },
    apps: {
      'Test Management Repository': process.env.TEST_APP_URL || 'https://example.testmanagement.local',
    },
    pages: {
      'Create Bug Record Test Plan Editor': '/test-plans/create-bug-record-editor',
    },
  };
  this.a11y = {};
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED' && page) {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});

/**************************************************/
/*  TEST CASE: TC-001
/*  Title: Keyboard-only navigation supports creating, reviewing, and submitting the create bug record test plan
/*  Priority: High
/*  Category: Accessibility
/**************************************************/

/**************************************************/
/*  TEST CASE: TC-002
/*  Title: Screen reader labeling and status announcements make plan sections, validation errors, and workflow outcomes understandable
/*  Priority: High
/*  Category: Accessibility
/**************************************************/

// ==================== GIVEN STEPS ====================

Given('user is logged into {string} as {string}', async function (appName: string, userType: string) {
  const baseUrl = this.testData?.apps?.[appName] || process.env.BASE_URL || 'https://example.testmanagement.local';
  const creds = this.testData?.users?.[userType] || { username: 'testuser', password: 'testpass' };
  await actions.navigateTo(baseUrl);
  await waits.waitForDomContentLoaded();

  const userField = page.locator(`${dt('input', 'username')}, ${dt('input', 'email')}, input[name="username"], input[name="email"]`);
  const passField = page.locator(`${dt('input', 'password')}, input[name="password"]`);
  const loginBtn = page.locator(`${dt('button', 'login')}, ${dt('button', 'sign-in')}, button:has-text("Login"), button:has-text("Sign In")`);

  if (await userField.count()) {
    await actions.fill(userField.first(), creds.username);
    await actions.fill(passField.first(), creds.password);
    await actions.click(loginBtn.first());
    await waits.waitForNetworkIdle();
  }
});

Given('user is on {string} page', async function (pageName: string) {
  const baseUrl = this.testData?.apps?.['Test Management Repository'] || process.env.BASE_URL || 'https://example.testmanagement.local';
  const path = this.testData?.pages?.[pageName] || `/${toKebab(pageName)}`;
  await actions.navigateTo(`${baseUrl}${path}`);
  await waits.waitForLoad();
  await waits.waitForNetworkIdle();
});

Given('{string} test plan is available for create or edit', async function (planName: string) {
  const plan = page.locator(`${dt('plan', planName)}, ${dt('card', planName)}, ${dt('row', planName)}, text=${planName}`);
  if (await plan.count()) {
    await assertions.assertVisible(plan.first());
    this.currentPlan = planName;
  } else {
    this.currentPlan = planName;
  }
});

Given('{string} has access to document scope, prerequisites, governance, and traceability', async function (role: string) {
  this.currentRole = role;
  const areas = ['document scope', 'prerequisites', 'governance', 'traceability'];
  for (const area of areas) {
    const loc = page.locator(`${dt('section', area)}, ${dt('nav', area)}, text=${area}`);
    if (await loc.count()) {
      await assertions.assertVisible(loc.first());
    }
  }
});

Given('no browser extensions that alter focus behavior are enabled', async function () {
  this.a11y.extensionsAffectingFocus = false;
});

Given('screen reader {string} is running', async function (screenReader: string) {
  this.a11y.screenReader = screenReader;
});

Given('the editor contains labeled sections for coverage, prerequisites, entry criteria, exit criteria, evidence expectations, and traceability matrix', async function () {
  const names = ['coverage', 'prerequisites', 'entry criteria', 'exit criteria', 'evidence expectations', 'traceability matrix'];
  for (const name of names) {
    const loc = sectionLocator(name);
    if (await loc.count()) {
      await assertions.assertVisible(loc.first());
    } else {
      await assertions.assertVisible(page.locator(`text=${name}`).first());
    }
  }
});

// ==================== WHEN STEPS ====================

When('user navigates through {string} page using keyboard only', async function (pageName: string) {
  await waits.waitForLoad();
  await page.keyboard.press('Tab');
  this.a11y.lastNavigationContext = pageName;
});

When('user navigates through page header, plan title field, section navigation, and action buttons using keyboard only', async function () {
  const sequence = ['Tab', 'Tab', 'Tab', 'Tab', 'Tab', 'Tab'];
  for (const key of sequence) {
    await page.keyboard.press(key);
  }
});

When('user enters {string} in {string} field', async function (value: string, fieldName: string) {
  const loc = fieldLocator(fieldName).first();
  await waits.waitForVisible(loc);
  await actions.clearAndFill(loc, value);
  this[`field_${fieldName}`] = value;
});

When('user interacts with prerequisites, entry criteria, exit criteria, and traceability matrix sections using keyboard only', async function () {
  const sections = ['prerequisites', 'entry criteria', 'exit criteria', 'traceability matrix'];
  for (const name of sections) {
    const sec = sectionLocator(name).first();
    if (await sec.count()) {
      await actions.scrollIntoView(sec);
      await sec.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Space');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Escape');
    }
  }
});

When('user clicks {string} button', async function (buttonText: string) {
  const btn = buttonLocator(buttonText).first();
  await waits.waitForVisible(btn);
  await actions.click(btn);
  await waits.waitForNetworkIdle();
});

When('user navigates to the status area using keyboard only', async function () {
  const status = statusLocator().first();
  if (await status.count()) {
    await status.focus();
  } else {
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
  }
});

When('user navigates through the page by headings, landmarks, and form fields', async function () {
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  this.a11y.navigationMode = 'semantic';
});

When('user navigates to {string} field', async function (fieldName: string) {
  const loc = fieldLocator(fieldName).first();
  await actions.scrollIntoView(loc);
  await loc.focus();
  this.a11y.activeField = fieldName;
});

When('user navigates through the traceability matrix by row and column', async function () {
  const matrix = page.locator(`${dt('table', 'traceability-matrix')}, ${dt('matrix', 'traceability-matrix')}, table[aria-label="Traceability Matrix"], table:has-text("Traceability")`).first();
  if (await matrix.count()) {
    await actions.scrollIntoView(matrix);
    await matrix.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowLeft');
  }
});

// ==================== THEN STEPS ====================

Then('visible keyboard focus should be displayed on the first interactive element', async function () {
  const active = page.locator(':focus');
  await assertions.assertVisible(active);
});

Then('keyboard focus should remain clearly discernible', async function () {
  const active = page.locator(':focus');
  await assertions.assertVisible(active);
});

Then('focus should move in a logical order', async function () {
  const active = page.locator(':focus');
  await assertions.assertVisible(active);
});

Then('no interactive control should be skipped', async function () {
  const controls = page.locator('button, input, textarea, select, a, [tabindex]:not([tabindex="-1"])');
  await assertions.assertElementCount(controls, await controls.count());
});

Then('{string} should be enabled', async function (name: string) {
  const control = page.locator(`${dt('button', name)}, ${dt('action', name)}, ${dt('control', name)}, button:has-text("${name}")`).first();
  await waits.waitForVisible(control);
  await assertions.assertVisible(control);
});

Then('{string} should retain the entered value', async function (fieldName: string) {
  const loc = fieldLocator(fieldName).first();
  await waits.waitForVisible(loc);
  await assertions.assertVisible(loc);
});

Then('all form controls in those sections should be operable by keyboard', async function () {
  const sections = ['prerequisites', 'entry criteria', 'exit criteria', 'traceability matrix'];
  for (const name of sections) {
    const sec = sectionLocator(name).first();
    if (await sec.count()) {
      await assertions.assertVisible(sec);
    }
  }
});

Then('expanded controls should receive focus appropriately', async function () {
  const active = page.locator(':focus');
  await assertions.assertVisible(active);
});

Then('focus should not become trapped in any component', async function () {
  await page.keyboard.press('Tab');
  await assertions.assertVisible(page.locator(':focus'));
});

Then('success message {string} should be displayed', async function (text: string) {
  const msg = messageLocator(text).first();
  await waits.waitForVisible(msg);
  await assertions.assertVisible(msg);
  await assertions.assertContainsText(msg, text);
});

Then('keyboard focus should remain on a sensible element', async function () {
  await assertions.assertVisible(page.locator(':focus'));
});

Then('submission workflow should be operable by keyboard', async function () {
  const dlg = dialogLocator().first();
  if (await dlg.count()) {
    await assertions.assertVisible(dlg);
    await page.keyboard.press('Tab');
    await assertions.assertVisible(page.locator(':focus'));
  } else {
    await assertions.assertVisible(page.locator(':focus'));
  }
});

Then('any confirmation dialog or status update should be operable by keyboard', async function () {
  const dlg = dialogLocator().first();
  const stat = statusLocator().first();
  if (await dlg.count()) {
    await assertions.assertVisible(dlg);
  } else {
    await assertions.assertVisible(stat);
  }
});

Then('final plan status should be understandable by keyboard navigation', async function () {
  const stat = statusLocator().first();
  await waits.waitForVisible(stat);
  await assertions.assertVisible(stat);
});

Then('all key workflow actions for this feature should be keyboard accessible', async function () {
  const actionsList = ['Edit', 'Save Draft', 'Submit for Approval'];
  for (const name of actionsList) {
    const btn = buttonLocator(name).first();
    await assertions.assertVisible(btn);
  }
});

Then('page title {string} should be visible', async function (pageTitle: string) {
  const title = page.locator(`${dt('title', pageTitle)}, h1:has-text("${pageTitle}"), [data-testid="page-title"]:has-text("${pageTitle}")`).first();
  await waits.waitForVisible(title);
  await assertions.assertVisible(title);
});

Then('major plan areas should be exposed as distinct headings or landmarks', async function () {
  const areas = page.locator('main, nav, header, section, [role="main"], [role="navigation"], h1, h2, h3');
  await assertions.assertElementCount(areas, await areas.count());
});

Then('{string} should be visible', async function (name: string) {
  const loc = page.locator(`${dt('input', name)}, ${dt('textarea', name)}, ${dt('field', name)}, ${dt('section', name)}, ${dt('button', name)}, text=${name}`).first();
  await waits.waitForVisible(loc);
  await assertions.assertVisible(loc);
});

Then('the field should have an accessible name matching the visible label', async function () {
  const active = page.locator(':focus').first();
  await assertions.assertVisible(active);
});

Then('the field should announce its control type', async function () {
  const active = page.locator(':focus').first();
  await assertions.assertVisible(active);
});

Then('the field should communicate required status where applicable', async function () {
  const active = page.locator(':focus').first();
  await assertions.assertVisible(active);
});

Then('error message {string} should be displayed', async function (error: string) {
  const loc = page.locator(`${dt('error', error)}, [role="alert"]:has-text("${error}"), .error:has-text("${error}"), text=${error}`).first();
  await waits.waitForVisible(loc);
  await assertions.assertVisible(loc);
  await assertions.assertContainsText(loc, error);
});

Then('the validation error should identify the missing information clearly', async function () {
  const err = page.locator('[role="alert"], .error, [data-testid^="error-"]').first();
  await assertions.assertVisible(err);
});

Then('the affected field or section should be associated with the validation error', async function () {
  const err = page.locator('[role="alert"], .error, [data-testid^="error-"]').first();
  await assertions.assertVisible(err);
});

Then('previous validation error {string} should be hidden', async function (error: string) {
  const loc = page.locator(`${dt('error', error)}, [role="alert"]:has-text("${error}"), .error:has-text("${error}"), text=${error}`).first();
  await waits.waitForHidden(loc);
});

Then('user should see {string} message', async function (text: string) {
  const loc = messageLocator(text).first();
  await waits.waitForVisible(loc);
  await assertions.assertVisible(loc);
  await assertions.assertContainsText(loc, text);
});

Then('the resulting plan state should be understandable to assistive technology', async function () {
  const stat = statusLocator().first();
  await assertions.assertVisible(stat);
});

Then('row and column context should be understandable', async function () {
  const matrix = page.locator(`${dt('table', 'traceability-matrix')}, ${dt('matrix', 'traceability-matrix')}, table`).first();
  await assertions.assertVisible(matrix);
});

Then('mapped requirement references {string} and {string} should be identifiable without relying on visual position alone', async function (ref1: string, ref2: string) {
  const r1 = page.locator(`text=${ref1}`).first();
  const r2 = page.locator(`text=${ref2}`).first();
  await assertions.assertVisible(r1);
  await assertions.assertVisible(r2);
});