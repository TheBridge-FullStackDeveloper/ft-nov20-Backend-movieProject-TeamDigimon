DROP DATABASE  IF EXISTS usersMovie;
create database usersMovie;
use usersMovie;
create table users(
	iduser int not null auto_increment,
    Email varchar(48) not null,
    pass varchar(64) not null,
    rules varchar(24) not null,
    primary key (iduser)
);

create table favMovies(
	idusers int,
  idFilm varchar(40),
foreign key (idusers) references users (iduser)
	on update cascade
    on delete restrict
);


