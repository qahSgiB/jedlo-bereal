import { Router } from 'express';

import { friendRequestApi } from 'shared/api';

import { friendRequestRepository } from '../repositories';
import { api, apiDoResult } from '../utils/api';



const router = Router();



router.post('/', api<friendRequestApi.create.Result>()('loggedIn', friendRequestApi.create.schema, async (req, res) => {
  return apiDoResult(await friendRequestRepository.create({
    fromId: req.session!.userId!,
    toUsername: req.body.toUsername,
  }));
}));

router.post('/cancel', api<friendRequestApi.cancel.Result>()('loggedIn', friendRequestApi.cancel.schema, async (req, res) => {
  return apiDoResult(await friendRequestRepository.cancel({
    id: req.body.id,
    fromId: req.session!.userId!,
  }));
}));

router.post('/accept', api<friendRequestApi.accept.Result>()('loggedIn', friendRequestApi.accept.schema, async (req, res) => {
  return apiDoResult(await friendRequestRepository.accept({
    id: req.body.id,
    toId: req.session!.userId!,
  }));
}));

router.post('/decline', api<friendRequestApi.decline.Result>()('loggedIn', friendRequestApi.decline.schema, async (req, res) => {
  return apiDoResult(await friendRequestRepository.decline({
    id: req.body.id,
    toId: req.session!.userId!,
  }));
}));

router.get('/', api<friendRequestApi.getAll.Result>()('loggedIn', friendRequestApi.getAll.schema, async (req, res) => {
  return apiDoResult(await friendRequestRepository.getAll({
    id: req.session!.userId!,
  }));
}));

router.get('/any', api<friendRequestApi.any.Result>()('loggedIn', friendRequestApi.any.schema, async (req, res) => {
  return apiDoResult(await friendRequestRepository.any({
    id: req.session!.userId!,
  }));
}));



export default router;