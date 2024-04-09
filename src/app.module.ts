import { Module } from '@nestjs/common'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './app/prisma'
import { MailModule } from './app/email/mail.module'
import { SmsModule } from './app/sms/sms.module'
import { AuthModule } from './app/modules/auth/auth.module'
import { UserModule } from './app/modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: join('.env'),
		}),
		PrismaModule,
		MailModule,
		SmsModule,
		AuthModule,
		UserModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
