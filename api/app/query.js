const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('tribe-network');
const util = require('util')


const auth = require('./auth')
const query = async (channelName, chaincodeName, fcn, args, username, org_name) => {

    try {

        const ccp = await auth.getCCP(org_name)

        // Create a new file system based wallet for managing identities.
        const walletPath = await auth.getWalletPath(org_name)
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await auth.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;
        // put here function name and respective args
        if (fcn == "queryProducts") {
            // args = parseInt(args)
            result = await contract.evaluateTransaction(fcn , args);
        }
        if (fcn == "queryTransaction") {
            // args = parseInt(args)
            result = await contract.evaluateTransaction(fcn , args);
        }

        console.log(result)
        console.log(`Transaction has been evaluated Successfully : ${result.toString()}`);
        result = JSON.parse(result.toString());
        return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}

exports.query = query;