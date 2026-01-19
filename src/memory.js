export class memoryInventory {
  createDB = () => {
    return { tables: {} };
  };
  initializeDB(db, table) {
    if (db === undefined) {
      throw new Error("DB is Undefined");
    }
    for (let i = 0; i < table.length; i++) {
      db.tables[table[i]] = [];
    }
    return db;
  }
}
