import fs from 'fs/promises'
import path from 'path'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import prisma from "../client"



const staticFolder = 'static'


type SaveData = {
  buffer: Buffer,
  folder: string,
  ext: string,
}

type Filename = {
  filename: string,
}

export const save = async (data: SaveData): Promise<Filename> => {
  const image = await prisma.image.create({
    data: {
      folder: data.folder,
      ext: data.ext,
    },
    select: {
      id: true,
    }
  });

  const filename = path.join(data.folder, `${image.id}.${data.ext}`);
  const staticFilename = path.join(staticFolder, filename);

  await fs.writeFile(staticFilename, data.buffer);

  return { filename: filename };
}


export const remove = async (data: Filename): Promise<boolean> => {
  const filePath = path.parse(data.filename);
  const id = filePath.name;

  let file = undefined;

  try {
    file = await prisma.image.delete({
      where: {
        id: id,
      },
      select: {
        folder: true,
        ext: true,
      }
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return false;
      }
    }

    throw e;
  }

  const filename = path.join(file.folder, `${id}.${file.ext}`);
  const staticFilename = path.join(staticFolder, filename);
  fs.rm(staticFilename);

  return true;
}