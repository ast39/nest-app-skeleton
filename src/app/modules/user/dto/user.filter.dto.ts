import { ApiProperty } from '@nestjs/swagger'
import { PaginationDto } from '../../../../shared/dto/pagination.dto'
import { IsEnum, IsOptional } from 'class-validator'
import { EUserStatus } from '@prisma/client'

export class UserFilterDto extends PaginationDto {
	@ApiProperty({
		title: 'Статус',
		description: 'Статус пользователя',
		enum: EUserStatus,
		required: false,
	})
	@IsOptional()
	@IsEnum(EUserStatus, { each: true, message: 'validation.not_each_value' })
	status?: EUserStatus[] | null
}
