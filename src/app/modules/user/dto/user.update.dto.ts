import { ApiProperty } from '@nestjs/swagger'
import { EUserStatus } from '@prisma/client'

// Edit user DTO
export class UserUpdateDto {
	@ApiProperty({
		title: 'E-mail',
		description: 'E-mail пользователя',
		type: String,
		required: false,
	})
	email?: string

	@ApiProperty({
		title: 'Имя',
		description: 'Имя пользователя',
		type: String,
		required: false,
	})
	name?: string

	@ApiProperty({
		title: 'Телефон',
		description: 'Телефон пользователя',
		type: String,
		required: false,
	})
	phone?: string

	@ApiProperty({
		title: 'Токен Remember Me',
		description: 'Токен Remember Me',
		type: String,
		required: false,
	})
	refreshToken?: string

	@ApiProperty({
		title: 'Статус',
		description: 'Статус пользователя',
		enum: EUserStatus,
		required: false,
		default: EUserStatus.ACTIVE,
	})
	status?: EUserStatus
}
