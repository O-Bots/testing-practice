import { test, expect, request } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const rd_email: any = process.env.rd_email_address ?? "";
const rd_password: any = process.env.rd_password ?? "";

let APIContext: any;

//Define the loginPayload, in URL-encoded data format.
//This will produce something like: "email=youremail%40example.com&password=yourpassword".
const loginPayload = new URLSearchParams();
loginPayload.append("email", rd_email);
loginPayload.append("password", rd_password);

test.beforeAll(async () => {
  //Create new API context to switch to API mode:
  APIContext = await request.newContext();
});

test.describe("API Practice: api/productsList", () => {
  test("Verify products list is returned when using GET api/productsList", async ({ page }) => {
    //API URL: https://automationexercise.com/api/productsList
    //Using GET should work with this API, and return a list of products and their details.

    const productsListResponse = await APIContext.get("https://automationexercise.com/api/productsList");
    console.log(`GET productsList Response Status: ${productsListResponse.status()}`);
    expect(productsListResponse.ok()).toBeTruthy();
    const productsListResponse_JSON = await productsListResponse.json();
    expect(productsListResponse_JSON.responseCode).toBe(200);
    console.log(`productsListResponse_JSON code: ${productsListResponse_JSON.responseCode}`);
  });

  test("Verify error message is returned when using POST with api/productsList", async ({ page }) => {
    //API URL: https://automationexercise.com/api/productsList
    //Using POST should NOT work with this API, and return an error message.

    const productsListResponse = await APIContext.post("https://automationexercise.com/api/productsList");
    console.log(`POST productsList Response Status: ${productsListResponse.status()}`);
    expect(productsListResponse.ok()).toBeTruthy();
    const productsListResponse_JSON = await productsListResponse.json();

    //Assert the responseCode & message is correct:
    expect(productsListResponse_JSON.responseCode).toBe(405);
    expect(productsListResponse_JSON.message).toBe("This request method is not supported.");
    console.log(`productsListResponse_JSON code: ${productsListResponse_JSON.responseCode}`);
  });
});

test.describe("API Practice: api/brandsList", () => {
  test("Verify brands list is returned when using GET api/brandsList", async ({ page }) => {
    //API URL: https://automationexercise.com/api/brandsList
    //Using GET should work with this API, and return the brands list.

    const brandsListResponse = await APIContext.get("https://automationexercise.com/api/brandsList");
    console.log(`GET brandsListResponse Response Status: ${brandsListResponse.status()}`);
    expect(brandsListResponse.ok()).toBeTruthy();
    const brandsListResponse_JSON = await brandsListResponse.json();
    expect(brandsListResponse_JSON.responseCode).toBe(200);
    console.log(`brandsListResponse_JSON code: ${brandsListResponse_JSON.responseCode}`);
  });

  test("Verify error message is returned when using PUT api/brandsList", async ({ page }) => {
    //API URL: https://automationexercise.com/api/brandsList
    //Using PUT should NOT work with this API, and return an error message.

    const brandsListResponse = await APIContext.put("https://automationexercise.com/api/brandsList");
    console.log(`PUT brandsListResponse Response Status: ${brandsListResponse.status()}`);
    expect(brandsListResponse.ok()).toBeTruthy();
    const brandsListResponse_JSON = await brandsListResponse.json();
    expect(brandsListResponse_JSON.responseCode).toBe(405);
    console.log(`brandsListResponse_JSON code: ${brandsListResponse_JSON.responseCode}`);
  });
});

test.describe("API Practice: api/verifyLogin", () => {
  test("Verify existing user login (using API)", async ({ page }) => {
    //Send POST request to the "verifyLogin" endpoint, with the loginPayload.
    const verifyLoginResponse = await APIContext.post("https://automationexercise.com/api/verifyLogin", {
      data: loginPayload.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", //Sending it in the URL-encoded data format
      },
    });

    //Assert the loginResponse to be ok:
    console.log(`POST verifyLogin Response Status: ${verifyLoginResponse.status()}`);
    expect(verifyLoginResponse.ok()).toBeTruthy();

    //Convert response to JSON format:
    const verifyLoginResponse_JSON = await verifyLoginResponse.json();

    //Assert that the user exists:
    expect(verifyLoginResponse_JSON.responseCode).toBe(200);
    expect(verifyLoginResponse_JSON.message).toBe("User exists!");
    console.log(`verifyLoginResponse_JSON code: ${verifyLoginResponse_JSON.responseCode}`);
  });
});
