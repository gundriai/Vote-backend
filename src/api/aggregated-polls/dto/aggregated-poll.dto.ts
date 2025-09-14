import { PollType, PollCategories } from '../../../types/enums';

export class AggregatedComment {
  id: string;
  pollId: string;
  content: string;
  author: string;
  createdAt: string;
  gajjabCount: number;
  bekarCount: number;
  furiousCount: number;
}

export class AggregatedCandidate {
  id: string;
  pollId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  voteCount: number;
}

export class AggregatedPoll {
  id: string;
  title: string;
  description: string | null;
  type: PollType;
  category: PollCategories[];
  mediaUrl: string | null;
  startDate: Date;
  endDate: Date;
  isHidden: boolean;
  comments: AggregatedComment[];
  updatedAt: Date;
  createdBy: string;
  createdAt: Date;
  candidates?: AggregatedCandidate[];
  voteCounts?: { [key: string]: number };
  totalComments: number;
  totalVotes: number;
}

export class AggregatedPollsResponse {
  polls: AggregatedPoll[];
  totalPolls: number;
  totalVotes: number;
  totalComments: number;
  categories: {
    [key: string]: number;
  };
  types: {
    [key: string]: number;
  };
}
