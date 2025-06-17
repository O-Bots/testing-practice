import { test, expect } from '@playwright/test';

import account from '../../test-data/ow_accountdetails.json';

const baseURL = 'https://www.automationexercise.com/'

async function createUser(browser: any) {
    await browser.getByRole('link', { name: ' Signup / Login' }).click()

    expect(browser.locator('div').filter({ hasText: 'New User Signup! Signup' }).nth(2)).toBeVisible()

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
    await browser.getByLabel('Country *').selectOption("Canada")
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

    expect(browser.getByText('Login to your account Login')).toBeVisible()

    await browser.getByTestId('login-email').fill(account.email)
    await browser.getByTestId('login-password').fill(account.password)
    await browser.getByTestId('login-button').click()

    //Verify that the account name is correct
    expect(await browser.locator('.shop-menu.pull-right').getByRole('listitem').nth(9).locator('b').innerText()).toEqual(account.account_name);
}

test.beforeEach('Test prep', async ({page}) => {
    await page.goto(baseURL)
    await page.getByRole('button', { name: 'Consent' }).click()
})

test.describe("Account functionality", () => {
    test("Account can be created as expected", async ({page}) => {
        
        await createUser(page)

    })
    test("Can log in to an already created account", async ({page}) => {
        await page.getByRole('link', { name: ' Signup / Login' }).click()

        expect(await page.getByText('Login to your account Login')).toBeVisible()

        await page.getByTestId('login-email').fill(account.email)
        await page.getByTestId('login-password').fill(account.password)
        await page.getByTestId('login-button').click()

        //Verify that the account name is correct
        expect(await page.locator('.shop-menu.pull-right').getByRole('listitem').nth(9).locator('b').innerText()).toEqual(account.account_name);

        //Log out of account
        await page.locator('.shop-menu.pull-right').getByRole('listitem').nth(3).click()

        // //Verify account is logged out
        // expect(await page.getByText('Login to your account Login')).toBeVisible()
    })
    test("Can log in and delete an already created account", async ({page}) => {

        await login(page)

        await page.getByRole('link', { name: ' Delete Account' }).click()

        //Confirm account deletion
        await page.locator('.btn.btn-primary', {hasText: 'Continue'}).click();

    })
})