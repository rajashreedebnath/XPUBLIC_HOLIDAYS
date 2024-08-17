const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Define the output JSON file path
const outputFilePath = path.join(__dirname, "test-results.json");

// Run the check-files.js script and capture its output
try {
  const result = execSync("node scripts/check-files.js", { encoding: "utf8" });
  console.log("Script ran successfully.");

  // Process the output to determine the status of each test case
  const testResults = [];
  const lines = result.split("\n");
  let currentTestCase = null;

  lines.forEach((line) => {
    if (line.startsWith("✔") || line.startsWith("✖")) {
      const status = line.startsWith("✔") ? "passed" : "failed";
      const cleanLine = line.replace(/✔|✖|[()]/g, "").trim();

      // Ignore summary lines such as "Passed: X" or "Failed: X"
      if (
        !cleanLine.startsWith("Passed:") &&
        !cleanLine.startsWith("Failed:")
      ) {
        testResults.push({ name: cleanLine, status });
      }
    }
  });

  // Store the results in the JSON file
  fs.writeFileSync(outputFilePath, JSON.stringify(testResults, null, 2));
  console.log(`Test results saved to ${outputFilePath}`);
} catch (error) {
  console.error("Error running the script:", error);
}
