import { Result } from "@badrap/result";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "../client";

import { Goals, GoalsOptional, Fyzio, FyzioOptional, Social, SocialOptional, IdModel, UserInfo, UserName } from "shared/types";

import { ApiClientErrorError } from "../types";



const userInfoSelect = {
  id: true,
  username: true,
  email: true,
}



export const getAll = async (): Promise<UserInfo[]> => {
  return await prisma.user.findMany({ select: userInfoSelect });
}

export const getSingle = async (data: IdModel): Promise<UserInfo | null> => {
  return await prisma.user.findUnique({ where: data, select: userInfoSelect });
}

export const getName = async (data: IdModel): Promise<Result<UserName, ApiClientErrorError>> => {
  const userName = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: { 
      username: true,
    },
  });

  if (userName === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'gg-1')); // unlikely
  }

  return Result.ok(userName)
}

//// GOALS
export const getGoals = async (data: IdModel): Promise<Result<Goals, ApiClientErrorError>> => {
  const userGoals = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      goals: {
        select: {
          calories: true,
          carbs: true,
          fats: true,
          proteins: true,
        },
      },
    },
  });

  if (userGoals === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'gg-1')); // unlikely
  }

  return Result.ok(userGoals.goals);
}


type SetGoalsData = IdModel & {
  goals: GoalsOptional,
}

export const setGoals = async (data: SetGoalsData): Promise<Result<undefined, ApiClientErrorError>> => {
  try {
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        goals: {
          update: data.goals,
        }
      }
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == 'P2025') {
        return Result.err(new ApiClientErrorError('User doesn\'t exist', 'sg-1')); // unlikely
      }
    }

    throw e;
  }

  return Result.ok(undefined);
}



//// FYZIO
export const getFyzio = async (data: IdModel): Promise<Result<Fyzio, ApiClientErrorError>> => {
  const userFyzio = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      fyzio: {
        select: {
          age: true,
          weight: true,
          height: true,
        }
      }
    },
  });

  if (userFyzio === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'gg-1')); // unlikely
  }

  return Result.ok(userFyzio.fyzio);
}


type SetFyzioData = IdModel & {
  fyzio: FyzioOptional,
}

export const setFyzio = async (data: SetFyzioData): Promise<Result<undefined, ApiClientErrorError>> => {
  try {
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        fyzio: {
          update: data.fyzio,
        },
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == 'P2025') {
        return Result.err(new ApiClientErrorError('User doesn\'t exist', 'sg-1')); // unlikely
      }
    }

    throw e;
  }

  return Result.ok(undefined);
}



//// SOCIAL
export const getSocial = async (data: IdModel): Promise<Result<Social, ApiClientErrorError>> => {
  const userSocial = await prisma.user.findUnique({
    where: {
      id: data.id,
    },
    select: {
      social: {
        select: {
          email: true,
          bio: true,
          picture: true,
        }
      }
    },
  });

  if (userSocial === null) {
    return Result.err(new ApiClientErrorError('User doesn\'t exist', 'gg-1')); // unlikely
  }

  return Result.ok(userSocial.social);
}


type SetSocialData = IdModel & {
  social: SocialOptional,
}

type SocialPictureWithOld = {
  picture: {
    old: string | null,
    new: string | null,
  } | undefined,
}

export const setSocial = async (data: SetSocialData): Promise<Result<SocialPictureWithOld, ApiClientErrorError>> => {
  const updatePicture = data.social.picture !== undefined;

  let pictureOld: string | null | undefined = undefined;
  if (updatePicture) {
    const social = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
      select: {
        social: {
          select: {
            picture: true,
          }
        },
      },
    });

    if (social === null) {
      return Result.err(new ApiClientErrorError('User doesn\'t exist', 'sg-1')); // unlikely
    }

    pictureOld = social.social.picture;
  }

  try {
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        social: {
          update: data.social,
        },
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == 'P2025') {
        return Result.err(new ApiClientErrorError('User doesn\'t exist', 'sg-2')); // unlikely
      }
    }

    throw e;
  }

  return Result.ok({
    picture: updatePicture ? {
      new: data.social.picture!, // ! ok
      old: pictureOld!, // ! ok
    } : undefined
  });
}