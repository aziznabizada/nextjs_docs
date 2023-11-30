const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

const upsertModel = async (model, data, uniqueCondation) => {
  console.log(uniqueCondation);
  const upsertPromises = data.map((item) => {
    if (item.date) {
      item.date = new Date(item.date);
    }
    return model.upsert({
      where: uniqueCondation(item), // Specify the unique identifier for the record
      update: item, // Data to be updated if the record exists
      create: item, // Data to be created if the record doesn't exist
    });
  });

  const insertedData = await Promise.all(upsertPromises);
  console.log('Upserted users:', insertedData);
  return insertedData;
};

async function main() {
  const client = await prisma.$connect();

  await upsertModel(prisma.user, users, (item) => {
    return { id: item.id };
  });
  await upsertModel(prisma.customer, customers, (item) => {
    return { id: item.id };
  });
  await upsertModel(prisma.invoice, invoices, (item) => {
    return {
      id: 'kkklsdkfl',
      customer_id: item.customer_id,
      date: { equals: item.date ? new Date(item.date) : null },
    };
  });
  await upsertModel(prisma.revenue, revenue, (item) => {
    return { month: item.month };
  });
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
