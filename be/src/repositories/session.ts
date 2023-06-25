import { Result } from "@badrap/result";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon2 from 'argon2'
import prisma from "../client";

import { Session, UUIDModel, User, OmitId, IdModel, SessionLoggedIn } from "shared/types";

import { ApiClientErrorError } from "../types";



export const create = async (): Promise<Session> => {
  return await prisma.session.create({
    data: {}
  });
}


type SessionUserId = {
  userId: number | null,
}

export const getUserId = async (data: UUIDModel): Promise<SessionUserId | null> => {
  return await prisma.session.findUnique({
    where: {
      id: data.id,
    },
    select: {
      userId: true,
    },
  });
}


type LoginData = {
  sid: string,
  user: {
    username: string,
    password: string,
  },
}

export const login = async (data: LoginData): Promise<Result<SessionLoggedIn, ApiClientErrorError>> => {
  try {
    const loginResult = await prisma.$transaction(async (tx) => {
      const sessionDeleteResult = await tx.session.deleteMany({      
        where: {
          id: data.sid,
          userId: null,
        },
      });

      if (sessionDeleteResult.count === 0) {
        throw new ApiClientErrorError('User is already logged in or (unlikely) session doesn\'t exists', 'login-1'); // unlikely
      }

      const user = await tx.user.findUnique({
        where: {
          username: data.user.username
        },
        select: {
          id: true,
          password: true,
        },
      })

      if (user === null) {
        throw new ApiClientErrorError('Specified user not found', 'login-2'); // shouldn't be client error
      }

      const passwordCorrect = await argon2.verify(user.password, data.user.password);
      if (!passwordCorrect) {
        throw new ApiClientErrorError('Wrong password', 'login-3'); // shouldn't be client error
      }

      try {
        const newSid = await tx.session.create({
          data: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        });

        return { id: newSid.id, userId: user.id };
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          // foreign key constraint violation on field userId
          // [note] this happens when user is found (previous query) but then is deleted by som other "thread" before this query
          //        there is very small time time window between these queries so this situtation is really impropable
          //        could be fixed using 'select ... for update' in previous query (locking user row), but prisma doesn't support select ... for update (teda nenasiel som ze by to islo)
          if (e.code === 'P2003' && e.meta !== undefined && 'field_name' in e.meta && e.meta.field_name === 'Session_userId_fkey (index)') {
            throw new ApiClientErrorError('Specified user not found', 'login-4'); // unlikely
          }
        }

        throw e;
      }
    });

    return Result.ok(loginResult);
  } catch (e) {
    if (e instanceof ApiClientErrorError) {
      return Result.err(e);
    } else {
      throw e;
    }
  }
}

export const logout = async (data: UUIDModel): Promise<Result<undefined, ApiClientErrorError>> => {
  const sessionUpdateResult = await prisma.session.updateMany({
    where: {
      id: data.id,
      NOT: { userId: null, },
    },
    data: {
      userId: null,
    },
  });

  if (sessionUpdateResult.count === 0) {
    return Result.err(new ApiClientErrorError('User already logged out or (unlikely) session doesn\'t exists', 'logout-1')); // unlikely
  }

  return Result.ok(undefined);
}


type SignupData = {
  sid: string,
  user: OmitId<User>,
};

export const signup = async (data: SignupData): Promise<Result<SessionLoggedIn, ApiClientErrorError>> => {
  try {
    return Result.ok(await prisma.$transaction(async (tx) => {
      const sessionDeleteResult = await tx.session.deleteMany({      
        where: {
          id: data.sid,
          userId: null,
        },
      });
  
      if (sessionDeleteResult.count === 0) {
        throw new ApiClientErrorError('User is already logged in or (unlikely) session doesn\'t exists', 'signup-1'); // unlikely
      }

      const passwordHashed = await argon2.hash(data.user.password);
  
      try {
        const userWithSessions = await tx.user.create({
          data: {
            username: data.user.username,
            password: passwordHashed,
            email: data.user.email,
            sessions: {
              create: [{}],
            },
            fyzio: {
              create: {
                age: 20,
                height: 180,
                weight: 70,
              },
            },
            goals: {
              create: {
                calories: 0,
                carbs: 0,
                fats: 0,
                proteins: 0,
              },
            },
            social: {
              create: {
                email: data.user.email,
                bio: '',
              }
            }
          },
          select: {
            id: true,
            sessions: {
              select: {
                id: true,
              },
            },
          },
        });

        return { id: userWithSessions.sessions[0].id, userId: userWithSessions.id };
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002' && e.meta !== undefined && 'target' in e.meta && Array.isArray(e.meta.target) && e.meta.target.length === 1 && e.meta.target[0] === 'username') {
            throw new ApiClientErrorError('Username alreadey taken', 'signup-2');
          }
        }

        throw e;
      }
    }));
  } catch (e) {
    if (e instanceof ApiClientErrorError) {
      return Result.err(e);
    } else {
      throw e;
    }
  }
}

export const me = async (data: UUIDModel): Promise<Result<IdModel | null, ApiClientErrorError>> => {
  const sessionWithUser = await prisma.session.findUnique({
    where: {
      id: data.id,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    }
  });

  if (sessionWithUser === null) {
    return Result.err(new ApiClientErrorError('Session doesn\'t exists', 'me-1')); // unlikely
  }

  return Result.ok(sessionWithUser.user);
}