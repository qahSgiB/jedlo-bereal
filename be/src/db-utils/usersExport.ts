import prisma from "../client";

import * as fs from 'fs/promises'



const main = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      password: true,
      email: true,
    }
  });

  await fs.writeFile('./dbExport.json', JSON.stringify(users, null, 2));
}



main();