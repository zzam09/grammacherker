# GrammarCheck 🖊️
### Modern Grammar Checker with Vue.js + Node.js + shadcn/ui

A clean, modern grammar checker web app with real-time analysis, beautiful UI, and history tracking.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Git

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/zzam09/grammacherker.git
cd grammarcheck

# Install all dependencies
pnpm run install:all
```

### 3. Development
```bash
# Start both frontend and backend
pnpm run dev

# Or start individually
pnpm run dev:frontend  # http://localhost:8080
pnpm run dev:backend   # http://localhost:3001
```

### 4. Production
```bash
# Build frontend
pnpm run build

# Start backend
pnpm run start
```

---

## 📁 Project Structure

```
grammarcheck/
├── frontend/                 # Vue.js + shadcn/ui
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── lib/            # Utilities
│   │   ├── stores/         # Pinia stores
│   │   ├── App.vue         # Main app
│   │   └── main.js         # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Node.js + Express
    ├── src/
    │   ├── controllers/     # API controllers
    │   ├── routes/         # API routes
    │   ├── services/       # Business logic
    │   └── server.js       # Server entry
    ├── package.json
    └── .env.example
```

---

## 🎨 Features

- ✅ **Modern UI** with shadcn/ui components
- ✅ **Real-time grammar checking**
- ✅ **History tracking** with localStorage
- ✅ **Responsive design** for all devices
- ✅ **Dark mode support**
- ✅ **Professional animations**
- ✅ **TypeScript support**
- ✅ **Clean architecture**

---

## 🛠 Tech Stack

### Frontend
- **Vue.js 3** - Progressive framework
- **shadcn/ui** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Pinia** - State management
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database (via Neon)
- **Axios** - HTTP client

---

## 📝 Environment Setup

### Backend (.env)
```env
DATABASE_URL=your_neon_database_url
PORT=3001
NODE_ENV=development
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
pnpm build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
pnpm start
# Set DATABASE_URL environment variable
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful components
- [Vue.js](https://vuejs.org/) - The progressive framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Neon](https://neon.tech/) - PostgreSQL hosting
