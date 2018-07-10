import * as numeral from 'numeral';
import { GetUserInfo } from 'src/common/interfaces';

const getUserInfo: GetUserInfo = async function getUserInfo(username) {
  return this.getPage(`/${username}`, async (page) => {
    const [posts, followers, following] = await page.evaluate(() => {
      const { scraper } = window as any;

      return scraper
        .find({
          selector: 'li span',
        })
        .slice(1)
        .map(el => el.text());
    });

    const isFollowed = await page.evaluate(() => {
      const { scraper } = window as any;

      const followButton = scraper.findOneWithText({ selector: 'button', text: 'Follow' });

      if (followButton) {
        return false;
      }

      return true;
    });

    return {
      isFollowed,
      username,
      following: numeral(following).value(),
      followers: numeral(followers).value(),
      posts: numeral(posts).value(),
    };
  });
};

export { getUserInfo };
