import { IdModel } from "./base";

export type FriendData = IdModel & {
    username: string,
    bio: string,
    picture: string,
};