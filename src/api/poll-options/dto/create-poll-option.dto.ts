import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePollOptionDto {
  @IsUUID()
  pollId: string;

  @IsString()
  @IsOptional()
  label?: string;

  @IsUUID()
  @IsOptional()
  candidateId?: string;
}
