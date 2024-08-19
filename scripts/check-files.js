const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const componentsPath = path.join(__dirname, "../src/components");
const appFilePath = path.join(__dirname, "../src/App.tsx");
const typesFilePath = path.join(__dirname, "../src/types/Holiday.ts");
const tsconfigPath = path.join(__dirname, "../tsconfig.json");

const testFolderToIgnore = path.join(__dirname, "../src/__test__");

(async () => {
  const { default: chalk } = await import("chalk");

  const logSuccess = (message) => {
    console.log(chalk.green.bold("✔ " + message));
    console.log();
  };

  const logError = (message) => {
    console.error(chalk.red.bold("✖ " + message));
    console.log();
  };

  const logInfo = (message) => {
    console.log(chalk.gray(message));
  };

  let passedTests = 0;
  let failedTests = 0;

  // Display a custom message before running the tests
  logInfo("Wait... Test cases are running...");

  // Run TypeScript compiler to check for errors
  logInfo(
    `Wait... Test case "Run TypeScript compiler to check for errors" is running...`
  );
  try {
    execSync("tsc --noEmit");
    logSuccess("TypeScript compiled successfully without errors");
    passedTests++;
  } catch (error) {
    logError("TypeScript compilation failed, please fix the errors");
    console.error(error.stdout.toString());
    failedTests++;
    process.exit(1); // Exit the script with a non-zero status code
  }

  // Check for .tsx extension in components
  logInfo(
    `Wait... Test case "Check for .tsx extension in components" is running...`
  );

  fs.readdirSync(componentsPath).forEach((file) => {
    const ext = path.extname(file);
    const fileNameWithoutExtension = file.replace(/\.tsx?$|\.ts$/, '');

    if (ext && ext !== ".tsx" && ext !== ".css") {
      logError(`File ${fileNameWithoutExtension} has an unsupported extension`);
      failedTests++;
    } else if (ext === ".tsx") {
      logSuccess(`File ${fileNameWithoutExtension} is correctly using the tsx extension`);
      passedTests++;
    }
  });

  // Check for App.tsx file
  logInfo(`Wait... Test case "Check for App.tsx file" is running...`);
  if (!fs.existsSync(appFilePath) || path.extname(appFilePath) !== ".tsx") {
    logError("App file is missing or has an incorrect extension");
    failedTests++;
  } else {
    logSuccess("App file is present and correctly uses the tsx extension");
    passedTests++;
  }

  // Check for type definitions in Holiday.ts
  logInfo(
    `Wait... Test case "Check for type definitions in Holiday.ts" is running...`
  );
  const typesFileContent = fs.readFileSync(typesFilePath, "utf8");
  if (!typesFileContent.includes("export interface Holiday")) {
    logError("Type definitions are missing in the Holiday TS file");
    failedTests++;
  } else {
    logSuccess("Type definitions are present in the Holiday TS file");
    passedTests++;
  }

  // Check for noImplicitAny in tsconfig.json
  logInfo(
    `Wait... Test case "Check for noImplicitAny in tsconfig.json" is running...`
  );
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = require(tsconfigPath);
    if (!tsconfig.compilerOptions.noImplicitAny) {
      logError("noImplicitAny is not enabled in tsconfig JSON file");
      failedTests++;
    } else {
      logSuccess("noImplicitAny is enabled in tsconfig JSON file");
      passedTests++;
    }
  } else {
    logError("tsconfig JSON file is missing");
    failedTests++;
  }

  // Check for any usage of 'any' type
  logInfo(
    `Wait... Test case "Check for any usage of 'any' type" is running...`
  );

  var anyPresent = false;
  const scanFilesForAny = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (filePath.startsWith(testFolderToIgnore)) return; // Ignore __test__ folder
      if (fs.lstatSync(filePath).isDirectory()) {
        scanFilesForAny(filePath);
      } else if (
        path.extname(file) === ".ts" ||
        path.extname(file) === ".tsx"
      ) {
        const content = fs.readFileSync(filePath, "utf8");
        if (content.includes(": any")) {
          logError(`File ${filePath} contains 'any' type, avoid using 'any'`);
          failedTests++;
          anyPresent = true;
        }
      }
    });
  };

  scanFilesForAny(path.join(__dirname, "../src"));

  //success message
  if (!anyPresent) {
    logSuccess("No file contains 'any' type");
    passedTests++;
  }

  // Run ESLint to check for type annotations
  logInfo(
    `Wait... Test case "Run ESLint to check for type annotations" is running...`
  );
  try {
    execSync(`eslint src/**/*.{ts,tsx} --ignore-pattern src/__test__`);
    logSuccess("ESLint passed with no issues");
    passedTests++;
  } catch (error) {
    logError("ESLint found issues with type annotations, please review them");
    console.error(error.stdout.toString());
    failedTests++;
  }

  // Check for hardcoded values (basic check)
  // const checkForHardcoding = (dir) => {
  //   fs.readdirSync(dir).forEach((file) => {
  //     const filePath = path.join(dir, file);
  //     if (filePath.startsWith(testFolderToIgnore)) return; // Ignore __test__ folder
  //     if (fs.lstatSync(filePath).isDirectory()) {
  //       checkForHardcoding(filePath);
  //     } else if (path.extname(file) === '.ts' || path.extname(file) === '.tsx') {
  //       const content = fs.readFileSync(filePath, 'utf8');
  //       if (/\b\d{1,3}\b/.test(content)) {
  //         logError(`File ${filePath} may contain hardcoded numeric values.`);
  //         failedTests++;
  //       }
  //       if (/"[^"]{1,30}"/.test(content)) {
  //         logError(`File ${filePath} may contain hardcoded strings.`);
  //         failedTests++;
  //       }
  //     }
  //   });
  // };

  // logInfo(`Wait... Test case "Check for hardcoded values" is running...`);
  // checkForHardcoding(path.join(__dirname, '../src'));

  // Final Report
  console.log("\nTest Case Report:");
  console.log(chalk.green.bold(`✔ Passed: ${passedTests}`));
  console.log(chalk.red.bold(`✖ Failed: ${failedTests}`));
})();
