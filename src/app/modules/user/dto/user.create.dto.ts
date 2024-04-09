import { ApiProperty } from '@nestjs/swagger'
import { EUserStatus } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

// Create user DTO
export class UserCreateDto {
	@ApiProperty({
		title: 'E-mail',
		description: 'E-mail пользователя',
		type: String,
		required: true,
	})
	@IsNotEmpty({ message: 'validation.not_empty' })
	@IsEmail({}, { message: 'validation.invalid_email' })
	email: string

	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'validation.invalid_string' })
	password?: string

	@ApiProperty({
		title: 'Имя',
		description: 'Имя пользователя',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'validation.invalid_string' })
	name?: string

	@ApiProperty({
		title: 'Телефон',
		description: 'Телефон пользователя',
		type: String,
		required: false,
	})
	@IsOptional()
	@IsString({ message: 'validation.invalid_string' })
	phone?: string

	@ApiProperty({
		title: 'Статус',
		description: 'Статус пользователя',
		enum: EUserStatus,
		required: false,
		default: EUserStatus.ACTIVE,
	})
	@IsOptional()
	@IsEnum(EUserStatus, { message: 'validation.not_enum' })
	status?: EUserStatus
}
