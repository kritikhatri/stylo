# ✨ Stylo

**Your AI stylist, every morning.**

Stylo is an AI automation project that sends you a personalised outfit suggestion every day, picked from your own wardrobe based on the weather, your plans for the day and your personal style.

> 🚧 **Status:** In active development. Follow along with the roadmap below.

---

## 💡 How it works

Every morning, Stylo:

1. **Checks the weather** in your city
2. **Looks at your wardrobe** (clothes you've uploaded and tagged)
3. **Filters out** anything wrong for the weather, in the laundry, or worn recently
4. **Scores colour combinations** to find outfits that go well together
5. **Asks an AI stylist** to pick the best outfit and explain why
6. **Sends it to you on Telegram**, where you can 👍, 👎 or ask for another option

Your feedback helps Stylo learn your style over time.

### Example message

> ☀️ 24°C, sunny · College day
> **Today's outfit:** White linen shirt + beige chinos + white sneakers
> *Why:* Breathable for the heat, neutral palette, smart-casual for presentations
> 👍 Love it · 🔄 Another option · 👎 Not today

---

## 🏗️ Architecture

```
[Daily scheduler]
        ↓
[Context builder] → weather + occasion + wardrobe
        ↓
[Rule filter]     → weather, laundry, recently worn
        ↓
[Colour scorer]   → ranks outfit combinations
        ↓
[AI stylist]      → picks the outfit + explains why
        ↓
[Telegram bot]    → delivers the message
        ↓
[Feedback loop]   → learns your preferences
```

**Design principle:** code handles the filtering, AI handles the taste. This keeps Stylo fast, cheap and reliable.

---

## 🛠️ Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | PostgreSQL, Prisma |
| Scheduling | node-cron |
| Weather | Open-Meteo API |
| AI | Vision LLM (clothing tagging) + LLM (outfit selection) |
| Validation | Zod |
| Delivery | Telegram Bot API |
| Colour matching | outfit-harmony |
| Dashboard | React, Vite |

---

## 🚀 Getting started

### Prerequisites

- Node.js 18 or higher
- npm
- PostgreSQL *(coming soon)*

### Installation

```bash
# Clone the repository
git clone https://github.com/kritikhatri/stylo.git
cd stylo

# Install dependencies
npm install

# Create your environment file
echo "PORT=3000" > .env

# Start the development server
npm run dev
```

Visit `http://localhost:3000/health` to check the server is running.

---

## 📁 Project structure

```
stylo/
├── src/
│   └── index.js      # Server entry point
├── .env              # Environment variables (not committed)
├── .gitignore
├── package.json
└── README.md
```

---

## 🗺️ Roadmap

- [x] Project setup
- [x] Express server with health check
- [ ] PostgreSQL database + Prisma schema
- [ ] Wardrobe API (add, view, edit, delete clothes)
- [ ] Telegram bot integration
- [ ] AI clothing tagging from photos
- [ ] Weather-based outfit filtering
- [ ] Colour-harmony scoring
- [ ] AI stylist recommendations
- [ ] Daily automated delivery
- [ ] Feedback loop (👍 / 👎 / 🔄)
- [ ] React dashboard
- [ ] Deployment

### Future ideas

- 🧳 **Packing mode:** "Goa trip, 4 days" → a full packing list from your wardrobe
- 🔍 **Wardrobe gap finder:** suggests what to buy to unlock more outfits
- 📅 **Calendar sync:** detects interviews, parties and events automatically
- 💬 **WhatsApp delivery**

---

## 👩‍💻 Author

**Kritika Khatri**
GitHub: [@kritikhatri](https://github.com/kritikhatri)

---

## 📄 License

This project is licensed under the ISC License.