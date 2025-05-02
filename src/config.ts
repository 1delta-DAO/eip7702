import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const OWNER_PRIVATE_KEY = process.env.PK1! as Address;

export const owner = privateKeyToAccount(OWNER_PRIVATE_KEY);

export const walletClient = createWalletClient({
  account: owner,
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(sepolia.rpcUrls.default.http[0]),
});
