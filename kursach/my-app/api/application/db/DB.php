<?php

class DB {
    function __construct() {
        $host = "127.0.0.1";
        $user = "mysql";
        $pass = "mysql";
        $name = "university";
        try {
            $this->conn = new PDO("mysql:host=$host;dbname=$name", $user, $pass);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
            die();
        }
    }

    function __destruct() {
        $this->conn = null;
    }

    public function select($tableName){}
    public function insert($tableName, $data) { //$data = []
        $stmt = $this->conn->prepare("INSERT INTO $tableName ? VALUES");
        $stmt->execute([$data]);
    }
    public function update($tableName){}
    public function delete($tableName){}

    public function getUserByLogin($login) {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE login='$login'");
        $stmt->execute();
        return $stmt->fetch();
    }

    public function getUserByLoginPass($login, $password) {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE login='$login' AND password='$password'");
        $stmt->execute();
        return $stmt->fetch();
    }

    public function getUserByToken($token) {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE token='$token'");
        $stmt->execute();
        return $stmt->fetch();
    }

    public function updateToken($id, $token) {
        $stmt = $this->conn->prepare("UPDATE users SET token='$token' WHERE id=$id");
        $stmt->execute();
        return true;
    }

    public function addNewUser($name, $login, $password) {
        $stmt = $this->conn->prepare("INSERT INTO users (name, login, password) VALUES ('$name', '$login', '$password')");
        $stmt->execute();
    }
	
}

$db = new DB();
$db.insert("subject", [["dfcz"]]);