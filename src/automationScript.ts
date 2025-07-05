import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://workspace.google.com/marketplace/category/productivity', {
        waitUntil: 'domcontentloaded'
    });

    // Wait for app cards to load
    await page.waitForSelector('div.nrKJWc');

    const allCards = await page.$$('div.nrKJWc');

    const visibleCards = [];

    for (const card of allCards) {
        const box = await card.boundingBox();
        if (box) visibleCards.push(card); // skip hidden/offscreen cards
    }

    console.log(`Found ${visibleCards.length} visible cards`);

    const results = [];

    for (let i = 0; i < Math.min(visibleCards.length, 10); i++) {
        const card = visibleCards[i];

        const name = await card.$eval('div.M0atNd', el => el.textContent?.trim() || '');
        const author = await card.$eval('span.y51Cnd', el => el.textContent?.trim() || '');

        results.push({ name, author });
    }

    console.log(JSON.stringify(results, null, 2));

    await browser.close();
})();
