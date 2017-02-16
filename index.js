/* eslint-disable camelcase, no-underscore-dangle */
'use strict';

const util = require('util');

// Custom mysql dialect, with deadlock retries
const Client_MySQL = require('knex/lib/dialects/mysql');

class Client_MySQL_deadlock extends Client_MySQL {
  constructor(config) {
    super(config);

    const { deadlockRetries } = config.options;

    this.deadlockRetries = deadlockRetries || 5;
  }

  _query(connection, obj) {
    let retryAmount = this.deadlockRetries;

    const runQuery = () => Reflect.apply(super._query, this, arguments)
      .catch(error => {
        if (error.code === 'ER_LOCK_WAIT_TIMEOUT' && --retryAmount > 0) {
          console.log(`${error.code} returned, retrying, (${retryAmount}) tries remaning: ${util.inspect(arguments, {depth:2})}`);

          return runQuery();
        }

        throw error;
      });

    return runQuery();
  }
}

module.exports = Client_MySQL_deadlock;
