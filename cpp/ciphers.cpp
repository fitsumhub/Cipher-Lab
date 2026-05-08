// Classical cipher implementations in C++.
// Compiled to WebAssembly via Emscripten and consumed from the browser.
#include <string>
#include <emscripten/bind.h>

using std::string;

// --- Caesar Cipher (monoalphabetic, fixed shift) -----------------------------
static string caesar_shift(const string& text, int shift) {
    // Normalize shift into [0, 26)
    shift = ((shift % 26) + 26) % 26;
    string out;
    out.reserve(text.size());
    for (char c : text) {
        if (c >= 'a' && c <= 'z') {
            out.push_back(static_cast<char>('a' + (c - 'a' + shift) % 26));
        } else if (c >= 'A' && c <= 'Z') {
            out.push_back(static_cast<char>('A' + (c - 'A' + shift) % 26));
        } else {
            out.push_back(c); // preserve non-letters
        }
    }
    return out;
}

string caesar_encrypt(const string& text, int shift) {
    return caesar_shift(text, shift);
}

string caesar_decrypt(const string& text, int shift) {
    return caesar_shift(text, -shift);
}

// --- Vigenère Cipher (polyalphabetic, keyword-based) -------------------------
static string vigenere_process(const string& text, const string& key, bool encrypt) {
    if (key.empty()) return text;

    // Build a normalized key of A-Z letters only.
    string nkey;
    nkey.reserve(key.size());
    for (char c : key) {
        if (c >= 'a' && c <= 'z') nkey.push_back(static_cast<char>(c - 'a' + 'A'));
        else if (c >= 'A' && c <= 'Z') nkey.push_back(c);
    }
    if (nkey.empty()) return text;

    string out;
    out.reserve(text.size());
    size_t ki = 0;
    for (char c : text) {
        if (c >= 'a' && c <= 'z') {
            int k = nkey[ki % nkey.size()] - 'A';
            int shift = encrypt ? k : -k;
            out.push_back(static_cast<char>('a' + (((c - 'a' + shift) % 26) + 26) % 26));
            ++ki;
        } else if (c >= 'A' && c <= 'Z') {
            int k = nkey[ki % nkey.size()] - 'A';
            int shift = encrypt ? k : -k;
            out.push_back(static_cast<char>('A' + (((c - 'A' + shift) % 26) + 26) % 26));
            ++ki;
        } else {
            out.push_back(c); // preserve non-letters; do not advance key
        }
    }
    return out;
}

string vigenere_encrypt(const string& text, const string& key) {
    return vigenere_process(text, key, true);
}

string vigenere_decrypt(const string& text, const string& key) {
    return vigenere_process(text, key, false);
}

EMSCRIPTEN_BINDINGS(ciphers_module) {
    emscripten::function("caesarEncrypt", &caesar_encrypt);
    emscripten::function("caesarDecrypt", &caesar_decrypt);
    emscripten::function("vigenereEncrypt", &vigenere_encrypt);
    emscripten::function("vigenereDecrypt", &vigenere_decrypt);
}
