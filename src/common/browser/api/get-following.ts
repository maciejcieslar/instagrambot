import { GetFollowing } from 'src/common/interfaces';

const getFollowing: GetFollowing = async function getFollowing(username) {
  return this.getPage(`/${username}`, async (page) => {
    let buttonOfFollowingList = await page.$(`a[href="/${username}/following/"]`);

    if (!buttonOfFollowingList) {
      const buttonOfFollowingListSelector = await page.evaluate(() => {
        const { scraper } = window as any;
        const el = scraper.findOne({
          selector: 'a',
          where: el => el.text().includes('following'),
        });

        if (!el) {
          return '';
        }

        return el
          .setscraperAttr('buttonOfFollowingList', 'buttonOfFollowingList')
          .getSelectorByscraperAttr('buttonOfFollowingList');
      });

      if (buttonOfFollowingListSelector) {
        buttonOfFollowingList = await page.$(buttonOfFollowingListSelector);
      }
    }

    await buttonOfFollowingList.click();
    await page.waitFor(1000);

    const following = await page.evaluate(async () => {
      const { scraper } = window as any;

      return scraper
        .find({
          selector: 'a[title].notranslate',
        })
        .slice(0, 20)
        .map(el => el.getAttr('title'));
    });

    return following;
  });
};

export { getFollowing };
