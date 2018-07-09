import * as puppeteer from 'puppeteer';

interface Post {
  likes: number;
  comments: string[];
  isLiked: boolean;
  isFollowed: boolean;
  likeSelector: string;
  followSelector: string;
  unlikeSelector: string;
  unfollowSelector: string;
  commentSelector: string;
  commentButtonSelector: string;
  description: string;
  author: string;
  postIntent: Intent;
}

interface UserInfo {
  username: string;
  following: number;
  followers: number;
  posts: number;
  isFollowed: boolean;
}

interface UserCredentials {
  username: string;
  password: string;
}

interface Browser {
  getPage: GetPage;
  close: CloseBrowser;
  getUserInfo: GetUserInfo;
  getFollowing: GetFollowing;
  findPosts: FindPosts;
  commentPost: CommentPost;
  followPost: FollowPost;
  likePost: LikePost;
  getPostInfo: GetPostInfo;
  unfollowUser: UnFollowUser;
  authenticate: Authenticate;
}

interface Intent {
  confidence: number;
  value: string;
}

type GetPage = (url: string, callback: (page: puppeteer.Page) => Promise<any>) => any;

type CloseBrowser = () => Promise<void>;

type GetUserInfo = (this: Browser, username: string) => Promise<UserInfo>;

type GetFollowing = (this: Browser, username: string) => Promise<string[]>;

type FindPosts = (this: Browser, hashtag: string, numberOfPosts: number) => Promise<string[]>;

type CommentPost = (
  this: Browser,
  page: puppeteer.Page,
  post: Post,
  message: string,
) => Promise<puppeteer.Page>;

type FollowPost = (this: Browser, page: puppeteer.Page, post: Post) => Promise<puppeteer.Page>;

type LikePost = (this: Browser, page: puppeteer.Page, post: Post) => Promise<puppeteer.Page>;

type GetPostInfo = (this: Browser, page: puppeteer.Page) => Promise<Post>;

type UnFollowUser = (this: Browser, username: string) => Promise<void>;

type Authenticate = (this: Browser, credentials: UserCredentials) => Promise<boolean>;

type CreateBrowser = () => Promise<Browser>;

export {
  Post,
  UserInfo,
  UserCredentials,
  Browser,
  Intent,
  GetPage,
  CloseBrowser,
  GetUserInfo,
  GetFollowing,
  FindPosts,
  CommentPost,
  FollowPost,
  LikePost,
  GetPostInfo,
  UnFollowUser,
  Authenticate,
  CreateBrowser,
};
