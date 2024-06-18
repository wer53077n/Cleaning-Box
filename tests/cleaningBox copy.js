import axios from 'axios'
import template from './template' // 確保這裡的路徑正確指向你的 template 模板
// import { distance } from '../utils/distance'

// 計算兩個經緯度座標的距離
export const distance = (lat1, lon1, lat2, lon2, unit) => {
	if (lat1 === lat2 && lon1 === lon2) {
		return 0
	} else {
		const radlat1 = (Math.PI * lat1) / 180
		const radlat2 = (Math.PI * lat2) / 180
		const theta = lon1 - lon2
		const radtheta = (Math.PI * theta) / 180
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
		if (dist > 1) {
			dist = 1
		}
		dist = Math.acos(dist)
		dist = (dist * 180) / Math.PI
		dist = dist * 60 * 1.1515
		if (unit === 'K') {
			dist = dist * 1.609344
		}
		if (unit === 'N') {
			dist = dist * 0.8684
		}
		return dist
	}
}

// 提取資料的函數
const extractData = (data) => {
	if (!data.result || !data.result.results) {
		throw new Error('無效的資料結構')
	}
	const results = data.result.results
	results.forEach((item) => {
		const { 行政區, 地址, 經度, 緯度 } = item
		console.log(`行政區: ${行政區}, 地址: ${地址}, 經度: ${經度}, 緯度: ${緯度}`)
	})
}

const main = async () => {
	try {
		const response = await axios.get('https://data.taipei/api/v1/dataset/e9f18521-77cc-4be3-b9e1-0c5424bfa984?scope=resourceAquire&limit=10')

		// 檢查 API 回應
		if (response.status !== 200) {
			throw new Error(`API 回應錯誤，狀態碼: ${response.status}`)
		}

		const data = response.data

		// 確認 API 回應結構
		console.log('API 回應資料:', data)

		// 提取並打印資料
		extractData(data)

		// 進一步處理資料並生成 replies
		const event = {
			message: {
				latitude: 25.033, // 範例經緯度
				longitude: 121.5654
			}
		}

		const replies = data.result.results
			.map((d) => {
				d.distance = distance(parseFloat(d.緯度), parseFloat(d.經度), event.message.latitude, event.message.longitude, 'K')
				return d
			})
			.sort((a, b) => {
				return a.distance - b.distance
			})
			.slice(0, 5)
			.map((d) => {
				const t = template()
				t.body.contents[0].contents[1].contents[1].text = `${d.地址}`
				t.body.contents[0].contents[0].contents[1].text = `${d.行政區}`
				t.footer.contents[0].action.uri = `https://www.google.com/maps/search/?api=1&query=${d.緯度},${d.經度}`
				t.footer.contents[1].action.uri = `https://taiwangods.moi.gov.tw/html/landscape/1_0011.aspx?i=${d._id}`
				return t
			})

		console.log('生成的 replies:', JSON.stringify(replies, null, 2))
	} catch (error) {
		console.error('錯誤:', error)
	}
}

main()
