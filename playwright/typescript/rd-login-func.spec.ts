import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const rd_email: any = process.env.rd_email_address ?? "";
const rd_password: any = process.env.rd_password ?? "";

let rd_loginToken;

test("Verify existing user login (using API)", async ({ page }) => {
  //Create new API context to switch to API mode:
  const APIContext = await request.newContext();

  //Define the loginPayload, in URL-encoded data format.
  //This will produce something like: "email=youremail%40example.com&password=yourpassword".
  const loginPayload = new URLSearchParams();
  loginPayload.append("email", rd_email);
  loginPayload.append("password", rd_password);

  //Send POST request to the "verifyLogin" endpoint, with the loginPayload.
  //Sending it in the URL-encoded data format:
  const loginResponse = await APIContext.post("https://automationexercise.com/api/verifyLogin", {
    data: loginPayload.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  expect(loginResponse.ok()).toBeTruthy();
  console.log(`Login Response Status: ${loginResponse.status()}`);

  //Convert response to JSON format:
  const loginResponse_JSON = await loginResponse.json();
  console.log(loginResponse_JSON);

  //Assert that the user exists:
  expect(loginResponse_JSON.message).toBe("User exists!");
});
