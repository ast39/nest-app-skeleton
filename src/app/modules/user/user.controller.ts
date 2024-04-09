import {
	Body,
	Controller,
	Param,
	Get,
	Post,
	Put,
	Delete,
	UseGuards,
	ParseIntPipe,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'
import { UserCreateDto } from './dto/user.create.dto'
import { UserUpdateDto } from './dto/user.update.dto'
import { UserFilterDto } from './dto/user.filter.dto'
import { UserFilterInterceptor } from './interceptors/user.filter.interceptor'
import { CurrentUrl } from '../../../shared/decorators/url.decorator'
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface'
import { plainToClass } from 'class-transformer'

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@ApiOperation({
		summary: 'Список пользователей',
		description: 'Получить список пользователей по фильтрам',
	})
	@ApiOkResponse({
		description: 'Список пользователей',
		type: UserDto,
		isArray: true,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(UserFilterInterceptor)
	@Get()
	public async index(
		@CurrentUrl('users') url: string,
		@Query() query: UserFilterDto,
	): Promise<PaginationInterface<UserDto>> {
		return this.userService.userList(url, query)
	}

	@ApiOperation({
		summary: 'Пользователь по ID',
		description: 'Получить информацию о пользователе',
	})
	@ApiOkResponse({
		description: 'Информация о пользователе',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Get(':user_id')
	public async show(@Param('user_id', ParseIntPipe) userId: number): Promise<UserDto> {
		const userData = await this.userService.getUser(userId)
		return plainToClass(UserDto, userData)
	}

	@ApiOperation({
		summary: 'Добавление пользователя',
		description: 'Добавление пользователя в БД',
	})
	@ApiResponse({
		description: 'Добавленный пользователь',
		type: UserDto,
		isArray: false,
		status: 201,
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Post()
	public async create(@Body() body: UserCreateDto): Promise<UserDto> {
		return await this.userService.createUser(body)
	}

	@ApiOperation({
		summary: 'Редактирование пользователя',
		description: 'Редактирование пользователя в БД',
	})
	@ApiOkResponse({
		description: 'Обновленный пользователь',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Put(':user_id')
	public async update(
		@Param('user_id', ParseIntPipe) userId: number,
		@Body() body: UserUpdateDto,
	): Promise<UserDto> {
		return await this.userService.updateUser(userId, body)
	}

	@ApiOperation({
		summary: 'Удаление пользователя',
		description: 'Удалить пользователя из БД',
	})
	@ApiOkResponse({
		description: 'Удаленный пользователь',
		type: UserDto,
		isArray: false,
		status: 200,
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@Delete(':user_id')
	public async delete(@Param('user_id', ParseIntPipe) userId: number): Promise<UserDto> {
		return await this.userService.deleteUser(userId)
	}
}
