import { zeroAddress, type Abi } from "viem";
import { walletClient, owner, publicClient } from "./config";
import fs from "fs";
import { stringifyBigInt } from "./utils";
import { nexusAccountAbi } from "./abis";
import { createInitData } from "./generateInitData";

export const getContractDetails = () => {
  try {
    const contractData = JSON.parse(
      fs.readFileSync("./src/contract.json", "utf8")
    );
    return {
      address: contractData.address,
      abi: contractData.abi,
    };
  } catch (error) {
    console.error("Error reading contract details:", error);
    throw error;
  }
};

export async function initializeAccount() {
  const initData = createInitData();

  console.log("Signing authorization for account initialization");
  const authorization = await walletClient.signAuthorization({
    account: owner,
    contractAddress: owner.address,
    executor: "self",
  });

  console.log("Authorization signed successfully");

  const hash = await walletClient.writeContract({
    authorizationList: [authorization],
    address: owner.address,
    functionName: "initializeAccount",
    args: [initData],
    abi: nexusAccountAbi as Abi,
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

export async function readaVars() {
  // read
  console.log("\nRead accountId");
  const accountId = await publicClient.readContract({
    address: owner.address,
    functionName: "accountId",
    abi: nexusAccountAbi as Abi,
  });
  console.log(`Account ID: ${accountId}`);

  console.log("\nRead isInitialized");
  const isInitialized = await publicClient.readContract({
    address: owner.address,
    functionName: "isInitialized",
    abi: nexusAccountAbi as Abi,
  });
  console.log(`Is initialized: ${isInitialized}`);
}

export async function executeOnEoaTest() {}

export async function setContractCode(contractAddress: `0x${string}`) {
  console.log("Sign authorization to set contract address");
  const authorization = await walletClient.signAuthorization({
    account: owner,
    contractAddress,
    executor: "self",
  });

  console.log("Authorization signed:");
  console.log(JSON.stringify(authorization, stringifyBigInt));

  console.log("\nSend EIP-7702 transaction to set contract code");

  const initData = createInitData();

  const hash = await walletClient.writeContract({
    authorizationList: [authorization],
    address: owner.address,
    functionName: "initializeAccount",
    args: [initData],
    abi: nexusAccountAbi as Abi,
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

export async function setContractCodeNoInit(contractAddress: `0x${string}`) {
  console.log("Sign authorization to set contract address");
  const authorization = await walletClient.signAuthorization({
    account: owner,
    contractAddress,
    executor: "self",
  });

  console.log("Authorization signed:");
  console.log(JSON.stringify(authorization, stringifyBigInt));

  console.log("\nSend EIP-7702 transaction to set contract code");

  const hash = await walletClient.sendTransaction({
    authorizationList: [authorization],
    to: owner.address,
    account: owner,
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

export async function resetCode() {
  console.log("Resetting the code of the eoa");
  const authorization = await walletClient.signAuthorization({
    account: owner,
    contractAddress: zeroAddress,
    executor: "self",
  });
  const hash = await walletClient.sendTransaction({
    authorizationList: [authorization],
    to: owner.address,
    account: owner,
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}
