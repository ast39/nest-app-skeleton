import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transporter, createTransport } from 'nodemailer'
import { EmailCreateDto } from './dto/email.create.dto'
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'

@Injectable()
export class MailService {
	private transporter: Transporter<SentMessageInfo>

	constructor(private configService: ConfigService) {
		this.transporter = createTransport({
			host: this.configService.get('EMAIL_HOST'),
			port: this.configService.get('EMAIL_PORT'),
			auth: {
				user: this.configService.get('EMAIL_USER'),
				pass: this.configService.get('EMAIL_PASS'),
			},
		})
	}

	async send(data: EmailCreateDto): Promise<any> {
		const { to, subject, text } = data

		return this.transporter.sendMail({
			from: this.configService.get('EMAIL_USER'),
			to,
			subject,
			text,
		})
	}
}
