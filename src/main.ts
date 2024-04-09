import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import * as dotenv from 'dotenv'
import { HttpExceptionFilter } from './app/filters/http-exception.filter'

async function bootstrap() {
	dotenv.config()

	/// set basic constants
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)
	const APP_PORT = config.get('APP_PORT') || 3000
	const SWAGGER_PREFIX = config.get('API_PREFIX') + config.get('SWAGGER_PATH')

	/// set global app prefix
	app.setGlobalPrefix(config.get('API_PREFIX'))

	/// set global pipes
	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	/// set global exception filters
	app.useGlobalFilters(new HttpExceptionFilter())

	/// enable CORS
	app.enableCors({
		origin: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
		credentials: true,
	})

	/// init swagger documentation
	const docs = new DocumentBuilder()
		.setTitle(config.get('APP_TITLE') || 'API')
		.setDescription(config.get('APP_DESC') || 'Описание методов API')
		.setVersion(config.get('APP_VERSION') || '1.0.0')
		.addBearerAuth()
		.build()

	/// init swagger UI
	const document = SwaggerModule.createDocument(app, docs)
	SwaggerModule.setup(SWAGGER_PREFIX, app, document, {
		swaggerOptions: { persistAuthorization: true },
	})

	/// start application
	await app.listen(APP_PORT, () => console.log(`APP started on port ${APP_PORT}`))
}
bootstrap().then(() => null)
