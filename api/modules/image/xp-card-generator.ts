import { bot } from '../../server';
import ImageGenerator from './image-generator';
import { createCanvas } from 'canvas';
import { User } from 'discord.js';
import { MemberDocument } from '../../models/member';
import { UserDocument } from '../../models/user';

export class XPCardGenerator extends ImageGenerator 
{
    discordUser: User;

    constructor(private user: UserDocument, private rank: number) 
    {
        super();

        this.discordUser = bot.users.cache.get(user._id);
        if (!this.discordUser)
            throw Error('Could not find Discord user!');
        if (this.discordUser.bot)
            throw Error('Bots don\'t have XP cards!');
    }

    async generate(savedMember: MemberDocument)
    {
        if (!savedMember)
            throw Error('Guild user cannot be null!');

        const canvas = createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const backgroundURL = '';

        await this.addBackgroundToCanvas(context, canvas, backgroundURL);
        await this.addXPBar(context, canvas, savedMember);
        this.addUserText(context, canvas, false);
        await this.addImageToCanvas(context, this.discordUser.displayAvatarURL);

        return canvas.toBuffer();
    }
    private addUserText(context, canvas, withRep = true) 
    {
        let card = this.user.xpCard;

        // context.fillStyle = card.primary || '#3c316b';
        // context.font = '32px Roboto, sans-serif';
        // const rank = `#${this.rank}`;
        // context.fillText(rank, canvas.width / 2.5, canvas.height / 2.5);

        // context.fillStyle = card.UsernameColour || '#ffffff';
        // context.font = super.applyText(canvas, this.discordUser.username);        
        // context.fillText(this.discordUser.username, canvas.width / 2.7, canvas.height / 1.6);

        // context.fillStyle = card.DiscriminatorColour || '#99AAB5';
        // context.font = super.applyText(canvas, `#${this.discordUser.discriminator}`);  

        context.fillText(`#${this.discordUser.discriminator}`, canvas.width / 2.7 + context.measureText(this.discordUser.username), canvas.height / 1.6);
    }
    private async addXPBar(context, canvas, guildUser)
    {
        let card = this.user.xpCard;

        // context.fillStyle = card.EXPColour || '#45377C';
        context.font = '32px Roboto, sans-serif';

        const sizeOffset = 325;
        const position = { x: 275, y: canvas.height * 0.775 };
        const height = 25;        

        // context.fillStyle = card.BackgroundColour || '#45377C';
        // context.fillRect(position.x, position.y, canvas.width - sizeOffset - 1, height);
        // context.fillStyle = card.ForegroundColour || '#482F5D';
        // context.fillRect(position.x, position.y, (canvas.width - sizeOffset) * (exp / nextLevelEXP), height);

        // context.fillStyle = card.EXPColour || '#45377C';
        // context.font = '16px Roboto, sans-serif';
        // context.fillText(exp, canvas.width / 2.5, canvas.height / 1.35);
        
        // context.fillStyle = '#0F0F0F';        
        // context.fillText(`/`, canvas.width / 2.5 + context.measureText(exp).width, canvas.height / 1.35);

        // context.fillStyle = card.EXPColour || '#45377C';
        // context.fillText(`${nextLevelEXP}XP`, canvas.width / 2.5 + context.measureText(`${exp}/`).width, canvas.height / 1.35);
        // context.fillText(`LEVEL ${level}`, canvas.width / 2.5, canvas.height / 1.175);
    }
}
