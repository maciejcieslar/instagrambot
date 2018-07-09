import { authenticate } from './authenticate';
import { getFollowing } from './get-following';
import { findPosts } from './find-posts';
import { commentPost } from './comment-post';
import { likePost } from './like-post';
import { followPost } from './follow-post';
import { getUserInfo } from './get-user-info';
import { getPostInfo } from './get-post-info';
import { unfollowUser } from './unfollow-user';

export {
  getUserInfo,
  getFollowing,
  findPosts,
  commentPost,
  followPost,
  likePost,
  getPostInfo,
  unfollowUser,
  authenticate,
};
