-- This is an empty migration.

ALTER TABLE "FriendRequest" ADD CHECK ("fromId" <> "toId");