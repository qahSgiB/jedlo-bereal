import prisma from "../client";
import { IdModel } from "shared/types";
import { Food } from "../types/food";
import { OmitId } from "shared/types";

const foodSelect = {
    id: true,
    userId: true,
    name: true,
    kCal: true,
    fat: true,
    carbs: true,
    protein: true,
    description: true
}


type GetAllData = {
    id: number | undefined,
}

export const getAll = async (data: GetAllData): Promise<Food[]> => {
    if (data.id === undefined) {
        return await prisma.food.findMany({
            where: {
                userId: null,
            },
            select: foodSelect,
            orderBy: {
                name: 'asc',
            }
        });
    }

    return await prisma.food.findMany({
        where: { 
            OR: [
                {
                    userId: data.id,
                },
                {
                    userId: null,
                }

            ]
        },
        select: foodSelect,
        orderBy: {
            name: 'asc',
        }
    });
}

export const getSingle = async (data: IdModel): Promise<Food | null> => {
    return await prisma.food.findUnique({
        where: {
            id: data.id,
        },
        select: foodSelect,
    })
}

export type FoodCreate = OmitId<Food>;

export const createSingle = async (data: FoodCreate): Promise<Food> => {
    return await prisma.food.create({
        data: data,
        select: foodSelect,
    })
}
