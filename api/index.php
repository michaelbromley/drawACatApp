<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 08/03/14
 * Time: 22:19
 */

include('Slim/Slim.php');
include('thumbnail.php');

use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();
$db = getConnection();

/**
 * Define the routes of the API
 */
$app->get('/cat/', function() use($app, $db) {
	$sql = "SELECT id, name, description, rating FROM cats";

	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(200);
		$response->body(json_encode($result));
	} catch(PDOException $e) {
		respondError($e->getMessage());
	}
});

$app->get('/cat/:id', function($id) use($app, $db) {
	$sql = "SELECT * FROM cats WHERE id = :id";

	try {
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		$dataDecoded = json_decode($result['data']);
		$result['data'] = $dataDecoded;

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(200);
		$response->body(json_encode($result));
	} catch(PDOException $e) {
		respondError($e->getMessage());
	}
});

$app->post('/cat/', function() use($app, $db) {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());

	$thumbnail = new Thumbnail($data->thumbnail);
	$thumbnail->save();
	$thumbnailFileName = $thumbnail->getFileName();

	$sql = "INSERT INTO cats (name, description, data, author, isPublic, thumbnail) VALUES (:name, :description, :data, :author, :isPublic, :thumbnail)";
	$isPublic = $data->isPublic === "true" ? 1 : 0;
	try {
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $data->name);
		$stmt->bindParam("description", $data->description);
		$stmt->bindParam("data", json_encode($data->cat));
		$stmt->bindParam("author", $data->author);
		$stmt->bindParam("isPublic", $isPublic);
		$stmt->bindParam("thumbnail", $thumbnailFileName);
		$stmt->execute();

		$responseData = array(
			"id" => $db->lastInsertId()
		);

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(201);
		$response->body(json_encode($responseData));
	} catch(PDOException $e) {
		respondError($e->getMessage());
	}
});
$app->run();

function respondError($errorMessage) {
	$response = Slim::getInstance()->response();
	$response['Content-Type'] = 'application/json';
	$response->status(400);
	$response->body(json_encode($errorMessage));
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="";
	$dbname="drawacat";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}