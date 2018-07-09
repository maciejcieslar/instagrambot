import * as nodeschedule from 'node-schedule';
import * as moment from 'moment';
import { Browser } from 'src/common/interfaces';
import { jobs, Job } from './jobs';

const getMilisecondsFromMinutes = (minutes: number) => minutes * 60000;

const schedule = (jobs: Job[], browser: Browser) =>
  nodeschedule.scheduleJob('0 * * * *', () => {
    const hour = moment().hour();

    console.log('Executing jobs for', moment().format('dddd, MMMM Do YYYY, h:mm:ss a'));

    return jobs.forEach(job => {
      if (!job.validateRanges(hour)) {
        return null;
      }

      const delayedMinutes = Math.floor(Math.random() * 30);

      const cb = () => job.execute(browser);

      return setTimeout(cb, getMilisecondsFromMinutes(delayedMinutes));
    });
  });

export { schedule, jobs };
