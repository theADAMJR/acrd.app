import { model, Schema, Document } from 'mongoose';

const memberSchema = new Schema({
    id: String,
    guildId: String,
    xpMessages: { type: Number, default: 0 },
    warnings: { type: Array, default: [] }
});

export interface MemberDocument extends Document {
    id: string;
    guildId: string;
    xpMessages: number;
    warnings: Warning[];
}

export interface Warning {
    reason: string;
    instigatorId: string;
    at: Date;
}

export const SavedMember = model<MemberDocument>('member', memberSchema);