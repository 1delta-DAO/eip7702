import {
  concatHex,
  encodeAbiParameters,
  pad,
  type Address,
  type Hex,
} from "viem";
import { CALL_TYPE, type EXEC_TYPE } from "./consts";
import { publicClient } from "./config";
import { owner } from "./config";

export const stringifyBigInt = (key: string, value: any) =>
  typeof value === "bigint" ? value.toString() : value;

export type CallArgs = {
  to: Address;
  data?: Hex;
  value?: bigint;
};
export type DelegateCallArgs = Omit<CallArgs, "value">;

export const encodeExecuteBatchCall = (args: readonly CallArgs[]) => {
  return encodeAbiParameters(
    [
      {
        name: "executionBatch",
        type: "tuple[]",
        components: [
          {
            name: "target",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
          {
            name: "callData",
            type: "bytes",
          },
        ],
      },
    ],
    [
      args.map((arg) => {
        return {
          target: arg.to,
          value: arg.value || 0n,
          callData: arg.data || "0x",
        };
      }),
    ]
  );
};

export const getExecMode = ({
  callType,
  execType,
}: {
  callType: CALL_TYPE;
  execType: EXEC_TYPE;
}): Hex => {
  return concatHex([
    callType, // 1 byte
    execType, // 1 byte
    "0x00000000", // 4 bytes
    "0x00000000", // 4 bytes
    pad("0x00000000", { size: 22 }),
  ]);
};

export type EncodeExecuteOptions = Parameters<typeof getExecMode>[0];

export async function getContractCode() {
  const code = await publicClient.getCode({
    address: owner.address,
  });
  return code;
}

export async function isEIP7702Account() {
  const code = await getContractCode();

  if (code && code.startsWith("0xef0100")) {
    return true;
  }
  return false;
}
