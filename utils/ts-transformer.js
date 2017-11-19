const ts = require('typescript');
const origin = require("metro-bundler/src/transformer").transform;
const SourceMap = require('source-map');

function decodeSourceMap(map) {
  const smc = new SourceMap.SourceMapConsumer(map);
  const ret = [];
  smc.eachMapping(m => {
    if (m.name) {
      ret.push([m.generatedLine, m.generatedColumn, m.originalLine, m.originalColumn, m.name]);
    } else {
      ret.push([m.generatedLine, m.generatedColumn, m.originalLine, m.originalColumn]);
    }
  });
  return ret;
}

exports.transform = function (_ref) {
  if (/\.tsx?$/.test(_ref.filename)) {
    const out = ts.transpileModule(_ref.src, Object.assign({
      fileName: _ref.filename,
    }, require('../tsconfig.json')));

    //var smc = new SourceMapConsumer();
    const map = JSON.parse(out.sourceMapText);

    return {
      code: out.outputText,
      filename: _ref.filename,
      map: _ref.options.generateSourceMaps ? map : decodeSourceMap(map),
    };
  }
  return origin(_ref);
};
