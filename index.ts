import {
  resetCode,
  setContractCodeNoInit,
  batchTest as execBatchTest,
  user2SendTxOnOwner,
} from "./src/eip7702-test";
import { KERNEL_V3_3 } from "./src/consts";
import { isEIP7702Account } from "./src/utils";
import { getContractCode } from "./src/utils";

async function main() {
  const args = process.argv.slice(2);
  let setContract,
    resetContract,
    batchTest,
    execOnOwner = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--all" || arg === "-a") {
      setContract = true;
      resetContract = true;

      break;
    }

    if (arg === "--set-contract" || arg === "-sc") {
      setContract = true;
      continue;
    }

    if (arg === "--reset-contract" || arg === "-rc") {
      resetContract = true;
      continue;
    }

    if (arg === "--batch-test" || arg === "-bt") {
      batchTest = true;
      continue;
    }

    if (arg === "--exec-on-owner" || arg === "-eo") {
      execOnOwner = true;
      continue;
    }
  }

  // execute according to conditions from args
  if (setContract) {
    const currentCode = await getContractCode();
    if (
      currentCode &&
      currentCode.toLowerCase() ===
        `0xef0100${KERNEL_V3_3.slice(2).toLowerCase()}`
    ) {
      console.log(
        "The code is already points to the kernel, no further tx is required"
      );
    } else {
      console.log(`Setting EOA code to ${KERNEL_V3_3}`);
      await setContractCodeNoInit(KERNEL_V3_3);
    }
  }

  if (resetContract) {
    console.log("Reset the code of the EOA");
    const haveCode = await isEIP7702Account();
    if (haveCode) {
      await resetCode();
    } else {
      console.log("EOA is not an EIP-7702 account");
    }
  }

  if (batchTest) {
    await execBatchTest();
  }

  if (execOnOwner) {
    await user2SendTxOnOwner();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error, "\n\n");
    process.exit(1);
  });
