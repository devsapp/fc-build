const fs = require('fs-extra');
const path = require('path');

async function demo() {
  const aptListFilePath = path.join('./', 'apt-get.list');
  if (fs.pathExistsSync(aptListFilePath)) {
    console.log(2222)
  }
}

demo();