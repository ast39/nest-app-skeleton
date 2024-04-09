import { EUserStatus, PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
async function main() {
	const password: string = await bcrypt.hash('root', 10)

	// Root user for API [u:root@api.com p:root]
	await prisma.user.createMany({
		data: [
			{
				email: 'root@api.com',
				name: 'Root',
				password: password,
				status: EUserStatus.ACTIVE,
			},
		],
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
