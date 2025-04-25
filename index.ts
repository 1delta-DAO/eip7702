import { testEIP7702 } from "./src/eip7702-test";

testEIP7702()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
