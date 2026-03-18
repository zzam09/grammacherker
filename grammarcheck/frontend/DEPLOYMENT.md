# 🚀 Deployment Guide

## Development Setup (Current)

### Frontend (Vue.js)
```bash
cd frontend
pnpm install
pnpm dev
# → http://localhost:8080
```

### Backend (Node.js + Neon PostgreSQL)
```bash
cd backend
pnpm install
pnpm dev
# → http://localhost:3001
```

## Production Deployment Options

### 1. **Vercel** (Recommended for Frontend)
```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel --prod
```

### 2. **Netlify** (Alternative Frontend)
```bash
# Build
pnpm build

# Deploy dist/ folder to Netlify
```

### 3. **Railway/Heroku** (Backend)
```bash
# Set environment variables
DATABASE_URL=your-neon-connection-string
NODE_ENV=production

# Deploy
railway up
# or
heroku deploy
```

### 4. **Docker** (Full Stack)
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
```

### Backend (.env.production)
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
NODE_ENV=production
PORT=3001
```

## Performance Optimizations

### Frontend
- ✅ Bundle splitting with Vite
- ✅ Tree-shaking enabled
- ✅ Lazy loading ready
- ✅ Service worker support

### Backend
- ✅ Connection pooling
- ✅ SSL enabled
- ✅ CORS configured
- ✅ Helmet security headers

## Monitoring

### Frontend
- Vercel Analytics (if using Vercel)
- Google Analytics
- Sentry for error tracking

### Backend
- Railway/Heroku logs
- Neon database metrics
- Custom health endpoints

## Security

### Frontend
- HTTPS enforced
- CSP headers via Vite
- No sensitive data in frontend

### Backend
- SSL required for database
- Helmet middleware
- CORS limited to frontend domain
- Environment variables for secrets

---

**🎯 Current Setup**: Both servers running locally for development
**🌐 Next Step**: Choose deployment platform based on your needs
