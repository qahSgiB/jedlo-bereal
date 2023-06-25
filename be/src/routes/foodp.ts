import { Router } from "express";
import { foodpApi } from "shared/api";
import { api, apiDoOk } from "../utils/api";
import { foodpRepository } from "../repositories";



const router = Router();

router.get('/', api<foodpApi.getAll.Result>()(undefined, foodpApi.getAll.schema, async (req, res) => {
  return apiDoOk(await foodpRepository.getAll({
    id: req.session?.userId,
    pf: req.query,
  }));
}))



export default router;