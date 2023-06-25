import { Router } from "express";

import { postApi } from "shared/api";

import { api, apiDoResult, apiDoClientError } from "../utils/api";
import { fileUploadWithData } from "../utils/middleware/fileUpload";
import { imageRepository, postRepository } from "../repositories";
import validateFile from "../utils/validateFile";



const router = Router();

router.get('/', api<postApi.getAll.Result>()('loggedIn', postApi.getAll.schema, async (req, res) => {
  return apiDoResult(await postRepository.getAll({
    id: req.session!.userId!
  }));
}));

router.post('/', fileUploadWithData('picture', false), api<postApi.create.Result>()('loggedIn', postApi.create.schema(), async (req, res) => {
  const pictureBuffer = req.file!.buffer;
  const ext = await validateFile(pictureBuffer, 'image');

  if (ext === undefined) {
    return apiDoClientError({
      code: 'post-post-unknown-file-type',
      message: 'Unknown file type (expecting image)',
    });
  }

  const picture = (await imageRepository.save({
    buffer: pictureBuffer,
    ext: ext,
    folder: 'posts',
  })).filename;

  return apiDoResult(await postRepository.create({
    creatorId: req.session!.userId!,
    picture: picture,
  }));
}));


export default router;
