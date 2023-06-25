import prisma from "../client";



const main = async () => {
  await prisma.food.create({
    data: {
      name: 'Potato',
      kCal: 85,
      fat: 0,
      carbs: 19,
      protein: 2,
    }
  })

  await prisma.food.create({
    data: {
      name: 'Rice',
      kCal: 127,
      fat: 0,
      carbs: 28,
      protein: 3,
      description: "Rice",
    }
  })

  await prisma.food.create({
    data: {
      name: 'Tomato',
      kCal: 20,
      fat: 0,
      carbs: 4,
      protein: 1,
      description: 'Tomato is red'
    }
  })

  await prisma.food.create({
    data: {
      name: 'Cheese',
      kCal: 213,
      fat: 15,
      carbs: 2,
      protein: 30,
      description: "Eidam"
    }
  })

  await prisma.food.create({
    data: {
      name: 'Cucumber',
      kCal: 16,
      fat: 0,
      carbs: 2,
      protein: 1,
    }
  })

  await prisma.food.create({
    data: {
      name: 'Cocacola',
      kCal: 45,
      fat: 0,
      carbs: 11,
      protein: 0,
    }
  })

  await prisma.food.create({
    data: {
      name: 'Chicken',
      kCal: 146,
      fat: 7,
      carbs: 0,
      protein: 20,
    }
  })

  await prisma.food.create({
    data: {
      name: 'Beef',
      kCal: 170,
      fat: 7,
      carbs: 1,
      protein: 25,
    }
  })

  await prisma.food.create({
    data: {
      name: 'Milk',
      kCal: 45,
      fat: 2,
      carbs: 3,
      protein: 5,
      description: "1.5% fat"
    }
  })

  await prisma.food.create({
    data: {
      name: 'French fries',
      kCal: 275,
      fat: 13,
      carbs: 35,
      protein: 4,
      description: "McDonald's"
    }
  })

  await prisma.food.create({
    data: {
      name: 'Milk',
      kCal: 45,
      fat: 2,
      carbs: 3,
      protein: 5
    }
  })

  await prisma.food.create({
    data: {
      name: 'Cottage cheese',
      kCal: 45,
      fat: 6,
      carbs: 3,
      protein: 11
    }
  })

  await prisma.food.create({
    data: {
      name: 'Orange juice',
      kCal: 36,
      fat: 0,
      carbs: 9,
      protein: 0
    }
  })
}

main();
