import { GetFollowing } from 'src/common/interfaces';

const getFollowing: GetFollowing = async function getFollowing(username) {
  return this.getPage(`/${username}`, async (page) => {
    let buttonOfFollowingList = await page.$(`a[href="/${username}/following/"]`);

    if (!buttonOfFollowingList) {
      const buttonOfFollowingListSelector = await page.evaluate(() => {
        const { scrapper } = window as any;
        const el = scrapper.findOne({
          selector: 'a',
          where: el => el.text().includes('following'),
        });

        if (!el) {
          return '';
        }

        return el
          .setScrapperAttr('buttonOfFollowingList', 'buttonOfFollowingList')
          .getSelectorByScrapperAttr('buttonOfFollowingList');
      });

      if (buttonOfFollowingListSelector) {
        buttonOfFollowingList = await page.$(buttonOfFollowingListSelector);
      }
    }

    await buttonOfFollowingList.click();
    await page.waitFor(1000);

    const following = await page.evaluate(async () => {
      const { scrapper } = window as any;

      return scrapper
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
