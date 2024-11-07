/**
 * @module tasks/layout/task/view-new/ui/likes-panel
 */
jn.define('tasks/layout/task/view-new/ui/likes-panel', (require, exports, module) => {
	const { Color, Indent } = require('tokens');
	const { Loc } = require('loc');
	const { connect } = require('statemanager/redux/connect');
	const { selectByTaskIdOrGuid } = require('tasks/statemanager/redux/slices/tasks');

	const LikesPanel = ({ viewsCount: count, taskId, testId }) => {
		return View(
			{
				testId: `${testId}_Container`,
				style: {
					paddingHorizontal: Number(Indent.XL3),
					paddingVertical: Number(Indent.XL),
					flexDirection: 'row',
					justifyContent: 'space-between',
				},
			},
			new LikeButton(),
			ViewsCount({ count, taskId, testId }),
		);
	};

	const ViewsCount = ({ count, taskId, testId }) => View(
		{
			testId: `${testId}_ViewsCountContainer`,
			style: {
				flexDirection: 'row',
				alignItems: 'center',
			},
			onClick()
			{
				// todo open users list widget - see layout/ui/user-list extension
				// const data = {
				// 	params: {
				// 		contentId: `TASK-${taskId}`,
				// 	},
				// };
				//
				// BX.ajax.runAction('socialnetwork.api.ContentView.getList', { data })
				// 	.then((response) => {
				// 		console.log('response', response);
				// 	})
				// 	.catch((err) => {
				// 		console.log('err', err);
				// 	});
			},
		},
		Image({
			svg: {
				// todo get icon from assets library
				content: `
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
						<path 
							fill-rule="evenodd" 
							clip-rule="evenodd" 
							d="M4.18087 9.48746C5.69937 7.44963 7.7094 6.01342 10.0633 6.07858C10.0725 6.07883 10.0817 6.07883 10.091 6.07858C12.4409 6.01353 14.3328 7.45722 15.9698 9.51349C15.9972 9.54783 16.0227 9.57939 16.0465 9.60895L16.0466 9.60899C16.1274 9.70909 16.1899 9.78636 16.2428 9.87126C16.3059 9.9724 16.3186 10.0301 16.3186 10.0652C16.3186 10.1031 16.3049 10.1634 16.2418 10.2667C16.1897 10.3521 16.129 10.4293 16.0509 10.5286L16.0508 10.5287C16.0259 10.5605 15.9991 10.5945 15.9703 10.6318C14.3577 12.7184 12.446 14.1218 10.091 14.0565C10.0817 14.0563 10.0725 14.0563 10.0633 14.0565C7.70239 14.1219 5.68453 12.7271 4.17818 10.6529C4.14288 10.6043 4.11097 10.5615 4.08171 10.5224L4.08171 10.5223C4.01333 10.4308 3.95941 10.3586 3.91052 10.276C3.84757 10.1697 3.83325 10.1074 3.83325 10.0673C3.83325 10.0277 3.8474 9.96601 3.9107 9.86053C3.96098 9.77676 4.01765 9.70247 4.08987 9.60779L4.08987 9.60779L4.08987 9.60778C4.11772 9.57127 4.14788 9.53174 4.18087 9.48746ZM3.37901 8.88995C4.99151 6.72597 7.26902 5.0067 10.0771 5.07859C12.8977 5.00642 15.0531 6.75643 16.7522 8.89064C16.7678 8.91026 16.7853 8.93187 16.8042 8.95515L16.8045 8.95547C16.8897 9.06056 17.0024 9.19953 17.0913 9.34196C17.2054 9.52495 17.3186 9.76935 17.3186 10.0652C17.3186 10.3597 17.2075 10.6041 17.0952 10.788C17.0089 10.9293 16.8992 11.0684 16.8157 11.1742C16.796 11.1992 16.7777 11.2224 16.7616 11.2433C15.0706 13.4312 12.8942 15.1288 10.0771 15.0565C7.27054 15.1286 4.98161 13.4609 3.36905 11.2405C3.35156 11.2164 3.33086 11.1887 3.30813 11.1583L3.30808 11.1583L3.30807 11.1582C3.23027 11.0542 3.12861 10.9182 3.05001 10.7855C2.94156 10.6023 2.83325 10.3592 2.83325 10.0673C2.83325 9.77379 2.94296 9.52975 3.05326 9.34595C3.13507 9.20963 3.24009 9.07226 3.32031 8.96732C3.34201 8.93894 3.36189 8.91292 3.37901 8.88995ZM11.495 10.0676C11.495 10.8515 10.8596 11.4869 10.0758 11.4869C9.29199 11.4869 8.65658 10.8515 8.65658 10.0676C8.65658 9.28382 9.29199 8.64841 10.0758 8.64841C10.8596 8.64841 11.495 9.28382 11.495 10.0676ZM10.0758 12.4869C11.4119 12.4869 12.495 11.4037 12.495 10.0676C12.495 8.73154 11.4119 7.64841 10.0758 7.64841C8.7397 7.64841 7.65658 8.73154 7.65658 10.0676C7.65658 11.4037 8.7397 12.4869 10.0758 12.4869Z" 
							fill="${Color.base4.toHex()}"/>
					</svg>
				`,
			},
			style: {
				width: 20,
				height: 20,
			},
		}),
		Text({
			testId: `${testId}_ViewsCountValue`,
			text: Number(count) > 1 ? String(count) : '1',
			style: {
				color: Color.base4.toHex(),
				fontSize: 12,
			},
		}),
	);

	class LikeButton extends LayoutComponent
	{
		constructor(props)
		{
			super(props);

			this.state = {
				active: false,
			};

			this.toggle = this.toggle.bind(this);
		}

		toggle()
		{
			this.setState({
				active: !this.state.active,
			});
		}

		render()
		{
			const color = this.state.active ? Color.accentMainPrimary.toHex() : Color.base4.toHex();

			return View(
				{
					style: {
						paddingVertical: 4,
						flexDirection: 'row',
						alignItems: 'center',
					},
					onClick: this.toggle,
				},
				Image({
					svg: {
						content: `
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path 
									fill-rule="evenodd" 
									clip-rule="evenodd" 
									d="M12.0656 4.28076C12.0672 4.27832 12.0685 4.27647 12.0696 4.27511L12.0726 4.27509C12.0936 4.27547 12.1562 4.28924 12.2259 4.36112C12.2754 4.41207 12.3057 4.48481 12.3057 4.56001V5.21305C12.3057 5.23436 12.303 5.339 12.2557 5.66579C12.2557 5.66579 12.2544 5.67326 12.2501 5.69036C12.2454 5.70921 12.2385 5.73398 12.2291 5.76504C12.2102 5.82736 12.1842 5.90513 12.1524 5.99502C12.0887 6.17448 12.007 6.38725 11.9251 6.59382C11.8435 6.7996 11.7633 6.99555 11.7033 7.1403C11.6734 7.21259 11.6486 7.2719 11.6313 7.31304L11.6114 7.36041L11.6046 7.37654C11.5914 7.40747 11.5813 7.43956 11.5742 7.47239C11.5338 7.65946 11.5322 7.92161 11.7178 8.14354C11.8831 8.34127 12.1092 8.39534 12.234 8.41524C12.3704 8.43697 12.516 8.43635 12.6305 8.43401C12.6807 8.43299 12.7258 8.43162 12.7691 8.43031C12.8412 8.42813 12.9079 8.4261 12.9836 8.4261H15.8576C15.8888 8.4261 15.9072 8.43005 15.9162 8.43269C15.9248 8.43521 15.9289 8.43768 15.9312 8.43921C15.935 8.44183 15.952 8.45469 15.9737 8.49903C16.0241 8.60196 16.0506 8.77218 16.0489 8.96288C16.0471 9.16289 16.0274 9.29401 15.9843 9.3919C15.9491 9.47172 15.8842 9.56249 15.7133 9.65019C15.5617 9.728 15.4564 9.87347 15.4298 10.0418C15.4032 10.21 15.4587 10.3814 15.5788 10.5022C15.5826 10.5075 15.6115 10.5482 15.63 10.6514C15.6493 10.7591 15.6494 10.8959 15.6226 11.0378C15.5641 11.3474 15.418 11.5194 15.2981 11.5676C15.1058 11.6448 14.9755 11.8263 14.964 12.0333C14.9538 12.2147 15.0366 12.3869 15.1802 12.4928C15.1831 12.5023 15.1865 12.5148 15.1899 12.5311C15.2085 12.6194 15.2117 12.7523 15.1859 12.8994C15.1601 13.0464 15.1116 13.1718 15.0574 13.2547C15.0149 13.3198 14.986 13.3349 14.9806 13.3372C14.8358 13.3701 14.7113 13.4618 14.637 13.5903C14.5623 13.7191 14.545 13.8733 14.589 14.0156C14.6067 14.073 14.5972 14.271 14.4564 14.4931C14.3199 14.7084 14.1704 14.7752 14.0853 14.7752C13.7657 14.7752 12.4283 14.7037 11.1423 14.63C10.5056 14.5935 9.88998 14.5571 9.43349 14.5297L8.68004 14.4841C8.67203 14.4836 8.66401 14.4833 8.65598 14.4832L8.65281 14.483C8.64598 14.4825 8.63261 14.4812 8.6151 14.4782C8.57763 14.4717 8.53547 14.4598 8.49951 14.4413C8.46597 14.424 8.44627 14.4056 8.43342 14.3857C8.42222 14.3684 8.39636 14.32 8.39636 14.2079V8.41787C8.39636 8.35294 8.41859 8.2901 8.45621 8.24123C8.47015 8.23061 8.487 8.21767 8.5066 8.20244C8.56672 8.15572 8.6528 8.08738 8.76037 7.99818C8.97542 7.81984 9.27686 7.55768 9.62875 7.21769C10.3315 6.53871 11.2411 5.54384 12.0656 4.28076ZM8.62018 15.5504L8.6244 15.5505L9.36959 15.5956C9.82665 15.623 10.4432 15.6595 11.0812 15.6961C12.3445 15.7685 13.7261 15.843 14.0853 15.843C14.6792 15.843 15.1173 15.4449 15.3582 15.0649C15.5184 14.8123 15.6424 14.4889 15.6614 14.1624C15.781 14.0667 15.8769 13.9527 15.9512 13.8389C16.1023 13.6078 16.1931 13.3378 16.2376 13.0841C16.2821 12.8306 16.2867 12.5576 16.2348 12.311C16.2276 12.277 16.2188 12.2408 16.2078 12.2031C16.4685 11.9211 16.6116 11.5551 16.6719 11.236C16.7202 10.9798 16.7255 10.7115 16.6811 10.4632C16.6708 10.4059 16.6574 10.347 16.6401 10.2878C16.78 10.15 16.8859 9.9938 16.9613 9.8227C17.0938 9.52228 17.1145 9.2145 17.1167 8.9725C17.1189 8.72118 17.0915 8.35366 16.9327 8.02935C16.8498 7.86006 16.7233 7.68693 16.5327 7.55696C16.3381 7.42429 16.1082 7.3583 15.8576 7.3583H12.9836C12.9128 7.3583 12.8366 7.3601 12.7668 7.36206C12.8133 7.24834 12.8652 7.11998 12.9178 6.98727C13.0017 6.7756 13.0888 6.54913 13.1587 6.35193C13.222 6.17369 13.2908 5.96656 13.3121 5.82175L13.3122 5.82062C13.3618 5.47794 13.3735 5.3124 13.3735 5.21305V4.56001C13.3735 4.20819 13.2358 3.86805 12.9915 3.61683C12.7536 3.37178 12.4329 3.21363 12.0919 3.20746C11.7364 3.20102 11.3889 3.3639 11.1714 3.69715C10.4014 4.8768 9.54822 5.81071 8.8868 6.44976C8.5566 6.76879 8.2756 7.01298 8.07874 7.17623C7.98035 7.25782 7.90311 7.31909 7.85139 7.35928C7.82553 7.37937 7.80607 7.39419 7.79355 7.40363L7.78005 7.41374L7.77717 7.41587C7.75302 7.43358 7.7304 7.4533 7.70955 7.4748C7.46546 7.7266 7.32855 8.06659 7.32855 8.41787V14.2079C7.32855 14.5003 7.4008 14.7553 7.53677 14.9656C7.67108 15.1733 7.8476 15.3066 8.01028 15.3904C8.17053 15.473 8.32459 15.5117 8.43428 15.5306C8.49036 15.5402 8.5383 15.5452 8.5744 15.5479C8.59253 15.5492 8.60794 15.55 8.62018 15.5504ZM4.36742 7.4785C3.54204 7.4785 2.88962 8.17809 2.94713 9.00146L3.3201 14.3405C3.37221 15.0865 3.99257 15.665 4.74038 15.665H5.19293C5.97924 15.665 6.61668 15.0276 6.61668 14.2413V8.90225C6.61668 8.11593 5.97924 7.4785 5.19293 7.4785H4.36742ZM4.01235 8.92705C3.99797 8.72121 4.16107 8.54631 4.36742 8.54631H5.19293C5.38951 8.54631 5.54887 8.70567 5.54887 8.90225V14.2413C5.54887 14.4379 5.38951 14.5972 5.19293 14.5972H4.74038C4.55343 14.5972 4.39834 14.4526 4.38531 14.2661L4.01235 8.92705Z" 
									fill="${color}"/>
							</svg>
						`,
					},
					style: {
						width: 20,
						height: 20,
					},
				}),
				Text({
					text: Loc.getMessage('M_TASK_DETAILS_LIKE_BUTTON'),
					style: {
						fontSize: 12,
						color,
					},
				}),
			);
		}
	}

	const mapStateToProps = (state, { taskId }) => {
		const task = selectByTaskIdOrGuid(state, taskId);

		return {
			taskId,
			viewsCount: task?.viewsCount || 1,
		};
	};

	module.exports = {
		LikesPanel: connect(mapStateToProps)(LikesPanel),
	};
});