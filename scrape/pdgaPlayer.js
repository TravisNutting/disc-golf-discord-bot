import rp from 'request-promise';
import { load } from 'cheerio';

const url = 'https://www.discgolfscene.com/tournaments/options;distance=120;zip=12866;';

//getTournamentList('120', '12866');

export function getPlayerInfoByName(name, callback) {
    var names = name.replace(' ', '+');
rp(`https://www.pdga.com/search?keywords=${names}&f%5B0%5D=search_node_index%253Apdga_search_unified_type%3APlayer`)
  .then(function(html){
    //success!
    const $ = load(html);
    //console.log($('a').length);
    //console.log($('div .tournaments-listing-all').children().html());
    console.log($('.player-name').text());
    //console.log($('.player-name').parent().attr('href'));
    //console.log('player name: ' + $('.player-name').text());
    if ($('.player-name').text().length > 0) {
    $('.player-name').each(function(i, elem) {
        //console.log($(this).text());
        if ($(this).text().toLowerCase() === name.toLowerCase()) {
            //console.log('MATCH' + $(this).text());
            console.log($(this).parent().attr('href'));
            //Call the pdga info func
            getPlayerPDGAInfo($(this).parent().attr('href'),  function(returnValue) {
                callback(returnValue);
            });
        }
    });
    
} else {
    callback('```No PDGA player was found with the name ' + name + '```');
}

    /*
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
    });*/
    //console.log(tourney[1].name);
    //callback(tourney);
  })
  .catch(function(err){
    //handle error
    callback(null);
  });
}


export function getPlayerPDGAInfo(url, callback) {
    rp(`https://www.pdga.com/${url}`)
  .then(function(html){
    var resp = '```';
    //success!
    const $ = load(html);
    resp = resp + $('.pane-page-title').text().trim() + '\n‣ ' + $('.classification').text() + '\n';
    //console.log($('.classification').text());
    if ($('.join-date').length > 0) {
        resp = resp + '‣ ' + $('.join-date').text() + '\n';
    };
    if ($('.current-rating').length > 0) {
        resp = resp + '‣' + $('.current-rating').text() + '\n';
    };
    if ($('.career-events').length > 0) {
        resp = resp + '‣ ' + $('.career-events').text() + '\n';
    };
    if ($('.upcoming-events').length > 0) {
        resp = resp + '‣ ' + $('.upcoming-events').text() + '\n';
    };
    //console.log(resp);
    //console.log($('.pane-page-title').children().children().text());
    resp = resp + '```';
    callback(resp);
  })
  .catch(function(err){
    //handle error
    callback(null);
  });
}

