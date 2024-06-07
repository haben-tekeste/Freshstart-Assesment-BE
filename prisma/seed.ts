import prisma from "../prisma";
import { faker } from "@faker-js/faker";
import { randAnimal, randBetweenDate, randNumber } from "@ngneat/falso";

const main = async () => {
  try {
    await prisma.item.deleteMany();
    const fakeBots = randAnimal({
      length: 20,
    });
    for (let index = 0; index < fakeBots.length; index++) {
      const name = faker.commerce.productName();
      await prisma.item.create({
        data: {
          name,
          quantity: randNumber({ min: 1, max: 99 }),
          price: randNumber({ min: 1, max: 100 }),
          id: "CMP" + randNumber({ length: 1 }),
        },
      });
    }
    console.log(`Database has been seeded. 🌱`);
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
