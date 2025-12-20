# 🚀 Setup Guide - Connect Frontend to Backend

## Quick Setup (3 Steps)

### Step 1: Deploy Backend to Railway

1. **Go to Railway:** https://railway.app
2. **Create New Project** → Name it `medical-inventory-system`
3. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Wait for deployment
   - Copy the `DATABASE_URL` from Variables tab

4. **Deploy Backend API:**
   - Click "New" → "GitHub Repo"
   - Select: `ashu13579/medical-inventory-backend`
   - Railway will auto-detect and deploy

5. **Set Environment Variables:**
   Go to your backend service → Variables → Add:
   ```
   DATABASE_URL=<paste-your-postgres-url>
   JWT_SECRET=your-super-secret-key-change-this-now
   NODE_ENV=production
   FRONTEND_URL=https://ashu13579.github.io/medical-inventory-system
   PORT=3000
   ```

6. **Initialize Database:**
   - Go to service → Settings
   - Under "Deploy" section
   - Add custom start command temporarily: `npm run init-db && npm start`
   - Click "Deploy"
   - After first successful deployment, change back to: `npm start`

7. **Generate Domain:**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - You'll get something like: `https://medical-inventory-backend-production.up.railway.app`
   - **COPY THIS URL** - you'll need it!

---

### Step 2: Update Frontend Configuration

1. **Edit `index.html`** in this repository
2. **Find line 23** (API_CONFIG section)
3. **Replace** the baseURL with your Railway backend URL:

```javascript
const API_CONFIG = {
    // Replace with your actual Railway backend URL:
    baseURL: 'https://medical-inventory-backend-production.up.railway.app/api',
};
```

**Example:**
```javascript
// Before:
baseURL: 'https://your-backend-url.railway.app/api',

// After (use YOUR actual URL):
baseURL: 'https://medical-inventory-backend-production-abc123.up.railway.app/api',
```

4. **Commit and push** the change
5. GitHub Pages will auto-deploy in ~1 minute

---

### Step 3: Test the Connection

1. **Open your frontend:** https://ashu13579.github.io/medical-inventory-system/
2. **Login with:**
   - Username: `admin`
   - Password: `admin123`
3. **If login works** → ✅ Backend connected!
4. **Add a product** to test database connection
5. **Make a sale** to test full workflow

---

## 🔧 Troubleshooting

### Issue: "Login failed" or "Network error"

**Check:**
1. Backend URL is correct in `index.html` (line 23)
2. Backend is running on Railway (check deployment logs)
3. Database is initialized (check Railway logs for "Database initialization complete")
4. CORS is configured (FRONTEND_URL in backend env vars)

**Fix:**
```javascript
// Make sure your API_CONFIG looks like this:
const API_CONFIG = {
    baseURL: 'https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app/api',
    // NOT localhost, NOT placeholder text
};
```

---

### Issue: "Session expired" immediately after login

**Check:**
1. JWT_SECRET is set in Railway backend
2. Backend logs for authentication errors

**Fix:**
- Go to Railway → Backend Service → Variables
- Ensure `JWT_SECRET` is set to a strong random string

---

### Issue: Database connection errors

**Check:**
1. PostgreSQL service is running
2. DATABASE_URL is correctly set
3. Database is initialized

**Fix:**
```bash
# In Railway backend service shell:
npm run init-db
```

---

### Issue: CORS errors in browser console

**Check:**
1. FRONTEND_URL in backend matches your GitHub Pages URL exactly
2. No trailing slash differences

**Fix:**
```
FRONTEND_URL=https://ashu13579.github.io/medical-inventory-system
```

---

## 🎯 What's Connected Now

### ✅ Real Backend Features:
- **Authentication:** JWT tokens, secure login/logout
- **Products:** CRUD operations with PostgreSQL
- **Sales:** Real transactions with FIFO stock deduction
- **Dashboard:** Live statistics from database
- **Batches:** Expiry tracking and batch management
- **Reports:** Real-time data from backend

### ✅ Frontend Features:
- **Auto-login:** Remembers your session
- **Loading states:** Shows spinners during API calls
- **Error handling:** User-friendly error messages
- **Stock validation:** Prevents overselling
- **Real-time updates:** Data refreshes after operations
- **PDF invoices:** Generate from real sale data

---

## 📊 API Endpoints Being Used

| Feature | Endpoint | Method |
|---------|----------|--------|
| Login | `/api/auth/login` | POST |
| Get User | `/api/auth/me` | GET |
| List Products | `/api/products` | GET |
| Add Product | `/api/products` | POST |
| List Categories | `/api/categories` | GET |
| Create Sale | `/api/sales` | POST |
| List Sales | `/api/sales` | GET |
| Dashboard Stats | `/api/reports/dashboard` | GET |

---

## 🔐 Security Features

- ✅ JWT authentication with 24h expiration
- ✅ Token stored in localStorage
- ✅ Auto-logout on token expiry
- ✅ Secure password hashing (bcrypt)
- ✅ CORS protection
- ✅ SQL injection prevention
- ✅ Rate limiting on backend

---

## 🚀 Next Steps

1. **Change default password:**
   - Login as admin
   - Go to backend database
   - Update admin password

2. **Add more products:**
   - Use the "Add Product" button
   - Products are now stored in PostgreSQL

3. **Make real sales:**
   - Sales are recorded in database
   - Stock is automatically deducted
   - Invoices are generated

4. **Monitor your system:**
   - Check Railway logs for errors
   - Monitor database usage
   - Track API performance

---

## 📱 Mobile Access

Your app is now accessible from any device:
- **Desktop:** Full features
- **Tablet:** Responsive layout
- **Mobile:** Touch-optimized

Just visit: https://ashu13579.github.io/medical-inventory-system/

---

## 🆘 Need Help?

**Backend Issues:**
- Check Railway deployment logs
- Verify environment variables
- Test database connection

**Frontend Issues:**
- Check browser console for errors
- Verify API_CONFIG URL
- Clear browser cache

**Database Issues:**
- Re-run `npm run init-db`
- Check PostgreSQL service status
- Verify DATABASE_URL

---

## 🎉 You're All Set!

Your full-stack medical inventory system is now:
- ✅ Frontend deployed on GitHub Pages
- ✅ Backend deployed on Railway
- ✅ PostgreSQL database running
- ✅ Real-time data synchronization
- ✅ Secure authentication
- ✅ Production-ready

**Start using your system now!** 🚀

---

**Questions?** Open an issue on GitHub or check the deployment logs on Railway.