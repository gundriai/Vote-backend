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

export class AggregatedPollOption {
  id: string;
  pollId: string;
  label: string | null;
  type: string | null;
  icon: string | null;
  color: string | null;
  candidateId: string | null;
  voteCount: number;
}

export class VotedDetails {
  alreadyVoted: boolean;
  optionChosen?: string; // This will be the pollOptionId or vote type that was chosen
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
  pollOptions?: AggregatedPollOption[];
  voteCounts?: { [key: string]: number };
  totalComments: number;
  totalVotes: number;
  votedDetails: VotedDetails;
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
