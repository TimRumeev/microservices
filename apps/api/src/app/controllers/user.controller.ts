import { Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { UserId } from "../guards/user.decorator";

@Controller("user")
export class UserConroller {
    // constructor() {}
    // @UseGuards(JwtAuthGuard)
    // @Post("info")
    // async register(@UserId() userId: string) {}
}
