/* eslint-disable no-console */
import mongoose from 'mongoose';
import config from '../config';
import { CANTEEN_CONSTANTS } from '../constants/canteen.constants';
import { UserModel } from '../modules/Auth/auth.model';
import { EntryModel } from '../modules/Entry/entry.model';
import { OfficeModel } from '../modules/Office/office.model';
import { SquadronModel } from '../modules/Squadron/squadron.model';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for database seeding...');
    await mongoose.connect(config.databaseUrl);
    console.log('MongoDB connected successfully.');

    // 1. Seed Offices
    console.log('Seeding RTS BAF offices...');
    for (let i = 0; i < CANTEEN_CONSTANTS.defaultOffices.length; i++) {
      const officeName = CANTEEN_CONSTANTS.defaultOffices[i];
      await OfficeModel.findOneAndUpdate(
        { name: officeName },
        {
          $setOnInsert: { name: officeName, sortOrder: i + 1, isActive: true },
        },
        { upsert: true, new: true },
      );
    }
    console.log('Offices seeded successfully.');

    // 2. Seed Default Entry
    console.log(`Seeding default Entry ${CANTEEN_CONSTANTS.defaultEntry}...`);
    await EntryModel.findOneAndUpdate(
      { entryNo: CANTEEN_CONSTANTS.defaultEntry },
      {
        $setOnInsert: {
          entryNo: CANTEEN_CONSTANTS.defaultEntry,
          status: 'ACTIVE',
        },
      },
      { upsert: true, new: true },
    );
    console.log('Default Entry batch seeded.');

    // 2.5 Seed Squadrons and Rooms
    console.log('Seeding BAF RTS squadrons and room numbers...');
    const defaultRooms = Array.from({ length: 16 }, (_, i) => `Room ${i + 1}`);
    for (const sqn of CANTEEN_CONSTANTS.squadrons) {
      await SquadronModel.findOneAndUpdate(
        { name: sqn },
        {
          $setOnInsert: {
            name: sqn,
            rooms: defaultRooms,
            isActive: true,
          },
        },
        { upsert: true, new: true },
      );
    }
    console.log('Squadrons and rooms seeded successfully.');

    // 3. Seed Default Admin, NCOIC, and JCOIC users
    console.log('Seeding default manager users...');

    const defaultUsers = [
      {
        username: 'admin',
        name: 'Officer Commanding Canteen',
        rank: 'Sqn Ldr',
        bdNo: 'BD/90001',
        email: 'admin@rts.baf.mil.bd',
        password: 'AdminPassword123',
        role: 'ADMIN',
        isActive: true,
      },
      {
        username: 'ncoic',
        name: 'Shanjid Ahmad',
        rank: 'Cpl',
        bdNo: 'BD/472770',
        trade: 'E&I Fitter',
        email: 'shanjid@rts.baf.mil.bd',
        password: 'NcoicPassword123',
        role: 'NCOIC',
        isActive: true,
      },
    ];

    for (const u of defaultUsers) {
      const existing = await UserModel.findOne({
        $or: [{ username: u.username }, { bdNo: u.bdNo }],
      });

      if (!existing) {
        await UserModel.create(u);
        console.log(`User ${u.username} (${u.role}) created.`);
      } else {
        console.log(`User ${u.username} already exists.`);
      }
    }

    console.log('Database seeding finished successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Database seeding failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
