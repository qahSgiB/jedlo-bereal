import * as fs from 'fs/promises'
import prisma from '../client';



type UserExport = {
  id: number,
  username: string,
  password: string,
  email: string,
}



const main = async () => {
  const userJson = await fs.readFile('./dbExport.json', { encoding: 'utf-8' });
  const users = JSON.parse(userJson) as UserExport[];

  const user = users[0];
  
  await Promise.all(users.map(user => prisma.$transaction(async tx => {
    const { id: fyzioId } = await tx.userFyzio.create({
      data: {
        age: 20,
        height: 180,
        weight: 70,
      },
      select: {
        id: true,
      }
    });

    const { id: goalsId } = await tx.userGoals.create({
      data: {
        calories: 0,
        carbs: 0,
        fats: 0,
        proteins: 0,
      },
      select: {
        id: true,
      }
    });

    const { id: socialId } = await tx.userSocial.create({
      data: {
        email: user.email,
        bio: 'bioooo',
      },
      select: {
        id: true,
      }
    });

    await tx.user.create({
      data: {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        fyzioId: fyzioId,
        goalsId: goalsId,
        socialId: socialId,
      }
    });
  })));
}



main();