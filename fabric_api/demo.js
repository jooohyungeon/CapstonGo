/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
var Date = require('date-utils');
const bodyparser = require('body-parser');
var moment = require('moment'); 
require('moment-timezone'); 
moment.tz.setDefault("Asia/Seoul");

var express = require('express');
var app = express();

var port = 5050;

var trx_list = [];

global.get_result;

var key_num = 1;

app.use(bodyparser.json());

app.get('/get_ledger', function(req, res) {
    async function query() {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                console.log('An identity for the user "appUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('fabcar');
    
            // Evaluate the specified transaction.
            // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
            // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
            const result = await contract.evaluateTransaction('queryAllCars');
            console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

            res.send(result.toString());
    
        } catch (error) {
            console.error(`Failed to evaluate transaction: ${error}`);
            process.exit(1);
        }
    }

    query();
});

app.post('/push_ledger', function(req, res) {
    var device_id = req.body.device_id;
    var user_id = req.body.user_id;
    var verifier_id = req.body.verifier_id;
    var dates = req.body.date;
    var result = req.body.result;

    var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    var key = "KEY" + key_num;

    key_num = key_num + 1;

    async function invoke(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            // console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                // console.log('An identity for the user "appUser" does not exist in the wallet');
                // console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('fabcar');
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction('createCar', arg0, arg1, arg2, arg3, arg4, arg5, arg6);
            // console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();

            console.log(arg0);

            res.send(200);
    
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
            res.send(400);
        }
    }

    invoke(key, device_id, user_id, verifier_id, result, dates, timestamp);
});

app.post('/update_ledger', function(req, res) {
    // console.log(req.body);
    var key = req.body.key;
    var result = req.body.result;

    var timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    // trx_list.push(key);
    // trx_list.push(result);


    async function update(arg0, arg1, arg2) {
        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'wallet');
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            // console.log(`Wallet path: ${walletPath}`);

            console.log("11");
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get('appUser');
            if (!identity) {
                // console.log('An identity for the user "appUser" does not exist in the wallet');
                // console.log('Run the registerUser.js application before retrying');
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

            console.log("11");
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork('mychannel');
    
            // Get the contract from the network.
            const contract = network.getContract('fabcar');

            console.log("11");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction('changeCarOwner', arg0, arg1, arg2);
            // console.log('Transaction has been submitted');
    
            // Disconnect from the gateway.
            await gateway.disconnect();

            res.send(200);
    
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            res.send(error);
            process.exit(1);
        }
    }

    update(key, result, timestamp);
});

app.listen(port, function() {
    console.log(`Server is running on ${port}port`);
});