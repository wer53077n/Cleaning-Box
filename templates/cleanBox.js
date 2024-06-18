export default () => {
	return {
		type: 'bubble',
		// hero: {
		// 	type: 'image',
		// 	url: 'https://zeals75.com/wp-content/uploads/2023/02/53250002.jpg',
		// 	size: 'full',
		// 	aspectMode: 'cover',
		// 	action: {
		// 		type: 'uri',
		// 		uri: 'https://line.me/'
		// 	},
		// 	aspectRatio: '20:13'
		// },
		body: {
			type: 'box',
			layout: 'vertical',
			contents: [
				{
					type: 'text',
					text: '延平北路延平北路七段250號福安國中(右側公車亭左旁)',
					weight: 'bold',
					size: 'lg',
					wrap: true
				},
				{
					type: 'box',
					layout: 'vertical',
					margin: 'lg',
					spacing: 'sm',
					contents: [
						{
							type: 'box',
							layout: 'baseline',
							spacing: 'sm',
							contents: [
								{
									type: 'text',
									text: '地區',
									color: '#949449',
									size: 'md',
									flex: 1
								},
								{
									type: 'text',
									text: '士林區',
									color: '#949449',
									size: 'md',
									flex: 5
								}
							]
						}
					]
				}
			]
		},
		footer: {
			type: 'box',
			layout: 'vertical',
			spacing: 'sm',
			contents: [
				{
					type: 'button',
					height: 'sm',
					action: {
						type: 'uri',
						label: 'Google Map',
						uri: 'https://www.google.com/maps/search/?api=1&query=25.109023,121.466267'
					},
					style: 'primary',
					color: '#A9BB68'
				}
			],
			flex: 0
		}
	}
}
