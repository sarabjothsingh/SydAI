const { getConfig } = require("../config");

function listModels() {
  return getConfig().models;
}

function findModel(identifier) {
  const models = listModels();
  return (
    models.find((model) => model.display_name === identifier) ||
    models.find((model) => model.id === identifier) ||
    null
  );
}

module.exports = {
  listModels,
  findModel,
};
