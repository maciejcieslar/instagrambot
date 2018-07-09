import { Browser } from 'src/common/interfaces';
import { reduceAsync, getRandomItem, probability } from 'src/common/utils';
import { job as jobConfig, auth as authConfig } from 'src/config';
import { getMessageBasedOnIntent } from 'src/common/wit';

class Job {
  private ranges: number[][] = [];

  public execute(browser: Browser) {
    throw new Error('Execute must be provided.');
  }

  public constructor(ranges: number[][]) {
    this.ranges = ranges;
  }

  public validateRanges(hour: number): boolean {
    return Boolean(
      this.ranges.find(
        (range): boolean => {
          const [startHour, endHour] = range;

          return hour >= startHour && hour <= endHour;
        },
      ),
    );
  }
}

class FollowJob extends Job {
  public async execute(browser: Browser) {
    try {
      const hashtag = getRandomItem(jobConfig.hashtags);
      const postsUrls = await browser.findPosts(hashtag, jobConfig.numberOfPosts);

      await reduceAsync<string, void>(
        postsUrls,
        async (prev, url) =>
          browser.getPage(url, async page => {
            try {
              const post = await browser.getPostInfo(page);

              await browser.likePost(page, post);
              console.log('liked');

              await browser.followPost(page, post);
              console.log('followed');

              const message = getMessageBasedOnIntent(post.postIntent);

              if (probability(jobConfig.commentProbability) && message) {
                await browser.commentPost(page, post, message);
                console.log('commented');
              }
            } catch (e) {
              console.log('Failed to like/follow/comment.');
              console.log(e);
            }
          }),
        35,
      );
      console.log('FollowJob executed successfully.');
    } catch (e) {
      console.log('FollowJob failed to execute.');
      console.log(e);
    }
  }
}

class UnfollowJob extends Job {
  public async execute(browser: Browser) {
    try {
      const following = await browser.getFollowing(authConfig.username);

      await reduceAsync<string, void>(
        following,
        async (result, username) => {
          await browser.unfollowUser(username);
        },
        35,
      );

      console.log('UnfollowJob executed successfully');
    } catch (e) {
      console.log('UnfollowJob failed to execute.');
      console.log(e);
    }
  }
}

const jobs = {
  UnfollowJob,
  FollowJob,
};

export { Job, jobs };
