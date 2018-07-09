import { CommentPost } from 'src/common/interfaces';

const commentPost: CommentPost = async function commentPost(page, post, message) {
  await page.click(post.commentButtonSelector);
  await page.waitForSelector(post.commentSelector);
  await page.type(post.commentSelector, message, { delay: 200 });

  const submitSelector: string = await page.evaluate(() => {
    const { scrapper } = window as any;

    return scrapper
      .findOneWithText({ selector: 'button[type="submit"]', text: 'Post' })
      .setScrapperAttr('submitSelector', 'submitSelector')
      .getSelectorByScrapperAttr('submitSelector');
  });

  await page.click(submitSelector);
  await page.waitFor(2500);

  return page;
};

export { commentPost };
