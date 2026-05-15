# 🚨 TROUBLESHOOTING GUIDE - Qutebrowser Dashboard

## ✅ What's Fixed

The template syntax issue has been resolved. The dashboard is now served as a **static HTML file** instead of a Jinja2 template, so it will work immediately.

---

## 🚀 How to Start

### Method 1: Using the script (Recommended)
```bash
cd ~/.config/qutebrowser
./start-dashboard-server.sh
```

### Method 2: Manual start
```bash
cd ~/.config/qutebrowser
python3 -m http.server 9999
```

### Method 3: In qutebrowser
```qute
:o http://localhost:9999/dashboard/index.html
```

---

## 🔍 If Dashboard Doesn't Show

### Step 1: Check if server is running
```bash
ps aux | grep "python3 -m http.server 9999"
```

**Expected output:** Process running with PID

### Step 2: Check if port 9999 is open
```bash
netstat -tulpn | grep 9999
# OR
ss -tulpn | grep 9999
```

**Expected output:** `tcp LISTEN 0 5 0.0.0.0:9999`

### Step 3: Test URL directly
```bash
curl -I http://localhost:9999/dashboard/index.html
```

**Expected output:** `HTTP/1.0 200 OK`

### Step 4: View server logs
```bash
tail -f /tmp/qute-dashboard-server.log
```

Look for errors or success messages.

### Step 5: Check qutebrowser configuration
```bash
grep -n "default_page\|start_pages" ~/.config/qutebrowser/config.py
```

**Expected:**
```python
c.url.default_page = 'http://localhost:9999/dashboard/index.html'
c.url.start_pages = ['http://localhost:9999/dashboard/index.html']
```

### Step 6: Test in qutebrowser
1. Open qutebrowser
2. Press `:o http://localhost:9999/dashboard/index.html`
3. Press Enter
4. Open console with `:jseval console.log('test')`
5. Check for errors

---

## 🐛 Common Errors

### Error 1: "404 Not Found"
**Cause:** File not found on server
**Solution:**
```bash
ls -la ~/.config/qutebrowser/dashboard/index.html
ls -la ~/.config/qutebrowser/dashboard/js/
```

### Error 2: "Module not found"
**Cause:** JavaScript modules not accessible
**Solution:**
```bash
curl http://localhost:9999/dashboard/js/main.js
```

### Error 3: "Template syntax error"
**Cause:** HTML still using Jinja2 syntax
**Solution:**
```bash
grep -n "include" ~/.config/qutebrowser/dashboard/index.html
```
Should return no results or only CSS/HTML.

### Error 4: "JavaScript disabled"
**Cause:** JavaScript not enabled in qutebrowser
**Solution:**
```python
# In ~/.config/qutebrowser/config.py
c.content.javascript.enabled = True
```

### Error 5: "Black screen / blank page"
**Cause:** CSS not loading
**Solution:**
```bash
curl -I http://localhost:9999/dashboard/css/main.css
```

---

## 🧪 Test All Components

### Test 1: Server response
```bash
curl -I http://localhost:9999/dashboard/index.html
```

### Test 2: CSS loading
```bash
curl -I http://localhost:9999/dashboard/css/main.css
```

### Test 3: JavaScript loading
```bash
curl -I http://localhost:9999/dashboard/js/main.js
```

### Test 4: All module files
```bash
cd ~/.config/qutebrowser/dashboard
for file in js/*.js; do
    echo "Testing $file..."
    curl -I http://localhost:9999/dashboard/$file
done
```

---

## 🔄 Restart Everything

If all else fails, restart completely:

```bash
# Kill all Python processes
pkill -9 python3

# Start fresh server
cd ~/.config/qutebrowser
./start-dashboard-server.sh
```

---

## 📊 Dashboard URLs

- **Main Dashboard:** http://localhost:9999/dashboard/index.html
- **Direct Access:** http://localhost:9999/dashboard/
- **Terminal Commands:** Open in qutebrowser: `:o http://localhost:9999/dashboard/index.html`

---

## 🔧 Qutebrowser Configuration

### Default Page
```python
c.url.default_page = 'http://localhost:9999/dashboard/index.html'
```

### Start Pages
```python
c.url.start_pages = ['http://localhost:9999/dashboard/index.html']
```

### JavaScript Enabled
```python
c.content.javascript.enabled = True
```

### WebGL Enabled
```python
c.content.webgl = True
```

---

## 🎯 Quick Test

### In qutebrowser console:
```qute
:jseval console.log('Dashboard loaded')
```

**Should see:** `Dashboard loaded` in console

### Check if modules loaded:
```qute
:jseval console.log(typeof initDashboard)
```

**Should see:** `function`

---

## 📝 Notes

- Server runs on port **9999**
- Log file: `/tmp/qute-dashboard-server.log`
- Dashboard location: `~/.config/qutebrowser/dashboard/`
- All files must be accessible by qutebrowser user

---

## ✨ If Still Not Working

1. **Clear qutebrowser cache:**
   ```qute
   :config-read
   :history-clear
   ```

2. **Open in incognito mode:**
   ```qute
   :o -r http://localhost:9999/dashboard/index.html
   ```

3. **Check browser console:**
   - In qutebrowser: `:jseval console.log($0)`
   - Or open external browser: `:spawn --detach chromium http://localhost:9999/dashboard/index.html`

4. **Verify file permissions:**
   ```bash
   ls -la ~/.config/qutebrowser/dashboard/
   ```

---

## 📞 Support

If problems persist, check:
- Server logs: `tail -100 /tmp/qute-dashboard-server.log`
- Qutebrowser log: `~/.local/share/qutebrowser/logs/qutebrowser.log`
- System logs: `journalctl -xe`

---

## 🎉 Success!

When everything works, you should see:
- ✅ Cyberpunk dashboard with S1BGr0up branding
- ✅ 3 clocks (Local, London, Thailand)
- ✅ System stats (CPU, RAM)
- ✅ Interactive terminal
- ✅ TODO list
- ✅ Network visualization
- ✅ Particle effects

**Enjoy your dashboard! 🚀**
