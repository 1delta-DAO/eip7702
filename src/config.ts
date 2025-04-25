import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const EOA_PRIVATE_KEY = process.env.PK1! as Address;

export const eoa = privateKeyToAccount(EOA_PRIVATE_KEY);

export const walletClient = createWalletClient({
  account: eoa,
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});
