import { encodeFunctionData, getAddress, zeroAddress, type Abi } from "viem";
import { walletClient, owner, publicClient, user2Client } from "./config";
import { encodeExecuteBatchCall, getExecMode, stringifyBigInt } from "./utils";
import { ERC20_ABI, KernelV3ExecuteAbi, WETH_ABI } from "./abi";
import { CALL_TYPE, EXEC_TYPE, USDC, WETH } from "./consts";

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

export async function batchTest(usdcAmount: string = "1000000") {
  console.log("Batch test\nbatching 3 transactions");
  const approvalCalldata = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "approve",
    args: [WETH, BigInt(usdcAmount)],
  });

  const transferCalldata = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [WETH, BigInt(usdcAmount)],
  });

  const wrapCalldata = encodeFunctionData({
    abi: WETH_ABI,
    functionName: "deposit",
  });

  const calldata = encodeExecuteBatchCall([
    {
      to: USDC,
      data: approvalCalldata,
    },
    {
      to: USDC,
      data: transferCalldata,
    },
    {
      to: WETH,
      data: wrapCalldata,
      value: BigInt("100000"),
    },
  ]);

  const hash = await walletClient.writeContract({
    address: owner.address,
    abi: KernelV3ExecuteAbi,
    functionName: "execute",
    args: [
      getExecMode({ callType: CALL_TYPE.BATCH, execType: EXEC_TYPE.DEFAULT }),
      calldata,
    ],
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

export async function user2SendTxOnOwner() {
  const usdcAmount = 10000000;
  console.log("Batch test\nbatching 3 transactions");
  const approvalCalldata = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "approve",
    args: [WETH, BigInt(usdcAmount)],
  });

  const transferCalldata = encodeFunctionData({
    abi: ERC20_ABI,
    functionName: "transfer",
    args: [WETH, BigInt(usdcAmount)],
  });

  const wrapCalldata = encodeFunctionData({
    abi: WETH_ABI,
    functionName: "deposit",
  });

  const calldata = encodeExecuteBatchCall([
    {
      to: USDC,
      data: approvalCalldata,
    },
    {
      to: USDC,
      data: transferCalldata,
    },
    {
      to: WETH,
      data: wrapCalldata,
      value: BigInt("100000"),
    },
  ]);

  const hash = await user2Client.writeContract({
    address: owner.address,
    abi: KernelV3ExecuteAbi,
    functionName: "execute",
    args: [
      getExecMode({ callType: CALL_TYPE.BATCH, execType: EXEC_TYPE.DEFAULT }),
      calldata,
    ],
  });

  console.log(`Transaction hash: ${hash}`);

  console.log("Waiting for transaction confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}
