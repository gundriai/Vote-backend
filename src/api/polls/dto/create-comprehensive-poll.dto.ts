import { IsString, IsEnum, IsDateString, IsOptional, IsArray, IsBoolean, ValidateNested, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { PollType, PollCategories } from '../../../types/enums';

export class CreateCandidateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class CreateVoteOptionDto {
  @IsString()
  type: string;

  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  author: string;

  @IsNumber()
  @IsOptional()
  gajjabCount?: number;

  @IsNumber()
  @IsOptional()
  bekarCount?: number;

  @IsNumber()
  @IsOptional()
  furiousCount?: number;
}

export class CreateComprehensivePollDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PollType)
  type: PollType;

  @IsArray()
  @IsEnum(PollCategories, { each: true })
  @IsOptional()
  category?: PollCategories[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @IsUUID()
  @IsOptional()
  createdBy?: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  // Poll type specific data
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCandidateDto)
  @IsOptional()
  candidates?: CreateCandidateDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVoteOptionDto)
  @IsOptional()
  voteOptions?: CreateVoteOptionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentDto)
  @IsOptional()
  comments?: CreateCommentDto[];

  // Vote counts for rating polls
  @IsOptional()
  voteCounts?: { [key: string]: number };
}
