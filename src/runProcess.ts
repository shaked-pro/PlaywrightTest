import * as fs from 'fs';
import {
    launchBrowser,
    navigateToCategory,
    extractAppCards,
    extractAppData,
    AppData,
    MAX_APPS
} from './automationScript';

async function run() {
    const { context, page } = await launchBrowser();
    await navigateToCategory(page);

    const cards = await extractAppCards(page);
    const results: AppData[] = [];

    for (let i = 0; i < Math.min(cards.length, MAX_APPS); i++) {
        const data = await extractAppData(cards[i]);
        results.push(data);
    }

    fs.writeFileSync('apps.json', JSON.stringify(results, null, 2));
    console.log('✅ Data written to apps.json');

    await context.close();
}

run();
