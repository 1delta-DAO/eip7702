import { resetCode, setContractCodeNoInit } from "./src/eip7702-test";
import { KERNEL_V3_3 } from "./src/consts";
import { owner, publicClient } from "./src/config";

async function getContractCode() {
  const code = await publicClient.getCode({
    address: owner.address,
  });
  return code;
}

async function isEIP7702Account() {
  const code = await getContractCode();

  if (code && code.startsWith("0xef0100")) {
    return true;
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  let setContract,
    resetContract = false;
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
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error, "\n\n");
    process.exit(1);
  });
