var files = app.openDialog();

// if (app.documents.length > 0)
// 	app.activeDocument.close();

var input = getJPGtype();

for (var i = 0; i < files.length; i++)
	doFile(files[i]);

function getJPGtype() 
{
	var format, scans;
	var input = prompt("Please enter the quality:\n1 = Default\n2 = Optimized\n3-5 = Scans", "1");
	// alert(input);

	if (input != null)
	{
		if (input === "1")
			format = FormatOptions.STANDARDBASELINE;
		else if (input === "2")
			format = FormatOptions.OPTIMIZEDBASELINE;
		else if (input === "3")
		{
			format = FormatOptions.PROGRESSIVE;
			scans = 3;
		}
		else if (input === "4")
		{
			format = FormatOptions.PROGRESSIVE;
			scans = 4;
		}
		else if (input === "5")
		{
			format = FormatOptions.PROGRESSIVE;
			scans = 5;
		}
	}

	return [format, scans];
}

/** @param {File} f */
function doFile(f)
{
	var fileSize = Math.round(f.length / 1024); // B to KB
	if (fileSize < 7000)
		return;

	var d = app.open(f);

	var ext = d.name.match(/[^.]+$/)[0].toUpperCase();
	if (input[0] !== null && ext === "PNG")
		saveAsJPG(d, f, 12, input[0], input[1] || 3);

	d.close(SaveOptions.DONOTSAVECHANGES);
}

/** 
 * @param {Document} doc 
 * @param {File} file Same as Path
 * @param {Number} quality 0..9
 */
function saveAsPNG(doc, file, quality)
{
	var saveOptions = new PNGSaveOptions();
	saveOptions.compression = quality;
	saveOptions.interlaced = false;
	doc.saveAs(file, saveOptions, true, Extension.LOWERCASE);
}

/** 
 * @param {Document} doc 
 * @param {File} file Same as Path
 * @param {Number} quality 0..12
 * @param {FormatOptions} format 
 * @param {Number} scans // Values: 3..5, only needed format = FormatOptions.PROGRESSIVE
 */
function saveAsJPG(doc, file, quality, format, scans)
{
	var saveOptions = new JPEGSaveOptions();
	saveOptions.embedColorProfile = true;
	saveOptions.formatOptions = format;
	saveOptions.matte = MatteType.SEMIGRAY;
	saveOptions.quality = quality;
	if (format === FormatOptions.PROGRESSIVE)
		saveOptions.scans = scans;
	doc.saveAs(file, saveOptions, true, Extension.LOWERCASE);
}