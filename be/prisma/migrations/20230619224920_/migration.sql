-- CreateTable
CREATE TABLE "FoodDiary" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "grams" INTEGER NOT NULL,
    "dateEaten" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodDiary_pkey" PRIMARY KEY ("id")
);
