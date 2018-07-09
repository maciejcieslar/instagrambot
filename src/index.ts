import 'module-alias/register';
import * as dotenv from 'dotenv';

dotenv.config();

import { createBrowser } from 'src/common/browser';
import { auth as authConfig } from 'src/config';
import { schedule, jobs } from 'src/common/scheduler';
import { getMessageBasedOnIntent } from 'src/common/wit';

console.log(getMessageBasedOnIntent({ confidence: 1, value: 'happy_description' }));

(async () => {
  try {
    const browser = await createBrowser();
    await browser.authenticate(authConfig);

    await new jobs.FollowJob([]).execute(browser);

    schedule(
      [
        new jobs.FollowJob([[0, 5], [11, 14], [17, 21], [22, 23]]),
        new jobs.UnfollowJob([[6, 10], [13, 18], [21, 24]]),
      ],
      browser,
    );
  } catch (e) {
    console.log(e);
  }
})();
