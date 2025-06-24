import {test, expect} from "@playwright/test";
import {LoginHelper} from  "./LoginHelper";
import { Person } from "../../test-data/userInfoHelper"

let context_loggedIn: any;

test("test logincontext", async ({page}) => {
    const loggedInUser = new Person

    
})