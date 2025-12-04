# TradeStack 🚀

**The Professional Stock Trading Terminal**

TradeStack is a full-stack stock trading simulation platform designed to provide a real-time trading experience. It features live market data updates, a secure wallet system with Virtual IBANs, and an escrow-based settlement simulation.

## ✨ Features

- **⚡ Real-Time Market Data**: Live stock price updates via **WebSockets (Socket.io)** with sub-millisecond latency simulation.
- **💳 Secure Wallet System**: Integrated **Virtual IBANs** for every user. Deposits are simulated with an "Escrow" hold period for realism.
- **📈 Instant Execution**: Buy and Sell stocks instantly. Portfolio updates in real-time.
- **📜 Transaction History**: Track all your deposits, withdrawals, and trades with a detailed history view.
- **🌗 Dark/Light Mode**: Fully responsive UI with a seamless theme toggle.
- **🔒 Secure Authentication**: User registration and login with MongoDB storage.

## 🛠️ Tech Stack

### Frontend (The Face)
- **React.js**: Component-based UI architecture.
- **Tailwind CSS**: Modern, utility-first styling for a premium look.
- **Vite**: Blazing fast build tool.

### Backend (The Brain)
- **Node.js & Express**: Robust REST API for user management and transactions.
- **Socket.io**: Real-time bidirectional communication for stock prices.

### Database (The Memory)
- **MongoDB**: NoSQL database for storing Users, Wallets, Portfolios, and Transaction History.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Atlas URI)

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
node index.js
```
*The server will run on `http://localhost:3001`*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```
*The client will run on `http://localhost:5173`*

## 👨‍💻 Author

**Vijay Netekal**
- AI/ML Engineer & Full Stack Developer
- [GitHub Profile](https://github.com/the-lost-phoenix)
- [LinkedIn Profile](https://www.linkedin.com/in/vijay-netekal-a603b2280/)

---

