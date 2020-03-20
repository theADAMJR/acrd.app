import { model, Schema, Document } from 'mongoose';
import { ModuleString } from '../modules/module';
import { PermissionString } from 'discord.js';

const commandSchema = new Schema({
    name: String,
    summary: String,
    cooldown: Number,
    precondition: String
});

export interface CommandDocument extends Document {
    name: string;
    summary: string;
    module: ModuleString;
    usage: string;
    precondition?: PermissionString;
}

export const SavedCommands = model<CommandDocument>('command', commandSchema);
