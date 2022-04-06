#!/usr/bin/env node

import { prompt } from "inquirer";
import { list } from "./commands/config";
import { displayMenu } from "./menu";

displayMenu();
// prompt([{ name: "Hi", message: "Hello", type: "list", choices: list }]).then(
//   (ans) => {
//     console.log(ans);
//   },
// );
// import yargs from 'yargs';
// import { hideBin } from 'yargs/helpers';

// yargs(hideBin(process.argv))
//   // Use the commands directory to scaffold.
//   .commandDir('commands')
//   // Enable strict mode.
//   .strict()
//   // Useful aliases.
//   .alias({ h: 'help' })
//   .argv;
