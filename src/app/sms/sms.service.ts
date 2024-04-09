import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { SmsDto } from './dto/sms.dto'
import { map } from 'rxjs/operators'
import { lastValueFrom } from 'rxjs'
import { defCode, phonesConfig } from './config/phones.config'

@Injectable()
export class SmsService {
	constructor(
		private readonly http: HttpService,
		private readonly config: ConfigService,
	) {}

	public async sendSms(sms: SmsDto): Promise<any> {
		const login = this.config.get('LOGIN_SMS_SERVICE')
		const pass = this.config.get('PASS_SMS_SERVICE')
		const url = `https://smsc.ru/sys/send.php?login=${login}&psw=${pass}&phones=${sms.phone}&mes=${sms.text}`

		return await lastValueFrom(
			this.http.get(url).pipe(
				map((res) => {
					if (res.data.indexOf('ERROR') !== -1) {
						console.log('This error from sms service ', res.data)
					}

					return res.data
				}),
			),
		)
	}

	public generateSMSCode(phone: string): string {
		const codeA = String(Math.floor(Math.random() * 10))
		const codeB = String(Math.floor(Math.random() * 10))
		const codeC = String(Math.floor(Math.random() * 10))
		const codeD = String(Math.floor(Math.random() * 10))

		return phonesConfig.includes(phone) ? defCode : `${codeA}${codeB}${codeC}${codeD}`
	}
}
