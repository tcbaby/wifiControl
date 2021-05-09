
const puppeteer = require('puppeteer')

const url = 'http://192.168.10.1/';

if (process.argv.length == 2 || (process.argv[2] != 'on' && process.argv[2] != 'off')) {
    console.log('wifi.js on|off')
    return;
}
const control = process.argv[2] == 'on' ? true : false;

(async () => {
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForTimeout(1000);

    // login
    await page.evaluate(() => document.getElementById('Username').value = 'user');
    await page.evaluate(() => document.getElementById('Password').value = 'X6*v694f');
    await page.click('#btnSubmit');
    await page.waitForTimeout(1000);

    await page.evaluate(() => document.getElementsByTagName('frame')[1].contentWindow.document.getElementsByClassName('navNetNormal')[0].getElementsByTagName('div')[0].click())
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.getElementsByTagName('frame')[1].contentWindow.document.getElementById('net-wlan').click())
    await page.waitForTimeout(1000);

    const getWifiStatus = async () => {
        let flag = await page.evaluate(() => document.getElementsByTagName('frame')[1].contentWindow.document.getElementById('wlInfo').style.display)
        return !flag;
    }

    let flag = await getWifiStatus();
    let status = control ? '开启' : '关闭'
    if (control == flag) {
        console.log(`${new Date()}: wifi 处于${status}状态，无需重复${status}!`)
    } else {
        await page.evaluate(() => document.getElementsByTagName('frame')[1].contentWindow.document.getElementById('wlan_enbl').getElementsByTagName('input')[0].click());
        await page.waitForTimeout(1000);

        await page.evaluate(() => document.getElementsByTagName('frame')[1].contentWindow.document.getElementById('btnOK').click());
        await page.waitForTimeout(1000);

        console.log(`${new Date()}: 成功${status}wifi 2.4g!`)
    }

    // logout
    await page.evaluate(() => document.getElementsByTagName('frame')[1].contentWindow.document.getElementsByClassName('welcom')[0].getElementsByTagName('a')[0].click())
    await browser.close();
  })();
