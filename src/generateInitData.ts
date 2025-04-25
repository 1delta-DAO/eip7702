import {
  NEXUS_K1_VALIDATOR_ADDRESS,
  MODULE_ADDRESS,
  NEXUS_BOOTSTRAP,
} from "./consts";
import { eoa } from "./config";
import {
  zeroAddress,
  type Hex,
  type Address,
  encodeAbiParameters,
  encodeFunctionData,
  type Abi,
} from "viem";
import { bootstrapAbi } from "./abis";

export interface BootstrapConfig {
  module: Address;
  data: Hex;
}

export interface BootstrapPreValidationHookConfig {
  hookType: bigint;
  module: Address;
  data: Hex;
}

export function createInitData() {
  const owner = eoa.address;

  const validators: BootstrapConfig[] = [
    {
      module: NEXUS_K1_VALIDATOR_ADDRESS,
      data: owner,
    },
  ];

  const executors: BootstrapConfig[] = [
    {
      module: MODULE_ADDRESS,
      data: "0x",
    },
  ];

  const hook: BootstrapConfig = {
    module: zeroAddress,
    data: "0x",
  };

  const preValidationHooks: BootstrapPreValidationHookConfig[] = [];

  const fallbacks: BootstrapConfig[] = [];

  return encodeAbiParameters(
    [
      { name: "bootstrap", type: "address" },
      { name: "initData", type: "bytes" },
    ],
    [
      NEXUS_BOOTSTRAP,
      encodeFunctionData({
        abi: bootstrapAbi as Abi,
        functionName: "initNexusNoRegistry",
        args: [validators, executors, hook, fallbacks, preValidationHooks],
      }),
    ]
  );
}
