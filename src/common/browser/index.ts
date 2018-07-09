import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as api from './api';
import { GetPage, CloseBrowser, CreateBrowser } from 'src/common/interfaces';

const getUrl = (endpoint: string): string => `https://www.instagram.com${endpoint}`;

const createBrowser: CreateBrowser = async () => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['--lang=en-US,en'],
  });

  const getPage: GetPage = async function getPage(endpoint, fn) {
    let page: puppeteer.Page;
    let result;

    try {
      const url = getUrl(endpoint);
      console.log(url);
      page = await browser.newPage();

      await page.goto(url, { waitUntil: 'load' });

      page.on('console', msg => {
        const leng = msg.args().length;
        for (let i = 0; i < leng; i += 1) {
          console.log(`${i}: ${msg.args()[i]}`);
        }
      });

      await page.addScriptTag({
        path: path.join(__dirname, '../../../src/common/scraper/scraper.js'),
      });

      result = await fn(page);
      await page.close();
    } catch (e) {
      if (page) {
        await page.close();
      }

      throw e;
    }

    return result;
  };

  const close: CloseBrowser = async function close() {
    await browser.close();
    browser = null;
  };

  return {
    getPage,
    close,
    ...api,
  };
};

export { createBrowser };
