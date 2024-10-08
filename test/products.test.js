
import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test of Product Endpoints", () => { // La función ejecuta todos los test de los endpoints de productos
    let cookieAdmin;
    let cookiePremium;
    before(async () => {
        //Login de administrador
        const loginAdmin = {
            email: "usuario1@test.com",
            password: "12345",
        };

        const { headers } = await requester.post("/api/sessions/login").send(loginAdmin);
        const cookieResult = headers["set-cookie"][0];
        cookieAdmin = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        };

        //Login de usuario premium
        const loginPremium = {
            email: "usuario3@test.com",
            password: "12345",
        };

        const { headers: headersPremium } = await requester.post("/api/sessions/login").send(loginPremium);
        const cookieResultPremium = headersPremium["set-cookie"][0];
        cookiePremium = {
            name: cookieResultPremium.split("=")[0],
            value: cookieResultPremium.split("=")[1],
        };
        
    });

    let productIdAdmin;
    let productIdPremium;

    it("[POST] /api/products - This endpoint should create a product", async () => {
        const newProduct = {
            title: "Product test",
            description: "This is a test product",
            price: 100,
            thumbnail: ["http://www.google.com/img"],
            code: "testCode1",
            stock: 10,
            category: "test",
        };
        
        //Producto creado por administrador
        const { status, _body, ok } = await requester.post("/api/products").send(newProduct).set("Cookie", [`${cookieAdmin.name}=${cookieAdmin.value}`]);

        productIdAdmin = _body.response._id;
        
        expect(status).to.be.equal(201); 
        expect(ok).to.be.equal(true);
        expect(_body.response.title).to.be.equal("Product test");
        expect(_body.response.description).to.be.equal("This is a test product");
        expect(_body.response.price).to.be.equal(100);
        expect(_body.response.price).to.be.an("number");
        expect(_body.response.thumbnail).to.be.an("array");
        expect(_body.response.code).to.be.equal("testCode1");
        expect(_body.response.stock).to.be.equal(10);
        expect(_body.response.stock).to.be.an("number");
        expect(_body.response.category).to.be.equal("test");

        //Producto creado por usuario premium
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.post("/api/products").send(newProduct).set("Cookie", [`${cookiePremium.name}=${cookiePremium.value}`]);

        productIdPremium = _bodyPremium.response._id;

        expect(statusPremium).to.be.equal(201);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.response.title).to.be.equal("Product test");
        expect(_bodyPremium.response.description).to.be.equal("This is a test product");
    });

    it("[GET] /api/products/:pid - This endpoint should return a product", async () => {
        const { status, _body, ok } = await requester.get(`/api/products/${productIdAdmin}`);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.response.title).to.be.equal("Product test");
        
    });

    it("[GET] /api/products - This endpoint should return all products", async () => {
        const { status, _body, ok } = await requester.get("/api/products");
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.products.docs).to.be.an("array");
    });

    it("[PUT] /api/products/:pid - This endpoint should update a product", async () => {
        const updatedProduct = {
            title: "Product test updated",
            description: "This is a test product updated",
        };

        //Producto actualizado por administrador
        const { status, _body, ok } = await requester.put(`/api/products/${productIdAdmin}`).send(updatedProduct).set("Cookie", [`${cookieAdmin.name}=${cookieAdmin.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.response.title).to.be.equal("Product test updated");
        expect(_body.response.description).to.be.equal("This is a test product updated");

        //Producto actualizado por usuario premium
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.put(`/api/products/${productIdPremium}`).send(updatedProduct).set("Cookie", [`${cookiePremium.name}=${cookiePremium.value}`]);

        expect(statusPremium).to.be.equal(200);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.response.title).to.be.equal("Product test updated");
        expect(_bodyPremium.response.description).to.be.equal("This is a test product updated");
    });

    it("[DELETE] /api/products/:pid - This endpoint should delete a product", async () => {
        //Eliminación de producto creado por administrador
        const { status, _body, ok } = await requester.delete(`/api/products/${productIdAdmin}`).set("Cookie", [`${cookieAdmin.name}=${cookieAdmin.value}`]);
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);

        //Eliminación de producto creado por usuario premium
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.delete(`/api/products/${productIdPremium}`).set("Cookie", [`${cookiePremium.name}=${cookiePremium.value}`]);

        expect(statusPremium).to.be.equal(200);
        expect(okPremium).to.be.equal(true);
    });
});




