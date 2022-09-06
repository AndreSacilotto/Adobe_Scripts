var files = app.openDialog();

// if (app.documents.length > 0)
// 	app.activeDocument.close();

for (var i = 0; i < files.length; i++)
	doFile(files[i]);

/** @param {File} f */
function doFile(f)
{
	var fileSize = Math.round(f.length / 1024); // B to KB
	if(fileSize < 7000)
		return;

	var maxRes = 300; // 72 = WEB / 300 = ART
	var maxW = 3840; // 4K X
	var maxH = 2160; // 4K Y

	var d = app.open(f);

	var ext = d.name.match(/[^.]+$/)[0].toUpperCase();

	var res = d.resolution;

	/** @type {Number} */
	var w = (d.width && d.width.value) || d.width;

	/** @type {Number} */
	var h = (d.height && d.height.value) || d.height;

	if (res > maxRes && w > maxW || h > maxH)
	{
		w = (w / res) * maxRes;
		h = (h / res) * maxRes;
		res = maxRes;
	}

	if (w > maxW || h > maxH)
	{
		var fit = calculateAspectRatioFit(w, h, maxW, maxH);
		d.resizeImage(px(fit.width), px(fit.height), res, ResampleMethod.AUTOMATIC);
		// d.save();
		d.close(SaveOptions.SAVECHANGES);
	}
	else
		d.close(SaveOptions.DONOTSAVECHANGES);
}

/** @param {Number} num */
function px(num) { return new UnitValue(num, "px"); }

/** Conserve aspect ratio of the original region. Useful when shrinking/enlarging images to fit into a certain area.
 * @param {Number} srcWidth base width of image @param {Number} srcHeight base height of image
 * @param {Number} maxWidth max available width @param {Number} maxHeight max available height
 * @return {{width:Number, height:Number}}
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight)
{
	var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	return { width: srcWidth * ratio, height: srcHeight * ratio };
}

/** @param {Number} bytes @return {{value:Number, size:String}} */
function bytesToSize(bytes)
{
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 B';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return { value: Math.round(bytes / Math.pow(1024, i), 2), size: sizes[i] };
}