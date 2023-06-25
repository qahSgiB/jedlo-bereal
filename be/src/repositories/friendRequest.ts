import { Result } from "@badrap/result";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client"

import { IdModel, UserFriendRequests } from "shared/types";

import { ApiClientErrorError } from "../types";

import { FriendRequestData } from "shared/types";


const arrayCompare = (a1: unknown[], a2: unknown[]): boolean => {
  if (a1.length !== a2.length) {
    return false;
  }

  for (let index = 0; index < a1.length; index++) {
    if (a1[index] !== a2[index]) {
      return false;
    }
  }

  return true;
}



type CreateData = {
  fromId: number,
  toUsername: string,
}


export const create = async (data: CreateData): Promise<Result<FriendRequestData, ApiClientErrorError>> => {
  // if (data.fromId === data.toId) {
  //   return Result.err(new ApiClientErrorError('You cannot send friend request to yourself', 'fr-1'));
  // }

  try {
    return Result.ok(await prisma.$transaction(async (tx) => {
      const getIdFromUsername = await tx.user.findUnique({
        where: {
          username: data.toUsername,
        },
        select: {
          id: true,
        },
      });

      if (getIdFromUsername === null) {
        throw new ApiClientErrorError('User doesn\'t exist', 'fr-7');
      }

      if (data.fromId === getIdFromUsername.id) {
        throw new ApiClientErrorError('You cannot send friend request to yourself', 'fr-1');
      }

      let retval = undefined;
      try {
        const friendRequest = await tx.friendRequest.create({
          data: {
            fromId: data.fromId,
            toId: getIdFromUsername.id,
          },
          select: {
            id: true,
            toId: true,
            to: {
              select: {
                username: true,
                social: {
                  select: {
                    bio: true,
                    picture: true,
                  }
                }
              }
            }
          },
        });
      retval = friendRequest;
      
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2003' && e.meta !== undefined && 'field_name' in e.meta) {
            if (e.meta.field_name === 'FriendRequest_fromId_fkey (index)') {
              throw new ApiClientErrorError('Id of user sending request doesn\'t exist', 'fr-2'); // unlikely
            } else if (e.meta.field_name === 'FriendRequest_toId_fkey (index)') {
              throw new ApiClientErrorError('Id of user to whom request is going to doesn\'t exist', 'fr-3');
            }
          } else if (e.code === 'P2002' && e.meta !== undefined && 'target' in e.meta && Array.isArray(e.meta.target)) {
            if (arrayCompare(e.meta.target, ['fromId', 'toId'])) {
              throw new ApiClientErrorError('Friend request already exists', 'fr-4');
            } else if (arrayCompare(e.meta.target, ['LEAST(fromId', 'toId)', 'GREATEST(fromId', 'toId)'])) {
              throw new ApiClientErrorError('Symmetric friend request already exists', 'fr-5');
            }
          }
        }
    
        throw e;
      }

      const friend = await tx.friend.aggregate({
        where: {
          OR: [{
            user1Id: data.fromId,
            user2Id: getIdFromUsername.id,
          }, {
            user1Id: getIdFromUsername.id,
            user2Id: data.fromId,
          }],
        },
        take: 1,
        _count: true,
      });

      if (friend._count !== 0) {
        throw new ApiClientErrorError('Users are already friends', 'fr-6');
      }

      return {
        id: retval.id,
        otherUserId: retval.toId,
        username: retval.to.username,
        bio: retval.to.social.bio,
        picture: retval.to.social.picture!,
      };
      
    }));
  } catch (e) {
    if (e instanceof ApiClientErrorError) {
      return Result.err(e);
    }

    throw e;
  }
}


type CancelData = IdModel & {
  fromId: number,
}

export const cancel = async (data: CancelData): Promise<Result<undefined, ApiClientErrorError>> => {
  const friendRequestDeleteResult = await prisma.friendRequest.deleteMany({
    where: {
      id: data.id,
      fromId: data.fromId,
    },
  });

  if (friendRequestDeleteResult.count === 0) {
    return Result.err(new ApiClientErrorError('Friend request doesn\'t exist or doesn\'t belong to currently logged in user', 'frc-1'));
  }

  return Result.ok(undefined);
}


type AcceptData = IdModel & {
  toId: number,
}

export const accept = async (data: AcceptData): Promise<Result<undefined, ApiClientErrorError>> => {
  try {
    return Result.ok(await prisma.$transaction(async (tx) => {
      let friendRequests = undefined;

      try {
        friendRequests = await tx.friendRequest.delete({
          where: {
            id: data.id,
          },
          select: {
            toId: true,
            fromId: true,
          }
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new ApiClientErrorError('Friend request doesn\'t exist', 'fra-1');
          }
        }

        throw e;
      }

      if (friendRequests.toId !== data.toId) {
        throw new ApiClientErrorError('Friend request isn\'t for currently logged in user', 'fra-2');
      }

      const fromId = friendRequests.fromId;

      try {
        await tx.friend.createMany({
          data: [
            {
              user1Id: fromId,
              user2Id: data.toId,
            },
            {
              user1Id: data.toId,
              user2Id: fromId,
            },
          ],
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002' && e.meta !== undefined && 'target' in e.meta && Array.isArray(e.meta.target)) {
            if (arrayCompare(e.meta.target, ['user1Id', 'user2Id'])) {
              throw new ApiClientErrorError('Users are already friends', 'fra-3'); // impossible
            }
          }
        }

        throw e;
      }

      return undefined;
    }));
  } catch (e) {
    if (e instanceof ApiClientErrorError) {
      return Result.err(e);
    }

    throw e;
  }
}



type DeclineData = IdModel & {
  toId: number,
}

export const decline = async (data: DeclineData): Promise<Result<undefined, ApiClientErrorError>> => {
  const friendRequestDeleteResult = await prisma.friendRequest.deleteMany({
    where: {
      id: data.id,
      toId: data.toId
    },
  });

  if (friendRequestDeleteResult.count === 0) {
    return Result.err(new ApiClientErrorError('Friend reuqest doesn\'t exist os isn\'t for currently logged in user', 'frd-2'));
  }

  return Result.ok(undefined);
}


export const getAll = async (data: IdModel): Promise<Result<UserFriendRequests, ApiClientErrorError>> => {
  const friendRequests = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      requestsFrom: {
        select: {
          id: true,
          to: {
            select: {
              id: true,
              username: true,
              social: {
                select: {
                  bio: true,
                  picture: true
                }
              }
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
      },
      requestsTo: {
        select: {
          id: true,
          from: {
            select: {
              id: true,
              username: true,
              social: {
                select: {
                  bio: true,
                  picture: true
                }
              }
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        },
      },
    },
  });

  if (friendRequests === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'frg-1')); // unlikely
  }

  return Result.ok({
    from: friendRequests.requestsFrom.map(fr => ({
      id: fr.id, 
      otherUserId: fr.to.id,
      username: fr.to.username,
      bio: fr.to.social.bio,
      picture: fr.to.social.picture!,
    })),
    to: friendRequests.requestsTo.map(fr => ({ 
      id: fr.id, 
      otherUserId: fr.from.id,
      username: fr.from.username,
      bio: fr.from.social.bio,
      picture: fr.from.social.picture!, 
    })),
  });
}


export const any = async (data: IdModel): Promise<Result<boolean, ApiClientErrorError>> => {
  return Result.ok(await prisma.$transaction(async tx => {
    const frientRequestsCount = await tx.friendRequest.aggregate({
      where: {
        toId: data.id,
      },
      _count: true,
    });

    const user = await tx.user.findUnique({
      where: {
        id: data.id,
      },
      select: {
        _count: true,
      }
    });

    if (user === null) {
      throw new ApiClientErrorError('User doesn\'t exist', 'frany-1'); // unlikely
    }
  
    return frientRequestsCount._count > 0;
  }))
}