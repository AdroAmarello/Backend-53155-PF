import { fakerES as faker } from "@faker-js/faker";
import { productsModel } from "../persistences/mongo/models/products.model.js";

export const generateProductsMock = (amount) =>{
    const products = [];
    
    for(let i = 0; i < amount; i++) {
        const product = {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            thumbnail: faker.internet.url(),
            code: faker.string.alphanumeric(6),
            stock: faker.number.int({min: 0, max: 100}),
            status: faker.datatype.boolean(),
            price: faker.commerce.price({min: 10, max: 100}),
            category: faker.commerce.productMaterial(),
        };

        products.push(product);
    };

    productsModel.insertMany(products);

    return products;
};