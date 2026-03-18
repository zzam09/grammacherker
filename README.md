# GrammarCheck 🖊️
### **SIMPLE SEPARATED FOLDER STRUCTURE**

A clean, modern grammar checker with **two separate projects** - Frontend (Vercel) and Backend (Cloudflare).

---

## **📁 YOUR TWO SEPARATE PROJECTS:**

```
📁 YOUR-COMPUTER/
│
├── 📁 grammarcheck-frontend/          ← THIS GOES TO VERCEL
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── GrammarChecker.vue     ← Your UI
│   │   │
│   │   ├── 📁 services/                ← 👈 IMPORTANT: CONNECTION HERE
│   │   │   └── api.js                   ← FETCHES JSON FROM BACKEND
│   │   │
│   │   ├── App.vue                     ← Main app
│   │   └── main.js                      ← Entry point
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── 📁 grammarcheck-backend/           ← THIS GOES TO CLOUDFLARE
    │
    ├── 📁 src/
    │   ├── index.js                     ← 👈 MAIN WORKER FILE
    │   └── grammar-service.js            ← Your logic
    │
    ├── package.json
    ├── wrangler.toml                     ← Cloudflare config
    └── .env.example                      ← Local development only
```

---

## **🔌 THE CONNECTION MAP**

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOW THEY CONNECT                          │
└─────────────────────────────────────────────────────────────────┘

📁 FRONTEND (Vercel)                                 📁 BACKEND (Cloudflare)
────────────────────                                 ───────────────────────
                                                    
src/services/api.js                                src/index.js
        │                                                   ▲
        │                                                   │
        │  🔌 CONNECTION #1                                  │
        └───────> FETCH to Cloudflare URL ──────────────────┘
                 "https://grammarcheck-api.worker.dev"
                         
                         ↓
                    Returns JSON
                         ↓
                         
📁 FRONTEND                                    📁 BACKEND
GrammarChecker.vue                             
   ▲                                            src/index.js
   │                                                   │
   │  Receives JSON                                    │
   └───────────────────────────────────────────────────┘
   
   🔌 CONNECTION #2 (Optional - Add Later)
   Backend to Database
   
   src/index.js ─────> Neon Database
                      (via env.DATABASE_URL)
```

---

## **� DEPLOYMENT STEPS**

### **STEP 1: Deploy Backend to Cloudflare**
```bash
cd grammarcheck-backend

# Install wrangler
npm install

# Login to Cloudflare
npx wrangler login

# Deploy
npx wrangler deploy

# 👀 After deploy, it shows your URL:
# https://grammarcheck-api.your-name.workers.dev
# COPY THIS URL!
```

### **STEP 2: Update Frontend with Backend URL**
```javascript
// grammarcheck-frontend/src/services/api.js
// PASTE YOUR CLOUDFLARE URL HERE 👇

const API_URL = 'https://grammarcheck-api.your-name.workers.dev'  // ← YOUR URL
```

### **STEP 3: Deploy Frontend to Vercel**
```bash
cd grammarcheck-frontend

# Install dependencies
npm install

# Build
npm run build

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import project
# 3. Select grammarcheck-frontend folder
# 4. Click Deploy
```

---

## **✨ WHAT YOU NOW HAVE**

✅ **Two separate folders** - Frontend and Backend independent  
✅ **Frontend only needs JSON** - Just fetches from backend endpoint  
✅ **Clear connection points** - Only 2 places to connect  
✅ **Cloudflare handles backend** - Your API runs globally  
✅ **Vercel handles frontend** - Your Vue app is live  
✅ **Everything FREE** - No cost to run  

---

## **� THE ONLY 2 THINGS YOU NEED TO CONNECT**

### **Connection #1: Frontend → Backend**
```javascript
// In frontend/src/services/api.js
const API_URL = 'https://your-cloudflare-worker.workers.dev'  // ← PUT YOUR URL HERE
```

### **Connection #2 (Optional): Backend → Database**
```bash
# In Cloudflare Dashboard:
# Add environment variable DATABASE_URL with your Neon connection string
```
