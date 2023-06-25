import { Router } from "express";
import ft from 'file-type';

import { userApi } from 'shared/api';

import { apiDoOk, api, apiDoResult, apiDoClientError } from "../utils/api";
import { fileUploadWithData } from "../utils/middleware/fileUpload";

import { imageRepository, userRepository } from "../repositories";
import validateFile from "../utils/validateFile";





const router = Router();

router.get('/', api<userApi.getAll.Result>()(undefined, userApi.getAll.schema, async (req, res) => {
  return apiDoOk(await userRepository.getAll());
}));

// router.get('/:id', api<userApi.getSingle.Result>()(undefined, userApi.getSingle.schema, async (req, res) => {
//   return apiDoOk(await userRepository.getSingle({ id: req.params.id }));
// }));

router.get('/name', api<userApi.getName.Result>()('loggedIn', userApi.getName.schema, async (req, res) => {
  return apiDoResult(await userRepository.getName({
    id: req.session!.userId!
  }));
}));

router.get('/goals', api<userApi.getGoals.Result>()('loggedIn', userApi.getGoals.schema, async (req, res) => {
  return apiDoResult(await userRepository.getGoals({
    id: req.session!.userId!
  }));
}));

router.post('/goals', api<userApi.setGoals.Result>()('loggedIn', userApi.setGoals.schema, async (req, res) => {
  return apiDoResult(await userRepository.setGoals({
    id: req.session!.userId!, goals: req.body
  }));
}));

router.get('/fyzio', api<userApi.getFyzio.Result>()('loggedIn', userApi.getFyzio.schema, async (req, res) => {
  return apiDoResult(await userRepository.getFyzio({
    id: req.session!.userId!
  }));
}));

router.post('/fyzio', api<userApi.setFyzio.Result>()('loggedIn', userApi.setFyzio.schema, async (req, res) => {
  return apiDoResult(await userRepository.setFyzio({
    id: req.session!.userId!, fyzio: req.body
  }));
}));

router.get('/social', api<userApi.getSocial.Result>()('loggedIn', userApi.getSocial.schema, async (req, res) => {
  return apiDoResult(await userRepository.getSocial({
    id: req.session!.userId!
  }));
}));

router.post('/social', fileUploadWithData('picture', true), api<userApi.setSocial.Result>()('loggedIn', userApi.setSocial.schema, async (req, res) => {
  let picture = undefined;

  if (req.file !== undefined) {
    const pictureBuffer = req.file.buffer;
    const ext = await validateFile(pictureBuffer, 'image');

    if (ext === undefined) {
      return apiDoClientError({
        code: 'post-social-unknown-file-type',
        message: 'Unknown file type (expecting image)',
      });
    }
  
    picture = (await imageRepository.save({
      buffer: pictureBuffer,
      ext: ext,
      folder: 'social',
    })).filename;
  }

  const setResult = await userRepository.setSocial({
    id: req.session!.userId!,
    social: {
      ...req.body,
      picture,
    },
  });

  if (setResult.isErr) {
    return apiDoClientError(setResult.error.unClass());
  }

  const pictureUpdate = setResult.value.picture;

  if (pictureUpdate === undefined) {
    return apiDoOk({ picture: undefined });
  }

  if (pictureUpdate.old !== null) {
    await imageRepository.remove({ filename: pictureUpdate.old })
  }
  
  return apiDoOk({ picture: pictureUpdate.new });
}));

export default router;
