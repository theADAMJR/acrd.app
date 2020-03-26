export default class Leveling {
    static xpInfo(messages: number, xpPerMessage: number) { // TODO: replace with getLevel
        const xp = xpPerMessage * messages;

        const preciseLevel = (-75 + Math.sqrt(Math.pow(75, 2) - 300 * (-150 - xp))) / 150;
        const level = ~~preciseLevel;

        const xpForNextLevel = this.xpForNextLevel(level, xp);
        return { level, exp: xp, xpForNextLevel };
    }
    private static xpForNextLevel(currentLevel: number, xp: number) { // TODO: remove - will be handled in webapp xp card
        return ((75 * Math.pow(currentLevel + 1, 2)) + (75 * (currentLevel + 1)) - 150) - xp;
    }
}
