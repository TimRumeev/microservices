import { IUser, UserRole } from "@courses/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;

    constructor(user: IUser) {
        this._id = user._id;
        this.displayName = user.displayName;
        this.email = user.email;
        this.role = user.role;
        this.passwordHash = user.passwordHash;
    }
    public async SetPassword(password: string) {
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }

    public ValidatePassword(password: string) {
        return compare(password, this.passwordHash);
    }
}
