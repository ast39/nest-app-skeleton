import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma'
import { UserRepository } from './user.repository'
import { UserDto } from './dto/user.dto'
import { UserCreateDto } from './dto/user.create.dto'
import { UserUpdateDto } from './dto/user.update.dto'
import { UserFilterDto } from './dto/user.filter.dto'
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface'
import { UserEmailExistException, UserNotFoundException } from './exeptions/user.exeptions'
import { plainToClass } from 'class-transformer'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private userRepo: UserRepository,
	) {}

	/// User list
	async userList(url: string, userFilter: UserFilterDto): Promise<PaginationInterface<UserDto>> {
		const page = Number(userFilter.page ?? 1)
		const limit = Number(userFilter.limit ?? 10)

		const users = await this.prisma.$transaction(async (tx) => {
			const users = await this.userRepo.index(
				{
					skip: (page - 1) * limit,
					take: limit,
					where: {
						status: { in: userFilter.status ?? undefined },
					},
					orderBy: { userId: 'desc' },
				},
				tx,
			)

			if (!users) {
				throw new UserNotFoundException()
			}

			return users
		})

		const totalRows = await this.prisma.$transaction(async (tx) => {
			return await this.userRepo.totalRows(
				{
					where: {
						status: { in: userFilter.status ?? undefined },
					},
				},
				tx,
			)
		})

		return {
			data: users.map((user) => plainToClass(UserDto, user)),
			meta: {
				currentPage: page,
				lastPage: Math.ceil(totalRows / limit),
				perPage: limit,
				from: (page - 1) * limit + 1,
				to: (page - 1) * limit + limit,
				total: totalRows,
				path: url,
			},
		}
	}

	// Find user by ID
	async getUser(userId: number): Promise<UserDto | null> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.userRepo.show({ userId: Number(userId) }, tx)
			if (!user) {
				throw new UserNotFoundException()
			}

			return plainToClass(UserDto, user)
		})
	}

	// Find user by email
	async getUserByEmail(email: string): Promise<UserDto | null> {
		return this.prisma.$transaction(async (tx) => {
			const users = await this.userRepo.index(
				{
					where: {
						email: email,
					},
				},
				tx,
			)

			return users[0] ?? null
		})
	}

	// Add user
	async createUser(data: UserCreateDto): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			const user = await this.getUserByEmail(data.email)

			if (user) {
				throw new UserEmailExistException()
			}

			const password = data.password ?? Math.random().toString(36).slice(-8)
			data.password = await bcrypt.hash(password, 10)

			const newUser = await this.userRepo.store(data, tx)
			newUser.password = password

			return plainToClass(UserDto, newUser)
		})
	}

	// Update user
	async updateUser(userId: number, data: UserUpdateDto): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.getUser(userId)
			const user = await this.userRepo.update(
				{
					where: { userId: Number(userId) },
					data: data,
				},
				tx,
			)

			return plainToClass(UserDto, user)
		})
	}

	// Delete user
	async deleteUser(userId: number): Promise<UserDto> {
		return this.prisma.$transaction(async (tx) => {
			await this.getUser(userId)
			const user = await this.userRepo.destroy({ userId: Number(userId) }, tx)

			return plainToClass(UserDto, user)
		})
	}
}
