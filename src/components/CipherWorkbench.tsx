import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Lock, Unlock, ArrowRightLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useCiphers } from "@/hooks/use-ciphers";
import type { CipherStep } from "@/lib/wasm/index";

function StepsPanel({ steps, mode }: { steps: CipherStep[]; mode: "encrypt" | "decrypt" }) {
  const [open, setOpen] = useState(false);
  if (steps.length === 0) return null;

  const letterSteps = steps.filter((s) => s.isLetter);

  return (
    <div className="rounded-lg border border-border/40 bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>Show steps ({letterSteps.length} characters shifted)</span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="border-t border-border/40 px-4 py-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-semibold">#</th>
                  <th className="pb-2 pr-4 font-semibold">Char</th>
                  {letterSteps[0]?.keyChar !== undefined && (
                    <th className="pb-2 pr-4 font-semibold">Key</th>
                  )}
                  <th className="pb-2 pr-4 font-semibold">Shift</th>
                  <th className="pb-2 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {steps.map((step, i) => (
                  <tr key={i} className={step.isLetter ? "" : "text-muted-foreground/50"}>
                    <td className="py-0.5 pr-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-0.5 pr-4 font-bold">{step.char === " " ? "␣" : step.char}</td>
                    {letterSteps[0]?.keyChar !== undefined && (
                      <td className="py-0.5 pr-4">{step.isLetter ? step.keyChar : "—"}</td>
                    )}
                    <td className="py-0.5 pr-4">
                      {step.isLetter ? (
                        <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                          +{step.shift}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-0.5 font-bold">{step.result === " " ? "␣" : step.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            {mode === "encrypt" ? "Encryption" : "Decryption"}: each letter is shifted by the
            indicated amount. Non-letter characters pass through unchanged.
          </p>
        </div>
      )}
    </div>
  );
}

interface CipherCardProps {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  controlLabel: string;
  controlNode: React.ReactNode;
  onEncrypt: () => string;
  onDecrypt: () => string;
  onSteps: (mode: "encrypt" | "decrypt") => CipherStep[];
  text: string;
  setText: (v: string) => void;
  ready: boolean;
  accent?: "primary" | "accent";
}

function CipherCard({
  title,
  subtitle,
  description,
  badge,
  controlLabel,
  controlNode,
  onEncrypt,
  onDecrypt,
  onSteps,
  text,
  setText,
  ready,
  accent = "primary",
}: CipherCardProps) {
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt" | null>(null);
  const [copied, setCopied] = useState(false);
  const [steps, setSteps] = useState<CipherStep[]>([]);

  const handleAction = (which: "encrypt" | "decrypt") => {
    if (!ready) return;
    const result = which === "encrypt" ? onEncrypt() : onDecrypt();
    setOutput(result);
    setMode(which);
    setCopied(false);
    setSteps(onSteps(which));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isPrimary = accent === "primary";

  return (
    <Card
      className="group relative overflow-hidden border-border/50 shadow-md transition-shadow duration-300 hover:shadow-lg"
      style={{ boxShadow: isPrimary ? "var(--cipher-glow)" : "var(--cipher-glow-accent)" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 rounded-t-lg"
        style={{
          background: isPrimary ? "oklch(0.55 0.2 265)" : "oklch(0.6 0.18 165)",
        }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
            <CardDescription className="mt-0.5 text-xs">{subtitle}</CardDescription>
          </div>
          <Badge
            className="font-mono text-[10px] tracking-wider border-none"
            style={{
              background: isPrimary ? "oklch(0.55 0.2 265 / 0.1)" : "oklch(0.6 0.18 165 / 0.1)",
              color: isPrimary ? "oklch(0.45 0.18 265)" : "oklch(0.45 0.16 165)",
            }}
          >
            {badge}
          </Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-1.5">
          <Label
            htmlFor={`${title}-text`}
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Input
          </Label>
          <Textarea
            id={`${title}-text`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="min-h-[100px] resize-none rounded-lg border-border/60 bg-muted/30 font-mono text-sm transition-colors focus:bg-card"
          />
        </div>

        <div className="grid gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {controlLabel}
          </Label>
          {controlNode}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => handleAction("encrypt")}
            disabled={!ready || !text}
            className="flex-1 gap-2 rounded-lg font-semibold transition-all"
            style={{
              background: isPrimary ? "oklch(0.55 0.2 265)" : "oklch(0.6 0.18 165)",
            }}
          >
            <Lock className="h-3.5 w-3.5" />
            Encrypt
          </Button>
          <Button
            onClick={() => handleAction("decrypt")}
            disabled={!ready || !text}
            variant="outline"
            className="flex-1 gap-2 rounded-lg font-semibold"
          >
            <Unlock className="h-3.5 w-3.5" />
            Decrypt
          </Button>
        </div>

        <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {mode ? (mode === "encrypt" ? "Encrypted" : "Decrypted") : "Output"}
              </span>
            </div>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground min-h-[2.5rem]">
            {output || (
              <span className="text-muted-foreground/60 italic">
                {ready ? "Results will appear here…" : "Loading engine…"}
              </span>
            )}
          </pre>
        </div>

        {mode && steps.length > 0 && <StepsPanel steps={steps} mode={mode} />}
      </CardContent>
    </Card>
  );
}

export function CipherWorkbench() {
  const { ciphers, ready, error } = useCiphers();

  const [caesarText, setCaesarText] = useState("Hello, World!");
  const [shift, setShift] = useState(3);

  const [vigText, setVigText] = useState("Attack at dawn");
  const [keyword, setKeyword] = useState("LEMON");

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          Failed to load cipher engine: {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <CipherCard
          title="Caesar Cipher"
          subtitle="Monoalphabetic · fixed shift"
          badge="CAESAR"
          accent="primary"
          description="Each letter shifts by a fixed number of positions. Julius Caesar famously used a shift of 3."
          controlLabel="Shift value"
          controlNode={
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={shift}
                onChange={(e) => setShift(parseInt(e.target.value || "0", 10))}
                className="w-20 rounded-lg border-border/60 bg-muted/30 text-center font-mono font-bold"
              />
              <input
                type="range"
                min={-25}
                max={25}
                value={shift}
                onChange={(e) => setShift(parseInt(e.target.value, 10))}
                className="flex-1 accent-[oklch(0.55_0.2_265)]"
              />
            </div>
          }
          text={caesarText}
          setText={setCaesarText}
          ready={ready}
          onEncrypt={() => ciphers!.caesarEncrypt(caesarText, shift)}
          onDecrypt={() => ciphers!.caesarDecrypt(caesarText, shift)}
          onSteps={(m) => ciphers!.caesarSteps(caesarText, shift, m === "encrypt")}
        />

        <CipherCard
          title="Vigenère Cipher"
          subtitle="Polyalphabetic · keyword shift"
          badge="VIGENÈRE"
          accent="accent"
          description="A repeating keyword determines shifting for each letter — once considered unbreakable."
          controlLabel="Keyword (letters only)"
          controlNode={
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. LEMON"
              className="rounded-lg border-border/60 bg-muted/30 font-mono font-bold uppercase tracking-widest"
            />
          }
          text={vigText}
          setText={setVigText}
          ready={ready}
          onEncrypt={() => ciphers!.vigenereEncrypt(vigText, keyword)}
          onDecrypt={() => ciphers!.vigenereDecrypt(vigText, keyword)}
          onSteps={(m) => ciphers!.vigenereSteps(vigText, keyword, m === "encrypt")}
        />
      </div>
    </div>
  );
}
