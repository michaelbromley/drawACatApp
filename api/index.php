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
	$sql = "SELECT id, name, thumbnail, author, UNIX_TIMESTAMP(created) as created, rating
			FROM cats
			WHERE isPublic = '1'";

	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$result = array();
		while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			// add any tags to the result
			$sql = "SELECT t.label FROM tags t
					INNER JOIN cats_tags ct
					ON ct.tag_id = t.id
					WHERE ct.cat_id = :catId";
			$tagStmt = $db->prepare($sql);
			$tagStmt->bindParam("catId", $row['id']);
			$tagStmt->execute();
			$tags = $tagStmt->fetchAll(PDO::FETCH_COLUMN, 0);
			$row['tags'] = $tags;

			array_push($result, $row);
		}

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

$app->get('/cat/:id/rated', function($id) use($app, $db) {
	$sql = "UPDATE cats SET rating = rating + 1 WHERE id = :id";

	try {
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(200);
	} catch(PDOException $e) {
		respondError($e->getMessage());
	}
});

$app->post('/cat/', function() use($app, $db) {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());

	$thumbnail = new Thumbnail($data->thumbnail);
	try {
		$thumbnail->save();
	}
	catch(Exception $e) {
		respondError($e->getMessage());
	}
	$thumbnailFileName = $thumbnail->getFileName();

	$sql = "INSERT INTO cats (name, description, data, author, isPublic, thumbnail, created) VALUES (:name, :description, :data, :author, :isPublic, :thumbnail, NOW())";
	$isPublic = $data->isPublic == true ? 1 : 0;
	try {
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $data->name);
		$stmt->bindParam("description", $data->description);
		$stmt->bindParam("data", json_encode($data->cat));
		$stmt->bindParam("author", $data->author);
		$stmt->bindParam("isPublic", $isPublic);
		$stmt->bindParam("thumbnail", $thumbnailFileName);
		$stmt->execute();

		$catId = $db->lastInsertId();
		$responseData = array(
			"id" => $catId
		);

		foreach($data->tags as $tag) {
			$sql = "INSERT IGNORE INTO tags (label) VALUES (:label)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam("label", $tag);
			$stmt->execute();

			if ($db->lastInsertId() == "0") {
				// the tag already exists in the database, so we need to get the id
				$sql = "SELECT id FROM tags WHERE label = :label";
				$stmt = $db->prepare($sql);
				$stmt->bindParam("label", $tag);
				$stmt->execute();
				$result = $stmt->fetch(PDO::FETCH_ASSOC);
				$tagId = $result['id'];
			} else {
				$tagId = $db->lastInsertId();
			}

			$sql = "INSERT INTO cats_tags (cat_id, tag_id) VALUES (:catId, :tagId)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam("catId", $catId);
			$stmt->bindParam("tagId", $tagId);
			$stmt->execute();
		}

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(201);
		$response->body(json_encode($responseData));
	} catch(PDOException $e) {
		respondError($e->getMessage());
	}
});
$app->get('/tags/', function() use($app, $db) {
	$sql = "SELECT label FROM tags";
	try {
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$tags = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(200);
		$response->body(json_encode($tags));
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
    if (strstr($_SERVER['DOCUMENT_ROOT'], 'E:/')) {
        $dbhost="127.0.0.1";
        $dbuser="root";
        $dbpass="";
        $dbname="drawacat";
    } else {
        $dbhost="mysql2109int.cp.blacknight.com";
        $dbuser="u1190953_drawcat";
        $dbpass="shim38LSdw00002233";
        $dbname="db1190953_drawacat";
    }
    // 500 error caused by next line on live server
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}