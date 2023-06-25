import { Router } from "express";

import { handleOkResponse } from "../utils/handleResponse";
import { validate } from '../utils/middleware/validate'
import expressAsyncHandler from "../utils/expressAsyncHandler";
import { api, apiDoOk } from "../utils/api";
import { foodValidation } from "../schemas";

import { foodRepository } from "../repositories";



const router = Router();

router.get('/', api<unknown>()(undefined, foodValidation.getAll, async (req, res) => {
  const food = await foodRepository.getAll({
    id: req.session?.userId,
  });
  return apiDoOk(food);
}));

router.get('/:id', validate(foodValidation.getSingle), expressAsyncHandler(async (req, res) => {
  const food = await foodRepository.getSingle({ id: req.params.id });
  handleOkResponse(res, food);
}));

router.post('/', validate(foodValidation.createSingle), expressAsyncHandler(async (req, res) => {
  const food = await foodRepository.createSingle(req.body);
  handleOkResponse(res, food);
}));

export default router;
