import { test, expect, request } from '@playwright/test';
import {LoginHelper} from "./LoginHelper"

import account from '../../test-data/ow_accountdetails.json';

const baseURL = 'https://www.automationexercise.com/'

async function createUser(browser: any) {
    await browser.getByRole('link', { name: ' Signup / Login' }).click()

    await expect(browser.locator('div').filter({ hasText: 'New User Signup! Signup' }).nth(2)).toBeVisible()

    await browser.getByRole('textbox', { name: 'Name' }).fill(account.account_name)
    await browser.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(account.email)
    await browser.getByRole('button', { name: 'Signup' }).click()

    await browser.click('#id_gender1')
    await browser.getByRole('textbox', { name: 'Password *' }).fill(account.password)
    await browser.locator('#days').selectOption(account.dob.day)
    await browser.locator('#months').selectOption(account.dob.month)
    await browser.locator('#years').selectOption(account.dob.year)
    await browser.getByRole('textbox', { name: 'First name *' }).fill(account.first_name)
    await browser.getByRole('textbox', { name: 'Last name *' }).fill(account.last_name)

    await browser.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill(account.living_address.address)
    await browser.getByLabel('Country *').selectOption(account.living_address.country)
    await browser.getByRole('textbox', { name: 'State *' }).fill(account.living_address.state)
    await browser.getByRole('textbox', { name: 'City * Zipcode *' }).fill(account.living_address.city)
    await browser.locator('#zipcode').fill(account.living_address.zipcode)
    await browser.getByRole('textbox', { name: 'Mobile Number *' }).fill(account.mobile_number)
    await browser.getByRole('button', { name: 'Create Account' }).click()
    await browser.locator('.btn.btn-primary', {hasText: 'Continue'}).click();

    //Verify that the account name is correct
    expect(await browser.locator('.shop-menu.pull-right').getByRole('listitem').nth(9).locator('b').innerText()).toEqual(account.account_name);

    //Log out of account
    await browser.locator('.shop-menu.pull-right').getByRole('listitem').nth(3).click()

    // //Verify account is logged out
    // expect(await browser.getByText('Login to your account Login')).toBeVisible()
}

async function login(browser: any) {
    await browser.getByRole('link', { name: ' Signup / Login' }).click()

    await expect(browser.getByText('Login to your account Login')).toBeVisible()

    await browser.getByTestId('login-email').fill(account.email)
    await browser.getByTestId('login-password').fill(account.password)
    await browser.getByTestId('login-button').click()

    //Verify that the account name is correct
    expect(await browser.locator('.shop-menu.pull-right').getByRole('listitem').nth(9).locator('b').innerText()).toEqual(account.account_name);
}

// test.beforeEach('Test prep', async ({page}, testInfo) => {
//     if(!testInfo.title.includes('API')){
//         await page.goto(baseURL)
//         await page.getByRole('button', { name: 'Consent' }).click()
//     }
// })
let context_loggedIn: any

test.describe("Account functionality", () => {
    test("ACC-01+08 Account can be created as expected", async ({page}) => {
        
        await createUser(page)

    })

    test("ACC-02 Unable to create account with already used email", async ({page}) => {
        await page.getByRole('link', { name: ' Signup / Login' }).click()

        await expect(page.locator('div').filter({ hasText: 'New User Signup! Signup' }).nth(2)).toBeVisible()

        await page.getByRole('textbox', { name: 'Name' }).fill(account.account_name)
        await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(account.email)
        await page.getByRole('button', { name: 'Signup' }).click()
        
    })

    test("ACC-03 Unable to create account with missing required fields", async ({page}) => {
        await page.getByRole('link', { name: ' Signup / Login' }).click()

        await expect(page.locator('div').filter({ hasText: 'New User Signup! Signup' }).nth(2)).toBeVisible()

        await page.getByRole('textbox', { name: 'Name' }).fill(account.account_name)
        await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(1+account.email)
        await page.getByRole('button', { name: 'Signup' }).click()

        await page.click('#id_gender1')
        await page.getByRole('textbox', { name: 'Password *' }).fill(account.password)
        await page.locator('#days').selectOption(account.dob.day)
        await page.getByRole('button', { name: 'Create Account' }).click()

        expect(await page.url()).toContain("signup")
        
    })

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

    test("ACC-05 Unable to login with incorrect details", async ({page}) => {
        await page.getByRole('link', { name: ' Signup / Login' }).click()

        await expect(page.getByText('Login to your account Login')).toBeVisible()

        await page.getByTestId('login-email').fill(account.email+1)
        await page.getByTestId('login-password').fill(account.password)
        await page.getByTestId('login-button').click()
        
        await expect(page.locator('.login-form').locator('p')).toHaveText('Your email or password is incorrect!')
    })

    test("ACC-06 Unable to login with case incorrect details", async ({page}) => {
        await page.getByRole('link', { name: ' Signup / Login' }).click()

        await expect(page.getByText('Login to your account Login')).toBeVisible()

        await page.getByTestId('login-email').fill(account.email)
        await page.getByTestId('login-password').fill(account.password.toLocaleUpperCase())
        await page.getByTestId('login-button').click()
        
        await expect(page.locator('.login-form').locator('p')).toHaveText('Your email or password is incorrect!')
    })

    test("ACC-10 Can delete an already created account", async ({page}) => {

        await login(page)

        await page.getByRole('link', { name: ' Delete Account' }).click()

        //Confirm account deletion
        await page.locator('.btn.btn-primary', {hasText: 'Continue'}).click();

    })
})

test.describe("Purchase flow", () => {
    test("PUR-01 Searching for an existing product works as expected", async ({page}) => {
        await page.getByRole('link', { name: 'Products' }).click()
        await page.getByRole('textbox', { name: 'Search Product' }).fill("Stylish Dress")
        await page.locator('#submit_search').click()
        
        expect(await page.locator('.productinfo.text-center').nth(0).innerText()).toContain("Stylish Dress")
        
    })
})