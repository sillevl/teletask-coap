

module.exports.build = function(config){
  var coreFormat
  for (var resource in config.resources){
    if (config.resources.hasOwnProperty(resource)) {
       for(var item in config.resources[resource]){
          coreFormat += "</"+resource+"/"+config.resources[resource][item].number+">;title=\""+config.resources[resource][item].description+"\","
       }
    }
  }
  return coreFormat
}
