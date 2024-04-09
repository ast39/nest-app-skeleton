import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/// Login DTO ( Sign In )
export class LoginDto {
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
		required: true,
	})
	@IsNotEmpty({ message: 'validation.not_empty' })
	@IsString({ message: 'validation.invalid_string' })
	password: string
}
