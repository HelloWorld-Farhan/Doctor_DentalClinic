<h1 align="center">🦷 Doctor DentalCare Portal - Clinical Management System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"/>
  <img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge" alt="MIT License"/>
</p>

<p align="center">
  <strong>Doctor DentalCare Portal</strong> is an advanced, highly polished clinical management web application built for dental practitioners and modern clinics.<br/>
  It features comprehensive patient charting, interactive 32-tooth odontograms, AI-powered voice-to-text charting, multi-day appointment telemetry,<br/>
  and interactive Power BI clinical analytics to streamline operatory workflows.
</p>

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Doctor Clinical Dashboard** | Practice KPIs bento grid, today's schedule queue, interactive quick note pad with clinical categorization, operatory equipment telemetry, and quick action modals. |
| 🎙️ **AI Voice-to-Text Charting** | Hands-free chairside dictation modal with high-pass drill/suction noise suppression, ADA CDT vocabulary models, and live audio waveform stream simulation. |
| 📅 **Smart Multi-Day Calendar** | Complete monthly calendar with color-coded procedure legends (🟢 Cleanings, 🔵 Root Canals, 🟡 Crowns, 🟣 Orthodontics, 🔴 Surgery) and multi-appointment same-day indicators. |
| ⚡ **AI Operatory Optimization** | Algorithmic chair utilization and wait-time rebalancing modal (`78% → 94%`) with automatic patient notification and emergency cushion buffers. |
| 👥 **Comprehensive Patient Directory** | Demographic telemetry banner, live pagination across 62 pages (2,482 records), and multi-criteria filter & sort popovers. |
| 🦷 **Interactive 32-Tooth Odontogram** | Universal Numbering System dental chart modal for maxillary and mandibular arches with real-time condition tracking (Caries, Crown, Root Canal, Implant). |
| 📝 **Patient Record Editing** | Pre-filled clinical record modal with allergy chips, contact updates, and instant table synchronization with toast feedback. |
| ⭐ **Power BI Reviews & Feedback** | Sentiment analysis gauges, rating distribution histograms with Framer Motion spring animations, and star-level filters calculated from dynamic data. |
| 💬 **Patient Reply Modal** | Clinician response interface with one-click clinical response presets (`Warm Gratitude`, `Wait Time Apology`), character counter, and SMS alerts. |
| 📥 **Export Reports Suite** | Generates PDF, Excel, Power BI (.pbix), and direct CSV downloads (`Dental_Clinic_Reviews_PowerBI_Report.csv`) with simulated compilation progress. |
| ⚙️ **Practice Settings & Governance** | 6 configuration modules: Clinic Info, HIPAA Protocols & Audit Log export, Automated Notifications, Power BI Azure integration, Equipment management, and Voice Charting. |
| 🔔 **Notification Center & Profile** | Real-time clinical alert dropdown with category indicators, unread filters, and Doctor Profile header menu with fast logout and settings access. |
| 🎨 **Clinical Design System** | Healthcare-tailored color palette, crisp typography (Inter), glassmorphic backdrops, portaled modals, and responsive mobile-first layouts. |

---

## 💻 How to Build (For Developers)

Before you begin, ensure you have **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended) and **npm** installed on your system.

### Step 1 — Clone the Repository

```bash
git clone https://github.com/HelloWorld-Farhan/Doctor_DentalClinic.git
cd Doctor_DentalClinic
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Run Locally

```bash
npm run dev
```

> The application will be running live at `http://localhost:5173`.

### Step 4 — Build for Production

```bash
npm run build
```

> Your optimized production bundle will be generated inside the `dist/` directory.

---

## 📁 Project Structure

```text
Doctor_DentalClinic/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.tsx         # Modern sidebar, top navigation, notification center & doctor profile
│   ├── pages/
│   │   ├── Dashboard.tsx      # Clinical dashboard, quick note pad, voice charting setup & equipment telemetry
│   │   ├── Appointments.tsx   # Appointment queue, multi-appointment calendar & AI schedule optimizer
│   │   ├── Patients.tsx       # Patient directory, 62-page pagination, edit record & 32-tooth odontogram
│   │   ├── Reviews.tsx        # Power BI feedback analytics, animated histograms, reply & export modals
│   │   ├── Settings.tsx       # Clinic governance, HIPAA audit logs, Power BI integration & equipment manager
│   │   ├── Login.tsx          # Doctor sign-in portal
│   │   └── Signup.tsx         # Doctor credential registration portal
│   ├── App.tsx                # Client-side routing configuration
│   ├── main.tsx               # App entrypoint
│   └── index.css              # Global styles, clinical design tokens & Tailwind directives
├── tailwind.config.js         # Theme extensions, surface containers & brand colors
├── tsconfig.json              # TypeScript strict configuration
└── package.json               # Dependencies and scripts
```

---

## 👨‍💻 Author

**Farhan Khalid**

📧 [farhankhalid17968@gmail.com](mailto:farhankhalid17968@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/farhan-khalid-117514259/)  
🐙 [GitHub](https://github.com/HelloWorld-Farhan)

---

## 📄 License

```text
MIT License

Copyright (c) 2026 Farhan Khalid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🌟 Support

If you found this clinical portal helpful, please consider giving it a ⭐ on GitHub!

<p align="center">Made with ❤️ in India</p>
