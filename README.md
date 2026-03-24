# Time Zone — frontend + backend (separate ports)

## Ports

| Part       | Port  | Command                          |
|-----------|-------|----------------------------------|
| **Backend** (API)  | **3000** | `cd backend && npm run dev`      |
| **Frontend** (UI)  | **5173** | `cd frontend && npm run dev`     |

Open the app at **http://localhost:5173** (login, register, timezone viewer).  
API calls go to `/api/...` on the frontend origin; **Vite proxies** them to `http://localhost:3000`.

## First-time setup

From the project root:

```bash
npm run install:all
```

Or install each folder:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Run (two terminals)

**Terminal 1 — backend**

```bash
cd backend
npm run dev
```

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

## Environment (optional)

### Backend (`backend/`)

- `PORT` — default `3000`
- `JWT_SECRET` — secret for signing JWTs (set in production)
- `FRONTEND_ORIGIN` — default `http://localhost:5173` (CORS)

### Frontend (`frontend/`)

- `VITE_API_BASE` — usually **empty** in dev (uses Vite proxy).  
  For production, if the UI is hosted separately from the API, set e.g. `VITE_API_BASE=http://your-api-host:3000` and rebuild.

## Project layout

```
backend/     Express API only
frontend/    Vite static UI (HTML/JS)
```

User data for auth is stored in `backend/data/users.json` (dev-friendly; use a real database for production).

## Android app (Play Store path)

The frontend is configured with Capacitor and an Android project at `frontend/android`.

### 1) Prepare API for mobile

- Deploy the backend to a public HTTPS URL (Render/Railway/VPS/etc).
- Set `VITE_API_BASE` for production builds:

```bash
cd frontend
copy .env.production.example .env.production
```

Then edit `.env.production` with your real API URL.

### 2) Build Android app

```bash
cd frontend
npm run android:build
```

### 3) Open in Android Studio

```bash
cd frontend
npm run android:open
```

In Android Studio:
- Set app icon, app name, version code/version name
- Build > Generate Signed Bundle / APK > Android App Bundle (AAB)

### 4) Publish to Play Store

- Create Google Play Console developer account
- Create a new app listing
- Upload the signed `.aab`
- Fill Store Listing, Content rating, Data safety, App access, and privacy policy
- Complete required testing track (internal/closed) and submit for review

## Deploy to public URL (ready configs added)

This repository now includes:

- `render.yaml` for backend deploy on Render
- `netlify.toml` for frontend deploy on Netlify

### Deploy backend (Render)

1. Push code to GitHub.
2. In Render, create a new **Web Service** from this repo (Render can auto-detect `render.yaml`).
3. After deploy, copy your backend URL:
   - Example: `https://time-zone-backend.onrender.com`
4. Test quickly:
   - `https://time-zone-backend.onrender.com/api/timezones/all` should return 401 (expected because auth is required).

### Deploy frontend (Netlify)

1. In Netlify, create a new site from this repo.
2. It will read `netlify.toml` (base `frontend`, publish `dist`).
3. Set environment variable in Netlify:
   - `VITE_API_BASE=https://<your-render-backend>.onrender.com`
4. Redeploy.

### Final CORS update on backend

In Render env vars, set:

- `FRONTEND_ORIGINS=https://<your-netlify-site>.netlify.app`

If needed, include multiple origins (comma-separated), for example:

`https://myapp.netlify.app,http://localhost:5173`

### Local verification command

To verify production frontend against your public backend before Android build:

```bash
cd frontend
npm run build
npm run preview
```
