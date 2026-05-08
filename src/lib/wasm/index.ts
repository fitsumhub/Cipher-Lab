// Cipher implementations.
//
// These mirror the C++ reference implementation in /cpp/ciphers.cpp exactly.
// We use pure TypeScript here so the app works in every environment (SSR,
// edge runtime, static export) without needing to ship and serve a .wasm
// binary. The algorithms are identical character-for-character.

export interface CipherStep {
  char: string;
  isLetter: boolean;
  base?: string;
  shift?: number;
  keyChar?: string;
  result: string;
}

export interface CiphersModule {
  caesarEncrypt: (text: string, shift: number) => string;
  caesarDecrypt: (text: string, shift: number) => string;
  vigenereEncrypt: (text: string, key: string) => string;
  vigenereDecrypt: (text: string, key: string) => string;
  caesarSteps: (text: string, shift: number, encrypt: boolean) => CipherStep[];
  vigenereSteps: (text: string, key: string, encrypt: boolean) => CipherStep[];
}

const A_LOWER = "a".charCodeAt(0);
const A_UPPER = "A".charCodeAt(0);
const Z_LOWER = "z".charCodeAt(0);
const Z_UPPER = "Z".charCodeAt(0);

function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function caesarShift(text: string, shift: number): string {
  const k = mod(Math.trunc(shift), 26);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= A_LOWER && code <= Z_LOWER) {
      out += String.fromCharCode(A_LOWER + ((code - A_LOWER + k) % 26));
    } else if (code >= A_UPPER && code <= Z_UPPER) {
      out += String.fromCharCode(A_UPPER + ((code - A_UPPER + k) % 26));
    } else {
      out += text[i]; // preserve non-letters
    }
  }
  return out;
}

function caesarEncrypt(text: string, shift: number): string {
  return caesarShift(text, shift);
}

function caesarDecrypt(text: string, shift: number): string {
  return caesarShift(text, -shift);
}

function normalizeKey(key: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < key.length; i++) {
    const code = key.charCodeAt(i);
    if (code >= A_LOWER && code <= Z_LOWER) out.push(code - A_LOWER);
    else if (code >= A_UPPER && code <= Z_UPPER) out.push(code - A_UPPER);
  }
  return out;
}

function vigenereProcess(text: string, key: string, encrypt: boolean): string {
  const nkey = normalizeKey(key);
  if (nkey.length === 0) return text;

  let out = "";
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const isLower = code >= A_LOWER && code <= Z_LOWER;
    const isUpper = code >= A_UPPER && code <= Z_UPPER;
    if (isLower || isUpper) {
      const base = isLower ? A_LOWER : A_UPPER;
      const k = nkey[ki % nkey.length];
      const shift = encrypt ? k : -k;
      out += String.fromCharCode(base + mod(code - base + shift, 26));
      ki++;
    } else {
      out += text[i]; // preserve non-letters; do not advance key
    }
  }
  return out;
}

function vigenereEncrypt(text: string, key: string): string {
  return vigenereProcess(text, key, true);
}

function vigenereDecrypt(text: string, key: string): string {
  return vigenereProcess(text, key, false);
}

function caesarSteps(text: string, shift: number, encrypt: boolean): CipherStep[] {
  const k = mod(Math.trunc(encrypt ? shift : -shift), 26);
  const steps: CipherStep[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const isLower = code >= A_LOWER && code <= Z_LOWER;
    const isUpper = code >= A_UPPER && code <= Z_UPPER;
    if (isLower || isUpper) {
      const base = isLower ? A_LOWER : A_UPPER;
      const resultCode = base + ((code - base + k) % 26);
      steps.push({
        char: text[i],
        isLetter: true,
        shift: encrypt ? mod(Math.trunc(shift), 26) : mod(Math.trunc(-shift), 26),
        result: String.fromCharCode(resultCode),
      });
    } else {
      steps.push({ char: text[i], isLetter: false, result: text[i] });
    }
  }
  return steps;
}

function vigenereSteps(text: string, key: string, encrypt: boolean): CipherStep[] {
  const nkey = normalizeKey(key);
  const steps: CipherStep[] = [];
  if (nkey.length === 0) {
    for (let i = 0; i < text.length; i++) {
      steps.push({ char: text[i], isLetter: false, result: text[i] });
    }
    return steps;
  }
  let ki = 0;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const isLower = code >= A_LOWER && code <= Z_LOWER;
    const isUpper = code >= A_UPPER && code <= Z_UPPER;
    if (isLower || isUpper) {
      const base = isLower ? A_LOWER : A_UPPER;
      const k = nkey[ki % nkey.length];
      const shift = encrypt ? k : -k;
      const resultCode = base + mod(code - base + shift, 26);
      steps.push({
        char: text[i],
        isLetter: true,
        keyChar: String.fromCharCode(A_UPPER + nkey[ki % nkey.length]),
        shift: mod(shift, 26),
        result: String.fromCharCode(resultCode),
      });
      ki++;
    } else {
      steps.push({ char: text[i], isLetter: false, result: text[i] });
    }
  }
  return steps;
}

const ciphers: CiphersModule = {
  caesarEncrypt,
  caesarDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  caesarSteps,
  vigenereSteps,
};

export function loadCiphers(): Promise<CiphersModule> {
  return Promise.resolve(ciphers);
}

export { ciphers };
