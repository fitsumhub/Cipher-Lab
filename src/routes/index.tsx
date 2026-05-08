import { createFileRoute } from "@tanstack/react-router";
import { CipherWorkbench } from "@/components/CipherWorkbench";
import { ShieldCheck, BookOpen, Zap } from "lucide-react";
import logoUrl from "@/assets/logo.svg?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cipher Lab — Interactive Caesar & Vigenère Ciphers" },
      {
        name: "description",
        content:
          "Interactive cryptography playground. Encrypt and decrypt with Caesar and Vigenère ciphers in your browser.",
      },
      { property: "og:title", content: "Cipher Lab — Learn Classical Cryptography" },
      {
        property: "og:description",
        content: "Hands-on Caesar and Vigenère ciphers running entirely in the browser.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-surface)" }}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-20">
        {/* Hero */}
        <header className="mb-14 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <img src={logoUrl} alt="Cipher Lab logo" className="h-4 w-4" width={16} height={16} />
            Classical Cryptography Playground
          </div>
          <h1
            className="bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
            style={{ backgroundImage: "var(--gradient-hero)" }}
          >
            Cipher Lab
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Type a message, pick a key, and watch encryption happen in real time — right in your
            browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              Educational
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              Instant results
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              100% client-side
            </span>
          </div>
        </header>

        {/* Cipher cards */}
        <CipherWorkbench />

        {/* Info cards */}
        <section className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
          <article className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-base font-bold">How Caesar works</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pick a shift{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">k</code>. Each
              letter moves{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">k</code> positions
              down the alphabet, wrapping past Z. With only 26 possible keys, it's trivial to
              brute-force.
            </p>
          </article>
          <article className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <h2 className="mb-2 text-base font-bold">How Vigenère works</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A keyword like{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">LEMON</code>{" "}
              repeats over the message. Each keyword letter sets the shift for the matching
              plaintext letter, hiding letter frequencies and making it much harder to crack.
            </p>
          </article>
        </section>

        <footer className="mt-14 text-center text-xs text-muted-foreground/60">
          Built with TypeScript & React · Classical cipher algorithms
        </footer>
      </div>
    </div>
  );
}
