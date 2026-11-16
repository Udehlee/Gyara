import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.integration.test.ts"],
    setupFiles: ["dotenv/config"],
    testTimeout: 40000,
    hookTimeout: 90000,
  },
});