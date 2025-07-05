import { extractAppData, AppData } from '../src/automationScript';

//tested extractAppData function since it is logic-heavy and crucial for data extraction
describe('extractAppData', () => {
    it('should return correct structure from mocked card', async () => {
        const mockCard = {
            $eval: async (selector: string, cb: (el: any) => any) => {
                const map: Record<string, string> = {
                    'div.M0atNd': 'Test App',
                    'span.y51Cnd': 'Test Author',
                    'div.BiEFEd': 'Test Description',
                    'span.GDSAjf span.kVdtk:nth-of-type(1) span.wUhZA': '4.5',
                    'span.GDSAjf span.kVdtk:nth-of-type(2) span.wUhZA': '1M+'
                };
                return cb({ textContent: map[selector] || '' });
            }
        };

        const result = await extractAppData(mockCard as any);
        const expected: AppData = {
            name: 'Test App',
            author: 'Test Author',
            description: 'Test Description',
            rating: '4.5',
            downloads: '1M+'
        };

        expect(result).toEqual(expected);
    });

    it('should handle missing rating/downloads gracefully', async () => {
        const mockCard = {
            $eval: async (selector: string, cb: (el: any) => any) => {
                const map: Record<string, string> = {
                    'div.M0atNd': 'Test App',
                    'span.y51Cnd': 'Test Author',
                    'div.BiEFEd': 'Test Description'
                    // No rating or downloads in map
                };
                if (!(selector in map)) throw new Error('Not found');
                return cb({ textContent: map[selector] });
            }
        };

        const result = await extractAppData(mockCard as any);
        expect(result.rating).toBeNull();
        expect(result.downloads).toBeNull();
    });
});
