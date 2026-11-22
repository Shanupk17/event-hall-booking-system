# GatherHall – Event Hall Booking System

A full-stack Event Hall Booking System that allows users to register and reserve an event hall based on date and time-slot availability. The application prevents duplicate bookings by ensuring that only one registration is accepted per time slot for a particular date.

## 🎥 Project Demo

Watch the complete working demonstration of GatherHall Event Booking System:

▶️ **[Watch Project Demo – GatherHall](https://www.awesomescreenshot.com/video/58567509?key=b67ad64287feaf6d87d6b25d29c26c5e)**

The screen recording demonstrates:
- Event registration form
- User detail validation
- Event date selection
- Morning, Afternoon, and Night slot selection
- Booking availability checking
- Successful registration workflow

## ✨ Features

- **Event Registration:** Users can submit their event booking details through a simple registration form.
- **Date Selection:** Users can select their preferred event date.
- **Three Time Slots:** Each date has three available booking slots:
  - Morning: 07:00 AM – 12:00 PM
  - Afternoon: 12:00 PM – 07:00 PM
  - Night: 07:00 PM – 12:00 AM
- **Real-Time Slot Availability:** Previously booked slots are displayed as unavailable.
- **Duplicate Booking Prevention:** Only one booking is allowed per date and time slot.
- **Form Validation:** Validates user details, email, phone number, event date, and guest count.
- **MongoDB Integration:** Stores registration details in MongoDB.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Svelte | Frontend development |
| HTML5 | Page structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Application logic |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| Vite | Frontend development server |

## 📁 Project Structure

```text
event-hall-booking-system/
│
├── frontend/
│   ├── src/
│   │   ├── App.svelte
│   │   ├── app.css
│   │   └── main.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Booking.js
│   ├── routes/
│   │   └── bookingRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

```bash
cd event-hall-booking-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder using `.env.example` as a reference.

Configure your environment variables:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings/slots?date=YYYY-MM-DD` | Checks slot availability for a selected date |
| POST | `/api/bookings` | Registers a new event hall booking |

### Booking Logic

The application uses a unique compound index in MongoDB on:

```javascript
{ eventDate: 1, timeSlot: 1 }
```

This ensures that two registrations cannot be successfully stored for the same date and time slot, including simultaneous booking attempts.

## 🗄️ Database

**Database:** MongoDB

**Collection:** bookings

The booking records contain:

- Full Name
- Email Address
- Phone Number
- Event Date
- Time Slot
- Guest Count
- Special Requirements
- Created At / Updated At timestamps


## 🚀 Future Enhancements

- Booking confirmation through email
- Admin dashboard for managing reservations
- Booking cancellation functionality
- Event hall availability calendar

## 👩‍💻 Author

**Santha P**

B.Tech – Information Technology | 2025 Graduate

---

*Built as a full-stack development project to demonstrate frontend development, REST API integration, backend validation, and database management.*
