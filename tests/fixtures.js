import { test as base, chromium } from '@playwright/test';
import path from 'path';


export const test = base.extend({
    context: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '..');
        const context = await chromium.launchPersistentContext('', {
            headless: false,
            args: [
                // `--headless=new`,
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });
        await use(context);
        await context.close();
    },
    dirName: async ({ }, use) => {
        use(path.join(__dirname, '..'))
    },
    extensionId: async ({ context }, use) => {
        // for manifest v3:
        let [background] = context.serviceWorkers();
        if (!background)
            background = await context.waitForEvent('serviceworker');

        const extensionId = background.url().split('/')[2];
        await use(extensionId);
    },
    pathToExtension: async ({ }, use) => {
        const pathToExtension = path.join(__dirname, '..');
        await use(pathToExtension);
    },
    databaseName: async ({ }, use) => {
        await use(`MYDB`);
    }
});
export const expect = test.expect;
