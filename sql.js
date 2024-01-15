USE diary_db;

CREATE TABLE users
(id int primary key not null auto_increment,
 user_name varchar(255),
 email varchar (255),
 password varchar (255));
 
 
 CREATE TABLE diary
 (id int primary key not null auto_increment,
 title varchar(255),
 description varchar(255),
 created_at datetime)