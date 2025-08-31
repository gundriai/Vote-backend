import { IsString, IsOptional } from 'class-validator';

export class CreateCandidateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  photo?: string;
}
