import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Function to generate a valid PNG buffer
function createPng(width, height, drawFn) {
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

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);

    const crcVal = crc32(typeAndData);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal >>> 0, 0);

    return Buffer.concat([len, typeAndData, crcBuf]);
  }

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

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Icon Drawer: Deep Royal Emerald & Gold "Rozana Hisaab" Khata Book with Coin
function drawAppIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;

  // Center coordinate
  const cx = 0.5;
  const cy = 0.5;
  const dx = Math.abs(nx - cx);
  const dy = Math.abs(ny - cy);

  // Squircle boundary (if not maskable; maskable covers full canvas)
  if (!isMaskable) {
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
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Base Background: Rich Royal Emerald Gradient to Dark Slate
  let r = Math.floor(4 + nx * 8 + ny * 10);
  let g = Math.floor(95 + (1 - ny) * 35 - nx * 20);
  let b = Math.floor(60 + ny * 25 + nx * 15);

  // Border gold highlight ring
  if (!isMaskable && (dx > 0.44 || dy > 0.44)) {
    r = 234;
    g = 179;
    b = 8;
    return [r, g, b, 255];
  }

  // Central Ledger Book (bounds: x from 0.22 to 0.78, y from 0.22 to 0.78)
  const inBookX = nx >= 0.22 && nx <= 0.78;
  const inBookY = ny >= 0.22 && ny <= 0.78;

  if (inBookX && inBookY) {
    // Book base: Dark Slate Cover
    r = 15;
    g = 23;
    b = 42;

    // Green Leather Spine on the left (0.22 to 0.35)
    if (nx <= 0.35) {
      r = 16;
      g = 185;
      b = 129;
    } else if (nx >= 0.35 && nx <= 0.365) {
      // Golden Stitched Seam
      r = 245;
      g = 158;
      b = 11;
    }

    // Gold Ribbon bookmark at top
    if (nx >= 0.40 && nx <= 0.46 && ny <= 0.38) {
      r = 234;
      g = 179;
      b = 8;
    }
  }

  // Central Gold Coin with "Rs" / Cash symbol
  // Center at (0.56, 0.54) with radius 0.17
  const coinDx = nx - 0.56;
  const coinDy = ny - 0.54;
  const distToCoin = Math.sqrt(coinDx * coinDx + coinDy * coinDy);

  if (distToCoin < 0.18) {
    // Outer Gold Rim
    if (distToCoin > 0.155) {
      r = 202;
      g = 138;
      b = 4;
    } else if (distToCoin > 0.14) {
      // Dark Inset Ring
      r = 15;
      g = 23;
      b = 42;
    } else {
      // Golden Coin Core
      r = Math.floor(250 - distToCoin * 120);
      g = Math.floor(204 - distToCoin * 200);
      b = Math.floor(21);

      // Stylized "R" pattern on coin
      // Vertical bar of R at coinDx ~ -0.06
      if (coinDx >= -0.07 && coinDx <= -0.045 && coinDy >= -0.09 && coinDy <= 0.09) {
        r = 15;
        g = 23;
        b = 42;
      }
      // Top loop of R
      if (coinDx >= -0.05 && coinDx <= 0.04 && coinDy >= -0.09 && coinDy <= -0.065) {
        r = 15;
        g = 23;
        b = 42;
      }
      if (coinDx >= -0.05 && coinDx <= 0.04 && coinDy >= -0.015 && coinDy <= 0.01) {
        r = 15;
        g = 23;
        b = 42;
      }
      if (coinDx >= 0.02 && coinDx <= 0.045 && coinDy >= -0.09 && coinDy <= 0.01) {
        r = 15;
        g = 23;
        b = 42;
      }
      // Leg of R
      if (coinDx >= -0.02 && coinDx <= 0.045 && coinDy >= 0.00 && coinDy <= 0.09 && Math.abs(coinDx - (coinDy * 0.7 - 0.01)) < 0.02) {
        r = 15;
        g = 23;
        b = 42;
      }
    }
  }

  // Upward Cash Indicator (Green dot)
  const upDx = nx - 0.72;
  const upDy = ny - 0.32;
  if (Math.sqrt(upDx * upDx + upDy * upDy) < 0.035) {
    r = 16;
    g = 185;
    b = 129;
  }

  // Downward Cash Indicator (Red dot)
  const downDx = nx - 0.72;
  const downDy = ny - 0.68;
  if (Math.sqrt(downDx * downDx + downDy * downDy) < 0.035) {
    r = 239;
    g = 68;
    b = 68;
  }

  return [r, g, b, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 192x192
const png192 = createPng(192, 192, (x, y, w, h) => drawAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), png192);

// Generate 512x512
const png512 = createPng(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), png512);

// Generate maskable 512x512 (edge-to-edge for Android adaptive icons)
const pngMaskable512 = createPng(512, 512, (x, y, w, h) => drawAppIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pngMaskable512);

// Generate Apple Touch Icon 180x180
const png180 = createPng(180, 180, (x, y, w, h) => drawAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), png180);

console.log('Successfully generated all brand new PWA PNG icons in /public!');
