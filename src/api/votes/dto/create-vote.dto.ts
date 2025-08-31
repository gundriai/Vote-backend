import { IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateVoteDto {
  @IsUUID()
  pollId: string;

  @IsUUID()
  optionId: string;

  @IsUUID()
  userId: string;

  @IsDateString()
  @IsOptional()
  createdAt?: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;
}
