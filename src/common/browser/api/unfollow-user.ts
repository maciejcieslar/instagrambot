import { UnFollowUser } from 'src/common/interfaces';

const unfollowUser: UnFollowUser = async function unfollowUser(username) {
  return this.getPage(`/${username}`, async (page) => {
    const unfollowButtonSelector = await page.evaluate(() => {
      const { scraper } = window as any;
      let el = scraper.findOneWithText({
        selector: 'button',
        text: 'Following',
      });

      if (!el) {
        el = scraper.findOne({
          selector: 'button._qv64e._t78yp._r9b8f._njrw0',
        });
      }

      if (!el) {
        return '';
      }

      return el
        .setscraperAttr('following', 'following')
        .getSelectorByscraperAttr('following');
    });

    if (!unfollowButtonSelector) {
      return null;
    }

    const unfollowButton = await page.$(unfollowButtonSelector);
    await unfollowButton.click();

    const confirmUnfollowButtonSelector = await page.evaluate(() => {
      const { scraper } = window as any;

      return scraper
        .findOneWithText({ selector: 'button', text: 'Unfollow' })
        .setscraperAttr('confirmUnfollowButton', 'confirmUnfollowButton')
        .getSelectorByscraperAttr('confirmUnfollowButton');
    });

    (await page.$(confirmUnfollowButtonSelector)).click();

    await page.waitFor(1500);
  });
};

export { unfollowUser };
