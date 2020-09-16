import rp from 'request-promise';
import { load } from 'cheerio';

const url = 'https://www.discgolfscene.com/tournaments/options;distance=120;zip=12866;';

//getTournamentList('120', '12866');

export function getTournamentList(dist, zip, callback) {
rp(`https://www.discgolfscene.com/tournaments/options;distance=${dist};zip=${zip};`)
  .then(function(html){
    //success!
    const $ = load(html);
    //console.log($('a').length);
    //console.log($('div .tournaments-listing-all').children().html());

    const tourney = [];
    var t = 0;
    $('div .tournaments-listing-all').children().each(function(i, elem) {
        if (t < 12) {
        const cou = $(this).children().children().children('span').slice($(this).children().children().children('span').length - 2,$(this).children().children().children('span').length - 1).text().replace("at ", "");
        const hos = $(this).children().children().children('span').slice($(this).children().children().children('span').length - 1,$(this).children().children().children('span').length - 0).text().replace("hosted by ", "");
        var thisOne = {
            name: $(this).children().children().children('em').text(),
            date: $(this).children().children().children('.t-date').text(),
            regOpen: $(this).children().children().children().hasClass('trego'),
            course: cou.substring(0, cou.indexOf("·")).trim(),
            city: cou.substring(cou.indexOf("·")+1,cou.length).trim(),
            host: hos,
            url: 'https://www.discgolfscene.com' + $(this).children().children().attr('href')
        };
        console.log(`Tournament Name: ${thisOne.name}`);
        console.log(`Tournament Date: ${thisOne.date}`);
        console.log(`Registration: ${thisOne.regOpen}`);
        console.log(`Course: ${thisOne.course}`);
        console.log(`City: ${thisOne.city}`);
        console.log(`Host: ${thisOne.host}`);
        console.log(`Url: ${thisOne.url}`);
        tourney[i] = thisOne;
        console.log(i);
        if (t == 12) {
            console.log("length of array: " + tourney.length);
            callback(tourney);
            return tourney;
        };
    };
        //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        //console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        t++;
    });
    console.log(tourney[1].name);
    callback(tourney);
  })
  .catch(function(err){
    //handle error
    callback(null);
  });
}




export function getTournamentDetails(name, callback) {
    rp(`https://www.discgolfscene.com/search/${name}`)
      .then(function(html){
        //success!
        const $ = load(html);
        if ($('.search-result').children('a').attr('href') != null) {
            getTournamentDetailsURL($('.search-result').children('a').attr('href'),  function(returnValue) {
                callback(returnValue);
            });
        } else {
            callback('I did not find a tournament with the name ' + name);
        }
      })
      .catch(function(err){
        //handle error
        callback(null);
      });
    }
    
    export function getTournamentDetailsURL(url, callback) {
        rp(`${url}`)
          .then(function(html){
            //success!
            const $ = load(html);
            var respo = '```';
            respo = respo + $('.tournament-name').text() + '\n';
            if ($('.tournament-meta').length > 0) {
                respo = respo + '‣ ' + $('.tournament-meta').text().trim() + '\n';
            };
            if ($('.tournament-registration-opens').length > 0) {
                respo = respo + '‣ ' + $('.tournament-registration-opens').text().replace('Follow this tournament for a 24-hour reminder','').replace('opens','opens ') + '\n';
            };

            var result = $('.tournament-locations').siblings().text().trim();

            if (result.includes('Event results')) {
                respo = respo + '‣ ' + result + '\n';
            }

            getTournamentRegistration(url, respo, function(returnValue) {
                callback(returnValue);
            });


          })
          .catch(function(err){
            //handle error
            console.log(err.name);
            //callback(null);
          });
        }


        export function getTournamentRegistration(url, respo, callback) {
            rp(`${url}/registration`)
              .then(function(html){
                //success!
                const $ = load(html);


                if ($('.message-suggestion').length > 0) {
                    respo = respo + '‣ ' + $('.message-suggestion').text().trim().replace(".",". ").replace('e.', 'e. ') + '\n';
                };

                

                respo = respo + '‣ ' + url + '\n```';
                callback(respo);
              })
              .catch(function(err){
                //handle error
                console.log(err.name);
                callback(null);
              });
            }