import {
  resetCode,
  setContractCodeNoInit,
  readaVars,
  executeOnEoaTest,
  initializeAccount,
} from "./src/eip7702-test";

async function main() {
  const args = process.argv.slice(2);
  let setContract,
    resetContract,
    readTest,
    writeTest,
    init = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--all" || arg === "-a") {
      setContract = true;
      resetContract = true;
      readTest = true;
      writeTest = true;
      init = true;

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

    if (arg === "--read-test" || arg === "-rt") {
      readTest = true;
      continue;
    }

    if (arg === "--write-test" || arg === "-wt") {
      writeTest = true;
      continue;
    }

    if (arg === "--init" || "-i") {
      init = true;
      continue;
    }
  }

  // execute according to conditions from args
  if (setContract) {
    console.log(
      "Setting EOA code to 0x000000004F43C49e93C970E84001853a70923B03"
    );
    await setContractCodeNoInit("0x000000004F43C49e93C970E84001853a70923B03");
  }

  if (resetContract) {
    console.log("Reset the code of the EOA");
    if (!setContract) {
      // then first set the code
      await setContractCodeNoInit("0x000000004F43C49e93C970E84001853a70923B03");
    }
    await resetCode();
  }

  if (readTest) {
    if (!setContract) {
      // then first set the code
      await setContractCodeNoInit("0x000000004F43C49e93C970E84001853a70923B03");
    }
    console.log("read from the code of the EOA");
    await readaVars();
  }

  if (writeTest) {
    if (!setContract) {
      // then first set the code
      await setContractCodeNoInit("0x000000004F43C49e93C970E84001853a70923B03");
    }
    console.log("Execute on the code of EOA");
    await executeOnEoaTest();
  }

  if (init) {
    if (!setContract) {
      // then first set the code
      await setContractCodeNoInit("0x000000004F43C49e93C970E84001853a70923B03");
    }
    await initializeAccount();
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
