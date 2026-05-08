import type { CiphersModule } from "@/lib/wasm";
import { ciphers } from "@/lib/wasm";

export function useCiphers(): {
  ciphers: CiphersModule;
  ready: boolean;
  error: string | null;
} {
  return { ciphers, ready: true, error: null };
}
