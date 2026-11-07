import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to generate a valid PNG buffer
function createPng(width, height, drawFn) {
  // RGBA buffer: height rows, each row has 1 filter byte (0) + width * 4 bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // Helper to build a PNG chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);

    const crcVal = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal >>> 0, 0);

    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  // CRC32 implementation
  function crc32(buf) {
    let table = crc32.table;
    if (!table) {
      table = crc32.table = new Int32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let k = 0; k < 8; k++) {
          c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }
        table[i] = c;
      }
    }
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return crc ^ -1;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Drawer: dark slate squircle with emerald and gold rupee coin
function drawAppIcon(x, y, w, h) {
  const nx = x / w;
  const ny = y / h;

  // Center coordinate
  const cx = 0.5;
  const cy = 0.5;
  const dx = Math.abs(nx - cx);
  const dy = Math.abs(ny - cy);

  // Rounded squircle boundary (radius ~ 0.22)
  const cornerR = 0.22;
  const innerW = 0.5 - cornerR;
  const innerH = 0.5 - cornerR;

  let insideSquircle = true;
  if (dx > innerW && dy > innerH) {
    const distSq = (dx - innerW) * (dx - innerW) + (dy - innerH) * (dy - innerH);
    if (distSq > cornerR * cornerR) {
      insideSquircle = false;
    }
  }

  if (!insideSquircle) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Slate gradient background
  let r = 15 + Math.floor(nx * 15);
  let g = 23 + Math.floor(ny * 18);
  let b = 42 + Math.floor(nx * 20);

  // Center gold circle (coin)
  const distToCenter = Math.sqrt((nx - 0.55) * (nx - 0.55) + (ny - 0.5) * (ny - 0.5));
  if (distToCenter < 0.22) {
    // Gold gradient
    r = 245 + Math.floor(nx * 10);
    g = 158 + Math.floor(ny * 30);
    b = 11;
    // Darker rim
    if (distToCenter > 0.20) {
      r = 217;
      g = 119;
      b = 6;
    }
  } else if (nx < 0.32 && ny > 0.24 && ny < 0.76) {
    // Emerald vertical ledger spine
    r = 16;
    g = 185;
    b = 129;
  }

  return [r, g, b, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
const png192 = createPng(192, 192, drawAppIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// Generate 512x512
const png512 = createPng(512, 512, drawAppIcon);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// Generate maskable 512x512 (with safe margins)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), png512);

// Generate Apple Touch Icon 180x180
const png180 = createPng(180, 180, drawAppIcon);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

console.log('Successfully generated all PWA PNG icons in /public!');
