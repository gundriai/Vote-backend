import { IsString, IsEnum, IsDateString, IsOptional, IsUUID } from 'class-validator';
import { PollType } from '../../../types/enums';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(PollType)
  type: PollType;

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
