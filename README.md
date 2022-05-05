<h1 align="center">NEAR 101 Dacade unit test contract</h1>

## Table of Contents

- [Introduction](#introduction)
- [Project setup](#project-setup)
- [Write a couple of tests for the contract](#write-a-couple-of-tests-for-the-contract)

### Introduction
After finish course [101 NEAR from dacade](https://dacade.org/communities/near/courses/near-101/). I realized that the course has not yet implemented unit testing for smart contracts. In blockchain, writing unit tests is very important to increase security before publishing the contract on the mainnet. 

The course using assembly script for smart contract, i plan to implement unit test by using [as-pect](https://github.com/jtenner/as-pect) and the syntax resembles RSpec. The library is well [documented](https://tenner-joshua.gitbook.io/as-pect/) but sometimes the [tests for the testing library](https://github.com/jtenner/as-pect/tree/master/packages/assembly/assembly/__tests__) might be the best source of examples to help you learn quickly.

### Project setup
First copy the contract in folder smartcontract from [101 Near] https://github.com/dacadeorg/near-marketplace-dapp/tree/master/smartcontract and run ```yarn``` to install

Create the file as-pect.config.js to export module as-pec and add the following code:
```
module.exports = require('near-sdk-as/imports')
```

Inside folder assembly create a folder __tests__. Go to __tests__ create 2 file
- as-pect.d.ts: This file is used to define types that used in as-pect and add the following code
```
/// <reference types="@as-pect/assembly/types/as-pect" />
```
- marketplace.spec.ts: This file create an entry for unit test

The project structure should look like this:
```
├── asconfig.json
├── assembly
|   |──__tests__
│   |           ├── as-pect.d.ts
│   |           ├── marketplace.spec.ts
│   ├── as_types.d.ts
│   ├── index.ts
│   └── tsconfig.json
├── package.json
└── as-pect-config.js
```

### Write a couple of tests for the contract
Navigate to file marketplace.spec.ts ```assembly/__tests__/marketplace.spec.ts```
1. Import all function & model
```
import { buyProduct, setProduct, getProduct, getProducts } from '../index';
import { productsStorage } from '../model';
```

2. Import u128 (to parse price amount) & VMContext (VMContext will help us in mock context when testing, such as attaching a deposit to a message.)
```
import { u128, VMContext } from 'near-sdk-as';
```

3. Then copy these code:
```
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
        log("setProduct")
        expect(productsStorage.length).toBe(
            1,
            "should only contain one listed product"
        );
    });

    it("should get product", () => {
        const listProduct = getProducts();

        log("getProducts")
        expect(listProduct[0].name).toBe(
            "BBQ",
            "name should BBQ"
        );

        log("getProduct")
        expect(() => {
            getProduct("100");
          }).not.toThrow();

    })
    it("should buy product", () => {
        log("buyProduct")

        expect(() => {
            buyProduct("100")
        }).not.toThrow();
        const listProduct = getProducts();

        expect(listProduct[0].sold).toBe(
            1,
            "sold should increase to 1"
        );
    });
});
```

Let check what we got here: ```describe``` invoke the test , and check our test case with the correct order or not. We use ```beforeEach``` to fund near to account test ```alice.near``` and ```setProduct``` BBQ in each successive test.
Now to run test open your terminal and type
```
yarn asp
```
After the test is finished, you will see that the results of the passing tests will look like this:
<img width="607" alt="Screen Shot 2022-05-05 at 15 44 55" src="https://user-images.githubusercontent.com/13186215/166892352-fdd0edc6-1a23-4c8d-9963-8fc14c8b59bf.png">

You can refer [my previous project unit test](https://github.com/anhfactor/danger-is-near/tree/master/assembly/__tests__), i've applied in this course.
