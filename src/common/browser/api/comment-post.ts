import { CommentPost } from 'src/common/interfaces';

const commentPost: CommentPost = async function commentPost(page, post, message) {
  await page.click(post.commentButtonSelector);
  await page.waitForSelector(post.commentSelector);
  await page.type(post.commentSelector, message, { delay: 200 });

  await page.keyboard.press('Enter');

  await page.waitFor(2500);

  return page;
};

export { commentPost };
