import { IsString, IsEnum, IsDateString, IsOptional, IsUUID, IsArray } from 'class-validator';
import { PollType, PollCategories } from '../../../types/enums';

export class CreatePollDto {
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

  @IsOptional()
  createdBy?: any;

  @IsOptional()
  comments?: any;

  @IsOptional()
  isHidden?: boolean;
}
