//node -r esm index.js
require('dotenv').config();
import { getTournamentList, getTournamentDetails } from './scrape/localTournaments.js';
import { getPlayerInfoByName } from './scrape/pdgaPlayer.js';
import { Client } from 'discord.js';
import { postcodeValidator } from 'postcode-validator';
const bot = new Client();
const TOKEN = process.env.TOKEN;

bot.login(TOKEN);
getTournamentDetails('Blatnick Breeze', function(returnValue) {
  console.log('Returned: ***************\n' + returnValue + '\n**********************\n');
});

getTournamentDetails('green mountain championship', function(returnValue) {
  console.log('Returned: ***************\n' + returnValue + '\n**********************\n');
});

getTournamentDetails('Battle of Saratoga', function(returnValue) {
  console.log('Returned: ***************\n' + returnValue + '\n**********************\n');
});

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');

  } else if (msg.content.startsWith('!tournament')) {
    var command = msg.content.replace('!tournament', '').trim();
    getTournamentDetails(command, function(returnValue) {
      msg.channel.send(returnValue);
    });

  } else if (msg.content.startsWith('!pdganame')) {
    var command = msg.content.replace('!pdganame', '').trim();
    getPlayerInfoByName(command, function(returnValue) {
      msg.channel.send(returnValue);
    });
  } else if (msg.content.startsWith('!nearbytournaments')) {
    //Get list of tournaments within 75 miles of zip code
    var command = msg.content.replace('!nearbytournaments', '').trim();
    if (/^\d+$/.test(command) && command.length == 5) {
      if (postcodeValidator(command, 'US')) {
        //msg.channel.send('Valid Postcode');
      }
      //valid 5 digit zip code
      getTournamentList('75', command, function(returnValue) {
        //msg.channel.send(returnValue[1].name);
        var resp = '```'
        var i = 0;
        while (returnValue != null && i < returnValue.length) {
          //console.log(resp);
          resp = resp  + '‣ ' +  returnValue[i].name + ' | | ' + returnValue[i].course + ' | | ' + returnValue[i].city + ' | | ' + returnValue[i].date + '\n';
          i++;
        }
        resp = resp + '```\n'
        msg.channel.send(resp);
      });
      //msg.reply(command);
    } else {
      msg.channel.send('Please enter a 5 digit zip code. example: !tournaments 12866 \n!commands for the list of accessible commands.')
    }
    //msg.channel.send('test' + msg.content);

  } else if (msg.content.startsWith('!kick')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  }
});
