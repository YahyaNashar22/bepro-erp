import mongoose from "mongoose";

const { Schema, model } = mongoose;

const clientSchema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        company_name: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const Client = model("Client", clientSchema);
export default Client;