<?php
ob_start();

if(!isset($_REQUEST['paylink_url'])){
  $response = [
    "brf_id" => null,
    "success" => false
  ];
} else {
  $context = stream_context_create(
      array(
          'http' => array(
              'follow_location' => false
          )
      )
  );

  $content = file_get_contents($_REQUEST['paylink_url'], false, $context);
  if($content === FALSE){
    $response = [
      "brf_id" => null,
      "success" => false
    ];
  } else {
    $str = substr($http_response_header[4], strpos($http_response_header[4], "id="));
    $brf_id = substr($str,3);

    if (strpos($brf_id, "BRF") === 0) {
      $response = [
        "brf_id" => $brf_id,
        "success" => true
      ];
    } else {
      $response = [
        "brf_id" => null,
        "success" => false
      ];
    }
  }
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
echo json_encode($response);
?>
