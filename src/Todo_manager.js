export const manageInventory = (db, InventoryClass, cliArgs) => {
  const inventoryService = new InventoryClass(db);

  const { command, ...options } = parser(cliArgs);

  switch (command) {
    case "init":
      inventoryService.initlizeDb(db, options);
      break;
    case "update":
      inventoryService.updateItemOfInventory(db, options);
      break;
    case "add":
      inventoryService.addItemToInventory(db, options);
      break;
    case "list":
      inventoryService.listInventory(db, options);
      break;

    default:
      throw new Error("command is Invalid");
  }
};
