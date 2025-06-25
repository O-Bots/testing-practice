import { test, expect } from "@playwright/test";
import { Person } from "../../test-data/userInfoHelper"
import account from '../../test-data/ow_accountdetails.json';
import { CartChecker } from '../../test-data/cartHelper'

const loggedInUser = new Person
let context_filledCart: any;

test("checking cart checker", async () => {
    const cart = new CartChecker(3);
    const {context: context_filledCart, itemInfo: items} = await cart.cartSaveStorageState();
    const page = await context_filledCart.newPage();

    await page.goto('https://www.automationexercise.com')
    await page.pause()
})