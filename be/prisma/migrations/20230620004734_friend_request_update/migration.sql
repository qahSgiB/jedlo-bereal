-- This is an empty migration.

ALTER TABLE "FriendRequest" RENAME CONSTRAINT "FriendRequest_check" TO "FriendRequest_reflexive";