import {
  NEXUS_K1_VALIDATOR_ADDRESS,
  MODULE_ADDRESS,
  NEXUS_BOOTSTRAP,
} from "./consts";
import { owner } from "./config";
import { zeroAddress } from "viem";
import {
  getInitData,
  type GenericModuleConfig,
  type PrevalidationHookModuleConfig,
} from "@biconomy/abstractjs";

export function createInitData() {
  const validators: GenericModuleConfig[] = [
    {
      module: NEXUS_K1_VALIDATOR_ADDRESS,
      data: owner.address,
    },
  ];

  const executors: GenericModuleConfig[] = [
    {
      module: MODULE_ADDRESS,
      data: "0x",
    },
  ];

  const hook: GenericModuleConfig = {
    module: zeroAddress,
    data: "0x",
  };

  const preValidationHooks: PrevalidationHookModuleConfig[] = [];

  const fallbacks: GenericModuleConfig[] = [];

  return getInitData({
    defaultValidator: validators[0]!,
    prevalidationHooks: preValidationHooks,
    validators,
    executors,
    hook,
    fallbacks,
    registryAddress: zeroAddress,
    bootStrapAddress: NEXUS_BOOTSTRAP,
  });

  // return encodeAbiParameters(
  //   [
  //     { name: "bootstrap", type: "address" },
  //     { name: "initData", type: "bytes" },
  //   ],
  //   [
  //     NEXUS_BOOTSTRAP,
  //     encodeFunctionData({
  //       abi: bootstrapAbi as Abi,
  //       functionName: "initNexusNoRegistry",
  //       args: [validators, executors, hook, fallbacks, preValidationHooks],
  //     }),
  //   ]
  // );
}
