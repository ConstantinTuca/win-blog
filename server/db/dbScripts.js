module.exports = db => {
  const async                     = require('async');
  const _                         = require('lodash');
  const streetType                = require('./sync/sync-files/streetType');
  const locality                  = require('./sync/sync-files/locality');
  const country                   = require('./sync/sync-files/country');
  const county                    = require('./sync/sync-files/county');

  return {

    syncStreetType: () => {
      const arr = streetType, tasks = [];

      console.info('Started sync StreetType');
      for (let i = 0, ln = arr.length; i < ln; i++) {
        tasks.push(cb => {
          db.query(`SELECT name FROM "StreetType" WHERE name = '${arr[i].name}'`, { type: db.QueryTypes.SELECT }).then(r => {
            if (!r.length) {
              db.models.StreetType.create(arr[i]).then(() => {
                cb();
              }).catch(e => cb(e));
            } else {
              cb();
            }
          }).catch(() => console.error(`Eroare la verificarea StreetType!`));
        });
      }

      async.series(tasks, e => {
        if (e) {
          console.error(e);
        } else {
          console.info('SUCCESS!');
        }
      });
    },

    syncLocality: () => {
      const arr = locality, tasks = [];

      console.info('Started sync Locality');
      for (let i = 0, ln = arr.length; i < ln; i++) {
        tasks.push(cb => {
          db.query(`SELECT name FROM "Locality" WHERE name = '${arr[i].name}' AND id_county = ${arr[i].id_county}`, { type: db.QueryTypes.SELECT }).then(r => {
            if (!r.length) {
              db.models.Locality.create(arr[i]).then(() => {
                cb();
              }).catch(e => cb(e));
            } else {
              cb();
            }
          }).catch(() => console.error(`Eroare la verificarea Locality!`));
        });
      }

      async.series(tasks, e => {
        if (e) {
          console.error(e);
        } else {
          console.info('SUCCESS!');
        }
      });
    },

    syncCountry: () => {
      const arr = country, tasks = [];

      console.info('Started sync Country');
      for (let i = 0, ln = arr.length; i < ln; i++) {
        tasks.push(cb => {
          db.query(`SELECT name FROM "Country" WHERE name = '${arr[i].name}'`, { type: db.QueryTypes.SELECT }).then(r => {
            if (!r.length) {
              db.models.Country.create(arr[i]).then(() => {
                cb();
              }).catch(e => cb(e));
            } else {
              cb();
            }
          }).catch(() => console.error(`Eroare la verificarea Country!`));
        });
      }

      async.series(tasks, e => {
        if (e) {
          console.error(e);
        } else {
          console.info('SUCCESS!');
        }
      });
    },

    syncCounty: () => {
      const arr = county, tasks = [];

      console.info('Started sync County');
      for (let i = 0, ln = arr.length; i < ln; i++) {
        tasks.push(cb => {
          db.query(`SELECT name FROM "County" WHERE name = '${arr[i].name}'`, { type: db.QueryTypes.SELECT }).then(r => {
            if (!r.length) {
              db.models.County.create(arr[i]).then(() => {
                cb();
              }).catch(e => cb(e));
            } else {
              cb();
            }
          }).catch(() => console.error(`Eroare la verificarea County!`));
        });
      }

      async.series(tasks, e => {
        if (e) {
          console.error(e);
        } else {
          console.info('SUCCESS!');
        }
      });
    },
  };
};