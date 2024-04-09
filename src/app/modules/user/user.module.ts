import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserRepository } from './user.repository'

@Module({
	providers: [UserService, UserRepository],
	controllers: [UserController],
	imports: [forwardRef(() => AuthModule)],
	exports: [UserService],
})
export class UserModule {}
