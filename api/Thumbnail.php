<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 20/03/14
 * Time: 10:02
 */

class Thumbnail {

	const FILE_PATH = './thumbnails/';
	private $thumbnailDataString;
	private $thumbnailFileName;

	function __construct($dataUrl) {
		$dataUrlWithoutSpaces = str_replace(' ', '+', $dataUrl);
		$imageData = substr($dataUrlWithoutSpaces ,strpos($dataUrlWithoutSpaces,",") + 1);
		$this->thumbnailDataString = $imageData;
	}

	function save() {
		if (isset($this->thumbnailDataString)) {
			$this->thumbnailFileName = md5($this->thumbnailDataString).'.png';
			file_put_contents(self::FILE_PATH.$this->thumbnailFileName, base64_decode($this->thumbnailDataString));
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