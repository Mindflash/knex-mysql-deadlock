# knex-mysql-deadlock
A custom knex mysql dialect, which does deadlock retries

## Install

```bash
npm install knex mysql knex-mysql-deadlock
```

## Usage

```js
const knex = require('knex')({
  client: require('knex-mysql-deadlock'),
  connection: mysqlConfig
});
```
