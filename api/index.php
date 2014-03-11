<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 08/03/14
 * Time: 22:19
 */

include('Slim/Slim.php');
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();



/**
 * Define the routes of the API
 */
$app->get('/cat/', 'listCats');
$app->get('/cat/:id', 'loadCat');
$app->post('/cat/', 'addCat');

$app->run();

function listCats() {

	$sql = "SELECT id, name, description, rating FROM cats";

	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($result);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function loadCat($id) {
	$sql = "SELECT * FROM cats WHERE id = :id";

		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);
			$stmt->bindParam("id", $id);
			$stmt->execute();
			$result = $stmt->fetch(PDO::FETCH_ASSOC);
			$dataDecoded = json_decode($result['data']);
			$result['data'] = $dataDecoded;
			echo json_encode($result);
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
}

function addCat() {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());

	$sql = "INSERT INTO cats (name, description, data) VALUES (:name, :description, :data)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $data->name);
		$stmt->bindParam("description", $data->description);
		$stmt->bindParam("data", json_encode($data->cat));
		$stmt->execute();
		$data->id = $db->lastInsertId();
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
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