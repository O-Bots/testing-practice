//Helper file with a Class.
//The Class will log-in once with the credentials passed to it.
//It then saves the storage state to a .json file.
//This .json file can then be injected into a new browser context.
//This will bypass the need to log-in for every test.

//1. Login once with the given credentials (email and password)
//2. Use storageState() method to save the storage state (cookies etc.)
//3. Save the storage state to a .json file

import { chromium, Browser, BrowserContext, Page } from "@playwright/test";
import fs from "fs";

export class LoginHelper {
  private browser!: Browser;
  private storageStatePath: string;

  //Constructor requires an email & password.
  //Can optionally pass a file prefix, but will default to "storageState" prefix if one isn't passed.
  constructor(
    private loginEmail: string,
    private loginPassword: string,
    private storageStateFilePrefix: string = "storageState" //Default value
  ) {
    //Dynamic file naming so each user has a unique storage state file:
    this.storageStatePath = `${this.storageStateFilePrefix}_${this.loginEmail}.json`;
  }

  //Function to check the browser isn't already open.
  //Opens a browser instance if not already open.
  async initialiseBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: false });
    }
  }

  //Main function to return a logged-in browser context.
  //It reuses a storageState file if found.
  async loginSaveStorageState(): Promise<BrowserContext> {
    await this.initialiseBrowser();

    //Check for an existing .json file that matches the unique user.
    //If it aleady exists, return the browser context with the .json file it found:
    if (fs.existsSync(this.storageStatePath)) {
      return await this.browser.newContext({ storageState: this.storageStatePath });
    } else {
      const context = await this.browser.newContext();
      const page = await context.newPage();

      //If the .json storageState file doesn't exist, login and create one.
      //Goto login page, enter email & password, click login:
      await page.goto("https://www.automationexercise.com/login");
      await page.fill("input[data-qa='login-email']", this.loginEmail);
      await page.fill("input[data-qa='login-password']", this.loginPassword);
      await page.click("button[data-qa='login-button']");
      await page.waitForLoadState("networkidle");

      //Save the current storageState:
      await context.storageState({ path: this.storageStatePath });
      return context;
    }
  }

  //Close the browser if it's open:
  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
