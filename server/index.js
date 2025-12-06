import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import { INITIAL_STOCKS } from './data/stockData.js'; // <--- 1. IMPORT DATA

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["https://trade-stack-omega.vercel.app", "http://localhost:5173", "https://www.tradestack.io"],
        methods: ["GET", "POST"]
    }
});

// --- MARKET SIMULATION ---
// 2. Use the imported list as our memory
let stocks = [...INITIAL_STOCKS];

function updatePrices() {
    stocks = stocks.map(stock => {
        // More volatile logic for 100 stocks to make it look "alive"
        const volatility = 0.02; // 2% up or down
        const changePercent = (Math.random() * volatility * 2) - volatility;
        const newPrice = Math.max(0.01, stock.price * (1 + changePercent)); // Never go below 0.01

        return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2))
        };
    });
}

// Heartbeat
setInterval(() => {
    updatePrices();
    io.emit("stock_update", stocks);
}, 1000);


// --- API ROUTES ---

function generateIBAN() {
    const bankCode = "ES";
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `${bankCode}89-${randomNum}-BANK`;
}

// 3. NEW ROUTE: Get All Available Stocks (For the Marketplace)
app.get("/api/stocks", (req, res) => {
    res.json(stocks); // Send the full list of 100 companies
});

// ... (Previous imports and setup remain the same) ...

// 1. REGISTER (Updated to accept Name)
app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body; // Accept Name
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({
            name: name || "Trader",
            email,
            password,
            virtualIban: generateIBAN(),
            subscribedStocks: ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
        });

        await newUser.save();
        res.json({ message: "Account Created!", user: newUser });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN (Standard)
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ message: "Login Success", user });
    } else {
        res.status(400).json({ message: "Invalid Credentials" });
    }
});

// 2.5 GOOGLE LOGIN (Mock/Simulated Route)
// 2.5 CLERK USER SYNC
app.post("/api/auth/sync", async (req, res) => {
    try {
        const { clerkId, email, name, avatar, createIfMissing } = req.body;

        // Try to find by Clerk ID first
        let user = await User.findOne({ clerkId });

        // If not found, try by Email (Migration from old email login to Clerk)
        if (!user) {
            user = await User.findOne({ email });
            // If found by email, link the Clerk ID to this existing user
            if (user) {
                user.clerkId = clerkId;
                if (avatar) user.avatar = avatar; // Update avatar if available
                await user.save();
            }
        }

        // If still not found...
        if (!user) {
            if (createIfMissing) {
                // EXPLICIT CREATION
                user = new User({
                    clerkId,
                    name: name || "Trader",
                    email,
                    avatar,
                    virtualIban: generateIBAN(),
                    subscribedStocks: ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
                });
                await user.save();
            } else {
                // DO NOT CREATE
                return res.status(404).json({ error: "User not found" });
            }
        }

        res.json({ message: "Sync Success", user });
    } catch (err) {
        console.error("Sync Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ... (Rest of the file remains the same) ..

app.post("/api/transaction", async (req, res) => {
    const { userId, amount, type } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const cleanAmount = Number(amount);

        if (type === 'DEPOSIT') {
            if (cleanAmount < 1000) return res.status(400).json({ message: "Minimum deposit is $1000" });
            user.walletBalance += cleanAmount;
            user.history.push({ type: 'DEPOSIT', amount: cleanAmount });
        } else {
            if (user.walletBalance < cleanAmount) return res.status(400).json({ message: "Insufficient Funds" });
            user.walletBalance -= cleanAmount;
            user.history.push({ type: 'WITHDRAW', amount: cleanAmount });
        }

        await user.save();
        res.json({ message: "Transaction Successful", balance: user.walletBalance, history: user.history });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/trade", async (req, res) => {
    const { userId, stockCode, quantity, type } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const currentStock = stocks.find(s => s.code === stockCode);
        if (!currentStock) return res.status(400).json({ message: "Invalid Stock Code" });

        const realPrice = currentStock.price;
        const cost = realPrice * quantity;

        if (type === 'BUY') {
            if (user.walletBalance < cost) return res.status(400).json({ message: "Insufficient Funds" });
            user.walletBalance -= cost;
            const existingStock = user.portfolio.find(p => p.stockCode === stockCode);
            if (existingStock) existingStock.quantity += quantity;
            else user.portfolio.push({ stockCode, quantity, averageBuyPrice: realPrice });

            user.history.push({ type: 'BUY', stockCode, quantity, price: realPrice, amount: cost });
        }
        else if (type === 'SELL') {
            const existingStock = user.portfolio.find(p => p.stockCode === stockCode);
            if (!existingStock || existingStock.quantity < quantity) return res.status(400).json({ message: "Not enough shares" });
            user.walletBalance += cost;
            existingStock.quantity -= quantity;
            if (existingStock.quantity === 0) user.portfolio = user.portfolio.filter(p => p.stockCode !== stockCode);

            user.history.push({ type: 'SELL', stockCode, quantity, price: realPrice, amount: cost });
        }

        await user.save();
        res.json({ message: "Trade Executed", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/subscribe", async (req, res) => {
    const { userId, subscribedStocks } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.subscribedStocks = subscribedStocks;
        await user.save();
        res.json({ message: "Subscriptions Updated", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

});

app.delete("/api/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if user has stocks
        const hasStocks = user.portfolio.some(p => p.quantity > 0);
        if (hasStocks) {
            return res.status(400).json({ message: "You must sell all your shares before deleting your account." });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.emit("stock_update", stocks);
    socket.on("disconnect", () => console.log("User Disconnected", socket.id));
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MONGODB CONNECTED!"))
    .catch((err) => console.log("DB ERROR:", err));

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});