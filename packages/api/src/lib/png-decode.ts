function readUint32BE(data: Uint8Array, offset: number): number {
  return ((data[offset] ?? 0) << 24) | ((data[offset + 1] ?? 0) << 16) | ((data[offset + 2] ?? 0) << 8) | (data[offset + 3] ?? 0);
}

const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

function checkSignature(data: Uint8Array): boolean {
  if (data.length < 8) return false;
  for (let i = 0; i < 8; i++) if (data[i] !== PNG_SIGNATURE[i]) return false;
  return true;
}

async function inflateZlib(data: Uint8Array): Promise<Uint8Array | undefined> {
  try {
    const stream = new DecompressionStream("deflate");
    const writer = stream.writable.getWriter();
    await writer.write(data as unknown as NodeJS.BufferSource);
    await writer.close();
    const reader = stream.readable.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
    const total = chunks.reduce((sum, c) => sum + c.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) {
      out.set(c, off);
      off += c.length;
    }
    return out;
  } catch {
    return undefined;
  }
}

export interface DecodedPng {
  width: number;
  height: number;
  data: Uint8Array;
}

export async function decodePng(data: Uint8Array): Promise<DecodedPng | undefined> {
  if (!checkSignature(data)) return undefined;

  let pos = 8;
  let ihdr: {
    width: number;
    height: number;
    bitDepth: number;
    colorType: number;
    compression: number;
    filter: number;
    interlace: number;
  } | undefined;
  const idat: Uint8Array[] = [];

  while (pos + 8 <= data.length) {
    const len = readUint32BE(data, pos);
    pos += 4;
    const type = new TextDecoder().decode(data.slice(pos, pos + 4));
    pos += 4;
    if (pos + len + 4 > data.length) return undefined;
    const chunkData = data.slice(pos, pos + len);
    pos += len;
    pos += 4; // CRC

    if (type === "IHDR") {
      ihdr = {
        width: readUint32BE(chunkData, 0),
        height: readUint32BE(chunkData, 4),
        bitDepth: chunkData[8] ?? 0,
        colorType: chunkData[9] ?? 0,
        compression: chunkData[10] ?? 0,
        filter: chunkData[11] ?? 0,
        interlace: chunkData[12] ?? 0,
      };
      if (
        ihdr.compression !== 0 ||
        ihdr.filter !== 0 ||
        ihdr.bitDepth !== 8 ||
        (ihdr.colorType !== 0 && ihdr.colorType !== 2 && ihdr.colorType !== 4 && ihdr.colorType !== 6)
      ) {
        return undefined;
      }
    } else if (type === "IDAT") {
      idat.push(chunkData);
    } else if (type === "IEND") {
      break;
    }
  }

  if (!ihdr || idat.length === 0) return undefined;
  if (ihdr.interlace !== 0) return undefined;

  const compressed = concat(idat);
  const inflated = await inflateZlib(compressed);
  if (!inflated) return undefined;

  const samplesPerPixel =
    ihdr.colorType === 0 ? 1 : ihdr.colorType === 2 ? 3 : ihdr.colorType === 4 ? 2 : 4;
  const bytesPerRow = ihdr.width * samplesPerPixel + 1;
  const expected = ihdr.height * bytesPerRow;
  if (inflated.length !== expected) return undefined;

  const current = unfilter(inflated, ihdr.width, ihdr.height, samplesPerPixel);
  const rgba = toRgba8(current, ihdr.width, ihdr.height, samplesPerPixel, ihdr.colorType);
  return { width: ihdr.width, height: ihdr.height, data: rgba };
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function unfilter(raw: Uint8Array, width: number, height: number, samplesPerPixel: number): Uint8Array {
  const bytesPerRow = width * samplesPerPixel + 1;
  const out = new Uint8Array(height * (bytesPerRow - 1));
  const prev = new Uint8Array(bytesPerRow - 1);

  for (let y = 0; y < height; y++) {
    const filter = raw[y * bytesPerRow] ?? 0;
    const rowStart = y * bytesPerRow + 1;
    const row = raw.slice(rowStart, rowStart + bytesPerRow - 1);
    const targetOffset = y * (bytesPerRow - 1);

    for (let x = 0; x < row.length; x++) {
      const left = x >= samplesPerPixel ? (row[x - samplesPerPixel] ?? 0) : 0;
      const up = prev[x] ?? 0;
      const leftUp = x >= samplesPerPixel ? (prev[x - samplesPerPixel] ?? 0) : 0;
      let value = row[x] ?? 0;

      switch (filter) {
        case 0:
          break;
        case 1:
          value = (value + left) & 0xff;
          break;
        case 2:
          value = (value + up) & 0xff;
          break;
        case 3:
          value = (value + Math.floor((left + up) / 2)) & 0xff;
          break;
        case 4:
          value = (value + paethPredictor(left, up, leftUp)) & 0xff;
          break;
        default:
          break;
      }

      out[targetOffset + x] = value;
    }

    for (let i = 0; i < bytesPerRow - 1; i++) {
      prev[i] = out[targetOffset + i] ?? 0;
    }
  }

  return out;
}

function paethPredictor(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function toRgba8(
  raw: Uint8Array,
  width: number,
  height: number,
  samplesPerPixel: number,
  colorType: number
): Uint8Array {
  const out = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * samplesPerPixel;
      const dst = (y * width + x) * 4;
      switch (colorType) {
        case 0: {
          const g = raw[src] ?? 0;
          out[dst] = g;
          out[dst + 1] = g;
          out[dst + 2] = g;
          out[dst + 3] = 255;
          break;
        }
        case 2: {
          out[dst] = raw[src] ?? 0;
          out[dst + 1] = raw[src + 1] ?? 0;
          out[dst + 2] = raw[src + 2] ?? 0;
          out[dst + 3] = 255;
          break;
        }
        case 4: {
          const g = raw[src] ?? 0;
          out[dst] = g;
          out[dst + 1] = g;
          out[dst + 2] = g;
          out[dst + 3] = raw[src + 1] ?? 0;
          break;
        }
        case 6: {
          out[dst] = raw[src] ?? 0;
          out[dst + 1] = raw[src + 1] ?? 0;
          out[dst + 2] = raw[src + 2] ?? 0;
          out[dst + 3] = raw[src + 3] ?? 0;
          break;
        }
      }
    }
  }
  return out;
}
