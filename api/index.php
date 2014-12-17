<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 08/03/14
 * Time: 22:19
 */
include('Slim/Slim.php');
include('db.php');
include('Thumbnail.php');
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();
$db = getConnection();
define("ITEMS_PER_PAGE", 15);


/**
 * Define the routes of the API
 */
$app->get('/cat/', function() use($app, $db) {


	$req = $app->request();
	$page = $req->get("page") != null ? $req->get("page") : 1;
	$start = ($page - 1) * ITEMS_PER_PAGE;
	$limit = ITEMS_PER_PAGE;

	$sort = $req->get("sort") == "new" ? "created" : "rating";

	$tagString = $req->get("tags") != null ? $req->get("tags") : "";
	$tags = $tagString != "" ? explode(" ", $tagString) : array();

	$sql = makeListQuery($sort, $tags);

	try {
		$stmt = $db->prepare($sql);
		$i = 1;
		foreach($tags as $tag) {
			$stmt->bindValue($i, $tag, PDO::PARAM_STR);
			$i ++;
		}
		$stmt->execute();
		$totalItems = $stmt->rowCount();

		$allRows = $stmt->fetchAll();
		$pageRows = array_slice($allRows, $start, $limit);

		$result = array();

		foreach ($pageRows as $row) {
			$row['tags'] = $row['tags'] != "" ? explode(",", $row['tags']) : array();
			array_push($result, $row);
		}

		// construct response object
		$payload = array(
			"totalCats" => $totalItems,
			"result" => $result
		);

		$response = $app->response();
		$response['Content-Type'] = 'application/json';
		$response->status(200);
		$response->body(json_encode($payload));
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
			$stmt->bindParam("label", strtolower($tag));
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

/**
 * Build the query to get a page of th cats list.
 *
 * @param $sort
 * @param $tags
 * @return string
 */
function makeListQuery($sort, $tags) {
	$sql = "SELECT c.id, name, thumbnail, author, UNIX_TIMESTAMP(created) as created, rating, GROUP_CONCAT(t.label) as tags
					FROM cats c
					LEFT JOIN cats_tags ct ON c.id = ct.cat_id
					LEFT JOIN tags t ON t.id = ct.tag_id
				WHERE isPublic = '1'
				GROUP BY c.id ";

	for($i = 0; $i < count($tags); $i ++) {
		if ($i == 0) {
			$sql .= " HAVING FIND_IN_SET(?, tags)";
		} else {
			$sql .= " AND FIND_IN_SET(?, tags)";
		}
	}
	$sql .= " ORDER BY $sort DESC";

	return $sql;
}


function respondError($errorMessage) {
	$response = Slim::getInstance()->response();
	$response['Content-Type'] = 'application/json';
	$response->status(400);
	$response->body(json_encode($errorMessage));
}
