import { ApiProperty } from '@nestjs/swagger'

export class SmsDto {
	@ApiProperty({
		title: 'Телефон',
		description: 'Номер телефона',
		type: String,
	})
	phone: string

	@ApiProperty({
		title: 'Сообщение',
		description: 'Текст сообщения',
		type: String,
	})
	text: string
}
