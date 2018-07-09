import * as _ from 'lodash';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as api from './api';
import { GetPage, CloseBrowser, CreateBrowser } from 'src/common/interfaces';

const getUrl = (endpoint: string): string =>
  `https://www.instagram.com${endpoint}`;

const createBrowser: CreateBrowser = async () => {
  let browser = await puppeteer.launch({
    headless: true,
    args: ['--lang=en-US,en'],
  });
  let activePages: puppeteer.Page[] = [];

  async function closeInactivePages(pages: puppeteer.Page[]) {
    await Promise.all(
      pages.map(async (openedPage) => {
        if (!_.includes(activePages, openedPage)) {
          await openedPage.close();
          return null;
        }

        return openedPage;
      }),
    );
  }

  const getPage: GetPage = async function getPage(endpoint, fn) {
    let page: puppeteer.Page;
    let result;

    try {
      const url = getUrl(endpoint);
      console.log(url);
      page = await browser.newPage();
      activePages = [...activePages, page];

      await closeInactivePages(await browser.pages());
      await page.goto(url, { waitUntil: 'load' });

      page.on('console', (msg) => {
        const leng = msg.args().length;
        for (let i = 0; i < leng; i += 1) {
          console.log(`${i}: ${msg.args()[i]}`);
        }
      });

      await page.addScriptTag({
        path: path.join(__dirname, '../../../src/common/scrapper/scrapper.js'),
      });

      result = await fn(page);
      await page.close();
    } catch (e) {
      if (page) {
        await page.close();
      }

      throw e;
    }

    activePages = activePages.filter((activePage) => activePage !== page);
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