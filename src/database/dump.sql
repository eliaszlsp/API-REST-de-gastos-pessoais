-- Active: 1695257636860@@127.0.0.1@5432@dindin

CREATE DATABASE dindin 

CREATE TABLE
    usuarios (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    );

CREATE TABLE
    categorias (
        id SERIAL PRIMARY KEY,
        descricao TEXT
    );

INSERT INTO
    categorias (descricao)
VALUES ('Alimentação'), ('Assinaturas e Serviços'), ('Casa'), ('Mercado'), ('Cuidados Pessoais'), ('Educação'), ('Família'), ('Lazer'), ('Pets'), ('Presentes'), ('Roupas'), ('Saúde'), ('Transporte'), ('Salário'), ('Vendas'), ('Outras receitas'), ('Outras despesas');

CREATE TABLE
    transacoes (
        id SERIAL PRIMARY KEY,
        descricao TEXT,
        valor INTEGER,
        data DATE,
        usuario_id integer references usuarios(id),
        categoria_id integer references categorias(id),
        tipo TEXT
    );

