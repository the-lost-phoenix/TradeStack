import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, default: "User" }, // NEW: Store Name
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for Google Login users
    avatar: { type: String },   // NEW: Store Profile Pic URL
    walletBalance: { type: Number, default: 5000.00 },
    virtualIban: { type: String, unique: true },
    portfolio: [{
        stockCode: String,
        quantity: Number,
        averageBuyPrice: Number
    }],
    subscribedStocks: {
        type: [String],
        default: ["GOOG", "TSLA", "AMZN", "META", "NVDA"]
    }
});

const User = mongoose.model("User", userSchema);
export default User;