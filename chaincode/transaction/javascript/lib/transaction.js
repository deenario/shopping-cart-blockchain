/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict';

const {Contract} = require('fabric-contract-api');

class Transaction extends Contract {

    async initLedger(ctx) {
        const tribeAssets = [
            {
                sid: 'S01',
                name: 'Management',
                loc : 'UK'
            }, {
                sid: 'S02',
                name: 'Development',
                loc : 'UK'
            }
        ];

        for (let i = 0; i < tribeAssets.length; i++) {
            await ctx.stub.putState('Assets' + i, Buffer.from(JSON.stringify(tribeAssets[i])));
            console.info('Added <--> ', tribeAssets[i]);
        }
    }

// Create Products...

    async createProducts(ctx, title, imageLink, upc, sku, price, qtyInStock, timestamp) {
        const products = {
            title ,
            docType: 'Products',
            imageLink,
            upc,
            sku,
            price :parseInt(price),
            qtyInStock,
            timestamp
    
        };
        await ctx.stub.putState(title, Buffer.from(JSON.stringify(products)));
     
    }

// Create User Info....

    async transaction (ctx, productID, emailAddr, phoneNum, compnayName, shippingAddr, city, postalCode, timestamp) {
        const userInfo= {
            productID,
            emailAddr,
            docType : 'UserInfo',
            phoneNum,
            compnayName,
            shippingAddr,
            city,
            postalCode,
            timestamp
        }

        await ctx.stub.putState(productID, Buffer.from(JSON.stringify(userInfo)));

    }

//Query Products with Query Selector...

    async queryProducts(ctx ,title){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'Products';
        queryString.selector.title = title;
        return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
    }
    async getQueryResultForQueryString(stub, queryString){
        let resultsIterator = await stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return  JSON.stringify(results);

    }

    async getAllResults(iterator , isHistory) {
        let allResults = [];
        while(true) {
            let res = await iterator.next();
            if(res.value && res.value.value.toString()){
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                  if (isHistory && isHistory=== true) {
                    jsonRes.Pid   = res.value.pid;
                    jsonRes.Title   = res.value.title;
                    jsonRes.ImageLink   = res.value.imageLink;
                    jsonRes.Upc   = res.value.upc;
                    jsonRes.Sku  = res.value.sku;
                    jsonRes.Price   = res.value.price;
                    jsonRes.QtyInStock  = res.value.qtyInStock;
                    jsonRes.Timestamp = res.value.timestamp;
                  
                    try {
                        jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err){
                        console.log(err);
                        jsonRes.value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.key = res.value.key;
                    try{
                        jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err) {
                        console.log(err);
                        jsonRes.record = res.value.value.toString('utf8')
                    }
                }

                allResults.push(jsonRes);
            } 

            if (res.done){
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;

            }
        }
    } 

      
//Query Transaction with Query Selector

    async queryTransaction(ctx, productID){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'UserInfo';
        queryString.selector.productID= productID;
        return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
    }
    async getQueryResultForQueryString(stub, queryString){
        let resultsIterator = await stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return  JSON.stringify(results);

    }
    async getAllResults(iterator , isHistory) {
        let allResults = [];
        while(true) {
            let res = await iterator.next();
            if(res.value && res.value.value.toString()){
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory=== true) {
                    jsonRes.ProductID = res.value.productID;
                    jsonRes.EmailAddr = res.value.emailAddr;
                    jsonRes.PhoneNum =  res.value.phoneNum;
                    jsonRes.CompnayName = res.value.compnayName;
                    jsonRes.ShippingAddr = res.value.shippingAddr;
                    jsonRes.City = res.value.city;
                    jsonRes.PostalCode = res.value.postalCode;
                    jsonRes.Timestamp = res.value.timestamp;
                
                    try {
                        jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err){
                        console.log(err);
                        jsonRes.value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.key = res.value.key;
                    try{
                        jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err) {
                        console.log(err);
                        jsonRes.record = res.value.value.toString('utf8')
                    }
                }

                allResults.push(jsonRes);
            } 

            if (res.done){
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;

            }
        }
    } 
        
    //Query All Products with Query Selector

    async queryAllProducts(ctx){
         let queryString = {};
         queryString.selector = {};
         queryString.selector.docType = 'Products';
        return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
        }
        async getQueryResultForQueryString(stub, queryString){
            let resultsIterator = await stub.getQueryResult(queryString);
            let results = await this.getAllResults(resultsIterator, false);
            return  JSON.stringify(results);

        }
        async getAllResults(iterator , isHistory) {
            let allResults = [];
            while(true) {
                let res = await iterator.next();
                if(res.value && res.value.value.toString()){
                    let jsonRes = {};
                    console.log(res.value.value.toString('utf8'));
                    if (isHistory && isHistory=== true) {
                        jsonRes.Pid   = res.value.pid;
                        jsonRes.Title   = res.value.title;
                        jsonRes.ImageLink   = res.value.imageLink;
                        jsonRes.Upc   = res.value.upc;
                        jsonRes.Sku  = res.value.sku;
                        jsonRes.Price   = res.value.price;
                        jsonRes.QtyInStock  = res.value.qtyInStock;
                        jsonRes.Timestamp = res.value.timestamp;
                    
                        try {
                            jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                        }
                        catch(err){
                            console.log(err);
                            jsonRes.value = res.value.value.toString('utf8');
                        }
                    } else {
                        jsonRes.key = res.value.key;
                        try{
                            jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                        }
                        catch(err) {
                            console.log(err);
                            jsonRes.record = res.value.value.toString('utf8')
                        }
                    }

                    allResults.push(jsonRes);
                } 

                if (res.done){
                    console.log('end of data');
                    await iterator.close();
                    console.info(allResults);
                    return allResults;

                }
            }
        } 

    // Query Assets....

    async queryAssets(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await(const {key, value}
        of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({Key: key, Record: record});
        }

        console.info(allResults);
        return JSON.stringify(allResults);

    }
        
}

module.exports = Transaction;

