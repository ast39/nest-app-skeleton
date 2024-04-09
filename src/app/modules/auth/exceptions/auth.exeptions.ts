import { HttpException, HttpStatus } from '@nestjs/common'

export class WrongAuthDataException extends HttpException {
	constructor() {
		super({ message: 'Неверный E-Mail или пароль' }, HttpStatus.BAD_REQUEST)
	}
}

export class TokenIsAbsentException extends HttpException {
	constructor() {
		super({ message: 'Токен не был передан' }, HttpStatus.UNAUTHORIZED)
	}
}

export class TokenExpireException extends HttpException {
	constructor() {
		super({ message: 'Токен просрочен' }, HttpStatus.UNAUTHORIZED)
	}
}
