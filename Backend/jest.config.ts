import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      tsconfig: {
        rootDir: ".",
        types: ["jest", "node"],
      },
    }],
  },
};

export default config;
