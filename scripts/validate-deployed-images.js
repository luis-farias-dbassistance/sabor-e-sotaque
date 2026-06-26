#!/usr/bin/env node
/*
  validate-deployed-images.js
  Fetches all JS chunks from the deployed CloudFront site,
  extracts every Unsplash image URL, and validates each one with HTTP HEAD.
*/
const https = require('https');
const http = require('http');

const SITE_URL = 'https://d2ml79y2fqfsyi.cloudfront.net';

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

function headCheck(url, timeout = 8000) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const timer = setTimeout(() => { req.destroy(); resolve(false); }, timeout);
    const req = lib.get(url, (res) => {
      clearTimeout(timer);
      // Unsplash may redirect (301/302) — follow one hop
      if ([301, 302].includes(res.statusCode) && res.headers.location) {
        headCheck(res.headers.location, timeout).then(resolve);
      } else {
        resolve(res.statusCode === 200);
      }
    });
    req.on('error', () => { clearTimeout(timer); resolve(false); });
  });
}

(async () => {
  console.log(`🌐 Fetching deployed site: ${SITE_URL}`);

  // 1. Get the main HTML
  const { data: html } = await get(SITE_URL);

  // 2. Extract all JS chunk paths
  const jsChunks = [...new Set(html.match(/_next\/static\/[^"']+\.js/g) || [])];
  console.log(`   Found ${jsChunks.length} unique JS chunks`);

  // 3. Collect all unsplash URLs from HTML + all JS chunks
  const allContent = [html];
  for (const chunk of jsChunks) {
    try {
      const { data } = await get(`${SITE_URL}/${chunk}`);
      allContent.push(data);
    } catch (e) {
      console.warn(`   ⚠️ Could not fetch chunk: ${chunk}`);
    }
  }

  const combined = allContent.join('\n');

  // Extract unsplash URLs (handling HTML-encoded &amp;)
  const rawMatches = combined.match(/https:\/\/images\.unsplash\.com\/photo-[^"'\s\\)}\]]+/g) || [];
  // Decode &amp; → &
  const decoded = rawMatches.map(u => u.replace(/&amp;/g, '&'));
  const uniqueUrls = [...new Set(decoded)];

  console.log(`   Found ${uniqueUrls.length} unique Unsplash image URLs in deployed bundle\n`);

  if (uniqueUrls.length === 0) {
    console.log('⚠️ No image URLs found in the deployed bundle. The deploy may be outdated.');
    process.exit(1);
  }

  // 4. Validate each URL
  let broken = 0;
  let valid = 0;
  for (const url of uniqueUrls) {
    const ok = await headCheck(url);
    if (ok) {
      valid++;
    } else {
      broken++;
      console.log(`   ❌ BROKEN: ${url}`);
    }
  }

  console.log('');
  console.log(`📊 Results: ${valid} valid, ${broken} broken, ${uniqueUrls.length} total`);
  if (broken === 0) {
    console.log('✅ All deployed image URLs are valid!');
  } else {
    console.log('❌ Some images are broken in the deployed version.');
    process.exit(1);
  }
})();
