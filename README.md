# lh-ops-random-emoji

For [Lighthouse's](wearelighthouse.com/) [Airtable](https://airtable.com/) Operations members table.

- A place to save the random emoji list.
- A tool to generate formulas for the **Random Number** and **Random Emoji** columns.

![image](https://user-images.githubusercontent.com/462459/116162633-1df5b000-a6ee-11eb-8a34-bd2c1c4b175f.png)

## Usage

1. Clone the repo:  
`$ git clone https://github.com/burntcustard/lh-ops-random-emoji.git`

2. Install dependencies:  
`$ npm i`

3. Edit [emojis.md](emojis.md) via a text editor, **or** copy one or more emojis into your clipboard for the CLI tool to ingest.

4. Start:  
`$ npm start`

5. If you're using this repo to store the emoji list, commit:  
`$ git commit emojis.md -m "Add 🚀"`

## Reasoning

In JavaScript, you can't easily use string methods for choosing emoji, as they're composed of one, or sometimes multiple, code points. E.g. ☠️ is `U+2620` **and** `U+FE0F`.

`🐙🦁🐨🐻🐯🦆.charAt(2) // -> 'ud83e'`

However, arrays work well:  
`['🐙','🦁','🐨','🐻','🐯','🦆'][2] // -> '🐨'`

Unfortunately, Airtable formulas don't support accessing arrays by index.

Instead, you can use the [switch function](https://support.airtable.com/hc/en-us/articles/203255215-Formula-field-reference#logical_functions):  
`SWITCH({2}, 0, "🐙", 1, "🦁", 2, "🐨", 3, "🐻", 4, "🐯", 5, "🦆") // -> "🐨"`

Because adding and removing individual emojis from that list required me to keep track of the index, and add like 5 whole characters per emojis, and I'm exceptionally lazy, I made this tool to take a string of emojis from a file, and create the switch function for me!
