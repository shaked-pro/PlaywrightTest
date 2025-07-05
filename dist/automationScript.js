"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const PROFILE_PATH = './google-profile'; //used fake google profile for auth puposes
const CATEGORY_URL = 'https://workspace.google.com/marketplace/category/productivity';
const MAX_APPS = 10; //const limiting number of apps to parse
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
//this function is the main entry point of the script. It launches the browser, 
//navigates to the category page, extracts app data, and writes it to a JSON file.
//INPUT: none
//OUTPUT: none
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const { context, page } = yield launchBrowser();
        yield navigateToCategory(page);
        const cards = yield extractAppCards(page);
        const results = [];
        for (let i = 0; i < Math.min(cards.length, MAX_APPS); i++) {
            const data = yield extractAppData(cards[i]);
            results.push(data);
        }
        // Write results to file
        fs.writeFileSync('apps.json', JSON.stringify(results, null, 2));
        console.log('Data written to apps.json');
        yield context.close();
    });
}
run();
//# sourceMappingURL=automationScript.js.map