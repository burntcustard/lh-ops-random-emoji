const fs = require('fs');
const inquirer = require('inquirer');
const clipboardy = require('clipboardy');
const pressAnyKey = require('press-any-key');
const emojiRegex = require('emoji-regex/RGI_Emoji.js')();
let emojis = fs.readFileSync('emojis.md', 'utf8').trim();
let clipboardEmoji = '';

function printCurrentList() {
  console.log('Current emoji list:');
  console.log(emojis);
}

async function printRandomEmojiFormula() {
  const randomEmojiFormula = [...emojis].reduce((accumulator, emoji, index) => `${accumulator}, ${index}, "${emoji}"`, 'SWITCH({Random Number}') + ')';
  console.log(`\n${randomEmojiFormula}\n`);
  clipboardy.writeSync(randomEmojiFormula);
  console.log(' - Copied to clipboard!');
}

async function printRandomNumberFormula() {
  const randomNumberFormula = `MOD(VALUE(DATETIME_FORMAT(NOW(), 'D')) + Autonumber, ${[...emojis].length})`;
  console.log(`\n${randomNumberFormula}\n`);
  clipboardy.writeSync(randomNumberFormula);
  console.log(' - Copied to clipboard!');
}

async function removeEmoji() {
  await inquirer
    .prompt([{
      type: 'list',
      name: 'list',
      message: 'Choose an emoji to remove:',
      choices: [...emojis].map((e, i) => ({ name: e, value: i })),
      loop: false,
    }])
    .then(answers => {
      const removedEmoji = [...emojis][answers.list];
      emojis = [...emojis].filter((e, i) => i !== answers.list, 1).join('');
      fs.writeFileSync('emojis.md', emojis);
      console.clear();
      printCurrentList();
      console.log(` - Removed ${removedEmoji}`);
    });
}

async function addEmoji() {
  console.clear();

  if (clipboardEmoji.length === 0) {
    printCurrentList();
    console.log('No emoji in clipboard, none added.');
    return;
  }

  emojis += clipboardEmoji.join('');
  printCurrentList();
  fs.writeFileSync('emojis.md', emojis + '\r\n');
  console.log(` - Added ${clipboardEmoji} to the list`);
}

const tools = {
  'Remove emoji from list': removeEmoji,
  'Add emoji (#) from clipboard': addEmoji,
  'Random emoji formula': printRandomEmojiFormula,
  'Random number formula': printRandomNumberFormula,
  'Exit': async () => console.log('👋'),
}

const questions = () => ([{
  type: 'list',
  name: 'menu',
  message: 'Choose an option:',
  choices: Object.keys(tools).map(t => ({
    name: t.replace('#', clipboardEmoji.join('') || 'none'),
    value: t,
  })),
}]);

function main() {
  console.clear();
  printCurrentList();
  console.log();
  clipboardEmoji = [...clipboardy.readSync().matchAll(emojiRegex)].map(e => e[0]);
  inquirer
    .prompt(questions())
    .then(answers => {
      tools[answers.menu]()
        .then(() => {
          if (answers.menu !== 'Exit') {
            console.log('');
            pressAnyKey('', { ctrlC: 'reject' }).then(main).catch(error => error);
          }
        });
    })
    .catch(error => {
      console.error(error);
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
}

main();
