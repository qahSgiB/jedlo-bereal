import { IdModel, UserInfoSimple } from '../../types'

export type FriendRequestData = IdModel & {
  otherUserId: number,
  username: string,
  bio: string,
  picture: string,
}

export type FriendRequestWithUser = IdModel & {
  user: UserInfoSimple,
}

// export type UserFriendRequests = {
//   from: FriendRequestWithUser[],
// 	to: FriendRequestWithUser[],
// }

export type UserFriendRequests = {
  from: FriendRequestData[],
  to: FriendRequestData[],
}

export type CreateFriendRequestData = {
  toUsername: string,
}
