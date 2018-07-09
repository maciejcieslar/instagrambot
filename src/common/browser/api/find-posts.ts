import { FindPosts } from 'src/common/interfaces';

const findPosts: FindPosts = async function findPosts(
  hashtag,
  numberOfPosts = 12,
) {
  return this.getPage(`/explore/tags/${hashtag}`, async (page) => {
    if (numberOfPosts > 12) {
      await page.evaluate((posts) => {
        const { scrapper } = window as any;

        scrapper.scrollPageTimes({ times: Math.ceil((posts - 9) / 12) });
      }, numberOfPosts);
    }

    // waitFor render
    await page.waitFor(1000);

    return page.evaluate((posts) => {
      const { scrapper } = window as any;

      return scrapper
        .find({ selector: 'a[href^="/p/"]', count: posts + 9 })
        .slice(9)
        .map((el) => el.getAttr('href'));
    }, numberOfPosts);
  });
};

export { findPosts };
