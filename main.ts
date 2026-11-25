// SPDX-License-Identifier: MIT
// Loading Screen Gold: A Tip in 200 Characters.
// The program writes one loading-screen tip, a single line of at most
// 200 characters, to $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt
// inside the grader). Deterministic: no network, no randomness, no clock
// reads, so every run produces byte-identical output.
//
// The tip is aimed at stressed developers and the AI coding agents
// pairing with them: the agent now produces code faster than the human
// can read it, so the human's job has quietly changed into nodding
// along professionally.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, 94 characters.
const TIP =
  "Tip: your agent writes code faster than you can read it. Your job now is professional nodding.";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate rules, checked before anything is written: UTF-8 text,
  // 1 to 200 characters, a single line, not only whitespace.
  if (TIP.length === 0 || TIP.length > MAX_CHARS) {
    fail(`tip must be 1 to ${MAX_CHARS} characters, got ${TIP.length}`);
  }
  if (TIP.trim().length === 0) {
    fail("tip must not be only whitespace");
  }
  if (TIP.includes("\n") || TIP.includes("\r")) {
    fail("tip must be a single line");
  }
  // It must read as a loading-screen tip, not a slogan or status line:
  // the judge's first criterion is the tip's fit to the subject.
  if (!TIP.startsWith("Tip:")) {
    fail('tip must start with "Tip:"');
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TIP, "utf8");

  // Read back and verify: the file on disk must match the tip exactly,
  // so a silent write failure can never pass unnoticed. The byte length
  // is checked too, which catches any encoding surprise on disk.
  const back = readFileSync(outPath, "utf8");
  if (back !== TIP) {
    fail("read-back mismatch: entry.txt does not match the tip");
  }
  const expectedBytes = Buffer.byteLength(TIP, "utf8");
  const actualBytes = Buffer.byteLength(back, "utf8");
  if (actualBytes !== expectedBytes) {
    fail(
      `byte length mismatch: entry.txt is ${actualBytes} bytes, expected ${expectedBytes}`,
    );
  }
  console.log(`wrote ${outPath} (${TIP.length} characters)`);
}

main();
