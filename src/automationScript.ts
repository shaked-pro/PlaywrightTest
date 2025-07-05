import { chromium, Request } from 'playwright';

(async () => {
    const context = await chromium.launchPersistentContext('./google-profile', {
        headless: false
      });
    const page = await context.newPage();

    await page.goto('https://workspace.google.com/marketplace/category/productivity', {
        waitUntil: 'domcontentloaded'
    });

    await page.waitForSelector('a.RwHvCd');
    const cards = await page.$$('a.RwHvCd');

    const results = [];

    for (let i = 0; i < Math.min(cards.length, 10); i++) {
        const card = cards[i];

        const name = await card.$eval('div.M0atNd', el => el.textContent?.trim() || '');
        const author = await card.$eval('span.y51Cnd', el => el.textContent?.trim() || '');
        const description = await card.$eval('div.BiEFEd', el => el.textContent?.trim() || '');

        const rating = await card.$eval('span.GDSAjf span.kVdtk:nth-of-type(1) span.wUhZA', el => el.textContent?.trim() || null).catch(() => null);
        const downloads = await card.$eval('span.GDSAjf span.kVdtk:nth-of-type(2) span.wUhZA', el => el.textContent?.trim() || null).catch(() => null);

        results.push({
            name,
            author,
            description,
            rating,
            downloads
        });
    }

    console.log(JSON.stringify(results, null, 2));
    await context.close();
})();

