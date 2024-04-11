const { exec } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the name for the new migration: ', (migrationName) => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const migrationFolderName = `${timestamp}_${migrationName}`;
  const migrationsDir = path.join(
    __dirname,
    'prisma_sqlite/migrations',
    migrationFolderName,
  );

  // Create the migration folder
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  const migrationFilePath = path.join(migrationsDir, 'migration.sql');

  const command = `npx prisma migrate diff --from-schema-datasource ./prisma_sqlite/schema.prisma --to-schema-datamodel ./prisma_sqlite/schema.prisma --script > ${migrationFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Migration script created: ${migrationFilePath}`);
  });

  rl.close();
});
