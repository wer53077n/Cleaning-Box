import 'dotenv/config'
import linebot from 'linebot'

import commandFE from './commands/fe.js'
import commandClean from './commands/cleaningBox.js'
import { scheduleJob } from 'node-schedule'
import * as usdtwd from './data/usdtwd.js'

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.on('message', async (event) => {
	if (process.env.DEBUG === 'true') {
		console.log(event)
	}

	if (event.message.type === 'text') {
		const userMessage = event.message.text.trim()
		if (userMessage === '前端') {
			commandFE(event)
		} else if (userMessage === 'qr') {
			event.reply({
				type: 'text',
				text: '了解更多',
				quickReply: {
					items: [
						{
							type: 'action',
							action: {
								type: 'message',
								text: 'message text',
								label: 'taipei'
							}
						},
						{
							type: 'action',
							action: {
								type: 'uri',
								uri: 'https://wdaweb.github.io',
								label: '職訓'
							}
						},
						{
							type: 'action',
							action: {
								type: 'postback',
								label: 'postback',
								data: 'aaa'
							}
						}
					]
				}
			})
		} else if (userMessage === '附近的垃圾桶在哪?') {
			// 請求用戶分享位置訊息
			await event.reply({
				type: 'template',
				altText: 'Share your location',
				template: {
					type: 'buttons',
					thumbnailImageUrl: 'YOUR_IMAGE_URL',
					title: 'Share Location',
					text: 'Click to share your location',
					actions: [
						{
							type: 'location',
							label: 'Share Location'
						}
					]
				}
			})
		}
	} else if (event.message.type === 'location') {
		commandClean(event)
	}
})

bot.on('postback', (event) => {
	console.log(event)
	event.reply('aaa')
})

bot.listen('/', process.env.PORT || 3000, () => {
	console.log('機器人啟動')
})
