const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');
 
const PORT = 3000;
const CF_ACCOUNT_ID = 'af151226883e7da921dcd49a8f0acb6a';
const CF_API_TOKEN  = 'cfut_sBvZkUjVFb9hEJtah351iR05RmIt0NleEJHZAFqsa29c02ca';
const CF_MODEL      = '@cf/meta/llama-3-8b-instruct';
 
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
 
  // Proxy to Cloudflare Workers AI
  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const parsed = JSON.parse(body);
 
      // Build messages array with system prompt
      const messages = [];
      if (parsed.system) messages.push({ role: 'system', content: parsed.system });
      messages.push(...parsed.messages);
 
      const payload = JSON.stringify({ messages });
 
      const options = {
        hostname: 'api.cloudflare.com',
        path: `/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${CF_MODEL}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CF_API_TOKEN}`
        }
      };
 
      const proxyReq = https.request(options, proxyRes => {
        let data = '';
        proxyRes.on('data', chunk => data += chunk);
        proxyRes.on('end', () => {
          try {
            const cf = JSON.parse(data);
            // Cloudflare returns result.response
            const text = cf?.result?.response || 'No response from AI.';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            // Return in same format as before so index.html works unchanged
            res.end(JSON.stringify({ content: [{ type: 'text', text }] }));
          } catch(e) {
            res.writeHead(500); res.end(JSON.stringify({ error: 'Parse error' }));
          }
        });
      });
 
      proxyReq.on('error', err => {
        res.writeHead(500); res.end(JSON.stringify({ error: err.message }));
      });
 
      proxyReq.write(payload);
      proxyReq.end();
    });
    return;
  }
 
  // Serve static files
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
});
 
server.listen(PORT, () => {
  console.log(`\n🐾 PawHome running at http://localhost:${PORT}`);
  console.log(`   Using Cloudflare Workers AI (${CF_MODEL})\n`);
});
