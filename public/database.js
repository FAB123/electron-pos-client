const sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database (or open it if it already exists)
let db = new sqlite3.Database("pos_local.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    //db.run("CREATE TABLE IF NOT EXISTS configurations (item TEXT, value TEXT)");

    // Create table if it does not exist
    db.run(
      "CREATE TABLE IF NOT EXISTS configurations (item TEXT, value TEXT)",
      function (err) {
        if (err) {
          console.error("Error creating table: ", err);
        } else {
          console.log("Table created or already exists.");

          // Check if the table is empty and insert multiple default data if it is
          db.get(
            "SELECT COUNT(*) AS count FROM configurations",
            function (err, row) {
              if (err) {
                console.error("Error checking table data: ", err);
              } else if (row.count === 0) {
                // Insert multiple default data items if the table is empty
                const items = [
                  ["kitchen-printer", "0"],
                  ["display-type", "0"],
                  ["app-color", "#9b27b0"],
                ];

                // Prepare the insert statement
                const stmt = db.prepare(
                  "INSERT INTO configurations (item, value) VALUES (?, ?)"
                );

                // Insert multiple items using a loop
                items.forEach(([item, value]) => {
                  stmt.run(item, value, function (err) {
                    if (err) {
                      console.error(
                        `Error inserting item (${item}, ${value}):`,
                        err
                      );
                    }
                  });
                });

                // Finalize the statement after inserting all items
                stmt.finalize(function () {
                  console.log("Default data inserted.");
                });
              }
            }
          );
        }
      }
    );
    db.run("CREATE TABLE IF NOT EXISTS items (item TEXT, value TEXT)");
  }
});

function saveConfiguration(_, data) {
  const { item, value } = data;
  return new Promise((resolve, reject) => {
    const getSavedDataQuery = `SELECT * FROM configurations WHERE item = ?`;
    db.get(getSavedDataQuery, [item], (err, row) => {
      if (err) {
        resolve({ error: true, message: `Error reading data: ${err}` });
      }

      if (row) {
        // Item exists, so update it
        const updateQuery = `UPDATE configurations SET value = ? WHERE item = ?`;
        db.run(updateQuery, [value, item], function (err) {
          if (err) {
            resolve({ error: true, message: `Error updating data: ${err}` });
          } else {
            resolve({ error: false, message: "Successfully updated item" });
          }
        });
      } else {
        // Item doesn't exist, so insert it
        const insertQuery = `INSERT INTO configurations (item, value) VALUES (?, ?)`;
        db.run(insertQuery, [item, value], function (err) {
          if (err) {
            resolve({ error: true, message: `Error inserting data: ${err}` });
          } else {
            resolve({ error: false, message: "Successfully inserted" });
          }
        });
      }
    });
  });
}

function getConfiguration(_, item) {
  return new Promise((resolve, reject) => {
    const getSavedDataQuery = `SELECT value FROM configurations WHERE item = ?`;
    db.get(getSavedDataQuery, [item], (err, row) => {
      if (err) {
        console.error("Error reading data:", err);
        reject(err);
      } else {
        resolve(row ? row.value : null);
      }
    });
  });
}

function getAppConfiguration(_) {
  return new Promise((resolve, reject) => {
    const getSavedDataQuery = `SELECT * FROM configurations`;
    db.all(getSavedDataQuery, [], (err, row) => {
      if (err) {
        console.error("Error reading data:", err);
        reject(err);
      } else {
        if (row) {
          let result = row.reduce((acc, obj) => {
            acc[obj.item] = obj.value; // or any logic to transform the object
            return acc;
          }, {});
          resolve(result);
        } else {
          resolve(null);
        }
      }
    });
  });
}
// function saveItems(params) {
//     db.run("CREATE TABLE IF NOT EXISTS configurations (id INT, name TEXT)");
// }

// function getItemByCategory(category) {
//     return new Promise((resolve,reject)=>{
//         const getItemQuery = `SELECT * FROM items WHERE category = ?`;
//         db.get(getItemQuery, [category], (err, row) => {
//             if (err) {
//                 console.error("Error reading data:", err);
//                 reject(err)
//             }else{
//                 console.log(row);
//                 resolve(row || null)
//             }
//         });
//     })
// }

// function getAllCategory() {
//     return new Promise((resolve,reject)=>{
//         const getItemQuery = `SELECT category FROM items`;
//         db.get(getItemQuery, [], (err, row) => {
//             if (err) {
//                 console.error("Error reading data:", err);
//                 reject(err)
//             }else{
//                 console.log(row);
//                 resolve(row || null)
//             }
//         });
//     })
// }

module.exports = { saveConfiguration, getConfiguration, getAppConfiguration };
