import { createPrivateKey } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: bun run scripts/convert-private-key.ts <path-to-private-key.pem>");
  process.exit(1);
}

const input = readFileSync(inputPath, "utf8");
const privateKey = createPrivateKey(input);
const pkcs8 = privateKey.export({ type: "pkcs8", format: "pem" }) as string;

const outputPath = inputPath.replace(/\.pem$/, "-pkcs8.pem");
writeFileSync(outputPath, pkcs8);
console.log(`Converted to PKCS#8: ${outputPath}`);
