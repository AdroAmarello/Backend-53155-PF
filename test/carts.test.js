
import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test of Carts Endpoints", () => { // La función ejecuta todos los test de los endpoints de carritos
    let cookieUser;
    let cookiePremium;
    let cartIdUser;
    let cartIdPremium;
    let productIdUser
    before(async () => {
        //Login de usuario
        const loginUser = {
            email: "usuario2@test.com",
            password: "12345",
        };
        
        const { _body, headers } = await requester.post("/api/sessions/login").send(loginUser);
        cartIdUser = _body.payload.cart;

        const cookieResult = headers["set-cookie"][0];
        cookieUser = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        };
        //Login de usuario premium
        const loginPremium = {
            email: "usuario3@test.com",
            password: "12345",
        };

        const { _body: _bodyPremium, headers: headersPremium } = await requester.post("/api/sessions/login").send(loginPremium);
        cartIdPremium = _bodyPremium.payload.cart;

        const cookieResultPremium = headersPremium["set-cookie"][0];
        cookiePremium = {
            name: cookieResultPremium.split("=")[0],
            value: cookieResultPremium.split("=")[1],
        };

        //Producto a agregar al carrito
        const { _body: _bodyProduct } = await requester.get(`/api/products/`)
        productIdUser = _bodyProduct.products.docs[0]._id;
        console.log(productIdUser);
    
    })
    
    
    it("[GET] /api/carts/:cid - This endpoint should return a cart", async () => {
        //Carrito de usuario
        const { status, _body, ok } = await requester.get(`/api/carts/${cartIdUser}`).set("Cookie", [`${cookieUser.name}=${cookieUser.value}`]);
        
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
        expect(_body.payload._id).to.be.equal(cartIdUser);
        expect(_body.payload.products).to.be.an("array");
        
        //Carrito de usuario premium
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.get(`/api/carts/${cartIdPremium}`).set("Cookie", [`${cookiePremium.name}=${cookiePremium.value}`]);

        expect(statusPremium).to.be.equal(200);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.status).to.be.equal("success");
        expect(_bodyPremium.payload._id).to.be.equal(cartIdPremium);
        expect(_bodyPremium.payload.products).to.be.an("array");
    });

    it("[POST] /api/carts/:cid/product/:pid - This endpoint should add a product to a cart", async () => {
        //Agregado de un producto al carrito de usuario
        const { status, _body, ok } = await requester.post(`/api/carts/${cartIdUser}/product/${productIdUser}`).set("Cookie", [`${cookieUser.name}=${cookieUser.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
        expect(_body.response.products).to.be.an("array");

        //Agregado de un producto al carrito de usuario premium
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.post(`/api/carts/${cartIdPremium}/product/${productIdUser}`).set("Cookie", [`${cookiePremium.name}=${cookiePremium.value}`]);

        expect(statusPremium).to.be.equal(200);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.status).to.be.equal("success");
        expect(_bodyPremium.response.products).to.be.an("array");
        
        //Verificación de que el producto agregado al carrito de usuario es el mismo que el agregado al carrito de usuario premium

        expect(_body.response.products.product).to.be.equal(_bodyPremium.response.products.product);

    });

    it("[PUT] /api/carts/:cid/product/:pid - This endpoint should update the quantity of a product in a cart", async () => {
        //Actualización de la cantidad de un producto del carrito de usuario
        const newQuantity = {
            quantity: 10
        };

        const { status, _body, ok } = await requester.put(`/api/carts/${cartIdUser}/product/${productIdUser}`).set("Cookie", [`${cookieUser.name}=${cookieUser.value}`]).send(newQuantity);
        
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
        expect(_body.response.products).to.be.an("array");
        expect(_body.response.products[0].quantity).to.be.equal(newQuantity.quantity);
    });

    it("[DELETE] /api/carts/:cid/product/:pid - This endpoint should delete a product from a cart", async () => {
        //Eliminación de un producto del carrito de usuario
        const { status, _body, ok } = await requester.delete(`/api/carts/${cartIdUser}/product/${productIdUser}`).set("Cookie", [`${cookieUser.name}=${cookieUser.value}`]);
        
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
        expect(_body.response.products).to.be.an("array");
        expect(_body.response.products[0].product).to.be.equal(productIdUser);

        //Eliminación de un producto del carrito de usuario premium
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.delete(`/api/carts/${cartIdPremium}/product/${productIdUser}`).set("Cookie", [`${cookiePremium.name}=${cookiePremium.value}`]);

        expect(statusPremium).to.be.equal(200);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.status).to.be.equal("success");
        expect(_bodyPremium.response.products).to.be.an("array");
        expect(_bodyPremium.response.products[0].product).to.be.equal(productIdUser);
    });
});
