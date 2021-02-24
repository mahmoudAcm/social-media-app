import { SocialPost } from '../../post/schema';
import { Comment } from '../../comment/schema';
import { Activity } from '../../user/schema';

export interface PostHandlerPayload {
  type: 'interaction' | 'comment' | 'share';

  room: string;

  interaction?: Activity;

  comment?: Comment;

  share?: SocialPost;
}
