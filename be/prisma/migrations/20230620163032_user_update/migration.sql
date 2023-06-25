-- AlterTable
CREATE SEQUENCE userfyzio_id_seq;
ALTER TABLE "UserFyzio" ALTER COLUMN "id" SET DEFAULT nextval('userfyzio_id_seq');
ALTER SEQUENCE userfyzio_id_seq OWNED BY "UserFyzio"."id";

-- AlterTable
CREATE SEQUENCE usergoals_id_seq;
ALTER TABLE "UserGoals" ALTER COLUMN "id" SET DEFAULT nextval('usergoals_id_seq');
ALTER SEQUENCE usergoals_id_seq OWNED BY "UserGoals"."id";

-- AlterTable
CREATE SEQUENCE usersocial_id_seq;
ALTER TABLE "UserSocial" ALTER COLUMN "id" SET DEFAULT nextval('usersocial_id_seq');
ALTER SEQUENCE usersocial_id_seq OWNED BY "UserSocial"."id";
