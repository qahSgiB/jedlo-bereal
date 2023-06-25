import prisma from "../client"

import { FoodsPaginated } from "shared/types"



type GetAllData = {
  id: number | undefined
  pf: {
    cursor?: number,
    filter?: string,
    take?: number,
  }
}

export const getAll = async (data: GetAllData): Promise<FoodsPaginated> => {
  const foods = await prisma.food.findMany({
    ...(data.id !== undefined ? {} : {
      where: {
        userId: null,
        ...(data.pf.filter === undefined ? {} : {
          OR: [{
            name: {
              contains: data.pf.filter,
              mode: 'insensitive',
            }
          }, {
            description: {
              contains: data.pf.filter,
              mode: 'insensitive',
            }
          }]
        }),
      }
    }),
    ...(data.id === undefined ? {} : {
      where: {
        OR: [{
          userId: null,
        }, {
          userId: data.id,
        }],
        ...(data.pf.filter === undefined ? {} : {
          OR: [{
            name: {
              contains: data.pf.filter,
              mode: 'insensitive',
            }
          }, {
            description: {
              contains: data.pf.filter,
              mode: 'insensitive',
            }
          }]
        }),
      }
    }),
    orderBy: {
      name: 'asc',
    },
    take: data.pf.take ?? 2,
    ...(data.pf.cursor === undefined ? {} : {
      skip: 1,
      cursor: {
        id: data.pf.cursor,
      },
    }),
    select: {
      id: true,
      userId: true,
      name: true,
      kCal: true,
      fat: true,
      carbs: true,
      protein: true,
      description: true
    }
  });

  return {
    foods: foods,
    nextCursor: foods.at(-1)?.id ?? null,
  };
}