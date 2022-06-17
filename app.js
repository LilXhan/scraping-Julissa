const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();
  await page.goto('https://justice.ge.ch/fr')
  await page.click('.burger-button__icon')
  await page.click('.navigation-bar__link')
  const enlaces = await page.evaluate(()=>{
    const elements = document.querySelectorAll('.row .col-lg-3 a');
    const links = [];
    for(let element of elements){
      links.push(element.href)
    }
    return links.slice(0,30);
  })

  const pages = [];
  for(let enlace of enlaces){
    await page.goto(enlace);
    await page.waitForSelector('.article-header');

    const pageEvaluate = await page.evaluate(()=>{
      const tmp = {};
      tmp.title = document.querySelector('.article-header__title-content').innerText;
      tmp.description = document.querySelector('.article-header__desc').innerText;
      return tmp;

    })
    pages.push(pageEvaluate)
  }
  fs.writeFile('results.json', JSON.stringify(pages), function(err) {
    if (err) throw err;
    console.log('complete');
  });
  browser.close()
})();
