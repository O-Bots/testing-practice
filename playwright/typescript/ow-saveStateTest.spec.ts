import { test, expect, request } from "@playwright/test";
import account from '../../test-data/ow_accountdetails.json';
import { CartChecker } from '../helperScripts/cartHelper'
import { LoginHelper } from './LoginHelper'
import { createUser } from '../helperScripts/funcExports'
import fs from "fs";

let context_loggedIn: any
let context_filledCart: any;

const loginStoragePrefix: string ="login"
const cartStoragePrefix: string = "shoppingCart"
const totalCartItems: number = 3
const loginStorageStatePath = `${loginStoragePrefix}_${account.email}.json`;
const cartStorageStatePath = `${cartStoragePrefix}_${totalCartItems}.json`;
const cartItemPath = `${cartStoragePrefix}_items.json`;

test.beforeAll("Prep login save data and cart save data", async ({page}) => {
    await page.goto('https://www.automationexercise.com/')
    await page.getByRole('button', { name: 'Consent' }).click()

    await createUser(page)
    await page.close()
    
    const loginHelper = new LoginHelper(account.email, account.password, loginStoragePrefix)
    context_loggedIn =  await loginHelper.loginSaveStorageState()
    await page.close()
})

test.afterAll("Cleanup user data", async ({}) => {
    const apiContext = await request.newContext();
    const deleteUserPayload = new URLSearchParams();
    deleteUserPayload.append("email", account.email);
    deleteUserPayload.append("password", account.password);

    const deleteUserResponse = await apiContext.delete("https://automationexercise.com/api/deleteAccount", {
        data: deleteUserPayload.toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })

    const deleteUserResponse_JSON = await deleteUserResponse.json();

    expect(deleteUserResponse_JSON.message).toBe("Account deleted!");

    //Deletes the json cookies and info
    [loginStorageStatePath, cartStorageStatePath, cartItemPath].forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
})

test("checking cart checker", async () => {
    const cart = new CartChecker(totalCartItems, cartStoragePrefix);
    const {context: context_filledCart, itemInfo: items} = await cart.cartSaveStorageState();
    // Read and parse the storage state JSON file
    const loginStorageState = JSON.parse(fs.readFileSync(loginStorageStatePath, "utf-8"));
    const cartStorageState = JSON.parse(fs.readFileSync(cartStorageStatePath, "utf-8"));
    const allCookies = [...loginStorageState.cookies, ...cartStorageState.cookies]
    const uniqueCookies = Array.from(
        new Map(
            allCookies.map(cookie => [`${cookie.name}|${cookie.domain}|${cookie.path}`, cookie])
        ).values()
    );
    await context_filledCart.addCookies(uniqueCookies)
    const page = await context_filledCart.newPage();

    await page.goto('https://www.automationexercise.com')
    await page.pause()
})