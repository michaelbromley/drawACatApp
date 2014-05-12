<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 12/05/14
 * Time: 14:31
 */

include('Slim/Slim.php');
include('db.php');
use Slim\Slim;
\Slim\Slim::registerAutoloader();

$app = new Slim();
$db = getConnection();

$app->get('/:id/:name', function($id) use($app, $db) {
	$sql = "SELECT * FROM cats WHERE id = :id";

	try {
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$result = $stmt->fetch(PDO::FETCH_ASSOC);
		$dataDecoded = json_decode($result['data']);
		$result['data'] = $dataDecoded;

		makePageTemplate($result);
	} catch(PDOException $e) {
		respondError($e->getMessage());
	}
});

$app->run();

function makePageTemplate($data) {
    $description = !empty($data["description"]) ? $data["description"] : "Come and play with ".$data["name"]."!";
    ?>
    <!DOCTYPE html>
    <html>
    <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <base href="/">
    <title><?php echo $data["name"]; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="favicon.ico">
    <meta property="og:title" content="<?php echo $data["name"]; ?>">
    <meta property="og:type" content="website">
    <meta property="og:image" content="http://www.drawacat.net/api/thumbnails/<?php echo $data["thumbnail"]; ?>.gif">
    <meta property="og:description" content="<?php echo $description; ?>">
    </head>
    <body>
    <p><?php echo $description; ?></p>

    <footer class="footer"><div class="container">
            <div class="row text-center">
                <div class="col-xs-12">
                    Draw A Cat: a sketch by Michael Bromley<br>
                    www.michaelbromley.co.uk<br>
                    @michlbrmly<br>
    </div>
            </div>
        </div>
    </footer>
    </body>
    </html>
<?php
}
