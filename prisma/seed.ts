import { PrismaClient } from '@prisma/client';
import { ROLES } from '../src/common/constants/roles';
import { GENRE, COMIC_STATUS } from '../src/common/constants/genre';

// initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {
  // genre seed
  for (const data of GENRE) {
    await prisma.genreMaster.create({
      data,
    });
  }

  // comic status seed
  for (const data of COMIC_STATUS) {
    await prisma.statusMaster.create({
      data,
    });
  }

  // roles seed
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
