import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { UserDto } from '../user/dto/user.dto'
import { UserCreateDto } from '../user/dto/user.create.dto'
import { Request } from 'express'
import { TokenExpireException, TokenIsAbsentException, WrongAuthDataException } from "./exceptions/auth.exeptions";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	// Sign Up ( Registration )
	async signUp(userCreate: UserCreateDto) {
		const user = await this.userService.createUser(userCreate)

		const tokens = await this.generateTokens(user)
		await this.updateRefreshToken(user.userId, tokens.refresh_token)

		return tokens
	}

	// Sign In ( Login )
	async signIn(loginDto: LoginDto) {
		const { email, password } = loginDto

		const user = await this.userService.getUserByEmail(email)
		if (!user) {
			throw new WrongAuthDataException()
		}

		const passwordEquals = await bcrypt.compare(password, user.password)
		if (!passwordEquals) {
			throw new WrongAuthDataException()
		}

		const tokens = await this.generateTokens(user)

		await this.updateRefreshToken(user.userId, tokens.refresh_token)

		return tokens
	}

	// Информация об авторизованном пользователе
	async me(userId: number): Promise<UserDto> {
		const user = await this.userService.getUser(userId)
		if (!user) {
			throw new TokenExpireException()
		}

		return user
	}

	// Check user access token
	async check(request: Request): Promise<{ auth: boolean }> {
		try {
			const token = request?.headers?.authorization?.split(' ')[1]?.trim() || null
			const jwtService = new JwtService()
			const payload = jwtService.decode(token)
			return { auth: payload !== null }
		} catch (e) {
			return { auth: false }
		}
	}

	// Logout
	async logout(user_id: number): Promise<UserDto> {
		return this.userService.updateUser(user_id, { refreshToken: null })
	}

	/// Prolongation access token
	async refreshTokens(refreshToken: string) {
		const jwtService = new JwtService()
		const payload = jwtService.decode(refreshToken)
		const userId = payload?.['id']

		if (!userId) {
			throw new TokenIsAbsentException()
		}

		const user = await this.userService.getUser(userId)
		if (!user || !user.refreshToken) {
			throw new TokenExpireException()
		}

		const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken)
		if (!refreshTokenMatches) {
			throw new TokenExpireException()
		}

		const tokens = await this.generateTokens(user)
		await this.updateRefreshToken(user.userId, tokens.refresh_token)

		return tokens
	}

	/// Update refresh token
	private async updateRefreshToken(user_id: number, refreshToken: string): Promise<void> {
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10)

		await this.userService.updateUser(user_id, {
			refreshToken: hashedRefreshToken,
		})
	}

	/// Generate access and refresh tokens
	private async generateTokens(user: UserDto) {
		const [access_token, refresh_token] = await Promise.all([
			this.jwtService.signAsync(
				{
					id: user.userId,
					email: user.email,
				},
				{
					secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
					expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRED'),
				},
			),
			this.jwtService.signAsync(
				{
					id: user.userId,
					email: user.email,
				},
				{
					secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
					expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRED'),
				},
			),
		])

		return {
			access_token,
			refresh_token,
		}
	}
}
