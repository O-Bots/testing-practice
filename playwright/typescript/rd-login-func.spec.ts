import { test, expect } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const rd_loginEmail = process.env.rd_email_address;
const rd_password = process.env.rd_password;

test.only("Test 1", async ({ page }) => {
  console.log(rd_loginEmail);
});
