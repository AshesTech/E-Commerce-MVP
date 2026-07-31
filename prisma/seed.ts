import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Starting to seed... ")

  // This tells the database to create our 3 starter categories
  await prisma.category.createMany({
    data: [
      { name: 'Televisions' },
      { name: 'Mobile Phones' },
      { name: 'Speakers' },
    ],
    skipDuplicates: true, // This stops us from accidentally creating doubles if we run it twice!
  })
  
  console.log("Categories seeded successfully! ")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })