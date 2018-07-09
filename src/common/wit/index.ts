import { Wit } from 'node-wit';
import * as _ from 'lodash';
import * as emoji from 'node-emoji';
import { Intent } from 'src/common/interfaces';
import { wit as witConfig, comments as commentsConfig } from 'src/config';
import { getRandomItem } from 'src/common/utils';

const client = new Wit(_.pick(witConfig, ['accessToken']));

const getIntentFromMessage = async (message: string, context: any = {}): Promise<Intent> => {
  if (!message || message.length > 280) {
    return {
      confidence: 0,
      value: '',
    };
  }

  const result = await client.message(message, context);

  return _.get(result, ['entities', 'intent', '0']);
};

const intentToCategory = {
  happy_description: 'happy',
  sad_description: 'sad',
};

const emojis = {
  happy: [
    'smiley',
    'smirk',
    'pray',
    'rocket',
    'kissing_closed_eyes',
    'sunglasses',
    'heart_eyes',
    'joy',
    'relieved',
    'wink',
    'innocent',
    'smiling_imp',
    'sweat_smile',
    'blush',
    'yum',
    'triumph',
  ],
  sad: ['cry', 'sob', 'cold_sweat', 'disappointed', 'worried'],
};

const getRandomEmoji = (type: string) => {
  const emojisForType: string[] = emojis[type];

  if (!emojisForType) {
    return '';
  }

  const emojiName = getRandomItem<string>(emojisForType);

  return emoji.get(emojiName);
};

const getRandomEmojis = (count: number, type: string) =>
  new Array(count)
    .fill(type)
    .map(getRandomEmoji)
    .join('');

const shouldPostComment = (intent: Intent): boolean =>
  intent.confidence >= witConfig.expectedConfidence;

const generateComment = (category: string): string => {
  // const randomEmojis = getRandomEmojis(getRandomNumber(0, 2), category);
  const randomEmojis = '';

  return [getRandomItem<string>(commentsConfig[category]), randomEmojis].join(' ');
};

const getMessageBasedOnIntent = (intent: Intent): string => {
  const category: string = intentToCategory[intent.value];

  if (!category || !shouldPostComment(intent)) {
    return '';
  }

  return generateComment(category);
};

export { client, getIntentFromMessage, getMessageBasedOnIntent, shouldPostComment };
