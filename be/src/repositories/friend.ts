import { Result } from "@badrap/result";
import prisma from "../client";

import { IdModel, UserInfoSimple } from "shared/types";

import { ApiClientErrorError } from "../types";

import { FriendData } from "shared/types";

export const getAll = async (data: IdModel): Promise<Result<FriendData[], ApiClientErrorError>> => {
  const friends = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      friends1: {
        select: {
          user2: {
            select: {
              id: true,
              username: true,
              social: {
                select: {
                  bio: true,
                  picture: true,
                }
              }
            },
          }
        },
        orderBy: {
          user2: {
            username: 'asc',
          }
        }        
      }
    }
  });

  if (friends === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'fga-1')); // unlikely
  }

  let retval: FriendData[] = friends.friends1.map(friend => ({
    
      id: friend.user2.id,
      username: friend.user2.username,
      bio: friend.user2.social.bio,
      picture: friend.user2.social.picture!,
    
  }));

  return Result.ok(retval);
};


type RemoveData = {
  id: number,
  friendId: number,
}

export const remove = async (data: RemoveData): Promise<Result<undefined, ApiClientErrorError>> => {
  const friendDeleteResult = await prisma.friend.deleteMany({
    where: {
      OR: [{
        user1Id: data.id,
        user2Id: data.friendId,
      }, {
        user1Id: data.friendId,
        user2Id: data.id,
      }]
    }
  });

  if (friendDeleteResult.count !== 2) {
    return Result.err(new ApiClientErrorError('Users are not friends', 'fre-1'));
  }

  return Result.ok(undefined);
};