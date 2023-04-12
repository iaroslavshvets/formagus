const fs = require('fs');
const path = require('path');

const createPath = (fileName) => path.resolve(__dirname, '../build/', fileName);

const content = fs.readFileSync(createPath('index.html'), 'utf8');

fs.writeFileSync(createPath('200.html'), content, 'utf8');
