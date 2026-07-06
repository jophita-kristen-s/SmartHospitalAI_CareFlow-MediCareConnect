# 🏥 CareFlow + MediCareConnect v2

A **production-grade** healthcare platform built with React 18, Tailwind CSS, Framer Motion, and Context API.

---

## 🚀 Quick Start

```bash
cd careflow-v2
npm install
npm start
# Opens at http://localhost:3000
```

**Demo credentials:**
- Email: `gopika@careflow.in`
- Password: `Care@123`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Button.js       ← PrimaryButton, OutlineButton, GhostButton, IconButton
│   ├── Card.js         ← Card, GlassCard, StatCard
│   ├── Loader.js       ← Skeleton, DashboardSkeleton, Spinner
│   ├── Modal.js        ← Animated modal wrapper
│   ├── Navbar.js       ← Mobile top bar
│   └── Sidebar.js      ← Desktop sidebar + mobile bottom nav
├── context/
│   ├── AuthContext.js  ← Login, signup, logout, updateUser
│   └── HealthContext.js← Medications, surgeries, reports, appointments
├── pages/
│   ├── Login.js        ← Email/password auth with show/hide
│   ├── Signup.js       ← Validated form + success animation
│   ├── Dashboard.js    ← Vitals, quick actions, medications, appointment
│   ├── Emergency.js    ← SOS button + ambulance tracking
│   ├── Appointments.js ← 4-step booking wizard (Puducherry hospitals)
│   ├── MedicalRecords.js ← QR code, medications CRUD, surgery CRUD
│   ├── ReportTracking.js ← Report validity with countdown
│   └── Profile.js      ← Full profile: insurance, ESIC, medical info
├── services/
│   └── mockService.js  ← All mock data
├── styles/
│   └── theme.js        ← Design tokens + Framer Motion variants
├── App.js              ← Router with auth guards
└── index.css           ← Full design system (card-premium, glass-card, btn-*)
```

---

## ✨ Feature Summary

| Feature | Details |
|---|---|
| 🔐 Auth | Login + Signup with validation, session persistence |
| 📱 Responsive | Sidebar on desktop, bottom nav on mobile |
| 🚨 SOS | Countdown → ripple → ambulance step tracker |
| 📅 Appointments | Hospital picker (JIPMER, GH, Manipal, Altius) + 4-step wizard |
| 💊 Records | QR code, medications CRUD, surgery CRUD with modals |
| 📋 Reports | Upload UI, expiry countdown, green/yellow/red status |
| 🛡️ Profile | Blood group picker, Insurance + ESIC toggles, allergy badges |
| ✨ Animations | Page transitions, card hover, modal spring, SOS pulse |
| 🎨 Design | Outfit + DM Sans fonts, cyan/teal theme, glassmorphism |

---

## 🎨 Design System

CSS classes available globally:
- `.card-premium` — dark glass card with border + shadow
- `.glass-card` — lighter glass surface
- `.btn-primary` — teal gradient button
- `.btn-danger` — red SOS button
- `.btn-outline` — bordered outline button
- `.btn-ghost` — subtle ghost button
- `.input-modern` — dark styled input
- `.gradient-text` — cyan gradient text
- `.mesh-bg` — ambient background gradient
- `.skeleton` — shimmer loading animation
- `.sos-pulse`, `.sos-ripple` — emergency animations
- `.badge-valid`, `.badge-expiring`, `.badge-expired` — status badges
- `.tag` — cyan tag pill
- `.label-sm` — small uppercase label
- `.section-title` — section heading

---

## 🛠 Tech Stack

- **React 18** — functional components + hooks
- **React Router v6** — protected routes + guards
- **Framer Motion 11** — animations everywhere
- **Tailwind CSS** — utility-first styling
- **Lucide React** — icons (valid imports only)
- **Context API** — AuthContext + HealthContext

---

Made with ❤️ for Indian healthcare · Hackathon-ready UI
