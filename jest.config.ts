import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/lib"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default config;
