# CriticalStack Backend

Projeto Spring Boot com Java 21, Maven e Flyway.

## Pré-requisitos

- Java 21
- Maven 3.9+
- Docker (para banco de dados)

## Configuração

### 1. Subir o banco de dados

```bash
docker-compose up -d
```

Isso inicia um container MySQL na porta 3306.

### 2. Conectar no DBeaver

- Host: `localhost`
- Porta: `3306`
- Usuário: `root`
- Senha: `root`
- Database: `critical_stack`

### 3. Rodar a aplicação

```bash
./mvnw spring-boot:run
```

Na primeira execução, o **Flyway** criará automaticamente as tabelas definidas em `src/main/resources/db/migration`.

## Estrutura das Migrações

As migrações do Flyway estão em: `src/main/resources/db/migration/`

Formato: `V{versao}__{descricao}.sql`

## Tecnologias

- Spring Boot 4.0.2
- Java 21
- Spring Data JPA
- Spring Security
- Flyway
- MySQL
