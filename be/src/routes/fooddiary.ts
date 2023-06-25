import { Router } from "express";

import { foodDiaryRepository, userRepository } from "../repositories";
import { handleOkResponse } from "../utils/handleResponse";
import { validate } from '../utils/middleware/validate'
import expressAsyncHandler from "../utils/expressAsyncHandler";

import { foodDiaryValidation } from "../schemas";
import { needsAuth } from "../utils/middleware/session";

const router = Router();

router.get('/', needsAuth(true), validate(foodDiaryValidation.getAll), expressAsyncHandler(async (req, res) => {
  const completeFoodDiary = await foodDiaryRepository.getAll({
    id: req.session!.userId!,
  });
  handleOkResponse(res, completeFoodDiary);
}));
  

router.post('/', needsAuth(true), validate(foodDiaryValidation.createSingle), expressAsyncHandler(async (req, res) => {
  const foodDiary = await foodDiaryRepository.createSingle({
    ...req.body,
    userId: req.session!.userId!,
  });
  handleOkResponse(res, foodDiary);
}));

export default router;