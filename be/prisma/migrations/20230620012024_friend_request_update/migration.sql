-- This is an empty migration.

CREATE UNIQUE INDEX FriendRequest_symmetric ON "FriendRequest" (LEAST("fromId", "toId"), GREATEST("fromId", "toId"));