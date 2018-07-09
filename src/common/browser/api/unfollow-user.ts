import { UnFollowUser } from 'src/common/interfaces';

const unfollowUser: UnFollowUser = async function unfollowUser(username) {
  return this.getPage(`/${username}`, async (page) => {
    const unfollowButtonSelector = await page.evaluate(() => {
      const { scrapper } = window as any;
      let el = scrapper.findOneWithText({
        selector: 'button',
        text: 'Following',
      });

      if (!el) {
        el = scrapper.findOne({
          selector: 'button._qv64e._t78yp._r9b8f._njrw0',
        });
      }

      if (!el) {
        return '';
      }

      return el
        .setScrapperAttr('following', 'following')
        .getSelectorByScrapperAttr('following');
    });

    if (!unfollowButtonSelector) {
      return null;
    }

    const unfollowButton = await page.$(unfollowButtonSelector);
    await unfollowButton.click();

    const confirmUnfollowButtonSelector = await page.evaluate(() => {
      const { scrapper } = window as any;

      return scrapper
        .findOneWithText({ selector: 'button', text: 'Unfollow' })
        .setScrapperAttr('confirmUnfollowButton', 'confirmUnfollowButton')
        .getSelectorByScrapperAttr('confirmUnfollowButton');
    });

    (await page.$(confirmUnfollowButtonSelector)).click();

    await page.waitFor(1500);
  });
};

export { unfollowUser };
