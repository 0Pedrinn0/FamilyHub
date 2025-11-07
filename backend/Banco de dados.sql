CREATE DATABASE IF NOT EXISTS db_familyHub;

USE db_familyHub;

CREATE TABLE IF NOT EXISTS tb_usuario(
id_usuario INT PRIMARY KEY  AUTO_INCREMENT,
nome_usuario VARCHAR(255) NOT NULL,
senha_usuario VARCHAR(80) NOT NULL,
email_usuario VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS tb_lista_compra(
id_listaCompra INT PRIMARY KEY AUTO_INCREMENT,
nome_listaCompra VARCHAR(255) NOT NULL,
quantidade_listaCompra INT NOT NULL,
descricao_listaCompra TEXT NULL,
comprado_listaCompra BOOLEAN
);
CREATE TABLE IF NOT EXISTS tb_lembrete(
id_lembrete INT PRIMARY KEY AUTO_INCREMENT,
titulo_lembrete VARCHAR(100) NOT NULL,
discricao_lembrete TEXT NOT NULL,
data_lembrete DATE NOT NULL,
horario_lembrete TIME NULL
);
CREATE TABLE IF NOT EXISTS tb_boleto(
id_boleto INT PRIMARY KEY AUTO_INCREMENT,
nome_boleto VARCHAR(100) NOT NULL,
discricao_boleto TEXT NOT NULL,
data_boleto DATE NOT NULL
);