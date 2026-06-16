# 🐾 PawHome AI — Pet Adoption App

A modern pet adoption web app powered by Cloudflare Workers AI (Llama 3.2).

## Features
- Browse 8 adoptable pets — dogs, cats, rabbits, birds
- Filter by type, age, and traits
- AI chat assistant to help find your perfect pet
- Pet detail modal with adoption process guide
- Dark mode support

## Setup

### 1. Clone the repo
```
git clone https://github.com/yourusername/pawHome.git
cd pawHome/pawHome
```

### 2. Add your Cloudflare credentials to `server.js`
```js
const CF_ACCOUNT_ID = 'your_account_id';
const CF_API_TOKEN  = 'your_api_token';
```

### 3. Run the server
```
node server.js
```

### 4. Open in Chrome
```
http://localhost:3000
```

## Tech Stack
- Vanilla HTML, CSS, JavaScript
- Node.js (no dependencies!)
- Cloudflare Workers AI — `@cf/meta/llama-3.2-3b-instruct`

## Getting Cloudflare API Credentials
1. Go to [cloudflare.com](https://cloudflare.com) → Sign up free
2. Dashboard → Workers AI → REST API
3. Create API Token → Workers AI template
4. Copy Account ID from your dashboard URL

## Project Structure
```
pawHome/
├── index.html    # Frontend — UI + AI chat
├── server.js     # Node.js server — Cloudflare AI proxy
└── README.md     # This file
```

## Screenshots
> Coming soon

## License
MIT
