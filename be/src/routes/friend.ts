import { Router } from "express";
import { friendApi } from "shared/api";
import { friendRepository } from "../repositories";
import { apiDoOk, api, apiDoResult } from "../utils/api";



const router = Router();

router.get('/', api<friendApi.getAll.Result>()('loggedIn', friendApi.getAll.schema, async (req, res) => {
  return apiDoResult(await friendRepository.getAll({
    id: req.session!.userId!,
  }));
}));

router.post('/remove', api<friendApi.remove.Result>()('loggedIn', friendApi.remove.schema, async (req, res) => {
  return apiDoResult(await friendRepository.remove({
    id: req.session!.userId!,
    friendId: req.body.friendId,
  }));
}));



export default router;