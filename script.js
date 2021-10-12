require("chromedriver"); // import chromedriver

let wd = require("selenium-webdriver"); // make selenium webdriver object

let browser = new wd.Builder().forBrowser('chrome').build(); // build new browser

let matchid = 35092; // match ID from cricbuzz

let inning1batsmen = []; // data of inning 1 batsmen
let inning1ballers = []; // data of inning 1 ballers
let batinfo = [ "Player Name", "Runs", "Balls Played", "4s", "6s", "Strike Rate" ]; // batsmen info
let ballinfo = [ "Player Name", "O", "M", "R", "W", "NB", "WD", "ECO" ]; // ballers info
async function main(inning) {
    await browser.get(`https://www.cricbuzz.com/live-cricket-scores/${matchid}`); // open URL
    await browser.wait(wd.until.elementsLocated(wd.By.css(".cb-nav-bar a")));
    let buttons = await browser.findElements(wd.By.css(".cb-nav-bar a"));
    await buttons[1].click();
    await browser.wait(wd.until.elementsLocated(wd.By.css(`#innings_${inning} .cb-col.cb-col-100.cb-ltst-wgt-hdr`)));
    let tables = await browser.findElements(wd.By.css(`#innings_${inning} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
    
    // getting rows of inning 1 batsmen table i.e., tables[0]
    let batr = await tables[0].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    // traversing through all rows in i1batr array
    for( i in batr ) {
        let col = await batr[i].findElements(wd.By.css("div"));
        if( col.length != 7 ) { break; }
        col.splice(1,1);
        let player = new Object();
        for( j in col ) {
            let data = await col[j].getText(wd.By.css("div"));
            // let data = await col[j].getAttribute("innerText");  // used in class
            player[batinfo[j]] = data;
        }
        inning1batsmen.push(player);
    }

    // getting ballers data
    
    // getting rows of inning 1 ballers table i.e., tables[1]
    let ballr = await tables[1].findElements(wd.By.css(".cb-col.cb-col-100.cb-scrd-itms"));
    // traversing through all rows in i1batr array
    for( i in ballr ) {
        let col = await ballr[i].findElements(wd.By.css("div"));
        let player = new Object();
        for( j in col ) {
            let data = await col[j].getText(wd.By.css("div"));
            player[ballinfo[j]] = data;
        }
        inning1ballers.push(player);
    }

    console.log(inning1batsmen);
    console.log(inning1ballers);

    browser.close();
}
main(1);