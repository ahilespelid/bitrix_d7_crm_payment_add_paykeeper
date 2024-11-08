/**
 * @module layout/ui/file/icon
 */
jn.define('layout/ui/file/icon', (require, exports, module) => {
	const AppTheme = require('apptheme');
	const { stringify } = require('utils/string');

	const MediaType = {
		ARCHIVE: 'archive',
		MEDIA: 'media',
		PICTURE: 'picture',
		OTHER: 'other',
	};

	const Presets = {
		RAR: { color: '#7EAB34', mediaType: MediaType.ARCHIVE },
		ZIP: { color: '#AC5FBD', mediaType: MediaType.ARCHIVE },
		GZIP: { color: '#8F44A0', mediaType: MediaType.ARCHIVE },
		GZ: { color: '#BA7ED5', mediaType: MediaType.ARCHIVE },
		JPG: { color: '#1D95A5', mediaType: MediaType.PICTURE },
		JPEG: { color: '#1D95A5', mediaType: MediaType.PICTURE },
		WEBP: { color: '#0D7683', mediaType: MediaType.PICTURE },
		GIF: { color: '#2E85D3', mediaType: MediaType.PICTURE },
		PNG: { color: '#1CC09D', mediaType: MediaType.PICTURE },
		MOV: { color: '#CB8600', mediaType: MediaType.MEDIA },
		'3GP': { color: '#ACB75F', mediaType: MediaType.MEDIA },
		WEBM: { color: '#ACB75F', mediaType: MediaType.MEDIA },
		AVI: { color: '#FF5752', mediaType: MediaType.MEDIA },
		MP3: { color: '#0B66C3', mediaType: MediaType.OTHER },
		WAV: { color: '#1D62AA', mediaType: MediaType.OTHER },
		PHP: { color: '#746781', mediaType: MediaType.OTHER },
		PDF: { color: '#D73B41', mediaType: MediaType.OTHER },
		PSD: { color: '#7E8997', mediaType: MediaType.OTHER },
		TXT: { color: '#9BA4AE', mediaType: MediaType.OTHER },
		DOC: { color: '#2C77B1', mediaType: MediaType.OTHER },
		DOCX: { color: '#2C77B1', mediaType: MediaType.OTHER },
		PPT: { color: '#E89E00', mediaType: MediaType.OTHER },
		PPTX: { color: '#E89E00', mediaType: MediaType.OTHER },
		XLS: { color: '#54B51E', mediaType: MediaType.OTHER },
		XLSX: { color: '#54B51E', mediaType: MediaType.OTHER },
		none: { color: '#7E8997', mediaType: MediaType.OTHER },
	};

	const DEFAULT_SIZE = 20;
	const MAX_ALLOWED_EXTENSION_LEN = 4;
	const COMMON_EXTENSION_LEN = 3;

	const trim = (s) => s.trim();

	/**
	 * @public
	 * @param {string} fileExt
	 * @param {number} size
	 * @return {LayoutComponent}
	 */
	function EasyIcon(fileExt, size)
	{
		return FileIcon({ fileExt, size });
	}

	/**
	 * @public
	 * @param {string} fileExt
	 * @param {string} mediaType
	 * @param {string} color
	 * @param {number} size
	 * @return {LayoutComponent}
	 */
	function FileIcon({ fileExt, mediaType, color, size = DEFAULT_SIZE })
	{
		fileExt = normalizeFileExtension(fileExt);
		const preset = preparePreset(fileExt, mediaType, color);

		return View(
			{
				style: {
					width: size,
					height: size,
				},
			},
			Image({
				style: {
					width: size,
					height: size,
				},
				resizeMode: 'contain',
				svg: {
					content: trim(`
						<svg xmlns="http://www.w3.org/2000/svg" width="100" height="117" viewBox="0 0 100 117" fill="none">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H63.3929L89.2857 25.8929V116.071H0V0Z" fill="#e5e8eb"></path>
							<path fill-rule="evenodd" clip-rule="evenodd" opacity="0.3" d="M63.3929 0L89.2857 25.8929H63.3929V0Z" fill="#535c69"></path>
							${renderMediaTypeFragment(preset.mediaType)}
							${renderFileExtension(fileExt, preset.color)}
						</svg>
					`),
				},
			}),
		);
	}

	/**
	 * @private
	 * @param {string} fileExt
	 * @return {string|null}
	 */
	function normalizeFileExtension(fileExt)
	{
		fileExt = fileExt ? stringify(fileExt).toLocaleUpperCase(env.languageId) : null;
		if (fileExt && fileExt.length > MAX_ALLOWED_EXTENSION_LEN)
		{
			fileExt = null;
		}

		return fileExt;
	}

	/**
	 * @private
	 * @param {string} fileExt
	 * @param {string} mediaType
	 * @param {string} color
	 * @return {{color: string, mediaType: string}}
	 */
	function preparePreset(fileExt, mediaType, color)
	{
		const preset = (fileExt && Presets[fileExt]) ? Presets[fileExt] : Presets.none;

		preset.color = color || preset.color;
		preset.mediaType = mediaType ? normalizeMediaType(mediaType) : preset.mediaType;

		return preset;
	}

	/**
	 * @private
	 * @param {string} mediaType
	 * @return {string}
	 */
	function normalizeMediaType(mediaType)
	{
		return Object.values(MediaType).includes(mediaType) ? mediaType : MediaType.OTHER;
	}

	/**
	 * @private
	 * @param {string} fileExt
	 * @param {string} color
	 * @return {string}
	 */
	function renderFileExtension(fileExt, color)
	{
		if (!fileExt)
		{
			return '';
		}

		const textSize = fileExt.length > COMMON_EXTENSION_LEN ? 28 : 32;
		const textTop = fileExt.length > COMMON_EXTENSION_LEN ? 31 : 32;

		return trim(`
			<svg xmlns="http://www.w3.org/2000/svg" width="85" height="44" x="15" y="53">
				<rect width="85" height="44" x="0" y="0" fill="${color}"></rect>
				<text x="43" y="${textTop}" fill="${AppTheme.colors.baseWhiteFixed}" font-family="sans-serif" font-size="${textSize}" text-anchor="middle">${fileExt}</text>
			</svg>
		`);
	}

	/**
	 * @private
	 * @param {string} mediaType
	 * @return {string}
	 */
	function renderMediaTypeFragment(mediaType)
	{
		if (mediaType === MediaType.PICTURE)
		{
			return `<path fill-rule="evenodd" clip-rule="evenodd" d="M11.6071 42.8571H75.4348H77.6785V108.929H11.6071V106.687V42.8571ZM13.8491 106.687H75.435V45.1009H13.8491V106.687ZM67.5987 61.1226C67.5987 64.4852 64.8718 67.2112 61.5082 67.2112C58.1443 67.2112 55.4176 64.4852 55.4176 61.1226C55.4176 57.76 58.1443 55.0341 61.5082 55.0341C64.8718 55.0341 67.5987 57.76 67.5987 61.1226ZM17.9371 102.805H71.3468V99.293L57.1052 85.2417L49.9824 92.2684L32.1785 74.7047L17.9371 88.7541V102.805Z" fill="${AppTheme.colors.base5}"></path>`;
		}

		if (mediaType === MediaType.ARCHIVE)
		{
			return `<path fill-rule="evenodd" clip-rule="evenodd" d="M22.3214 0H27.7486V1.96417H22.3214V0ZM22.3214 3.57123H27.7486V5.5354H22.3214V3.57123ZM22.3214 7.14246H27.7486V9.10663H22.3214V7.14246ZM22.3214 10.5351H27.7486V12.4993H22.3214V10.5351ZM22.3214 14.1063H27.7486V16.0705H22.3214V14.1063ZM22.3214 17.6776H27.7486V19.6417H22.3214V17.6776ZM22.3214 21.2488H27.7486V23.213H22.3214V21.2488ZM22.3214 24.82H27.7486V26.7842H22.3214V24.82ZM22.3214 28.3913H27.7486V30.3554H22.3214V28.3913ZM22.3214 31.7839H27.7486V33.7481H22.3214V31.7839ZM22.3214 35.3552H27.7486V37.3193H22.3214V35.3552ZM22.3214 38.9264H27.7486V40.8906H22.3214V38.9264ZM29.4993 1.19209e-07H34.9265V1.96417H29.4993V1.19209e-07ZM29.4993 3.57123H34.9265V5.5354H29.4993V3.57123ZM29.4993 7.14246H34.9265V9.10663H29.4993V7.14246ZM29.4993 10.5351H34.9265V12.4993H29.4993V10.5351ZM29.4993 14.1063H34.9265V16.0705H29.4993V14.1063ZM29.4993 17.6776H34.9265V19.6417H29.4993V17.6776ZM29.4993 21.2488H34.9265V23.213H29.4993V21.2488ZM29.4993 24.82H34.9265V26.7842H29.4993V24.82ZM29.4993 28.3913H34.9265V30.3554H29.4993V28.3913ZM29.4993 31.7839H34.9265V33.7481H29.4993V31.7839ZM29.4993 35.3552H34.9265V37.3193H29.4993V35.3552ZM29.4993 38.9264H34.9265V40.8906H29.4993V38.9264Z" fill="${AppTheme.colors.base5}"></path>`;
		}

		if (mediaType === MediaType.MEDIA)
		{
			return `<path fill-rule="evenodd" clip-rule="evenodd" d="M77.6785 90.873V42.6587H11.6071V90.873H77.6785ZM13.799 85.5088L13.848 85.5087L13.8488 88.6073L23.7776 88.6064L23.7781 88.6579H13.799V85.5088ZM65.4958 88.6064V44.9261L75.4346 44.9263L75.4335 48.0269L67.4498 48.0273V53.0045L75.4335 53.0032V48.0269L75.4826 48.0273V44.8779H65.4974L65.4958 44.9261H23.7776L23.7781 44.8759H13.799V48.0253H13.848V53.0016H21.8248V48.0253H13.848L13.8488 44.9263L23.7776 44.9261V88.6064H65.4958ZM75.4335 85.5053L75.4346 88.6073L65.4958 88.6064L65.4974 88.6541H75.4826V85.5067L75.4335 85.5053ZM75.4335 85.5053V80.5274L67.4498 80.5275V85.5067L75.4335 85.5053ZM13.848 85.5087H21.8248V80.5307H13.848V85.5087ZM53.3524 67.5326L39.5164 56.1499V56.2398L39.4786 56.2087V79.2022L53.4164 67.7065L53.279 67.593L53.3524 67.5326ZM13.848 72.404H21.8248V77.3819H13.848V72.404ZM67.4498 72.403L75.4335 72.4022V77.3803H67.4498V72.403ZM13.848 64.2772H21.8248V69.2551H13.848V64.2772ZM67.4498 64.2765L75.4335 64.2756V69.2551L67.4498 69.2556V64.2765ZM13.848 56.1504H21.8248V61.1283H13.848V56.1504ZM67.4498 56.1519L75.4335 56.1504V61.1283L67.4498 61.1292V56.1519Z" fill="${AppTheme.colors.base5}"></path>`;
		}

		return '';
	}

	module.exports = { FileIcon, EasyIcon, MediaType };
});
