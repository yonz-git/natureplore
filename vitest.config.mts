import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

// The domain modules in lib/, tested through their interfaces. No browser: the screens are checked by eye.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { include: ["lib/**/*.test.ts"] },
});
