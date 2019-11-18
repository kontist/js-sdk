#!/usr/bin/env node

// split command and arguments
let [,, cmd, ...args] = process.argv;
const fs = require("fs");

// some basic traversal attack protection
cmd = cmd.replace(/[^a-z\-]/gi, '');

// if a file with the name of the command exists run it
if (fs.existsSync(`${__dirname}/${cmd}.js`)) {
    require('dotenv').config();
    require(`${__dirname}/${cmd}`).exec(args)
        .catch(e => console.error(e));
} else {
    console.error(`Unknown command: '${cmd}'`);
    process.exit(127);
}
