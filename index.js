const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { findOrganization } = require('./postgres-service');

const rl = readline.createInterface({
  input: fs.createReadStream(path.join(__dirname, 'companies.txt')),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  // FIXME: there could be await with deferring
  findOrganization(line)
    .then((res) => {
      if (!res.rows?.length) {
        return;
      }
      process.stdout.write(`${line} --> `);
      console.dir(res.rows.map((o) => o.name));
    })
    .catch((err) => {
      console.error(err);
    });
});
