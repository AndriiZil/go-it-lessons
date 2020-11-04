const { promises: fsPromises } = require('fs');

async function readFileAsync() {
    try {
        const data = await fsPromises.readFile();
    } catch(err) {
        console.log(err);
    }
}