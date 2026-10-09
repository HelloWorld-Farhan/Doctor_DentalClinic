# 🦷 Dental Clinic Pro — Doctor Clinical Portal & Power BI Analytics

An advanced, responsive, and modern clinical management web application designed for dental practices and healthcare professionals. Built with **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

---

## 🌟 Key Modules & Features

### 1. 📊 Doctor Clinical Dashboard (`/dashboard`)
- **Key Practice KPIs Bento Grid**: Real-time tracking of Today's Appointments, Pending Reviews, Clinical Satisfaction, and Active Patient Volume.
- **Active Schedule Queue**: Today's appointment timeline with status tracking, patient badges, and procedure indicators.
- **Portaled Quick Action Modals**: 
  - **Register New Patient**: Demographics, contact info, and birth date capture.
  - **Schedule Appointment**: Date, time, procedure, and operatory chair assignment.
- **Real-Time Notification Center**: Interactive dropdown displaying equipment alerts, new bookings, and chart notifications.

### 2. 📅 Clinical Appointments & Telemetry (`/dashboard/appointments`)
- **Queue Management**: Filter appointments by status (`All`, `Confirmed`, `In Progress`, `Completed`, `Cancelled`) with live keyword search.
- **Power BI Peak Density Telemetry**: Interactive animated histogram visualizing hourly chair capacity and patient density.
- **Procedure Distribution Breakdown**: Visual allocation of Cleanings, Root Canals, Crowns, and Orthodontics.
- **Portaled Schedule Appointment Modal**: Full-screen backdrop blur modal for booking new chair sessions.
- **Interactive Calendar Widget**: Month selector with active day highlights.

### 3. 👥 Patient Directory & Treatment Flow (`/dashboard/patients`)
- **Power BI Demographics Banner**: Live sync telemetry tracking active patient volume, preventive care ratios, insurance verification percentages, and flagged medical alerts.
- **Patient Table**: Comprehensive records with patient ID, age, gender, last visit, primary procedure, medical alert tags, and insurance status.
- **Portaled "Add New Patient" Modal**:
  - Structured 3-step clinical form:
    1. **Personal & Contact Info**: First/Last name, DOB, gender, phone, email.
    2. **Clinical Care & Medical Alerts**: Procedure selector, custom allergy input, and **interactive one-click alert chips** (`Latex Allergy`, `Penicillin`, `Hypertension`, `Diabetic`, `None Reported`).
    3. **Insurance Provider & Billing**: Provider selector (`Delta Dental`, `MetLife`, `Cigna`, `Guardian`, `Self-Pay`) and policy subscriber ID.
  - **Portaled to `document.body`**: Ensures full-screen backdrop coverage with zero header clipping.
- **Patient History Drawer**: Slide-out timeline detailing past endodontic treatments, periodontal probing depths, and radiographs.

### 4. ⭐ Doctor Reviews & Advanced Feedback (`/dashboard/reviews`)
- **Power BI Clinical Analytics Header**:
  - Overall rating card with star distribution breakdown (5★, 4★, 3★).
  - NLP Sentiment Analysis breakdown (Positive, Neutral, Critical).
  - Punctuality & Wait-Time adherence gauge.
  - Pain management and gentle care comfort scores.
- **Animated Power BI Trend Histogram**:
  - 6-month rating distribution bars with smooth Framer Motion spring entry animations.
  - Interactive hover tooltips displaying review count, average stars, and Net Promoter Score (NPS).
  - Clickable month selection highlighting active performance period.
- **Dynamic Star & Status Filtering**:
  - Filter tabs with live counts calculated directly from dummy data: `All Reviews (12)`, `5 Stars (8)`, `4 Stars (4)`, `Needs Reply (7)`.
- **Live Sorting Dropdown**:
  - `Most Recent`: Chronological timestamp sorting.
  - `Highest Rating`: 5-star to 1-star reviews.
  - `Lowest Rating`: Critical reviews first.
- **Working Pagination System**:
  - Full pagination controls (`1`, `2`, `3`, `4`, `Previous`, `Next`).
  - Smooth page transitions and dynamic counter (`Showing 1-3 of 12 reviews`).
- **Portaled "Reply to Patient" Modal**:
  - Displays original patient feedback card, procedure tag, and star rating.
  - **Quick Clinical Response Templates**: Clickable presets (`Warm Gratitude`, `Wait Time Apology`, `Post-Procedure Check-in`, `Gentle Care Acknowledgment`).
  - Textarea for Dr. Sharma's official clinical response with character counter.
  - Push & SMS notification toggle for the patient.
  - Updates review card in real-time with doctor response badge.
- **Portaled "Export Reports" Modal**:
  - Format selection: PDF Executive Summary, Excel (.xlsx) Matrix, CSV Raw Data, Power BI Data Pack (.pbix).
  - Animated progress simulation: progress bar cycling from 0% to 100% with real-time compilation steps.
  - **Automated CSV Download**: Generates and downloads `Dental_Clinic_Reviews_PowerBI_Report.csv` directly to the client machine upon completion.

### 5. ⚙️ Practice Settings (`/dashboard/settings`)
- Practice branding, operatory chair configuration, staff access controls, and notification preferences.

### 6. 🔐 Authentication (`/` and `/signup`)
- Doctor Sign In with demo credentials.
- Multi-step Doctor Registration with clinical credential validation.

---

## 🛠️ Technology Stack

- **Framework**: React 18 (Vite SPA)
- **Language**: TypeScript (Strict typing)
- **Styling**: Tailwind CSS with custom clinical theme tokens (`surface-container-low`, `primary`, `on-surface`, `tertiary`, `secondary`)
- **Animations**: Framer Motion (page transitions, spring height graphs, layout animations, portaled modals)
- **Icons**: Google Material Symbols Outlined
- **Typography**: Inter (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/HelloWorld-Farhan/Doctor_DentalClinic.git

# Navigate to the project directory
cd Doctor_DentalClinic

# Install dependencies
npm install
```

### Development
```bash
# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
Doctor_DentalClinic/
├── public/
├── src/
│   ├── components/
│   │   └── Layout.tsx         # Responsive sidebar, header & notifications
│   ├── pages/
│   │   ├── Dashboard.tsx      # Clinical workspace & bento metrics
│   │   ├── Appointments.tsx   # Appointment queue & peak density graphs
│   │   ├── Patients.tsx       # Demographics directory & patient modal
│   │   ├── Reviews.tsx        # Power BI reviews, pagination, reply & export modals
│   │   ├── Settings.tsx       # Clinic configuration & preferences
│   │   ├── Login.tsx          # Doctor sign-in portal
│   │   └── Signup.tsx         # Doctor registration portal
│   ├── App.tsx                # Client-side routing configuration
│   ├── main.tsx               # App entrypoint
│   └── index.css              # Global styles & Tailwind directives
├── tailwind.config.js         # Design system tokens & color definitions
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 📄 License

This project is licensed under the MIT License.
