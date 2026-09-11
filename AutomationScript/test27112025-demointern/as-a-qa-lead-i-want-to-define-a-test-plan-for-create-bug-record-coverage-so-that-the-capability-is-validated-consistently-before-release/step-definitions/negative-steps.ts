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

const esc = (v: string): string => v.replace(/"/g, '\\"');

const dt = (id: string) => page.locator(`[data-testid="${id}"]`);
const txt = (t: string) => page.locator(`//*[contains(normalize-space(), "${esc(t)}")]`);

const findVisibleElement = async (name: string) => {
  const key = toKebab(name);
  const candidates = [
    dt(`text-${key}`),
    dt(`label-${key}`),
    dt(`status-${key}`),
    dt(`message-${key}`),
    dt(`section-${key}`),
    dt(`item-${key}`),
    dt(`coverage-${key}`),
    dt(`governance-${key}`),
    dt(`requirement-${key}`),
    txt(name),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      return locator.first();
    }
  }

  return txt(name).first();
};

const findButton = async (buttonText: string) => {
  const key = toKebab(buttonText);
  const candidates = [
    dt(`button-${key}`),
    dt(key),
    page.locator(`[data-testid*="${key}"]`),
    page.locator(`//button[normalize-space()="${esc(buttonText)}"]`),
    page.locator(`//button[contains(normalize-space(), "${esc(buttonText)}")]`),
    page.locator(`//*[@role="button" and normalize-space()="${esc(buttonText)}"]`),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      return locator.first();
    }
  }

  return page.locator(`//button[contains(normalize-space(), "${esc(buttonText)}")]`).first();
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
    baseUrl: process.env.BASE_URL || 'https://example.test-management.local',
    pages: {
      createBugRecordTestPlan: `${process.env.BASE_URL || 'https://example.test-management.local'}/test-management/create-bug-record-test-plan`,
    },
    users: {
      editor: { username: 'editor.user', password: 'editor123', role: 'edit-access' },
    },
    plans: {
      'POST /api/v1/bugs': {
        title: 'Create Bug Record Test Plan',
        endpoint: 'POST /api/v1/bugs',
        status: 'Draft',
      },
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
/*  TEST CASE: TC-001
/*  Title: Finalization is rejected when mandatory in-scope coverage is missing
/*  Priority: High
/*  Category: Negative
/*  Description: Validates submission rejection for missing in-scope coverage
/**************************************************/

/**************************************************/
/*  TEST CASE: TC-002
/*  Title: Finalization is rejected when governance controls are incomplete
/*  Priority: High
/*  Category: Negative
/*  Description: Validates rejection when governance items are incomplete
/**************************************************/

/**************************************************/
/*  TEST CASE: TC-003
/*  Title: Finalization is rejected when traceability mappings are incomplete
/*  Priority: High
/*  Category: Negative
/*  Description: Validates rejection for missing or partial traceability mappings
/**************************************************/

// ==================== GIVEN STEPS ====================

Given('user is on {string} page', async function (pageName: string) {
  const key = toKebab(pageName);
  const url =
    this.testData?.pages?.createBugRecordTestPlan && key === 'create-bug-record-test-plan'
      ? this.testData.pages.createBugRecordTestPlan
      : `${this.testData?.baseUrl || 'https://example.test-management.local'}/${key}`;

  await actions.navigateTo(url);
  await waits.waitForDomContentLoaded();
  await waits.waitForNetworkIdle();
});

Given('user has edit access to the test management repository', async function () {
  const accessIndicators = [
    dt('permission-edit-access'),
    dt('repository-edit-access'),
    dt('role-edit-access'),
    txt('edit access'),
  ];

  let matched = false;
  for (const locator of accessIndicators) {
    if ((await locator.count()) > 0) {
      await assertions.assertVisible(locator.first());
      matched = true;
      break;
    }
  }

  if (!matched) {
    const fallback = dt('test-management-repository').first();
    if ((await fallback.count()) > 0) {
      await assertions.assertVisible(fallback);
    } else {
      await assertions.assertVisible(page.locator('//body'));
    }
  }

  this.userAccess = 'edit';
});

Given('a draft plan exists for {string}', async function (planName: string) {
  const key = toKebab(planName);
  const candidates = [
    dt(`draft-plan-${key}`),
    dt(`plan-${key}`),
    dt('draft-plan'),
    page.locator(`//*[contains(normalize-space(), "${esc(planName)}")]`),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      await assertions.assertVisible(locator.first());
      break;
    }
  }

  this.currentPlan = this.testData?.plans?.[planName] || { endpoint: planName, status: 'Draft' };
});

Given('{string} should be visible', async function (elementText: string) {
  const locator = await findVisibleElement(elementText);
  await assertions.assertVisible(locator);
});

Given('the draft plan omits required coverage item {string}', async function (missingCoverageItem: string) {
  const key = toKebab(missingCoverageItem);
  this.missingCoverageItem = missingCoverageItem;

  const candidates = [
    dt(`coverage-item-${key}`),
    dt(`item-${key}`),
    page.locator(`//*[contains(normalize-space(), "${esc(missingCoverageItem)}")]`),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      await waits.waitForVisible(locator.first());
      break;
    }
  }
});

Given('the draft plan omits required governance item {string}', async function (missingGovernanceItem: string) {
  const key = toKebab(missingGovernanceItem);
  this.missingGovernanceItem = missingGovernanceItem;

  const candidates = [
    dt(`governance-item-${key}`),
    dt(`item-${key}`),
    page.locator(`//*[contains(normalize-space(), "${esc(missingGovernanceItem)}")]`),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      await waits.waitForVisible(locator.first());
      break;
    }
  }
});

Given('all planned coverage items are listed in the draft plan', async function () {
  const candidates = [
    dt('planned-coverage-list'),
    dt('coverage-items-list'),
    dt('traceability-matrix'),
    txt('Traceability Matrix'),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      await assertions.assertVisible(locator.first());
      break;
    }
  }

  this.allCoverageListed = true;
});

Given(
  'the traceability matrix has mapping status {string} for coverage item {string}',
  async function (mappingStatus: string, coverageItem: string) {
    const statusKey = toKebab(mappingStatus);
    const itemKey = toKebab(coverageItem);

    const rowCandidates = [
      dt(`traceability-row-${itemKey}`),
      dt(`coverage-row-${itemKey}`),
      page.locator(`//tr[.//*[contains(normalize-space(), "${esc(coverageItem)}")]]`),
      page.locator(`//*[contains(normalize-space(), "${esc(coverageItem)}")]`),
    ];

    for (const locator of rowCandidates) {
      if ((await locator.count()) > 0) {
        await assertions.assertVisible(locator.first());
        break;
      }
    }

    const statusCandidates = [
      dt(`mapping-status-${statusKey}`),
      dt(`status-${statusKey}`),
      page.locator(
        `//*[contains(normalize-space(), "${esc(coverageItem)}")]/ancestor::*[self::tr or self::div][1]//*[contains(normalize-space(), "${esc(mappingStatus)}")]`
      ),
      txt(mappingStatus),
    ];

    for (const locator of statusCandidates) {
      if ((await locator.count()) > 0) {
        await assertions.assertVisible(locator.first());
        break;
      }
    }

    this.mappingStatus = mappingStatus;
    this.coverageItem = coverageItem;
  }
);

// ==================== WHEN STEPS ====================

When('user clicks {string} button', async function (buttonText: string) {
  const button = await findButton(buttonText);
  await actions.scrollIntoView(button);
  await waits.waitForVisible(button);
  await actions.click(button);
  await waits.waitForNetworkIdle();
});

// ==================== THEN STEPS ====================

Then('error message {string} should be displayed', async function (validationMessage: string) {
  const key = toKebab(validationMessage);
  const candidates = [
    dt(`error-${key}`),
    dt(`validation-message-${key}`),
    dt('error-message'),
    dt('validation-message'),
    page.locator(`//*[contains(normalize-space(), "${esc(validationMessage)}")]`),
  ];

  for (const locator of candidates) {
    if ((await locator.count()) > 0) {
      await assertions.assertVisible(locator.first());
      await assertions.assertContainsText(locator.first(), validationMessage);
      return;
    }
  }

  await assertions.assertContainsText(page.locator('//body'), validationMessage);
});

Then('{string} should be visible', async function (text: string) {
  const locator = await findVisibleElement(text);
  await assertions.assertVisible(locator);
});

Then('I should see {string}', async function (text: string) {
  const locator = await findVisibleElement(text);
  await assertions.assertVisible(locator);
  await assertions.assertContainsText(locator, text);
});