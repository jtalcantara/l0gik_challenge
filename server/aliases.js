// Sistema de aliases usando module-alias
const moduleAlias = require('module-alias');

// Registrar alias principal - @ aponta para o diretório atual
moduleAlias.addAliases({
  '@': __dirname
});
