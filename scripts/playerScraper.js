const puppeteer = require('puppeteer');
const fs = require('fs');

// This function takes as input a url and scrapes all the player data from the page and returns an array of objects which contain the player data
const scrapeAllPlayers = async (url) => {
  try {
    const start = Date.now();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //Setup request interceptor to stop loading of CSS and images
    await page.setRequestInterception(true);

    // Intercept requests for images, css, fonts, media, and scripts
    page.on('request', (request) => {
      if (
        request.resourceType() === 'image' ||
        request.resourceType() === 'stylesheet' ||
        request.resourceType() === 'font' ||
        request.resourceType() === 'media' ||
        request.resourceType() === 'script'
      )
        request.abort();
      else request.continue();
    });

    // Go to page
    await page.goto(url);
    await page.content;

    // Create table of players and fill in data
    let playerTable = await page.evaluate(() => {
      let playerArray = [];

      // Create 25 player objects and append to the playerArray
      const allChildren = document.querySelector(
        '#rankings_landing_container > div > div.page-content.page-content--no-padding > div.wrapper-content-results.rankings_wrapper-content-results > div > div > table > tbody'
      );
      for (i = 0; i < 49; i += 2) {
        // const child = document.querySelector(
        //   '#rankings_landing_container > div > div.page-content.page-content--no-padding > div.wrapper-content-results.rankings_wrapper-content-results > div > div > table > tbody'
        // ).children[i];
        const child = allChildren.children[i];
        let playerJSON = new Object();

        playerJSON.rank = parseInt(child.children[0].innerText);
        playerJSON.country = child.children[1].innerText;
        playerJSON.name = child.children[2].innerText;
        playerJSON.url =
          child.children[2].children[0].children[0].children[0].href;

        let winLoss = child.children[4].innerText.split(' - ');
        playerJSON.wins = parseInt(winLoss[0]);
        playerJSON.losses = parseInt(winLoss[1]);

        playerJSON.prizeMoney = parseFloat(
          child.children[5].innerText.replace('$', '').replace(/,/g, '')
        );

        playerJSON.points = parseInt(
          child.children[6].innerText.split(' / ')[0].replace(/,/g, '')
        );

        playerJSON.discipline = document.querySelector(
          '#ajaxTabsRanking > li.active > a'
        ).innerText;

        playerJSON.lastUpdated = Date.now();

        playerArray.push(playerJSON);
      }

      return playerArray;
    });

    for (i = 0; i < playerTable.length; i++) {
      await page.goto(playerTable[i].url);
      await page.content;
      let DOB = await page.evaluate(() => {
        return document.querySelector(
          '#container-players-profile > section.playertop > div > div.player-profile-wrap > div.player-profile-data > div.player-extra-wrap > div.player-age > span:nth-child(3)'
        ).innerText;
      });
      playerTable[i].DOB = Date.parse(DOB.split('/').reverse().join('-'));
      Date.parse(DOB.replace(/\//g, '-'));
    }

    fs.writeFile(
      './../data/player-data.json',
      JSON.stringify(playerTable),
      (err) => {
        if (err) throw err;
        console.log('File saved!');
      }
    );

    const end = Date.now();
    const time = end - start;

    console.log(`Time taken to execute script: ${time}`);

    await browser.close();
    return;
  } catch (err) {
    console.log(err);
    return;
  }
};

async function f() {
  try {
    let players = await scrapeAllPlayers(
      'https://bwfbadminton.com/rankings/2/bwf-world-rankings/6/men-s-singles/2020/12/?rows=25&page_no=2'
    );
    return players;
  } catch (err) {
    console.log(err);
    return;
  }
}

f().then(() => {
  return;
});

module.exports = scrapeAllPlayers;
