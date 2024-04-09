import { ApiProperty } from '@nestjs/swagger'
import { EUserStatus } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserDto {
	@ApiProperty({
		title: 'ID',
		description: 'ID пользователя',
		type: Number,
	})
	userId: number

	@ApiProperty({
		title: 'E-mail',
		description: 'E-mail пользователя',
		type: String,
	})
	email: string

	@ApiProperty({
		title: 'Пароль',
		description: 'Пароль пользователя',
		type: String,
		required: false,
	})
	@Exclude()
	password?: string

	@ApiProperty({
		title: 'Токен Remember Me',
		description: 'Токен Remember Me',
		type: String,
	})
	refreshToken: string

	@ApiProperty({
		title: 'Имя',
		description: 'Имя пользователя',
		type: String,
	})
	name: string

	@ApiProperty({
		title: 'Статус',
		description: 'Статус пользователя',
		enum: EUserStatus,
	})
	status: EUserStatus

	@ApiProperty({
		title: 'Дата добавления',
		description: 'Дата добавления в БД',
		type: Date,
	})
	@Exclude()
	createdAt: Date

	@ApiProperty({
		title: 'Дата обноаления',
		description: 'Дата последнего обноаления',
		type: Date,
	})
	@Exclude()
	updatedAt: Date
}
