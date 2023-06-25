import { Result } from "@badrap/result";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client";

import { IdModel, Post } from "shared/types";

import { ApiClientErrorError } from "../types";


export const getAll = async (data: IdModel): Promise<Result<Array<Post>, ApiClientErrorError>> => {
  const posts = await prisma.post.findMany({
    where: {
      creator: {
        friends1: {
          some: {
            user2: {
              id: data.id,
            }
          }
        }
      }    
    },
    // select: {
    //   id: true,
    //   picture: true,
    //   creator: {
    //     select: {
    //       username: true,
    //       social: {
    //         select: {
    //           picture: true
    //         }
    //       }
    //     }
    //   },
    //   createdAt: true,
    // },
    select: {
      id: true,
      picture: true,
      creator: {
        select: {
          username: true,
          social: {
            select: {
              picture: true,
            },
          },
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (posts === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'gg-1')); // unlikely
  }

  let retval: Array<Post> = posts.map( (post) => ({
    id: post.id,
    picture: post.picture,
    createdAt: post.createdAt,
    creator: {
      username: post.creator.username,
      picture: post.creator.social.picture!,
    }
  }));

  return Result.ok(retval);
  // return Result.ok(posts);
}


type CreateData = {
  creatorId: number,
  picture: string,
}

export const create = async (data: CreateData): Promise<Result<undefined, ApiClientErrorError>> => {
  try {
    await prisma.post.create({
      data: {
        creator: {
          connect: {
            id: data.creatorId,
          },
        },
        picture: data.picture,
      }
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        throw new ApiClientErrorError('Friend request doesn\'t exist', 'pc-1'); // unlikely
      }
    }

    throw e;
  }

  return Result.ok(undefined);
}