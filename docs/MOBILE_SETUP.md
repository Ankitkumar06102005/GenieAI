# 📱 Contexta AI - Mobile & Local Setup Guide

Learn how to run **Contexta AI** on your laptop or PC and use it on your **smartphone (Android & iOS)** as an installed, full-screen mobile app with responsive UI.

---

## ⚡ Quick Architecture Overview

When you run Contexta AI on your computer:
1. **FastAPI Backend (`port 8000`)** & **Vite React Frontend (`port 5173`)** both bind to `0.0.0.0` (all network interfaces).
2. The frontend automatically detects your computer's local Wi-Fi IP address and communicates with the backend seamlessly—even when loaded from your smartphone browser!
3. Contexta AI includes a **PWA (Progressive Web App)** manifest, enabling you to install it to your phone's home screen just like a native app.

---

## 📋 Prerequisites

On your Computer / Laptop:
- **Node.js** (v18 or v20+) — [Download Node.js](https://nodejs.org)
- **Python** (3.10, 3.11, or 3.12) — [Download Python](https://python.org)
- **Git** — [Download Git](https://git-scm.com)
- Your phone and computer must be connected to the **same Wi-Fi network**.

---

## 🛠️ Step-by-Step Setup

### Step 1: Clone the GitHub Repository
Open your terminal (PowerShell, Command Prompt, or Terminal on macOS/Linux) and run:
```bash
git clone https://github.com/<your-username>/contexta-ai.git
cd contexta-ai
```

### Step 2: Configure Environment Variables
Create your `.env` file in the project root:
```bash
cp .env.example .env
```
Open `.env` and paste your Gemini API key (get a free key from [Google AI Studio](https://aistudio.google.com)):
```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

---

### Step 3: Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

---

### Step 4: Find Your Computer's Local Wi-Fi IP Address

Your smartphone needs to know your computer's address on your local network.

#### On Windows:
1. Open PowerShell or Command Prompt.
2. Run:
   ```cmd
   ipconfig
   ```
3. Look for your active connection (**Wireless LAN adapter Wi-Fi** or **Ethernet adapter**).
4. Find the **IPv4 Address**:
   ```text
   IPv4 Address. . . . . . . . . . . : 192.168.1.45   <--- (Example IP)
   ```

#### On macOS / Linux:
Run:
```bash
ifconfig | grep "inet "
# Or on Linux:
ip addr show
```
Note down your local IP (typically looks like `192.168.x.x` or `10.0.x.x`).

---

### Step 5: Start the Servers

#### Option A: 1-Click Launch (Windows)
Double-click `start.bat` in the project root. It will:
- Bind FastAPI backend to `0.0.0.0:8000`
- Bind Vite frontend to `0.0.0.0:5173`
- Display your local IP address in the console

#### Option B: Manual Launch (Any OS)
In terminal 1 (Backend):
```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## 📲 Accessing on Your Smartphone

1. Ensure your smartphone is connected to the **same Wi-Fi** as your laptop.
2. Open your mobile browser:
   - **Android:** Open **Google Chrome**.
   - **iPhone / iPad:** Open **Safari**.
3. In the address bar, type:
   ```text
   http://<YOUR-PC-IP>:5173
   ```
   *(Example: `http://192.168.1.45:5173`)*
4. The responsive Contexta AI mobile interface will load immediately!

---

## 📥 How to Install on Smartphone ("Add to Home Screen")

Contexta AI is fully configured as a Progressive Web App (PWA). You can install it on your device so it behaves like a native application without browser URL bars.

### 🤖 On Android (Google Chrome):
1. Navigate to `http://<YOUR-PC-IP>:5173`.
2. Tap the **Three Dots (⋮)** in the top-right corner of Chrome.
3. Tap **"Install app"** (or **"Add to Home screen"**).
4. Tap **Install** when prompted.
5. Contexta AI will now appear on your home screen and in your app drawer with its official dark-mode app icon!

### 🍏 On iOS / iPhone / iPad (Apple Safari):
1. Navigate to `http://<YOUR-PC-IP>:5173` in **Safari**.
2. Tap the **Share button** (the square with an arrow pointing upward at the bottom of the screen).
3. Scroll down the share menu and select **"Add to Home Screen"**.
4. Confirm the name (**Contexta AI**) and tap **Add** in the top-right corner.
5. Tap the new Contexta AI icon on your iPhone home screen to launch in standalone, full-screen mode!

---

## 👤 Real Account Login & Profile Setup

1. On your phone, tap **"Get Started"** or **"Sign In"**.
2. Switch to **"Create Account"** if you are a new user.
3. Enter your **Full Name**, **Major or Degree** (e.g. *Computer Science*, *Biomedical Engineering*, *Pre-Med*), **Email**, and **Password**.
4. Tap **Create Account**:
   - Your name, major, and personal streak are securely persisted in your device session.
   - Your sidebar greeting and study dashboard will reflect your real profile name and degree.
   - Your Knowledge Vault begins completely clean and empty—no fake placeholder files. You can upload your own PDFs, lecture slides, and notes directly from your phone's camera or file manager!

---

## 🔧 Troubleshooting & Tips

### ❓ "Site cannot be reached" or loading times out on phone
- **Check Windows Firewall:** When you first start Uvicorn or Node, Windows Defender Firewall may display a popup asking to allow network access. Ensure you check **Private networks** and click **Allow access**.
- **Same Wi-Fi Network:** Confirm your phone hasn't switched to mobile data (5G/LTE). Both devices must be on the same router/SSID.
- **AP Isolation:** Some college or public Wi-Fi networks block device-to-device communication ("Client Isolation"). If you are on a university campus or hotel Wi-Fi, you can turn on your phone's **Personal Hotspot**, connect your laptop to it, and use the hotspot gateway IP.

### 🌐 Accessing Away From Home (Remote Access)
If you want to use Contexta AI on your phone while away from home (on mobile data or at the library):
1. Install [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) or [ngrok](https://ngrok.com).
2. Run:
   ```bash
   ngrok http 5173
   ```
3. Open the secure HTTPS ngrok URL on your phone from anywhere in the world!
