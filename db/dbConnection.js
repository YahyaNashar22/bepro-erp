import mongoose from "mongoose";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function databaseConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI, clientOptions);
        console.log("Successfully connected to MongoDB!");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
    }
    finally {
        await mongoose.disconnect();
    }
}

export default databaseConnection;