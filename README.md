# ASKME+ 💬
### Ask Anything. Stay Anonymous.

A full-stack anonymous Q&A platform inspired by NGL. Users generate a personal link, share it, and receive anonymous messages from friends.

---

## 🚀 Features

- 🔗 **Personal anonymous link** — `yoursite.com/username`
- 💬 **Inbox system** — receive & manage anonymous messages
- 📸 **Story card generator** — reply with shareable visual cards
- 📊 **Analytics dashboard** — track clicks, messages, shares
- 🛡️ **Moderation** — profanity filter, rate limiting, report system
- 🌙 **Dark / Light mode**
- 📱 **Mobile-first design** — glassmorphism UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Framer Motion, Recharts |
| Backend | Flask, SQLAlchemy, Flask-JWT-Extended |
| Database | MySQL |
| Auth | JWT tokens, BCrypt password hashing |
| Moderation | better-profanity, custom rate limiting |

---

## 📁 Project Structure

```
askme-plus/
├── frontend/          # React app
│   └── src/
│       ├── pages/     # App pages
│       ├── components/# Reusable components
│       ├── context/   # Auth & Theme context
│       └── utils/     # API client
├── backend/           # Flask API
│   ├── app.py         # Main app
│   ├── models.py      # Database models
│   └── routes/        # API routes
├── database/
│   └── schema.sql     # MySQL schema
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. MySQL Database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run the server
python app.py
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/messages/send/:username` | Send anonymous message |
| GET | `/api/messages/inbox` | Get inbox (auth) |
| PUT | `/api/messages/:id/read` | Mark as read |
| DELETE | `/api/messages/:id` | Delete message |
| POST | `/api/messages/:id/report` | Report message |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Get stats |
| GET | `/api/analytics/chart?days=7` | Get chart data |
| POST | `/api/analytics/track-click/:username` | Track link click |
| POST | `/api/analytics/track-share` | Track story share |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/` | Get profile |
| PUT | `/api/profile/update` | Update profile |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/user/:username` | Get public profile |

---

## 🔐 Security

- Passwords hashed with BCrypt
- JWT authentication for protected routes
- Rate limiting: max 5 messages per IP per hour
- Profanity filtering on all messages
- XSS protection via React's built-in escaping

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Sign up |
| `/inbox` | Message inbox (auth) |
| `/share` | Share your link (auth) |
| `/insights` | Analytics (auth) |
| `/profile` | Profile & settings (auth) |
| `/:username` | Public anonymous Q&A page |

---

## 🎨 Design

- **Font**: Syne (headings) + DM Sans (body)
- **Colors**: Purple/Pink gradient palette
- **Theme**: Glassmorphism dark UI with light mode support
- **Animations**: Framer Motion transitions throughout

---

## 📄 License

MIT © ASKME+ 2024
