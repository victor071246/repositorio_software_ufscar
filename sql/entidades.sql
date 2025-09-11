create table Departamentos (
    id int primary key auto_increment,
    nome varchar(255) not null,
    criado_em timestamp default current_timestamp 
)

create table Equipamentos (
    id int primary key auto_increment,
    nome varchar(255) not null,
    descricao varchar(255) not null,
    estado varchar(50) default 'disponível',
    departamento_id int,
    criado_em timestamp default current_timestamp,
    constraint fk_equipamentos_departamento
    foreign key (departamento_id)
    references Departamentos(id)
)

create table Intercorrencias (
    id int primary key auto_increment,
    tipo varchar(30) not null,
    descricao varchar(255) not null,
    data_e_hora datetime not null, 
    equipamento_id int not null,
    criado_em timestamp default current_timestamp,
    constraint fk_intercorrencia_equipamento
    foreign key (equipamento_id)
    references Equipamentos(id)
)

create table Historico_Equipamentos (
    id int primary key auto_increment,

    equipamento_id int not null,
    usuario_id int not null,
    estado_anterior varchar(50) not null,
    novo_estado varchar(50) not null,
    data_e_hora DATETIME not null,

    constraint fk_historico_equipamento
    foreign key (equipamento_id)
    references Equipamentos(id)

    constraint fk_historico_usuario
    foreign key (usuario_id)
    references Usuarios(id)
)

create table Usuarios(
    id int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) unique not null,
    senha_hash varchar(255) not null,
    supervisor boolean not null default false,
    departamento_id int,
    criado_em timestamp default current_timestamp,
    constraint fk_usuarios_departamento
    foreign key (departamento_id)
    references Departamentos(id)
)

create table Agendamentos(
    id int primary key auto_increment,
    equipamento_id int not null,
    usuario_id int not null,
    horario_inicio datetime not null,
    horario_fim datetime not null,
    criado_em timestamp default current_timestamp,

    constraint fk_agendamentos_equipamentos
    foreign key (equipamento_id)
    references Equipamentos(id),
    
    constraint fk_agendamentos_usuarios
    foreign key (usuario_id)
    references Usuarios(id)
)
