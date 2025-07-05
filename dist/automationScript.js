"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_APPS = void 0;
exports.launchBrowser = launchBrowser;
exports.navigateToCategory = navigateToCategory;
exports.extractAppCards = extractAppCards;
exports.extractAppData = extractAppData;
const playwright_1 = require("playwright");
const PROFILE_PATH = './google-profile'; //used fake google profile for auth puposes
const CATEGORY_URL = 'https://workspace.google.com/marketplace/category/productivity';
exports.MAX_APPS = 10; //const limiting number of apps to parse
//this function launches the browser with a persistent context using a fake profile
//this was done to avoid authentication issues 
//INPUT: none
//OUTPUT: returns a promise that resolves to an object containing the browser context and a new page
function launchBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        const context = yield playwright_1.chromium.launchPersistentContext(PROFILE_PATH, { headless: false });
        const page = yield context.newPage();
        return { context, page };
    });
}
//this function navigates to the specified category URL
//INPUT: page - the Playwright Page object
//OUTPUT: returns a promise that resolves when the navigation is complete
function navigateToCategory(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(CATEGORY_URL, { waitUntil: 'domcontentloaded' });
        yield page.waitForSelector('a.RwHvCd');
    });
}
//this function extracts app cards from the page
//INPUT: page - the Playwright Page object
//OUTPUT: returns a promise that resolves to an array of ElementHandles representing the app cards
function extractAppCards(page) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.$$('a.RwHvCd');
    });
}
//this function extracts data from a single app card
//INPUT: card - the ElementHandle representing the app card 
//OUTPUT: returns a promise that resolves to an AppData object containing the app's details
function extractAppData(card) {
    return __awaiter(this, void 0, void 0, function* () {
        const name = yield card.$eval('div.M0atNd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const author = yield card.$eval('span.y51Cnd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const description = yield card.$eval('div.BiEFEd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const rating = yield card
            .$eval('span.GDSAjf span.kVdtk:nth-of-type(1) span.wUhZA', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null; })
            .catch(() => null);
        const downloads = yield card
            .$eval('span.GDSAjf span.kVdtk:nth-of-type(2) span.wUhZA', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null; })
            .catch(() => null);
        return { name, author, description, rating, downloads };
    });
}
//# sourceMappingURL=automationScript.js.map