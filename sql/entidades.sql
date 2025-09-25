CREATE TABLE Departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Equipamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    estado VARCHAR(50) DEFAULT 'disponível',
    departamento_id INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_equipamentos_departamento
        FOREIGN KEY (departamento_id)
        REFERENCES Departamentos(id)
);

CREATE TABLE Intercorrencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    data_e_hora DATETIME NOT NULL,
    equipamento_id INT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_intercorrencia_equipamento
        FOREIGN KEY (equipamento_id)
        REFERENCES Equipamentos(id)
);

CREATE TABLE Usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    supervisor BOOLEAN NOT NULL DEFAULT FALSE,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    departamento_id INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_departamento
        FOREIGN KEY (departamento_id)
        REFERENCES Departamentos(id)
);

CREATE TABLE Historico_Equipamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipamento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    estado_anterior VARCHAR(50) NOT NULL,
    novo_estado VARCHAR(50) NOT NULL,
    data_e_hora DATETIME NOT NULL,
    CONSTRAINT fk_historico_equipamento
        FOREIGN KEY (equipamento_id)
        REFERENCES Equipamentos(id),
    CONSTRAINT fk_historico_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id)
);

CREATE TABLE Agendamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipamento_id INT NOT NULL,
    usuario_id INT NOT NULL,
    horario_inicio DATETIME NOT NULL,
    horario_fim DATETIME NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamentos_equipamentos
        FOREIGN KEY (equipamento_id)
        REFERENCES Equipamentos(id),
    CONSTRAINT fk_agendamentos_usuarios
        FOREIGN KEY (usuario_id)
        REFERENCES Usuarios(id)
);
