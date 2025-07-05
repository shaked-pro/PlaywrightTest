import { chromium, BrowserContext, Page, ElementHandle } from 'playwright';


const PROFILE_PATH = './google-profile'; //used fake google profile for auth puposes
const CATEGORY_URL = 'https://workspace.google.com/marketplace/category/productivity';
export const MAX_APPS = 10; //const limiting number of apps to parse

export interface AppData { // the temporary interface to hold the app's data (will later be converted to json) 
    name: string;
    author: string;
    description: string;
    rating: string | null;
    downloads: string | null;
}

//this function launches the browser with a persistent context using a fake profile
//this was done to avoid authentication issues 
//INPUT: none
//OUTPUT: returns a promise that resolves to an object containing the browser context and a new page
export async function launchBrowser(): Promise<{ context: BrowserContext, page: Page }> {
    const context = await chromium.launchPersistentContext(PROFILE_PATH, { headless: false });
    const page = await context.newPage();
    return { context, page };
}

//this function navigates to the specified category URL
//INPUT: page - the Playwright Page object
//OUTPUT: returns a promise that resolves when the navigation is complete
export async function navigateToCategory(page: Page): Promise<void> {
    await page.goto(CATEGORY_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('a.RwHvCd');
}

//this function extracts app cards from the page
//INPUT: page - the Playwright Page object
//OUTPUT: returns a promise that resolves to an array of ElementHandles representing the app cards
export async function extractAppCards(page: Page): Promise<ElementHandle[]> {
    return await page.$$('a.RwHvCd');
}

//this function extracts data from a single app card
//INPUT: card - the ElementHandle representing the app card 
//OUTPUT: returns a promise that resolves to an AppData object containing the app's details
export async function extractAppData(card: ElementHandle): Promise<AppData> {
    const name = await card.$eval('div.M0atNd', el => el.textContent?.trim() || '');
    const author = await card.$eval('span.y51Cnd', el => el.textContent?.trim() || '');
    const description = await card.$eval('div.BiEFEd', el => el.textContent?.trim() || '');

    const rating = await card
        .$eval('span.GDSAjf span.kVdtk:nth-of-type(1) span.wUhZA', el => el.textContent?.trim() || null)
        .catch(() => null);

    const downloads = await card
        .$eval('span.GDSAjf span.kVdtk:nth-of-type(2) span.wUhZA', el => el.textContent?.trim() || null)
        .catch(() => null);

    return { name, author, description, rating, downloads };
}