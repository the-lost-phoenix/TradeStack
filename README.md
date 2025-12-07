# TradeStack 🚀

**The Professional Stock Trading Terminal**

TradeStack is a comprehensive full-stack stock trading simulation platform designed to provide a real-time, premium trading experience. It features live market data simulations, a secure wallet system, portfolio management, and a robust user dashboard.

Built with performance and user experience in mind, TradeStack incorporates modern design principles, dark mode support, and seamless responsiveness across all devices.

## ✨ Features

- **⚡ Real-Time Market Data**: Live stock price updates via **WebSockets (Socket.io)** with sub-millisecond latency simulation.
- **🔒 Secure Authentication**: Robust authentication via **Clerk**, synced with a MongoDB backend for persistent user data.
- **💳 Secure Wallet System**:
    - Integrated **Virtual IBANs** for every user.
    - **Deposit & Withdraw** functionality with simulated processing.
    - "Escrow" hold simulation for realistic transaction processing.
- **📈 Advanced Trading Interface**:
    - Instant **Buy/Sell** execution.
    - Real-time **Portfolio** valuation.
    - Interactive **Stock Charts** powered by Recharts.
- **👀 Watchlist & Discovery**:
    - Track favorite stocks in a personalized Watchlist.
    - Filter marketplace by Categories (Tech, Auto, Finance, etc.).
    - Real-time search functionality.
- **📜 Transaction History**: Detailed log of all deposits, withdrawals, and trades.
- **🌗 Dark/Light Mode**: Fully responsive UI with a seamless theme toggle.
- **👤 Guest Mode**: Try the platform instantly without creating an account.
- **📱 Mobile Responsive**: Optimized layout for smartphones and tablets.
- **❓ FAQ Section**: Integrated help center for common queries.
- **⏳ Smart Loading**: Custom animations with server wake-up notifications for Render deployments.

## 🛠️ Tech Stack

### Frontend (The Face)
- **React.js**: Component-based UI architecture (Vite).
- **Tailwind CSS**: Modern, utility-first styling for a premium look.
- **Clerk**: Complete user management and authentication.
- **Recharts**: Composable charting library for React.
- **Socket.io-client**: Real-time event-based communication.

### Backend (The Brain)
- **Node.js & Express**: Robust REST API for user management and transactions.
- **Socket.io**: Real-time bidirectional communication server.
- **Mongoose**: Elegant MongoDB object modeling.

### Database (The Memory)
- **MongoDB**: NoSQL database for storing Users, Wallets, Portfolios, and Transaction History.

### Deployment
- **Render**: Hosting for both Client and Server.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Atlas URI)
- **Clerk Account** (for Publishable Key)

### 1. Clone the Repository
```bash
git clone https://github.com/the-lost-phoenix/TradeStack.git
cd TradeStack
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
```

Start the server:
```bash
npm run dev
```
*The server will run on `http://localhost:3001`*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the development server:
```bash
npm run dev
```
*The client will run on `http://localhost:5173`*

## 👨‍💻 Author

**Vijay Netekal**
- AI/ML & Web Development Enthusiast
- [GitHub Profile](https://github.com/the-lost-phoenix)
- [LinkedIn Profile](https://www.linkedin.com/in/vijay-netekal-a603b2280/)

---
