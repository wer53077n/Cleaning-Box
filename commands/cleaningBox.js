import axios from 'axios'
import template from '../templates/cleanBox.js'
import { distance } from '../utils/distance.js'
import fs from 'node:fs'

const commandClean = async (event) => {
	try {
		// 發送多個請求以獲取所有垃圾桶數據
		const [data1, data2] = await Promise.all([
			axios.get('https://data.taipei/api/v1/dataset/e9f18521-77cc-4be3-b9e1-0c5424bfa984?scope=resourceAquire&limit=1000'),
			axios.get('https://data.taipei/api/v1/dataset/e9f18521-77cc-4be3-b9e1-0c5424bfa984?scope=resourceAquire&offset=1000&limit=1000')
		])

		// 合併數據
		const combinedData = [...data1.data.result.results, ...data2.data.result.results]

		const extractData = (data) => {
			return data.map((item) => ({
				district: item.行政區,
				address: item.地址,
				longitude: parseFloat(item.經度),
				latitude: parseFloat(item.緯度),
				remark: item.備註
			}))
		}

		const locations = extractData(combinedData)

		const userLatitude = event.message.latitude
		const userLongitude = event.message.longitude

		// 計算每個位置與用戶位置的距離，並排序
		const replies = locations
			.map((location) => {
				const dist = distance(userLatitude, userLongitude, location.latitude, location.longitude, 'K')
				return { ...location, distance: dist }
			})
			.sort((a, b) => a.distance - b.distance)
			.slice(0, 5)
			.map((location) => {
				const t = template()
				// 根據調整後的模板，填充正確的內容
				t.body.contents[0].text = location.address // 更新地址
				t.body.contents[1].contents[0].contents[1].text = location.district // 更新地區
				t.footer.contents[0].action.uri = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}` // 更新Google地圖連結
				return t
			})

		// 回覆用戶消息
		const result = await event.reply({
			type: 'flex',
			altText: '最近的垃圾桶幫你找到囉',
			contents: {
				type: 'carousel',
				contents: replies
			}
		})

		// 如果處於調試模式，輸出結果到控制台並保存到文件中
		if (process.env.DEBUG === 'true') {
			console.log(result)
			if (result.message) {
				fs.writeFileSync('./dump/cleanBox.json', JSON.stringify(replies, null, 2))
			}
		}
	} catch (error) {
		console.error(error)
		await event.reply('發生錯誤，請稍後再試')
	}
}

export default commandClean
