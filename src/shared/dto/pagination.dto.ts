import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, Max, Min, ValidationArguments } from 'class-validator'
import { Type } from 'class-transformer'

export class PaginationDto {
	@ApiProperty({
		minimum: 1,
		maximum: 10000,
		title: 'Page',
		description: 'Страница',
		type: Number,
		format: 'int32',
		default: 1,
		required: false,
	})
	@IsInt({ message: 'validation.invalid_int' })
	@IsOptional()
	@Min(1, { message: 'validation.min' })
	@Type(() => Number)
	page?: number | null

	@ApiProperty({
		minimum: 1,
		maximum: 10000,
		title: 'Limit',
		description: 'Записей на страницу',
		type: Number,
		format: 'int32',
		default: 10,
		required: false,
	})
	@IsInt({ message: 'validation.invalid_int' })
	@IsOptional()
	@Min(1, { message: 'validation.min' })
	@Max(500, {
		message: (args: ValidationArguments) => {
			const { property, constraints } = args
			return `Значение поля [${property}] указано некорректно, оно не модет быть больше [${constraints[0]}]`
			// return 'validation.not_each_value'
		},
	})
	@Type(() => Number)
	limit?: number | null
}
