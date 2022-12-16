"use strict";
// REMINDER: 8 is admin in Discord, but 1 in Accord 
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermString = exports.PermissionTypes = void 0;
var PermissionTypes;
(function (PermissionTypes) {
    let General;
    (function (General) {
        General[General["VIEW_CHANNELS"] = 1024] = "VIEW_CHANNELS";
        // MANAGE_NICKNAMES = 512, // change number
        // CHANGE_NICKNAME = 256, // change number
        General[General["MANAGE_INVITES"] = 256] = "MANAGE_INVITES";
        General[General["CREATE_INVITE"] = 128] = "CREATE_INVITE";
        General[General["KICK_MEMBERS"] = 64] = "KICK_MEMBERS";
        // BAN_MEMBERS = 32, // change number
        General[General["MANAGE_CHANNELS"] = 16] = "MANAGE_CHANNELS";
        General[General["MANAGE_ROLES"] = 8] = "MANAGE_ROLES";
        General[General["MANAGE_GUILD"] = 4] = "MANAGE_GUILD";
        // VIEW_AUDIT_LOG = 2, // change number
        General[General["ADMINISTRATOR"] = 1] = "ADMINISTRATOR";
    })(General = PermissionTypes.General || (PermissionTypes.General = {}));
    let Text;
    (function (Text) {
        // ADD_REACTIONS = 2048 * 16,
        // MENTION_EVERYONE = 2048 * 8,
        Text[Text["READ_MESSAGES"] = 8192] = "READ_MESSAGES";
        Text[Text["MANAGE_MESSAGES"] = 4096] = "MANAGE_MESSAGES";
        Text[Text["SEND_MESSAGES"] = 2048] = "SEND_MESSAGES";
    })(Text = PermissionTypes.Text || (PermissionTypes.Text = {}));
    let Voice;
    (function (Voice) {
        Voice[Voice["MOVE_MEMBERS"] = 262144] = "MOVE_MEMBERS";
        Voice[Voice["MUTE_MEMBERS"] = 131072] = "MUTE_MEMBERS";
        Voice[Voice["SPEAK"] = 65536] = "SPEAK";
        Voice[Voice["CONNECT"] = 32768] = "CONNECT";
    })(Voice = PermissionTypes.Voice || (PermissionTypes.Voice = {}));
    PermissionTypes.All = Object.assign(Object.assign(Object.assign({}, General), Text), Voice);
    PermissionTypes.defaultPermissions = PermissionTypes.General.VIEW_CHANNELS
        | PermissionTypes.General.CREATE_INVITE
        | PermissionTypes.Text.SEND_MESSAGES
        | PermissionTypes.Text.READ_MESSAGES
        // | PermissionTypes.Text.ADD_REACTIONS
        | PermissionTypes.Voice.CONNECT
        | PermissionTypes.Voice.SPEAK;
})(PermissionTypes = exports.PermissionTypes || (exports.PermissionTypes = {}));
function getPermString(integer) {
    var _a, _b;
    return (typeof integer === 'string')
        ? (_b = (_a = Object
            .entries(PermissionTypes.All)
            .filter(([k, v]) => Number.isInteger(+v))
            .find(([k, v]) => k === integer || v === integer)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : ''
        : integer.toString();
}
exports.getPermString = getPermString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMudHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGVybWlzc2lvbnMudHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLG9EQUFvRDs7O0FBRXBELElBQWlCLGVBQWUsQ0E0Qy9CO0FBNUNELFdBQWlCLGVBQWU7SUFDOUIsSUFBWSxPQWFYO0lBYkQsV0FBWSxPQUFPO1FBQ2pCLDBEQUFvQixDQUFBO1FBQ3BCLDJDQUEyQztRQUMzQywwQ0FBMEM7UUFDMUMsMkRBQW9CLENBQUE7UUFDcEIseURBQW1CLENBQUE7UUFDbkIsc0RBQWlCLENBQUE7UUFDakIscUNBQXFDO1FBQ3JDLDREQUFvQixDQUFBO1FBQ3BCLHFEQUFnQixDQUFBO1FBQ2hCLHFEQUFnQixDQUFBO1FBQ2hCLHVDQUF1QztRQUN2Qyx1REFBaUIsQ0FBQTtJQUNuQixDQUFDLEVBYlcsT0FBTyxHQUFQLHVCQUFPLEtBQVAsdUJBQU8sUUFhbEI7SUFDRCxJQUFZLElBTVg7SUFORCxXQUFZLElBQUk7UUFDZCw2QkFBNkI7UUFDN0IsK0JBQStCO1FBQy9CLG9EQUF3QixDQUFBO1FBQ3hCLHdEQUEwQixDQUFBO1FBQzFCLG9EQUFvQixDQUFBO0lBQ3RCLENBQUMsRUFOVyxJQUFJLEdBQUosb0JBQUksS0FBSixvQkFBSSxRQU1mO0lBQ0QsSUFBWSxLQUtYO0lBTEQsV0FBWSxLQUFLO1FBQ2Ysc0RBQXdCLENBQUE7UUFDeEIsc0RBQXdCLENBQUE7UUFDeEIsdUNBQWlCLENBQUE7UUFDakIsMkNBQWUsQ0FBQTtJQUNqQixDQUFDLEVBTFcsS0FBSyxHQUFMLHFCQUFLLEtBQUwscUJBQUssUUFLaEI7SUFDWSxtQkFBRyxpREFDWCxPQUFPLEdBQ1AsSUFBSSxHQUNKLEtBQUssQ0FDVCxDQUFBO0lBSVksa0NBQWtCLEdBQzdCLGVBQWUsQ0FBQyxPQUFPLENBQUMsYUFBYTtVQUNuQyxlQUFlLENBQUMsT0FBTyxDQUFDLGFBQWE7VUFDckMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhO1VBQ2xDLGVBQWUsQ0FBQyxJQUFJLENBQUMsYUFBYTtRQUNwQyx1Q0FBdUM7VUFDckMsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPO1VBQzdCLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ2xDLENBQUMsRUE1Q2dCLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBNEMvQjtBQUVELFNBQWdCLGFBQWEsQ0FBQyxPQUF3Qjs7SUFDcEQsT0FBTyxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztRQUNsQyxDQUFDLENBQUMsTUFBQSxNQUFBLE1BQU07YUFDTCxPQUFPLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQzthQUM1QixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxPQUFPLENBQUMsMENBQUcsQ0FBQyxDQUFDLG1DQUFJLEVBQUU7UUFDOUQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN6QixDQUFDO0FBUEQsc0NBT0MifQ==