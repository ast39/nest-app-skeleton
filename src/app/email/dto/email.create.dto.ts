import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { Expose } from 'class-transformer'

export class EmailCreateDto {
	@IsString()
	@MaxLength(200)
	@IsNotEmpty()
	@Expose({ name: 'to' })
	to: string

	@IsString()
	@MaxLength(200)
	@IsNotEmpty()
	@Expose({ name: 'subject' })
	subject: string

	@IsString()
	@MaxLength(1000)
	@IsNotEmpty()
	@Expose({ name: 'text' })
	text: string
}
