import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro(),
    react(),
    tsconfigPaths({
      // Prevent scanning parent directories on Windows setups where
      // unrelated tsconfig files exist elsewhere on disk.
      projects: ["./tsconfig.json"],
      ignoreConfigErrors: true,
    }),
    tailwindcss(),
  ],
});
