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
const playwright_1 = require("playwright");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield playwright_1.chromium.launch({ headless: false });
    const page = yield browser.newPage();
    yield page.goto('https://workspace.google.com/marketplace/', {
        waitUntil: 'domcontentloaded'
    });
    page.click('text=Categories');
    yield page.waitForTimeout(1000); // Wait for the dropdown to open
    yield page.click('text=Productivity');
    yield page.waitForTimeout(2000); // Wait for the page to load
    console.log('URL:', page.url());
    // Wait for app cards to load
    yield page.waitForSelector('div.nrKJWc');
    const allCards = yield page.$$('div.nrKJWc');
    const visibleCards = [];
    for (const card of allCards) {
        const box = yield card.boundingBox();
        if (box)
            visibleCards.push(card); // skip hidden/offscreen cards
    }
    console.log(`Found ${visibleCards.length} visible cards`);
    const results = [];
    for (let i = 0; i < Math.min(visibleCards.length, 10); i++) {
        const card = visibleCards[i];
        const name = yield card.$eval('div.M0atNd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const author = yield card.$eval('span.y51Cnd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        results.push({ name, author });
    }
    console.log(JSON.stringify(results, null, 2));
    yield browser.close();
}))();
//# sourceMappingURL=automationScript.js.map