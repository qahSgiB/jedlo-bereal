import { UUIDModel } from "./base"



export type Session = UUIDModel & {
  userId: number | null,
}

export type SessionLoggedIn = UUIDModel & {
  userId: number,
}