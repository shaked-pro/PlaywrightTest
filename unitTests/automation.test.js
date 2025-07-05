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
const automationScript_1 = require("../src/automationScript");
//tested extractAppData function since it is logic-heavy and crucial for data extraction
describe('extractAppData', () => {
    it('should return correct structure from mocked card', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCard = {
            $eval: (selector, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const map = {
                    'div.M0atNd': 'Test App',
                    'span.y51Cnd': 'Test Author',
                    'div.BiEFEd': 'Test Description',
                    'span.GDSAjf span.kVdtk:nth-of-type(1) span.wUhZA': '4.5',
                    'span.GDSAjf span.kVdtk:nth-of-type(2) span.wUhZA': '1M+'
                };
                return cb({ textContent: map[selector] || '' });
            })
        };
        const result = yield (0, automationScript_1.extractAppData)(mockCard);
        const expected = {
            name: 'Test App',
            author: 'Test Author',
            description: 'Test Description',
            rating: '4.5',
            downloads: '1M+'
        };
        expect(result).toEqual(expected);
    }));
    it('should handle missing rating/downloads gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCard = {
            $eval: (selector, cb) => __awaiter(void 0, void 0, void 0, function* () {
                const map = {
                    'div.M0atNd': 'Test App',
                    'span.y51Cnd': 'Test Author',
                    'div.BiEFEd': 'Test Description'
                    // No rating or downloads in map
                };
                if (!(selector in map))
                    throw new Error('Not found');
                return cb({ textContent: map[selector] });
            })
        };
        const result = yield (0, automationScript_1.extractAppData)(mockCard);
        expect(result.rating).toBeNull();
        expect(result.downloads).toBeNull();
    }));
});
//# sourceMappingURL=automation.test.js.map