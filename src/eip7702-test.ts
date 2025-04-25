import { type Abi } from "viem";
import { walletClient, eoa, publicClient } from "./config";
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

  const hash = await walletClient.writeContract({
    address: eoa.address,
    functionName: "initializeAccount",
    args: [initData],
    abi: nexusAccountAbi as Abi,
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

export async function testEIP7702() {
  console.log("Starting EIP-7702 test...");

  let contractAddress: `0x${string}`;
  const contractDetails = getContractDetails();
  contractAddress = contractDetails.address as `0x${string}`;
  console.log("Using existing contract at:", contractAddress);

  console.log(`\nEOA Address: ${eoa.address}`);
  console.log(`Contract Address: ${contractAddress}\n`);

  // await setContractCode(contractAddress);
  await initializeAccount();

  // read
  console.log("\nRead accountId");
  const accountId = await publicClient.readContract({
    address: eoa.address,
    functionName: "accountId",
    abi: nexusAccountAbi as Abi,
  });
  console.log(`Account ID: ${accountId}`);

  console.log("\nRead isInitialized");
  const isInitialized = await publicClient.readContract({
    address: eoa.address,
    functionName: "isInitialized",
    abi: nexusAccountAbi as Abi,
  });
  console.log(`Is initialized: ${isInitialized}`);
}

export async function setContractCode(contractAddress: `0x${string}`) {
  console.log("Sign authorization to set contract address");
  const authorization = await walletClient.signAuthorization({
    account: eoa,
    contractAddress,
    executor: "self",
  });

  console.log("Authorization signed:");
  console.log(JSON.stringify(authorization, stringifyBigInt));

  console.log("\nSend EIP-7702 transaction to set contract code");

  const initData = createInitData();

  const hash = await walletClient.writeContract({
    authorizationList: [authorization],
    address: eoa.address,
    functionName: "initializeAccount",
    args: [initData],
    abi: nexusAccountAbi as Abi,
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}
