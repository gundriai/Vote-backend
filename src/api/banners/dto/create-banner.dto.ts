
import { IsString, IsOptional } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsString()
  subTitle: string;

  @IsOptional()
  @IsString()
  buttonLabel?: string;

  @IsOptional()
  @IsString()
  buttonUrl?: string;

  @IsOptional()
  isActive?: boolean;
}
