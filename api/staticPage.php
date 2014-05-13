<?php
/**
 * This file creates a static page for crawlers such as Facebook.
 *
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

$app->get('/:id/:name', function($id, $name) use($app, $db) {
    $sql = "SELECT * FROM cats WHERE id = :id";

    try {
        $stmt = $db->prepare($sql);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $dataDecoded = json_decode($result['data']);
        $result['data'] = $dataDecoded;

        makePageTemplate($result, $name);
    } catch(PDOException $e) {
        respondError($e->getMessage());
    }
});

$app->run();

function makePageTemplate($data, $name) {
    $pageUrl = "http://www.drawacat.net/cat/".$data["id"]."/".$name;
    $description = !empty($data["description"]) ? $data["description"] : "Come and play with ".$data["name"]."!";
    $imgUrl = "http://www.drawacat.net/api/thumbnails/".$data["thumbnail"].".gif";
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <base href="/">
        <title><?php echo $data["name"]; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="shortcut icon" href="favicon.ico">
        <!-- social media tags -->
        <meta name="twitter:card" content="summary_large_image">
        <!--<meta name="twitter:creator" content="@michlbrmly">-->
        <meta name="twitter:site" content="@DrawACat">
        <meta name="twitter:title" content="<?php echo $data["name"]; ?>">
        <meta name="twitter:description" content="<?php echo $description; ?>">
        <meta name="twitter:url" content="<?php echo $pageUrl; ?>">
        <meta name="twitter:domain" content="http://www.drawacat.net">
        <meta name="twitter:image:src" content="<?php echo $imgUrl; ?>">
        <meta property="og:title" content="<?php echo $data["name"]; ?>">
        <meta property="og:type" content="website">
        <meta property="og:url" content="<?php echo $pageUrl; ?>">
        <meta property="og:image" content="<?php echo $imgUrl; ?>">
        <meta property="og:description" content="<?php echo $description; ?>">
    </head>
    <body>
    <p><?php echo $description; ?></p>
    <pre>
        <?php
        //print_r($_SERVER);
        ?>
    </pre>
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
