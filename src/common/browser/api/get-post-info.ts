import * as numeral from 'numeral';
import { GetPostInfo } from 'src/common/interfaces';
import { getIntentFromMessage } from 'src/common/wit';

const getPostInfo: GetPostInfo = async function getPostInfo(page) {
  const { likeSelector = '', isLiked = false, unlikeSelector = '' } =
    (await page.evaluate(() => {
      const { scrapper } = window as any;

      const likeSpan = scrapper.findOne({
        selector: 'span',
        where: (el) => el.html() === 'Like',
      });

      if (!likeSpan) {
        const unlikeSpan = scrapper.findOne({
          selector: 'span',
          where: (el) => el.html() === 'Unlike',
        });
        const unlikeSelector = unlikeSpan
          .parent()
          .setScrapperAttr('unlikeHeart', 'unlikeHeart')
          .getSelectorByScrapperAttr('unlikeHeart');

        return {
          unlikeSelector,
          isLiked: true,
          likeSelector: unlikeSelector,
        };
      }

      const likeSelector = likeSpan
        .parent()
        .setScrapperAttr('likeHeart', 'likeHeart')
        .getSelectorByScrapperAttr('likeHeart');

      return {
        likeSelector,
        isLiked: false,
        unlikeSelector: likeSelector,
      };
    })) || {};

  const { followSelector = '', isFollowed = false, unfollowSelector = '' } =
    (await page.evaluate(() => {
      const { scrapper } = window as any;

      const followButton = scrapper.findOneWithText({
        selector: 'button',
        text: 'Follow',
      });

      if (!followButton) {
        const unfollowButton = scrapper.findOneWithText({
          selector: 'button',
          text: 'Following',
        });
        const unfollowSelector = unfollowButton
          .setScrapperAttr('unfollowButton', 'unfollowButton')
          .getSelectorByScrapperAttr('unfollowButton');

        return {
          unfollowSelector,
          isFollowed: true,
          followSelector: unfollowSelector,
        };
      }

      const followSelector = followButton
        .setScrapperAttr('followButton', 'followButton')
        .getSelectorByScrapperAttr('followButton');

      return {
        followSelector,
        isFollowed: false,
        unfollowSelector: followSelector,
      };
    })) || {};

  const likes = numeral(
    await page.evaluate(() => {
      const { scrapper } = window as any;
      const el = scrapper.findOne({ selector: 'a[href$="/liked_by/"] > span' });

      if (!el) {
        return 0;
      }

      return el.text();
    }),
  ).value();

  const { description = '', comments = [] } = await page.evaluate(() => {
    const { scrapper } = window as any;
    const comments = scrapper
      .find({ selector: 'div > ul > li > span' })
      .map((el) => el.text());

    return {
      description: comments[0],
      comments: comments.slice(1),
    };
  });

  const author = await page.evaluate(() => {
    const { scrapper } = window as any;

    return scrapper.findOne({ selector: 'a[title].notranslate' }).text();
  });

  const commentButtonSelector = await page.evaluate(() => {
    const { scrapper } = window as any;

    return scrapper
      .findOneWithText({ selector: 'span', text: 'Comment' })
      .parent()
      .setScrapperAttr('comment', 'comment')
      .getSelectorByScrapperAttr('comment');
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
