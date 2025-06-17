import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";
import { LoginHelper } from "./LoginHelper";

dotenv.config({ path: ".env" });

const rd_email: any = process.env.rd_email_address ?? "";
const rd_password: any = process.env.rd_password ?? "";

let context_loggedIn: any;

test.beforeAll("Skip Login using storageState", async () => {
  const loginHelper = new LoginHelper(rd_email, rd_password);
  context_loggedIn = await loginHelper.loginSaveStorageState();
});

test("Skip login", async () => {
  const page = await context_loggedIn.newPage();
  await page.goto("https://www.automationexercise.com/login");
  await page.pause();
});
