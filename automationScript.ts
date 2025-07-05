import { chromium, Page, BrowserContext } from 'playwright';

(async () => {
    const userDataDir = 'C:/Users/gigis/playwright-profile';
    const context: BrowserContext = await chromium.launchPersistentContext(userDataDir, {
        headless: false,
    });

    const page: Page = await context.newPage();
    await page.goto('https://workspace.google.com/marketplace', { waitUntil: 'domcontentloaded' });

    // Click the sidebar and select "Productivity"
    await page.click('text=Categories');
    await page.click('text=Productivity');

})();
