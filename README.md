Here’s a clean, polished, professional **README.md** version of your text — formatted, structured, and GitHub-ready:

---

# 🌍 TerraScope

**TerraScope** is an advanced, AI-powered country explorer application. It leverages **Google's Gemini 2.5 Flash** model to generate comprehensive, real-time profiles for any country on Earth — combining generative text, structured data, economic insights, and live news into a beautiful glassmorphic user interface.

---

## ✨ Features

### 🔹 AI Intelligence

* **AI-Generated Country Profiles** using Gemini 2.5 Flash
* Cultural insights, fun facts, demographics, and more
* Multi-language content generation (EN, ES, FR, DE, JP)

### 🔹 Interactive Exploration

* **Dynamic Leaflet maps** (country position + capital city)
* **Comparison Mode** for up to 3 countries side-by-side
* **Deep linking**: Shareable URLs for any country profile

### 🔹 Real-Time Data Integrations

* **Weather** (Open-Meteo): Temperature, humidity, wind, conditions
* **News**: Top 5 headlines powered by Gemini Search Grounding
* **Exchange Rates**: Live currency conversion (Open Exchange Rates API)

### 🔹 Economic Intelligence

* Interactive **GDP growth** & **inflation** charts (last 5 years)
* Visualized using Recharts

### 🔹 Travel & Safety

* Global **Safety Risk Scores** (0–5)
* Emergency contacts: Police, Ambulance, Fire
* Health risks, visa requirements, regional advisories

### 🔹 Theming & UI

* Persistent **Dark/Light Mode**
* Fully responsive **glassmorphic** design
* Built with Tailwind CSS + Lucide Icons

---

## 🛠️ Tech Stack

**Core:**

* React 19
* TypeScript

**AI & Data:**

* Google GenAI SDK (Gemini 2.5 Flash)

**Styling & Visualization:**

* Tailwind CSS
* Recharts
* Leaflet
* Lucide React

**External APIs:**

* Open-Meteo (Weather)
* Open Exchange Rates (Currency)
* FlagCDN (Flags)

---

## 🚀 Getting Started

### ✔ Prerequisites

* Node.js **v16 or higher**
* A **Google Gemini API Key**

---

### 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/terrascope.git
cd terrascope
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

Create a `.env` file in the root:

```env
API_KEY=your_google_gemini_api_key_here
```

> Ensure your API key has access to **Gemini 2.5 Flash** and **Google Search Grounding**.

Run the development server:

```bash
npm run dev
```

Open the app in your browser:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
src/
├── App.tsx                # Main layout & app controller
├── services/
│   ├── geminiService.ts   # AI generation + translation + news
│   ├── weatherService.ts  # Weather fetcher
│   └── exchangeRateService.ts
├── components/            # UI components (Cards, Maps, Viewer)
├── translations.ts        # Multi-language dictionary
└── types.ts               # TypeScript interfaces
```

---

## 🧩 How It Works

1. **User searches for a country**
2. **Gemini 2.5 Flash** generates:

   * Coordinates
   * Demographics
   * Economy
   * Culture
   * Landmarks
3. Parallel fetches begin:

   * Weather (Open-Meteo)
   * Currency rates (OXR)
   * News (Gemini Search Grounding)
4. UI renders dynamic cards, charts, and maps using Tailwind CSS.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

If you want, I can also:
✅ Add badges (tech stack, license, stars, etc.)
✅ Make it more futuristic
✅ Add screenshots or a demo section
Just tell me!
