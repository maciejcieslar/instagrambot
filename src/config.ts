const config = {
  auth: {
    username: process.env.USERNAME || '',
    password: process.env.PASSWORD || '',
  },
  job: {
    hashtags: ['like4like', 'follow4follow', 'followforfollow', 'likeforlike'],
    numberOfPosts: Number(process.env.NUMBER_OF_POSTS) || 20,
    unfollow: Number(process.env.NUMBER_OF_UNFOLLOW) || 20,
    commentProbability: 65,
  },
  wit: {
    accessToken: process.env.WIT_TOKEN || '',
    expectedConfidence: 0.7,
  },
  comments: {
    happy: [
      'Great',
      'Wow',
      'Damn',
      'Nice',
      'Cool!',
      'Awesome',
      'Beautiful',
      'Amazing',
      'Perfect',
      'Wonderful',
    ],
    sad: ['damn', 'im gonna cry', 'nooo', 'why', 'omg', 'oh God'],
  },
};

export = config;
