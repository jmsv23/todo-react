<?php
	if($_SERVER['REQUEST_METHOD'] == 'GET'){
		header('Content-type: application/json');
		$output = file_get_contents('todo.json');
		print $output;
	} elseif($_SERVER['REQUEST_METHOD'] == 'POST') {
		if($_POST['text'] != '') {
			header('Content-type: application/json');
			$output = file_get_contents('todo.json');
			$ar = json_decode($output);
			$comment = array('text' => $_POST['text']);
			array_push($ar, $comment);
			$actual = json_encode($ar);
			$status = file_put_contents('todo.json', $actual);
			// echo $status;
			print $actual;
		} else {
			http_response_code(404);
		}
	} elseif($_SERVER['REQUEST_METHOD'] == 'DELETE') {
		header('Content-type: application/json');
		$output = file_get_contents('todo.json');
		$ar = json_decode($output);
		unset($ar[$_GET['id']]);
		$ar2 = array();
		foreach ($ar as $key => $value) {
			array_push($ar2, $value);
		}
		$actual = json_encode($ar2);
		$status = file_put_contents('todo.json', $actual);
		print $actual;
	} elseif($_SERVER['REQUEST_METHOD'] == 'PUT') {
		header('Content-type: application/json');
		$output = file_get_contents('todo.json');
		$ar = json_decode($output);
		$ar[$_GET['id']]->done = true;
		$actual = json_encode($ar);
		$status = file_put_contents('todo.json', $actual);
		print $actual;
	}
	

?>