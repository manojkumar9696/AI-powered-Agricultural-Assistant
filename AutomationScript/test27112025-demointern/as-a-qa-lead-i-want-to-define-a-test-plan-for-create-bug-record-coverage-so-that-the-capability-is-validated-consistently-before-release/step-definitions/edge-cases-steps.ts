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

const esc = (v: string): string => v.replace(/"/g, '\\"').replace(/'/g, `\\'`);

const byTestId = (id: string) => page.locator(`[data-testid="${id}"]`);
const byXPath = (xp: string) => page.locator(xp);

const resolveVisibleLocator = (name: string) => {
  const key = toKebab(name);
  return page.locator(
    `[data-testid="${key}"], [data-testid="text-${key}"], [data-testid="section-${key}"], [data-testid="message-${key}"], [data-testid="warning-${key}"], [data-testid="status-${key}"], [data-testid="card-${key}"], [data-testid="tab-${key}"], [data-testid="link-${key}"]`
  ).first();
};

const resolveButtonLocator = (text: string) => {
  const key = toKebab(text);
  return page.locator(
    `[data-testid="button-${key}"], [data-testid="${key}"], [data-testid="action-${key}"]`
  ).first();
};

const resolveClickableLocator = (name: string) => {
  const key = toKebab(name);
  return page.locator(
    `[data-testid="${key}"], [data-testid="tab-${key}"], [data-testid="link-${key}"], [data-testid="card-${key}"], [data-testid="button-${key}"], [data-testid="menu-${key}"]`
  ).first();
};

const resolveFieldLocator = (fieldName: string) => {
  const key = toKebab(fieldName);
  return page.locator(
    `[data-testid="input-${key}"], [data-testid="textarea-${key}"], [data-testid="field-${key}"], [data-testid="${key}"]`
  ).first();
};

const resolveMappingTokenLocator = (item: string, req: string) => {
  const itemKey = toKebab(item);
  const reqKey = toKebab(req);
  return page.locator(
    `[data-testid="mapping-token-${itemKey}-${reqKey}"], [data-testid="mapping-${itemKey}-${reqKey}"], [data-testid="token-${reqKey}"]`
  ).first();
};

const resolveRemoveMappingLocator = (item: string, req: string) => {
  const itemKey = toKebab(item);
  const reqKey = toKebab(req);
  return page.locator(
    `[data-testid="remove-mapping-${itemKey}-${reqKey}"], [data-testid="mapping-remove-${itemKey}-${reqKey}"], [data-testid="remove-${reqKey}"]`
  ).first();
};

const resolveAddMappingInputLocator = (item: string) => {
  const itemKey = toKebab(item);
  return page.locator(
    `[data-testid="mapping-input-${itemKey}"], [data-testid="input-mapping-${itemKey}"], [data-testid="mapping-search-${itemKey}"]`
  ).first();
};

const resolveAddMappingConfirmLocator = (item: string, req: string) => {
  const itemKey = toKebab(item);
  const reqKey = toKebab(req);
  return page.locator(
    `[data-testid="add-mapping-${itemKey}-${reqKey}"], [data-testid="mapping-option-${itemKey}-${reqKey}"], [data-testid="option-${reqKey}"]`
  ).first();
};

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
    pages: {
      'test-management-repository': process.env.TEST_MANAGEMENT_REPOSITORY_URL || 'https://example.test/repository',
    },
    users: {
      'qa-lead': { username: 'qa.lead', password: 'Password123!' },
    },
  };
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }
  await page.close();
  await context.close();
  await browser.close();
});

/**************************************************/
/*  TEST CASE: TC-78413-001
/*  Title: Approval blocked when coverage mapping is incomplete
/*  Priority: High
/*  Category: Edge Cases
/**************************************************/

/**************************************************/
/*  TEST CASE: TC-78413-002
/*  Title: Validation enforces governance completeness
/*  Priority: High
/*  Category: Edge Cases
/**************************************************/

// ==================== GIVEN STEPS ====================

Given('user is on {string} page', async function (pageName: string) {
  const key = toKebab(pageName);
  const url = this.testData?.pages?.[key] || `https://example.test/${key}`;
  await actions.navigateTo(url);
  await waits.waitForDomContentLoaded();
  await waits.waitForNetworkIdle();
});

Given('{string} should be visible', async function (name: string) {
  const key = toKebab(name);
  const dt = resolveVisibleLocator(name);
  if (await dt.count() > 0) {
    await assertions.assertVisible(dt);
    return;
  }

  // TODO: Replace XPath with Object Repository when available
  const xp = byXPath(
    `//*[contains(@data-testid,'${esc(key)}') or @id='${esc(key)}' or contains(normalize-space(.),"${esc(name)}")]`
  ).first();
  await assertions.assertVisible(xp);
});

// ==================== WHEN STEPS ====================

When('user clicks on {string}', async function (target: string) {
  const dt = resolveClickableLocator(target);
  if (await dt.count() > 0) {
    await actions.click(dt);
  } else {
    // TODO: Replace XPath with Object Repository when available
    const xp = byXPath(
      `//*[@id='${esc(toKebab(target))}' or contains(@data-testid,'${esc(toKebab(target))}') or self::button or self::a][contains(normalize-space(.),"${esc(target)}")]`
    ).first();
    await actions.click(xp);
  }
  await waits.waitForNetworkIdle();
});

When('user clicks {string} button', async function (buttonText: string) {
  const dt = resolveButtonLocator(buttonText);
  if (await dt.count() > 0) {
    await actions.click(dt);
  } else {
    // TODO: Replace XPath with Object Repository when available
    const xp = byXPath(
      `//button[@id='${esc(toKebab(buttonText))}' or contains(@data-testid,'${esc(toKebab(buttonText))}') or contains(normalize-space(.),"${esc(buttonText)}")]`
    ).first();
    await actions.click(xp);
  }
  await waits.waitForNetworkIdle();
});

When('user enters {string} in {string} field', async function (value: string, fieldName: string) {
  const dt = resolveFieldLocator(fieldName);
  if (await dt.count() > 0) {
    await actions.clearAndFill(dt, value);
  } else {
    // TODO: Replace XPath with Object Repository when available
    const xp = byXPath(
      `//input[@id='${esc(toKebab(fieldName))}' or contains(@data-testid,'${esc(toKebab(fieldName))}')] | //textarea[@id='${esc(toKebab(fieldName))}' or contains(@data-testid,'${esc(toKebab(fieldName))}')]`
    ).first();
    await actions.clearAndFill(xp, value);
  }
});

When('user removes {string} from {string} mapping', async function (value: string, item: string) {
  const rm = resolveRemoveMappingLocator(item, value);
  if (await rm.count() > 0) {
    await actions.click(rm);
    await waits.waitForNetworkIdle();
    return;
  }

  const token = resolveMappingTokenLocator(item, value);
  if (await token.count() > 0) {
    await actions.hover(token);
    // TODO: Replace XPath with Object Repository when available
    const xp = byXPath(
      `//*[@data-testid='mapping-token-${esc(toKebab(item))}-${esc(toKebab(value))}' or @data-testid='mapping-${esc(toKebab(item))}-${esc(toKebab(value))}']//*[contains(@data-testid,'remove') or @aria-label='Remove']`
    ).first();
    await actions.click(xp);
    await waits.waitForNetworkIdle();
    return;
  }

  // TODO: Replace XPath with Object Repository when available
  const fallback = byXPath(
    `//*[contains(@data-testid,'${esc(toKebab(item))}') and contains(normalize-space(.),"${esc(value)}")]//*[contains(@data-testid,'remove') or @aria-label='Remove' or contains(normalize-space(.),"Remove")]`
  ).first();
  await actions.click(fallback);
  await waits.waitForNetworkIdle();
});

When('user adds {string} to {string} mapping', async function (value: string, item: string) {
  const input = resolveAddMappingInputLocator(item);
  if (await input.count() > 0) {
    await actions.clearAndFill(input, value);
    const confirm = resolveAddMappingConfirmLocator(item, value);
    if (await confirm.count() > 0) {
      await actions.click(confirm);
    } else {
      // TODO: Replace XPath with Object Repository when available
      const xp = byXPath(
        `//*[contains(@data-testid,'${esc(toKebab(item))}') and (contains(@data-testid,'option') or contains(@data-testid,'add')) and contains(normalize-space(.),"${esc(value)}")]`
      ).first();
      await actions.click(xp);
    }
    await waits.waitForNetworkIdle();
    return;
  }

  // TODO: Replace XPath with Object Repository when available
  const xpInput = byXPath(
    `//input[contains(@data-testid,'mapping') and contains(@data-testid,'${esc(toKebab(item))}')] | //textarea[contains(@data-testid,'mapping') and contains(@data-testid,'${esc(toKebab(item))}')]`
  ).first();
  await actions.clearAndFill(xpInput, value);

  const xpOption = byXPath(
    `//*[contains(@data-testid,'add') or contains(@data-testid,'option')][contains(normalize-space(.),"${esc(value)}")]`
  ).first();
  await actions.click(xpOption);
  await waits.waitForNetworkIdle();
});

When('user removes {string} from {string} field', async function (value: string, fieldName: string) {
  const key = toKebab(fieldName);
  const dt = page.locator(
    `[data-testid="remove-${toKebab(value)}-${key}"], [data-testid="field-remove-${key}-${toKebab(value)}"], [data-testid="token-remove-${toKebab(value)}"]`
  ).first();

  if (await dt.count() > 0) {
    await actions.click(dt);
  } else {
    // TODO: Replace XPath with Object Repository when available
    const xp = byXPath(
      `//*[@data-testid='input-${esc(key)}' or @data-testid='textarea-${esc(key)}' or @data-testid='field-${esc(key)}']//*[contains(normalize-space(.),"${esc(value)}")]/following::*[(contains(@data-testid,'remove') or @aria-label='Remove')][1] | //*[(contains(@data-testid,'${esc(key)}') or @id='${esc(key)}') and contains(normalize-space(.),"${esc(value)}")]//*[contains(@data-testid,'remove') or @aria-label='Remove']`
    ).first();
    await actions.click(xp);
  }
  await waits.waitForNetworkIdle();
});

// ==================== THEN STEPS ====================

Then('{string} should be visible', async function (name: string) {
  const key = toKebab(name);
  const dt = resolveVisibleLocator(name);
  if (await dt.count() > 0) {
    await assertions.assertVisible(dt);
    return;
  }

  // TODO: Replace XPath with Object Repository when available
  const xp = byXPath(
    `//*[contains(@data-testid,'${esc(key)}') or @id='${esc(key)}' or contains(normalize-space(.),"${esc(name)}")]`
  ).first();
  await assertions.assertVisible(xp);
});

Then('{string} should be hidden', async function (name: string) {
  const key = toKebab(name);
  const dt = resolveVisibleLocator(name);
  if (await dt.count() > 0) {
    await waits.waitForHidden(dt);
    return;
  }

  // TODO: Replace XPath with Object Repository when available
  const xp = byXPath(
    `//*[contains(@data-testid,'${esc(key)}') or @id='${esc(key)}' or contains(normalize-space(.),"${esc(name)}")]`
  ).first();
  await waits.waitForHidden(xp);
});

Then('error message {string} should be displayed', async function (message: string) {
  const key = toKebab(message);
  const dt = page.locator(
    `[data-testid="error-${key}"], [data-testid="message-error"], [data-testid="validation-error"], [data-testid="alert-error"]`
  ).first();

  if (await dt.count() > 0) {
    await assertions.assertContainsText(dt, message);
    await assertions.assertVisible(dt);
    return;
  }

  // TODO: Replace XPath with Object Repository when available
  const xp = byXPath(
    `//*[contains(@data-testid,'error') or contains(@class,'error') or @role='alert'][contains(normalize-space(.),"${esc(message)}")]`
  ).first();
  await assertions.assertContainsText(xp, message);
  await assertions.assertVisible(xp);
});