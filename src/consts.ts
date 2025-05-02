import type { Address } from "viem";

export const KERNEL_V3_3 =
  "0xd6CEDDe84be40893d153Be9d467CD6aD37875b28" as Address;

export const VALIDATOR_TYPE = {
  SUDO: "0x00",
  SECONDARY: "0x01",
  PERMISSION: "0x02",
} as const;
export enum VALIDATOR_MODE {
  DEFAULT = "0x00",
  ENABLE = "0x01",
}
export enum CALL_TYPE {
  SINGLE = "0x00",
  BATCH = "0x01",
  DELEGATE_CALL = "0xFF",
}
export enum EXEC_TYPE {
  DEFAULT = "0x00",
  TRY_EXEC = "0x01",
}
