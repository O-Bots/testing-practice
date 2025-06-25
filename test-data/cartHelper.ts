//This helper class will create a shopping cart already filled for purchase checks
//Storage state info will then be saved to a .json file
//This should give the tester an already filled shopping cart to test

import {chromium, Browser, BrowserContext} from "@playwright/test";
import fs from "fs";

interface ItemInfo {
    name: string;
    price: number;
}

export class CartChecker {
    private browser!: Browser;
    private storageStatePath: string;
    private itemInfoFilePath: string;
    private itemInfo: ItemInfo[] =[];

    //Constructor requires number of items and if duplicate items are allowed
    //Can optionally pass a file prefix but will default to "cartStorageState" prefix if one isn't passed
    constructor(
        private numberOfItems: number,
        private storageStateFilePrefix: string = "cartStorageState" //Default value
    ) {
        this.storageStatePath = `${this.storageStateFilePrefix}_${this.numberOfItems}.json`
        this.itemInfoFilePath = `${this.storageStateFilePrefix}_items.json`;
    }

    //Function to check the browser isn't already open.
    //Opens a browser instance if not already open.
    async initialiseBrowser() {
        if (!this.browser) {
        this.browser = await chromium.launch({ headless: false });
        }
    }

    private saveItemInfo() {
        fs.writeFileSync(this.itemInfoFilePath, JSON.stringify(this.itemInfo, null, 2));
    }

    private loadItemInfo() {
        if (fs.existsSync(this.itemInfoFilePath)) {
            this.itemInfo = JSON.parse(fs.readFileSync(this.itemInfoFilePath, "utf-8"));
        }
    }

    //Main function to return a logged-in browser context.
    //It reuses a storageState file if found.
    async cartSaveStorageState(): Promise<{context: BrowserContext, itemInfo: ItemInfo[]}> {
        await this.initialiseBrowser();

        //Check for an existing .json file that matches the unique user.
        //If it aleady exists, return the browser context with the .json file it found:
        if (fs.existsSync(this.storageStatePath)) {
            console.log(`File "${this.storageStatePath}" found, using this as the storageState.`);
            this.loadItemInfo();
            const context = await this.browser.newContext({ storageState: this.storageStatePath });
            return {context, itemInfo: this.itemInfo};
        } else {
            const context = await this.browser.newContext();
            const page = await context.newPage();

            //If the .json storageState file doesn't exist, create one.
            await page.goto("https://www.automationexercise.com");
            if (await page.getByRole('button', { name: 'Consent' }).isVisible()) await page.getByRole('button', { name: 'Consent' }).click()
            const featuredItems = await page.locator('//div[@class="features_items"]//div[@class="product-image-wrapper"]').all()
            for (let i = 0; i < this.numberOfItems; i++) {
                const rngItem = Math.floor(Math.random() * featuredItems.length)
                const itemName = await featuredItems[rngItem].locator('.productinfo').locator('p').innerText()
                const itemPrice = await featuredItems[rngItem].locator('.productinfo').locator('h2').innerText()
                await featuredItems[rngItem].locator('.productinfo').locator('.add-to-cart').click()
                await page.locator('.close-modal').click()
                this.itemInfo.push({name: itemName, price: Number(itemPrice.replace(/^Rs\.?\s*/, ''))})
            }

            //Save the current storageState:
            this.saveItemInfo();
            await context.storageState({ path: this.storageStatePath });
            console.log(`Created new storageState file "${this.storageStatePath}"`);
            return {context, itemInfo: this.itemInfo};
        }
    }

    //Close the browser if it's open:
    async closeBrowser() {
        if (this.browser) {
        await this.browser.close();
        }
    }
}