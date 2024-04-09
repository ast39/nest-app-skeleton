import { forwardRef, Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { ConfigService } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy'

@Global()
@Module({
	imports: [
		forwardRef(() => UserModule),
		JwtModule.register({
			secret: '33333',
			signOptions: {
				expiresIn: '33333',
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, ConfigService, AccessTokenStrategy, RefreshTokenStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
