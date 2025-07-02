import { faker } from "@faker-js/faker"

export class Person {
    // title = faker.person.prefix(); //Commenting out due to limited prefixes available on the app being tested
    title = "Mr";
    first_name = faker.person.firstName();
    last_name = faker.person.lastName();
    dob: {
        day:number;
        month: number;
        year: number
    };
    account_name = faker.internet.username();
    email = faker.internet.email();
    password = faker.internet.password();
    company = faker.company.name();
    address: { 
        address1: any;
        address2: string ;
        country: string ;
        state: string ;
        city: string ;
        zipcode: any;
    };
    mobile_number = faker.phone.number();
    payment_details: {
        card_number: number;
        card_cvc: number;
        card_expiry_month: number;
        card_expiry_year: number
    };

    constructor() {
        // Generate a random birthdate
        const birthDate: Date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
        const creditCardExpiryDate: Date = faker.date.future({years: 10})
        this.dob = {
            day: birthDate.getDate(),
            month: birthDate.getMonth() + 1,
            year: birthDate.getFullYear(),
        }
        this.address = {
            address1: faker.location.streetAddress(),
            address2: faker.location.street(),
            // country: faker.location.country(), //Commenting out due to limited countries available on the app being tested
            country: "Canada",
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.location.zipCode(),
        }
        this.payment_details = {
            card_number: Number(faker.finance.creditCardNumber()),
            card_cvc: Number(faker.finance.creditCardCVV()),
            card_expiry_month: creditCardExpiryDate.getMonth(),
            card_expiry_year: creditCardExpiryDate.getFullYear(),
        }
    }
}