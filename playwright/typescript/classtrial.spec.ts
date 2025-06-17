import { test, expect, request } from '@playwright/test';
import {LoginHelper} from "./LoginHelper"

import account from '../../test-data/ow_accountdetails.json';

let context_loggedIn: any

test("ACC-04+08 Can log in to an already created account", async () => {
    // await page.getByRole('link', { name: ' Signup / Login' }).click()

    // await expect(page.getByText('Login to your account Login')).toBeVisible()

    // await page.getByTestId('login-email').fill(account.email)
    // await page.getByTestId('login-password').fill(account.password)
    // await page.getByTestId('login-button').click()
    const loginHelper = new LoginHelper(account.email, account.password);
    context_loggedIn = await loginHelper.loginSaveStorageState();

    const page = await context_loggedIn.newPage()
    await page.goto("https://www.automationexercise.com/login");
    await page.pause();

    // //Verify that the account name is correct
    // expect(await page.locator('.shop-menu.pull-right').getByRole('listitem').nth(9).locator('b').innerText()).toEqual(account.account_name);

    // //Log out of account
    // await page.locator('.shop-menu.pull-right').getByRole('listitem').nth(3).click()
})