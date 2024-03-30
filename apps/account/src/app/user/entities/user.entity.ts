import { AccountChangedCourse } from "@courses/contracts";
import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from "@courses/interfaces";
import { compare, genSalt, hash } from "bcryptjs";

export class UserEntity implements IUser {
    _id?: string;
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    courses?: IUserCourses[];
    events: IDomainEvent[] = [];

    constructor(user: IUser) {
        this._id = user._id;
        this.displayName = user.displayName;
        this.email = user.email;
        this.role = user.role;
        this.passwordHash = user.passwordHash;
        this.courses = user.courses;
    }

    public deleteCourse(courseId: string) {
        this.courses = this.courses.filter((c) => c.courseId !== courseId);
    }

    public updateCourseStatus(courseId: string, state: PurchaseState) {
        const existsCourse = this.courses.find((c) => (c.courseId = courseId));
        if (!existsCourse) {
            this.courses.push({
                courseId,
                purchaseState: state,
            });
            return this;
        }
        if (state === PurchaseState.Canceled) {
            this.deleteCourse(courseId);
            return this;
        }
        // if (state === PurchaseState.Purchased) {
        //     this.addCourse(courseId);
        // }
        this.courses = this.courses.map((c) => {
            if ((c.courseId = courseId)) {
                c.purchaseState = state;
                return c;
            }
            return c;
        });
        this.events.push({
            topic: AccountChangedCourse.topic,
            data: {
                courseId: courseId,
                userId: this._id,
                state: state,
            },
        });
        return this;
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
