import { Router } from "express";

import { authApi } from "shared/api";

import { sessionRepository } from "../repositories";
import { api, apiDoClientError, apiDoOk, apiDoResult } from "../utils/api";



const router = Router();

router.post('/login', api<authApi.login.Result>()('loggedOut', authApi.login.schema, async (req, res) => {
  const loginResult = await sessionRepository.login({
    sid: req.session!.id,
    user: req.body,
  });

  if (loginResult.isErr) {
    return apiDoClientError(loginResult.error.unClass());
  }

  res.cookie('sid', loginResult.value.id, { httpOnly: true, sameSite: 'lax' });

  return apiDoOk({ id: loginResult.value.userId });
}));

router.post('/logout', api<authApi.logout.Result>()('loggedIn', authApi.logout.schema, async (req, res) => {
  const logoutResult = await sessionRepository.logout({
    id: req.session!.id,
  });

  return apiDoResult(logoutResult.map(() => null));
}));

router.post('/signup', api<authApi.signup.Result>()('loggedOut', authApi.signup.schema, async (req, res) => {
  const signupResult =  await sessionRepository.signup({
    sid: req.session!.id,
    user: req.body,
  });

  if (signupResult.isErr) {
    return apiDoClientError(signupResult.error.unClass());
  }

  res.cookie('sid', signupResult.value.id, { httpOnly: true, sameSite: 'lax' });

  return apiDoOk({ id: signupResult.value.userId });
}));

router.get('/me', api<authApi.me.Result>()(undefined, authApi.me.schema, async (req, res) => {
  return apiDoResult(await sessionRepository.me({
    id: req.session!.id,
  }));
}));



export default router;