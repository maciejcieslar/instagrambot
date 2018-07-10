import { FindPosts } from 'src/common/interfaces';

const findPosts: FindPosts = async function findPosts(hashtag, numberOfPosts = 12) {
  return this.getPage(`/explore/tags/${hashtag}`, async page => {
    if (numberOfPosts > 12) {
      await page.evaluate(async posts => {
        const { scraper } = window as any;

        await scraper.scrollPageTimes({ times: Math.ceil((posts - 12) / 12) + 1 });
      }, numberOfPosts);
    }

    // waitFor render
    await page.waitFor(10000);

    return page.evaluate(posts => {
      const { scraper } = window as any;

      return scraper
        .find({ selector: 'a[href^="/p/"]', count: posts + 9 })
        .slice(9)
        .map(el => el.getAttr('href'));
    }, numberOfPosts);
  });
};

export { findPosts };
