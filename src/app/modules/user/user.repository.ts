import { Injectable } from '@nestjs/common'
import { IPrismaTR, PrismaService } from '../../prisma'
import { UserDto } from './dto/user.dto'
import { UserCreateDto } from './dto/user.create.dto'
import { UserUpdateDto } from './dto/user.update.dto'
import { IUserFilter, IUserOrder, IUserUnique } from '../../../shared/interfaces/user.interface'

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	// Total users in DB
	async totalRows(
		params: {
			cursor?: IUserUnique
			where?: IUserFilter
		},
		tx?: IPrismaTR,
	): Promise<number> {
		const { cursor, where } = params
		const prisma = tx ?? this.prisma

		return prisma.user.count({
			cursor,
			where,
		})
	}

	// User list from DB
	async index(
		params: {
			skip?: number
			take?: number
			cursor?: IUserUnique
			where?: IUserFilter
			orderBy?: IUserOrder
		},
		tx?: IPrismaTR,
	): Promise<UserDto[]> {
		const { skip, take, cursor, where, orderBy } = params
		const prisma = tx ?? this.prisma

		return prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		})
	}

	// Пользователь по ID
	async show(cursor: IUserUnique, tx?: IPrismaTR): Promise<UserDto | null> {
		const prisma = tx ?? this.prisma

		return prisma.user.findUnique({
			where: cursor,
		})
	}

	//Add user into DB
	async store(data: UserCreateDto, tx?: IPrismaTR): Promise<UserDto> {
		const prisma = tx ?? this.prisma

		return prisma.user.create({
			data: {
				email: data.email,
				password: data.password,
				name: data.name,
				status: data.status || undefined,
			},
		})
	}

	// Update user in DB
	async update(
		params: {
			where: IUserUnique
			data: UserUpdateDto
		},
		tx?: IPrismaTR,
	): Promise<UserDto> {
		const { where, data } = params
		const prisma = tx ?? this.prisma
		return prisma.user.update({
			where,
			data,
		})
	}

	// Delete user from DB
	async destroy(where: IUserUnique, tx?: IPrismaTR): Promise<UserDto> {
		const prisma = tx ?? this.prisma

		return prisma.user.delete({
			where,
		})
	}
}
