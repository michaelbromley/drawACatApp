<?php
/**
 * Created by PhpStorm.
 * User: Michael
 * Date: 08/03/14
 * Time: 22:19
 */

include('Slim/Slim.php');
\Slim\Slim::registerAutoloader();

$app = new Slim();

/**
 * Define the routes of the API
 */
$app->post('/cat', 'addCat');