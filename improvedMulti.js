require("chromedriver"); // import chromedriver

let wd = require("selenium-webdriver"); // make selenium webdriver object
let browser = new wd.Builder().forBrowser('chrome').build(); // build new browser

const fs = require('fs');

let matchid = 30880; // match ID from cricbuzz
// use 35092, 32267 as id too
let carrerinfo = {};
let batcinfo = [ "Match Type", "M", "Inn", "NO", "Runs", "HS", "Avg", "BF", "SR", "100", "200", "50", "4s", "6s" ]; // batsmen carrer info
let bowlcinfo = [ "Match Type", "M", "Inn", "B", "Runs", "Wkts", "BBI", "BBM", "Econ", "Avg", "SR", "5W", "10W" ]; // ballers carrer info
let playersAdded = 0;
async function getCarrerData(url, totalPlayers) {
    let browser = new wd.Builder().forBrowser('chrome').build();
    await browser.get(url);
    await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-font-40")));
    
    // getting player name
    let tabs = await browser.findElement(wd.By.css(".cb-font-40"));
    let playerName = await tabs.getAttribute("innerText");

    // await browser.wait(wd.until.elementsLocated(wd.By.css(".table.cb-col-100.cb-plyr-thead")));
    let allRows = await browser.findElements(wd.By.css(".table.cb-col-100.cb-plyr-thead tbody tr"));
    
    let temp = {}; // to contain carrer data for one player
    let batcollection = {};
    let bowlcollection = {};
    for( row of allRows ) {
        let col = await row.findElements(wd.By.css("td"));
        let curr_match = {};
        let matchType = await col[0].getAttribute("innerText");
        for( let i = 1; i < col.length; i++ ) {
            let data = await col[i].getAttribute("innerText");
            if( col.length == 14 ) { curr_match[batcinfo[i]] = data; }
            else { curr_match[bowlcinfo[i]] = data; }
        }
        if( col.length == 14 ) { batcollection[matchType] = curr_match; }
        else { bowlcollection[matchType] = curr_match; }
    }
    temp["Batting Carrer"] = batcollection;
    temp["Bowling Carrer"] = bowlcollection;

    carrerinfo[playerName] = temp;

    playersAdded++;
    if( playersAdded == totalPlayers ) { fs.writeFileSync('output.json', JSON.stringify(carrerinfo)); }
    
    browser.close();
}

async function main(inning) {
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchid}`); // open URL
    await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementsLocated(wd.By.css(`#innings_${inning} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${inning} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    
    // getting rows of inning 1 batsmen table i.e., tables[0]
    let batr = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    
    // getting rows of inning 1 ballers table i.e., tables[1]
    let ballr = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));

    // getting batsmen player's carrer data

    let profiles = [];
    for( i in batr ) {
        let col = await batr[i].findElements(wd.By.css("div"));
        if( col.length != 7 ) { continue; }
        let tag = await col[0].findElement(wd.By.css("a"));
        let ref = await tag.getAttribute("href");
        profiles.push(ref);
    }
    for( i in ballr ) {
        let col = await ballr[i].findElements(wd.By.css("div"));
        profiles.push( await (await col[0].findElement(wd.By.css("a"))).getAttribute("href") );
    }

    for( let url of profiles ) {
        getCarrerData(url, profiles.length);
    }

    browser.close();
}

main(1);