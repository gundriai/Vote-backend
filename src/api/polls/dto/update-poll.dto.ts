import { PartialType } from '@nestjs/mapped-types';
import { CreatePollDto } from './create-poll.dto';

import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePollCandidateDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;
}

export class UpdatePollDto extends PartialType(CreatePollDto) {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdatePollCandidateDto)
    @IsOptional()
    candidates?: UpdatePollCandidateDto[];
}
