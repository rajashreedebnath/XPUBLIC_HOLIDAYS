module.exports = {
  preset: "ts-jest",
  reporters: ["default", ["jest-ctrf-json-reporter", {}]],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
