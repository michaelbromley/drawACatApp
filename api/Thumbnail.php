<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 20/03/14
 * Time: 10:02
 */

class Thumbnail {

	const FILE_PATH = './thumbnails/';
	const THUMBNAIL_MID_DIMENSIONS = 200;
	const THUMBNAIL_SMALL_DIMENSIONS = 100;
	private $thumbnailDataString;
	private $thumbnailFileName;

	function __construct($dataUrl) {
		$dataUrlWithoutSpaces = str_replace(' ', '+', $dataUrl);
		$imageData = substr($dataUrlWithoutSpaces ,strpos($dataUrlWithoutSpaces,",") + 1);
		$this->thumbnailDataString = $imageData;
	}

	function save() {
		if (isset($this->thumbnailDataString)) {
			$hash = md5($this->thumbnailDataString);
			$this->thumbnailFileName = $hash;


			$original = imagecreatefromstring(base64_decode($this->thumbnailDataString));
			$originalWidth = imagesx($original);
			$originalHeight = imagesy($original);

			$thumbMid = imagecreatetruecolor(self::THUMBNAIL_MID_DIMENSIONS, self::THUMBNAIL_MID_DIMENSIONS);
		    imagecopyresampled($thumbMid, $original, 0, 0, 0, 0, self::THUMBNAIL_MID_DIMENSIONS, self::THUMBNAIL_MID_DIMENSIONS, $originalWidth, $originalHeight);

			$thumbSmall = imagecreatetruecolor(self::THUMBNAIL_SMALL_DIMENSIONS, self::THUMBNAIL_SMALL_DIMENSIONS);
		    imagecopyresampled($thumbSmall, $original, 0, 0, 0, 0, self::THUMBNAIL_SMALL_DIMENSIONS, self::THUMBNAIL_SMALL_DIMENSIONS, $originalWidth, $originalHeight);


			imagetruecolortopalette($original, false, 8);
			imagetruecolortopalette($thumbMid, false, 8);
			imagetruecolortopalette($thumbSmall, false, 8);
			imagegif($original, self::FILE_PATH.$this->thumbnailFileName.'.gif');
			imagegif($thumbMid, self::FILE_PATH.$this->thumbnailFileName.'_m.gif');
			imagegif($thumbSmall, self::FILE_PATH.$this->thumbnailFileName.'_s.gif');
		}
	}

	function getFileName() {
		if (isset($this->thumbnailFileName)) {
			return $this->thumbnailFileName;
		} else {
			return 'file not saved!';
		}
	}
}