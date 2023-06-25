import { IdModel } from "./base";



export type User = IdModel & {
  username: string,
  password: string,
  email: string,
}

export type UserInfo = Omit<User, 'password'>;

export type UserInfoSimple = IdModel & {
  username: string,
}

export type UserName = {
  username: string,
}



export type Goals = {
  calories: number
  carbs: number
  fats: number
  proteins: number
}

export type GoalsOptional = {
  calories?: number
  carbs?: number
  fats?: number
  proteins?: number
}

export type Fyzio = {
  age: number,
  weight: number,
  height: number,
}

export type FyzioOptional = {
  age?: number,
  weight?: number,
  height?: number,
}

export type Social = {
  email: string,
  bio: string,
  picture: string | null
}

export type SocialOptional = {
  email?: string,
  bio?: string,
  picture?: string | null,
}