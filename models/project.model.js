import mongoose from "mongoose";

import { ProjectType } from "../enums/projectTypeEnum.js";
import { ProjectSourceEnum } from "../enums/projectSourceEnum.js";
import { ProjectStatusEnum } from "../enums/projectStatusEnum.js";
import { CurrencyEnum } from "../enums/currencyEnum.js";

const { Schema, model } = mongoose;

const projectSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: false },
        type: { type: String, enum: ProjectType, required: true, default: "sale" },
        source: { type: String, enum: ProjectSourceEnum, required: true, default: "not selected" },
        source_info: { type: String, required: false },
        status: { type: String, enum: ProjectStatusEnum, required: true, default: "new" },
        price: { type: String, required: true, default: 0 },
        quotation: { type: String, required: false },
        files: [{ type: String, required: false }],
        currency: { type: String, required: true, enum: CurrencyEnum, default: "USD" },
        responsible: { type: Schema.Types.ObjectId, ref: "User", required: true },
        client_id: [{ type: Schema.Types.ObjectId, ref: "Client", required: true }]
    },
    {
        timestamps: true
    }
);

const Project = model("Project", projectSchema);
export default Project;