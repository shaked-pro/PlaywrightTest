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
    const context = yield playwright_1.chromium.launchPersistentContext('./google-profile', {
        headless: false
    });
    const page = yield context.newPage();
    yield page.goto('https://workspace.google.com/marketplace/category/productivity', {
        waitUntil: 'domcontentloaded'
    });
    yield page.waitForSelector('a.RwHvCd');
    const cards = yield page.$$('a.RwHvCd');
    const installButtons = yield page.$$('button:has-text("Install")'); // Assume button list matches card order
    const results = [];
    for (let i = 0; i < Math.min(cards.length, 10); i++) {
        const card = cards[i];
        const name = yield card.$eval('div.M0atNd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const author = yield card.$eval('span.y51Cnd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const description = yield card.$eval('div.BiEFEd', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; });
        const rating = yield card.$eval('span.GDSAjf span.kVdtk:nth-of-type(1) span.wUhZA', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null; }).catch(() => null);
        const downloads = yield card.$eval('span.GDSAjf span.kVdtk:nth-of-type(2) span.wUhZA', el => { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || null; }).catch(() => null);
        results.push({
            name,
            author,
            description,
            rating,
            downloads
        });
    }
    console.log(JSON.stringify(results, null, 2));
    yield context.close();
}))();
//# sourceMappingURL=automationScript.js.map