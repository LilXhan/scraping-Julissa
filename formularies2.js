const puppeteer = require('puppeteer');
const fs = require('fs');
(async() => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://justice.ge.ch/fr/contenu/formulaires')
    const pageEvaluate = await page.evaluate(()=>{
      const form = [];
      const title =  document.querySelectorAll('#fg-1490 .forms-group__title');
      const description = document.querySelectorAll('#fg-1490 .article-header__desc');
      const subTitle = document.querySelectorAll('#fg-1490 .forms-list__title');
      const descriptionSubTitle = document.querySelectorAll('#fg-1490 .forms-list__desc');
      const pdf = document.querySelectorAll('#fg-1490 .forms-list__item a');
      title.forEach((title)=> {
        form.push({
          title : title.innerText
        })
      });
      description.forEach((desc)=>{
        form.push({
          description: desc.innerText
        });
      });
      subTitle.forEach((subTitle)=>{
        form.push({
          subtitle: subTitle.innerText
        });
      });
      descriptionSubTitle.forEach((descSubT)=>{
        form.push({
          descriptionSubTitle: descSubT.innerText
        });
      });
      pdf.forEach((linkPDF)=>{
        form.push({
          linkPDF : linkPDF.getAttribute('href')
        });
      });
      return form;
    });
    fs.writeFile('form.json', JSON.stringify(pageEvaluate), function(err) {
      if (err) throw err;
      console.log('complete');
    });
    browser.close()
})();
