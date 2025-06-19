import { test, expect } from '@playwright/test';

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

test.beforeEach('Test prep', async ({page}, testInfo) => {
    if(!testInfo.title.includes('API')){
        await page.goto(baseURL)
        await page.getByRole('button', { name: 'Consent' }).click()
    }
})

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

    test("ACC-04+08 Can log in to an already created account", async ({page}) => {
        await page.getByRole('link', { name: ' Signup / Login' }).click()

        await expect(page.getByText('Login to your account Login')).toBeVisible()

        await page.getByTestId('login-email').fill(account.email)
        await page.getByTestId('login-password').fill(account.password)
        await page.getByTestId('login-button').click()

        //Verify that the account name is correct
        expect(await page.locator('.shop-menu.pull-right').getByRole('listitem').nth(9).locator('b').innerText()).toEqual(account.account_name);

        //Log out of account
        await page.locator('.shop-menu.pull-right').getByRole('listitem').nth(3).click()
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

    test("PUR-02 Searching for a non-existent product works as expected", async ({page}) => {
        await page.getByRole('link', { name: 'Products' }).click()
        await page.getByRole('textbox', { name: 'Search Product' }).fill("Dark Souls 2")
        await page.locator('#submit_search').click()

        expect(await page.locator('.single-products').count()).toEqual(0)
    })

    test("PUR-03 Browsing categories work as expected", async ({page}) => {
        const categories = await page.locator('.category-products .panel-default').nth(0)
        const mainCategory = await categories.locator('.panel-heading').innerText()
        const subCategory = await categories.locator('//div[@class="panel-body"]/ul/li[1]').innerText()

        await page.getByRole('link', { name: 'Women' }).click()
        await page.getByRole('link', { name: 'Dress' }).click()
        
        expect((await page.locator('.title').innerText()).toLocaleLowerCase()).toContain(mainCategory.toLocaleLowerCase())
        expect((await page.locator('.title').innerText()).toLocaleLowerCase()).toContain(subCategory.toLocaleLowerCase())
    })

    test("PUR-4 Product details are correct on the product detail page", async ({page}) => {
        const featuredItems = await page.locator('//div[@class="features_items"]//div[@class="product-image-wrapper"]').all()
        const rngItem = Math.floor(Math.random() * featuredItems.length)
        const itemName = await featuredItems[rngItem].locator('.productinfo').locator('p').innerText()
        const itemPrice = await featuredItems[rngItem].locator('.productinfo').locator('h2').innerText()

        await featuredItems[rngItem].locator('.choose').click()

        const productInfoName = await page.locator('.product-information').locator('h2').innerText()
        const productInfoPrice = await page.locator('//div[@class="product-information"]/span/span').innerText()

        expect(itemName.toLocaleLowerCase()).toEqual(productInfoName.toLocaleLowerCase())

        //Used regex (/^Rs\.?\s*/, '') to remove the "Rs. " leaving only the price
        expect(itemPrice.replace(/^Rs\.?\s*/, '')).toEqual(productInfoPrice.replace(/^Rs\.?\s*/, ''))
    })

    test("PUR-05 Successfully adds a product to the cart", async ({page}) => {
        const featuredItems = await page.locator('//div[@class="features_items"]//div[@class="product-image-wrapper"]').all()
        const rngItem = Math.floor(Math.random() * featuredItems.length)
        const itemName = await featuredItems[rngItem].locator('.productinfo').locator('p').innerText()
        const itemPrice = await featuredItems[rngItem].locator('.productinfo').locator('h2').innerText()

        await featuredItems[rngItem].locator('.productinfo').locator('.add-to-cart').click()
        await page.locator('.close-modal').click()
        await page.locator('//ul[@class="nav navbar-nav"]/li[3]').click()

        const cartItemName = await page.locator('//td[@class="cart_description"]//a').innerText()
        const cartItemPrice = await page.locator('//td[@class="cart_price"]/p').innerText()
        
        expect(itemName.toLocaleLowerCase()).toEqual(cartItemName.toLocaleLowerCase())
        expect(itemPrice.replace(/^Rs\.?\s*/, '')).toEqual(cartItemPrice.replace(/^Rs\.?\s*/, ''))
    })

    test("PUR-06 Successfully changes quantity of items in cart", async ({page}) => {
        const featuredItems = await page.locator('//div[@class="features_items"]//div[@class="product-image-wrapper"]').all()
        const rngItem = Math.floor(Math.random() * featuredItems.length)

        await featuredItems[rngItem].locator('.productinfo').locator('.add-to-cart').click()
        await page.locator('.close-modal').click()
        await page.locator('//ul[@class="nav navbar-nav"]/li[3]').click()

        const cartItemQuantity = await page.locator('//td[@class="cart_quantity"]').innerText()
        const cartItemTotal = await page.locator('.cart_total_price').innerText()
        
        await page.locator('//td[@class="cart_description"]//a').click()
        await page.locator(".btn.btn-default.cart").click()
        await page.locator('//div[@class="modal-body"]/p/a').click()        
        
        const secondCartItemQuantity = await page.locator('//td[@class="cart_quantity"]').innerText()
        const secondCartItemTotal = await page.locator('.cart_total_price').innerText()

        expect(cartItemQuantity).toEqual("1")
        expect(secondCartItemQuantity).toEqual("2")
        expect(Number(secondCartItemTotal.replace(/^Rs\.?\s*/, ''))).toEqual(Number(cartItemTotal.replace(/^Rs\.?\s*/, '')) * 2)
        
    })

    test("PUR-07 Sucessfully removes a product from the cart", async ({page}) => {
        const featuredItems = await page.locator('//div[@class="features_items"]//div[@class="product-image-wrapper"]').all()
        const rngItem = Math.floor(Math.random() * featuredItems.length)

        await featuredItems[rngItem].locator('.choose').click()
        await page.locator("#quantity").clear()
        await page.locator("#quantity").fill("3")
        await page.locator(".btn.btn-default.cart").click()
        await page.locator('//div[@class="modal-body"]/p/a').click()

        
        await page.locator(".cart_quantity_delete").click()
        await page.locator('//ul[@class="nav navbar-nav"]/li[3]').click()

        const cartContents = await page.locator('//tbody/tr').all()

        expect(cartContents.length).toEqual(0)
    })
})