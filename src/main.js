var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');

function updateTsConfig(exampleFolder) {
   var fileName = path.resolve(__dirname, '../main-app/tsconfig.json');
   var file = require(fileName);

   let relPath = path.relative(path.resolve(__dirname, '../main-app'), path.resolve(exampleFolder, 'demo'));
   let relPathInclude = path.relative(path.resolve(__dirname, '../main-app'), path.resolve(exampleFolder));

   file.compilerOptions.paths.demo = [`${relPath}`];

   fs.writeFile(fileName, JSON.stringify(file), function (err) {
      if (err) return console.log(err);
      console.log('writing new tsconfig.json ');
   });
}

function clearDirs(callback) {
   // rimraf(f, [opts], callback)
   const dataPath = path.resolve(__dirname, '../dist')
   rimraf(dataPath, callback);
}


module.exports = function (mode, exampleFolder, assets) {
   clearDirs((error) => {
      if (error) {
         console.log(error);
      }
      updateTsConfig(exampleFolder);
      if (mode === 'prod') {
         require('./prod')(exampleFolder, assets);
      } else if (mode === 'dev') {
         require('./dev')(exampleFolder, assets);
      }
   })
}
