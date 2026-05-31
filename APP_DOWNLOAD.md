# 📱 CLIX HUB - Download as App

Your hosted website is now downloadable as a desktop or mobile app!

## 🚀 Three Ways to Use CLIX HUB

### 1. 🌐 Web App (Easiest - No Installation)
Visit: **https://clixhub.vercel.app**

- No download needed
- Works in any browser
- Click "Install" when prompted (browser will show prompt)
- Works offline once cached

### 2. 💻 Desktop App (Windows, macOS, Linux)

#### How to Get Desktop Version

```bash
# Step 1: Clone and setup
git clone https://github.com/namanartist/clixhub.git
cd clixhub
npm install

# Step 2: Build the app
npm run build
npm run electron-build
```

**Installers created in `dist_electron/` folder:**
- **Windows**: `CLIX_HUB_Setup_x.x.x.exe` - Run this to install
- **Windows**: `CLIX_HUB_x.x.x.exe` - Portable version, no installation needed
- **macOS**: `CLIX_HUB_x.x.x.dmg` - Open and drag to Applications folder
- **Linux**: `CLIX_HUB_x.x.x.AppImage` - Run directly, or install `.deb` package

#### Development Mode (for testing)
```bash
npm run electron-dev
```

### 3. 📲 Mobile App (Android & iOS)

#### Prerequisites
- **Android**: Download [Android Studio](https://developer.android.com/studio)
- **iOS**: Need macOS with Xcode

#### For Android
```bash
npm install
npm run build
npm run mobile:build
npm run mobile:android
```
- Opens Android Studio
- Click **Build** → **Build APK(s)**
- APK ready to install on Android phones

#### For iOS (macOS only)
```bash
npm install
npm run build
npm run mobile:build
npm run mobile:ios
```
- Opens Xcode
- Click **Product** → **Archive**
- Ready to submit to App Store

---

## ✨ Features Available in All Versions

✅ **Offline Support** - App works without internet
✅ **Native App Feel** - Looks and feels like a real app
✅ **Fast Loading** - Cached for instant startup
✅ **QR Scanner** - Scan codes on mobile
✅ **Club Management** - Full functionality everywhere
✅ **Auto Updates** - Latest features included

---

## 📦 Share Your App

After building, you can share:

| Version | How to Share |
|---------|------------|
| **Web** | Share link: https://clixhub.vercel.app |
| **Windows** | Share `.exe` file from `dist_electron/` |
| **macOS** | Share `.dmg` file from `dist_electron/` |
| **Linux** | Share `.AppImage` file from `dist_electron/` |
| **Android** | Upload `.apk` to Google Play Store |
| **iOS** | Submit to Apple App Store |

---

## 🔧 Quick Reference Commands

```bash
# Development
npm run dev                    # Web dev server
npm run electron-dev          # Desktop dev with hot reload

# Production Builds
npm run build                  # Build web version
npm run electron-build        # Build desktop installers
npm run mobile:build          # Prepare mobile build

# Mobile Setup
npm run mobile:android        # Open Android project in Android Studio
npm run mobile:ios            # Open iOS project in Xcode (macOS only)
```

---

## 📋 What Files You Get

After running `npm run electron-build`:

```
dist_electron/
├── CLIX HUB Setup x.x.x.exe       (Windows installer)
├── CLIX HUB x.x.x.exe              (Windows portable)
├── CLIX HUB-x.x.x.dmg              (macOS installer)
├── CLIX HUB-x.x.x.AppImage         (Linux app)
├── clix-hub-x.x.x.deb              (Linux installer)
└── builder-effective-config.yaml   (build config)
```

---

## 🎯 For First-Time Users

### Option 1: Easiest (No Installation)
1. Go to https://clixhub.vercel.app
2. Click browser menu → **Install app** (Chrome, Edge, Safari)
3. App is installed! Click desktop icon to open

### Option 2: Download Desktop App
1. Go to GitHub repo releases
2. Download `.exe` (Windows), `.dmg` (macOS), or `.AppImage` (Linux)
3. Run the file to install or use portably
4. No internet needed after first load

### Option 3: Get from App Store (when published)
- Android: Download from Google Play Store
- iOS: Download from Apple App Store

---

## 💡 Pro Tips

### Add Custom Icons
Place images in `public/`:
- `icon-192.png` - App home screen (192×192px)
- `icon-512.png` - Splash screen (512×512px)
- `icon.png` - Desktop app icon

### Offline Features
The app automatically caches:
- All pages you visit
- Images and styles
- Some API responses

Works offline for previously visited pages!

### Environment Setup
Create `.env` file:
```
VITE_API_URL=https://your-api.com
GEMINI_API_KEY=your-key-here
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **White screen** | Check browser console, verify API endpoints in `.env` |
| **Won't install on Windows** | Try portable `.exe` version instead |
| **macOS won't open** | Right-click → Open (first time only) |
| **Service Worker issues** | Clear browser cache and reinstall |
| **Mobile build fails** | Delete `android/` or `ios/` folder and retry |

---

## 📚 Learn More

- [Electron Documentation](https://www.electronjs.org/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [GitHub Releases Guide](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases)

---

## 🚀 Next Steps

1. **Download & Build**
   ```bash
   npm install && npm run build
   ```

2. **Create Desktop Installer**
   ```bash
   npm run electron-build
   ```

3. **Test on Your Computer**
   - Windows: Run `.exe` from `dist_electron/`
   - macOS: Open `.dmg` and install
   - Linux: Run `.AppImage`

4. **Share with Others**
   - Upload to GitHub Releases
   - Share download links with friends
   - Publish to app stores (optional)

---

**Your app is ready! Pick your preferred version and start using it! 🎉**
