import { IUser, IUserCourses, UserRole } from "@courses/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    courses?: IUserCourses[];

    constructor(user: IUser) {
        this._id = user._id;
        this.displayName = user.displayName;
        this.email = user.email;
        this.role = user.role;
        this.passwordHash = user.passwordHash;
        this.courses = user.courses;
    }

    public getPuiblicProfile() {
        return {
            email: this.email,
            displayName: this.displayName,
            role: this.role,
        };
    }
    public async SetPassword(password: string) {
        const salt = await genSalt(10);
        this.passwordHash = await hash(password, salt);
        return this;
    }

    public ValidatePassword(password: string) {
        return compare(password, this.passwordHash);
    }

    public UpdateProfile(displayName: string) {
        this.displayName = displayName;
    }
}
