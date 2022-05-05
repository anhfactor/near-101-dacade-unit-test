// @ts-nocheck
import { buyProduct, setProduct, getProduct, getProducts } from '../index';
import { productsStorage } from '../model';
import { u128, VMContext } from 'near-sdk-as';

describe("Test manipulate product data", () =>{
    beforeEach(() => {
        VMContext.setCurrent_account_id('alice.near');
        VMContext.setSigner_account_id('alice.near');
        VMContext.setAttached_deposit(u128.from("10000000000000000000000"));

        setProduct({"id": "100", "name" : "BBQ", "description": "Its BBQ", 
                    "image": "https://i.imgur.com/yPreV19.png", "location": "Mexico",
                    "price": u128.from('10000000000000000000000'), "owner": "dacade.testnet", "sold": 0});
    });
    it("should add product", () => {
        log("Set product BBQ")
        expect(productsStorage.length).toBe(
            1,
            "should only contain one listed product"
        );
    });

    it("should get product", () => {
        const listProduct = getProducts();

        log("Get all product")
        expect(listProduct[0].name).toBe(
            "BBQ",
            "name should BBQ"
        );

        log("Get product id: 100")
        expect(() => {
            getProduct("100");
          }).not.toThrow();

    })
    it("should buy product", () => {
        log("Buy product BBQ")

        expect(() => {
            buyProduct("100")
        }).not.toThrow();
        const listProduct = getProducts();

        log("Product BBQ should increase sold to 1")

        expect(listProduct[0].sold).toBe(
            1,
            "sold should increase to 1"
        );
    });
});