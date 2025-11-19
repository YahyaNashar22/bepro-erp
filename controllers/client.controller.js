import { io } from "../index.js";

import Client from "../models/client.model.js";
import User from "../models/user.model.js";


export const createClient = async (req, res) => {
    try {

        const { name, phone, address, email, company_name } = req.body;

        const client = new Client({ name, phone, address, email, company_name });
        await client.save();

        io.emit("client_created", client);

        return res.status(201).json({ message: "client created", payload: client })
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error creating client", error: error.message });
    }
}


export const getAllClients = async (req, res) => {
    try {

        const clients = await Client.find().sort({ createdAt: -1 });
        return res.status(200).json({ message: "fetched successfully", payload: clients });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error fetching clients", error: error.message });
    }
}


export const editClient = async (req, res) => {
    try {
        const { userId, clientId, name, phone, address, email, company_name } = req.body;

        const user = await User.findById(userId);
        const client = await Client.findById(clientId);

        if (!user) return res.status(404).json({ message: "user does not exist" });
        if (!client) return res.status(404).json({ message: "client does not exist" });

        if (user.role === "admin") {

            const editedClient = await Client.findByIdAndUpdate(clientId, { name, phone, address, email, company_name }, { new: true });

            io.emit("client_updated", editedClient);

            return res.status(200).json({ message: "edited successfully", payload: editedClient });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error editing client", error: error.message });
    }
}


export const deleteClient = async (req, res) => {
    try {
        const { userId, clientId } = req.body;

        const user = await User.findById(userId);
        const client = await Client.findById(clientId);

        if (!user) return res.status(404).json({ message: "user does not exist" });
        if (!client) return res.status(404).json({ message: "client does not exist" });

        if (user.role === "admin") {

            const deletedClient = await Client.findByIdAndDelete(clientId);

            io.emit("client_deleted", deletedClient);

            return res.status(200).json({ message: "deleted successfully", payload: deletedClient });
        } else {

            return res.status(401).json({ message: "Not Authorized" });
        }

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "error deleting client", error: error.message });
    }
}
