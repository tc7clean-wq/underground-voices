# Underground Voices - Quick Start Guide

## 🚀 Get Running in 30 Minutes

### Step 1: Install Prerequisites (5 minutes)
1. **Node.js**: Download from [nodejs.org](https://nodejs.org) (choose LTS version)
2. **Git**: Download from [git-scm.com](https://git-scm.com)
3. **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com)

### Step 2: Get API Keys (10 minutes)
1. **Supabase**: Go to [supabase.com](https://supabase.com) → Create project → Copy URL and anon key
2. **NewsAPI**: Go to [newsapi.org](https://newsapi.org) → Get API key

### Step 3: Setup Project (5 minutes)
```bash
# Clone or download the project
cd underground-voices

# Run setup script (Windows)
setup.bat

# Or run setup script (Mac/Linux)
chmod +x setup.sh
./setup.sh
```

### Step 4: Configure Environment (5 minutes)
1. Open `backend/.env` and add your keys:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   JWT_SECRET=your_random_secret
   NEWS_API_KEY=your_news_api_key
   ```

2. Open `frontend/.env` and add:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ENCRYPTION_KEY=your_encryption_key
   ```

### Step 5: Setup Database (3 minutes)
1. Go to your Supabase project
2. Open SQL Editor
3. Copy and paste the contents of `database-setup.sql`
4. Click "Run"

### Step 6: Start the App (2 minutes)
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Step 7: Test It! (5 minutes)
1. Open [http://localhost:3000](http://localhost:3000)
2. Register a new account
3. Try the "Connect the Dots" tool
4. Create an article

## 🎉 You're Live!

Your Underground Voices app is now running locally. To deploy to the internet:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 🆘 Need Help?

- **Full Guide**: See `README.md` for detailed instructions
- **Common Issues**: Check the troubleshooting section
- **Code Issues**: Look at the comments in the code files

## 🔧 What You Built

- ✅ User authentication with profiles
- ✅ Article publishing and verification
- ✅ Visual "Connect the Dots" tool
- ✅ End-to-end encryption
- ✅ Mobile-responsive design
- ✅ Dark mode support
- ✅ Real-time collaboration ready

**Total Time**: ~30 minutes to get running
**Total Cost**: $0 (all free tiers)
**Skill Level**: Complete beginner friendly

---

*This is a complete, production-ready web application that you can use immediately with real journalists!*
