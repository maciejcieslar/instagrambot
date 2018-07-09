import * as numeral from 'numeral';
import { GetPostInfo } from 'src/common/interfaces';
import { getIntentFromMessage } from 'src/common/wit';

const getPostInfo: GetPostInfo = async function getPostInfo(page) {
  const { likeSelector = '', isLiked = false, unlikeSelector = '' } =
    (await page.evaluate(() => {
      const { scraper } = window as any;

      const likeSpan = scraper.findOne({
        selector: 'span',
        where: (el) => el.html() === 'Like',
      });

      if (!likeSpan) {
        const unlikeSpan = scraper.findOne({
          selector: 'span',
          where: (el) => el.html() === 'Unlike',
        });
        const unlikeSelector = unlikeSpan
          .parent()
          .setscraperAttr('unlikeHeart', 'unlikeHeart')
          .getSelectorByscraperAttr('unlikeHeart');

        return {
          unlikeSelector,
          isLiked: true,
          likeSelector: unlikeSelector,
        };
      }

      const likeSelector = likeSpan
        .parent()
        .setscraperAttr('likeHeart', 'likeHeart')
        .getSelectorByscraperAttr('likeHeart');

      return {
        likeSelector,
        isLiked: false,
        unlikeSelector: likeSelector,
      };
    })) || {};

  const { followSelector = '', isFollowed = false, unfollowSelector = '' } =
    (await page.evaluate(() => {
      const { scraper } = window as any;

      const followButton = scraper.findOneWithText({
        selector: 'button',
        text: 'Follow',
      });

      if (!followButton) {
        const unfollowButton = scraper.findOneWithText({
          selector: 'button',
          text: 'Following',
        });
        const unfollowSelector = unfollowButton
          .setscraperAttr('unfollowButton', 'unfollowButton')
          .getSelectorByscraperAttr('unfollowButton');

        return {
          unfollowSelector,
          isFollowed: true,
          followSelector: unfollowSelector,
        };
      }

      const followSelector = followButton
        .setscraperAttr('followButton', 'followButton')
        .getSelectorByscraperAttr('followButton');

      return {
        followSelector,
        isFollowed: false,
        unfollowSelector: followSelector,
      };
    })) || {};

  const likes = numeral(
    await page.evaluate(() => {
      const { scraper } = window as any;
      const el = scraper.findOne({ selector: 'a[href$="/liked_by/"] > span' });

      if (!el) {
        return 0;
      }

      return el.text();
    }),
  ).value();

  const { description = '', comments = [] } = await page.evaluate(() => {
    const { scraper } = window as any;
    const comments = scraper
      .find({ selector: 'div > ul > li > span' })
      .map((el) => el.text());

    return {
      description: comments[0],
      comments: comments.slice(1),
    };
  });

  const author = await page.evaluate(() => {
    const { scraper } = window as any;

    return scraper.findOne({ selector: 'a[title].notranslate' }).text();
  });

  const commentButtonSelector = await page.evaluate(() => {
    const { scraper } = window as any;

    return scraper
      .findOneWithText({ selector: 'span', text: 'Comment' })
      .parent()
      .setscraperAttr('comment', 'comment')
      .getSelectorByscraperAttr('comment');
  });

  const commentSelector = 'textarea[autocorrect="off"]';

  const postIntent = await getIntentFromMessage(description);

  return {
    likeSelector,
    unlikeSelector,
    isLiked,
    isFollowed,
    followSelector,
    unfollowSelector,
    likes,
    comments,
    description,
    author,
    commentSelector,
    commentButtonSelector,
    postIntent,
  };
};

export { getPostInfo };
