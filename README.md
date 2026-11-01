# Painel do Clima — Etapa 02 (Persistência de Dados + Docker)

## Autor
- **Nome:** Enzo Reis Araujo
- **Matrícula:** 22553166

---

## 1. Descrição do Projeto
Aplicação web interativa para consulta da previsão do tempo em qualquer cidade do mundo em tempo real, utilizando a API pública Open-Meteo[cite: 1, 5]. Nesta segunda etapa, o projeto ganhou persistência de dados na nuvem com o Supabase (PostgreSQL) para guardar cidades favoritas e foi conteinerizado com Docker para permitir a sua execução em qualquer ambiente com um único comando[cite: 9, 10, 11].

---

## 2. Persistência de Dados (Parte A)
- **Banco de Dados Utilizado:** Supabase (PostgreSQL)[cite: 10]
- **Nome da Tabela:** `favoritos`[cite: 10]
- **Estrutura da Tabela:**
  - `id`: `bigint` (Chave Primária, Auto-incremento)[cite: 10]
  - `criado_em`: `timestamptz` (Data e hora do registo)[cite: 10]
  - `nome_item`: `text` (Nome da cidade e país)[cite: 10]
  - `dados_extra`: `text` (Temperatura e condição do clima salvas no momento)[cite: 10]
- **Operações CRUD Implementadas:**
  - **Create (Criar):** O utilizador pesquisa uma cidade e clica no botão "⭐ Favoritar Cidade", gravando o registo na tabela do Supabase[cite: 10].
  - **Read (Ler):** Ao abrir a página, a aplicação procura automaticamente a lista de cidades salvas e desenha os itens na ecrã[cite: 10].
  - **Delete (Excluir):** Cada cidade favoritada possui um botão "Excluir" para remover a entrada correspondente do banco pelo seu `id`[cite: 10].

---

## 3. Links do Projeto
- **Repositório no GitHub:** https://github.com/enzoaraujo1203/bootcamp2-app
- **Aplicação no Ar (GitHub Pages):** https://enzoaraujo1203.github.io/bootcamp2-app/
- **Repositório no Docker Hub:** https://hub.docker.com/r/enzoaraujo1203/bootcamp2-app

---

## 4. Execução do Container via Docker (Parte B)
Para rodar a aplicação em qualquer servidor utilizando o container publicado no Docker Hub, execute o comando abaixo no terminal:

```bash
docker run -d -p 8080:80 enzoaraujo1203/bootcamp2-app:latest