import { zeroAddress, type Abi } from "viem";
import { walletClient, owner, publicClient } from "./config";
import { stringifyBigInt } from "./utils";

export async function setContractCodeNoInit(contractAddress: `0x${string}`) {
  console.log("Sign authorization to set contract address");
  console.log("delegated contract address", contractAddress);
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
