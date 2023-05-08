import { PrismaClient } from '@prisma/client';
import { ROLES } from '../src/common/constants/roles';

// initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  for (const data of ROLES) {
    await prisma.roleMaster.create({
      data,
    });
  }
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
