import { HttpException, HttpStatus } from '@nestjs/common'

export class UserNotFoundException extends HttpException {
	constructor() {
		super({ message: 'Пользователь не найден' }, HttpStatus.NOT_FOUND)
	}
}

export class UserEmailExistException extends HttpException {
	constructor() {
		super({ message: 'Пользователь с таким email уже существует' }, HttpStatus.BAD_REQUEST)
	}
}
