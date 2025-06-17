import { test, expect, request } from '@playwright/test';

import account from '../../test-data/ow_accountdetails.json';

test.describe('API tests', () => {
    test('Create user check', async () => {
        //Creates new API context
        const apiContext = await request.newContext();

        const accountCreationPayload = new URLSearchParams();
        accountCreationPayload.append("name", account.account_name);
        accountCreationPayload.append("email", account.email);
        accountCreationPayload.append("password", account.password);
        accountCreationPayload.append("title", account.title);
        accountCreationPayload.append("birth_date", account.dob.day);
        accountCreationPayload.append("birth_month", account.dob.month);
        accountCreationPayload.append("birth_year", account.dob.year);
        accountCreationPayload.append("firstname", account.first_name);
        accountCreationPayload.append("lastname", account.last_name);
        accountCreationPayload.append("company", account.company);
        accountCreationPayload.append("address1", account.living_address.address);
        accountCreationPayload.append("address2", account.living_address.address2);
        accountCreationPayload.append("country", account.living_address.country);
        accountCreationPayload.append("zipcode", account.living_address.zipcode);
        accountCreationPayload.append("state", account.living_address.state);
        accountCreationPayload.append("city", account.living_address.city);
        accountCreationPayload.append("mobile_number", account.mobile_number);

        const accountCreationResponse = await apiContext.post("https://automationexercise.com/api/createAccount", {
            data: accountCreationPayload.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })

        expect(accountCreationResponse.status()).toBeTruthy()

        const accountCreationResponse_JSON = await accountCreationResponse.json()

        expect(accountCreationResponse_JSON.message).toBe("User created!")
        
    })
    
    test('API confirmation that user exists', async () => {
        //Creates new API context
        const apiContext = await request.newContext();
    
        //Define the loginPayload, in URL-encoded data format.
        //This will produce something like: "email=youremail%40example.com&password=yourpassword".
        const loginPayload = new URLSearchParams();
        loginPayload.append("email", account.email);
        loginPayload.append("password", account.password);
    
    
        const loginResponse = await apiContext.post("https://automationexercise.com/api/verifyLogin", {
            data: loginPayload.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
    
        expect(loginResponse.status()).toBeTruthy()
        //Convert login response to JSON to confirm message response
        const loginResponse_JSON = await loginResponse.json()
    
        expect(loginResponse_JSON.message).toBe("User exists!")
    })

    test('API Delete user account', async () => {
        //Creates new API context
        const apiContext = await request.newContext();
    
        //Define the loginPayload, in URL-encoded data format.
        //This will produce something like: "email=youremail%40example.com&password=yourpassword".
        const deleteUserPayload = new URLSearchParams();
        deleteUserPayload.append("email", account.email);
        deleteUserPayload.append("password", account.password);
    
    
        const deleteUserResponse = await apiContext.delete("https://automationexercise.com/api/deleteAccount", {
            data: deleteUserPayload.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })
    
        expect(deleteUserResponse.status()).toBeTruthy()
        //Convert deleteUser response to JSON to confirm message response
        const deleteUserResponse_JSON = await deleteUserResponse.json()
    
        expect(deleteUserResponse_JSON.message).toBe("Account deleted!")
    })
} )