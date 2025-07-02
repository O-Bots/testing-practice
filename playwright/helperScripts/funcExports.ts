import { expect } from "@playwright/test";
import account from '../../test-data/ow_accountdetails.json';

//Function to create a new user account using test data
//Returns nothing so type is set to "Promise<void>" (would be "void" if it was not async)
export async function createUser(browser: any): Promise<void> {
    await browser.getByRole('link', { name: ' Signup / Login' }).click()

    await expect(browser.locator('div').filter({ hasText: 'New User Signup! Signup' }).nth(2)).toBeVisible()

    await browser.getByRole('textbox', { name: 'Name' }).fill(account.account_name)
    await browser.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(account.email)
    await browser.getByRole('button', { name: 'Signup' }).click()

    await browser.click('#id_gender1')
    await browser.getByRole('textbox', { name: 'Password *' }).fill(account.password)
    await browser.locator('#days').selectOption(`${account.dob.day}`)
    await browser.locator('#months').selectOption(`${account.dob.month}`)
    await browser.locator('#years').selectOption(`${account.dob.year}`)
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
}

//Simple function to log in to a user account using test data
//Returns nothing so type is set to "Promise<void>" (would be "void" if it was not async)
export async function login(browser: any): Promise<void> {
    await browser.getByRole('link', { name: ' Signup / Login' }).click()

    await expect(browser.getByText('Login to your account Login')).toBeVisible()

    await browser.getByTestId('login-email').fill(account.email)
    await browser.getByTestId('login-password').fill(account.password)
    await browser.getByTestId('login-button').click()
}