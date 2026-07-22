# Mongoose Shop

This repository includes an Express/Mongoose backend and a static frontend served from `public/index.html`.

## Features

- User registration and login
- JWT-protected routes
- Category creation with image upload
- Product creation with multiple images, colors, tags, and shipping options
- Product pagination
- Image upload testing endpoints

## Frontend

The frontend is available at `public/index.html` and uses JavaScript to interact with the API.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `DB_URL`, `MY_SECRET`, `PORT`, and `IMG_PATH`.
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node app.js
```

5. Open the app in a browser at `http://localhost:3000`.

