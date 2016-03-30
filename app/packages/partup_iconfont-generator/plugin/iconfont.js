var _ = Npm.require('lodash');
var fs = Npm.require('fs-extra');
var path = Npm.require('path');
var temp = Npm.require('temp').track();
var md5 = Npm.require('MD5');
var svg2ttf = Npm.require('svg2ttf');
var ttf2eot = Npm.require('ttf2eot');
var ttf2woff = Npm.require('ttf2woff');
var svgicons2svgfont = Npm.require('svgicons2svgfont');
var optionsFile = path.join(process.cwd(), 'iconfont.json');
var cacheFilePath = path.join(process.cwd(), '.meteor/iconfont.cache');

var handler = function(compileStep) {
    var options = fs.existsSync(optionsFile) ? loadJSONFile(optionsFile) : {};
    compileStep.inputPath = 'iconfont.json';
    options = _.extend({
        src: 'svgs',
        dest: 'public/fonts/icons',
        fontFaceBaseURL: '/fonts/icons',
        fontName: 'icons',
        fontHeight: 512,
        stylesheetsDestBasePath: 'client',
        descent: 64,
        normalize: true,
        classPrefix: 'icon-',
        stylesheetFilename: null,
        stylesheetTemplate: '.meteor/local/isopacks/andrefgneves_iconfont/os/packages/andrefgneves_iconfont/plugin/stylesheet.tpl',
        types: ['svg', 'ttf', 'eot', 'woff']
    }, options);
    if (!options.types || !options.types.length) {
        return;
    }
    options.files = getFiles(options.src);
    if (didInvalidateCache(options)) {
        console.log('\n[iconfont] generating');
        options.fontFaceURLS = {};
        options.types = _.map(options.types, function(type) {
            return type.toLowerCase();
        });
        return generateFonts(compileStep, options);
    }
};

var didInvalidateCache = function(options) {
    var didInvalidate = false;
    var newCacheChecksum = generateCacheChecksum(options);
    if (!fs.existsSync(cacheFilePath)) {
        didInvalidate = true;
    } else {
        var oldCacheChecksum = fs.readFileSync(cacheFilePath, {
            encoding: 'utf8'
        });
        didInvalidate = newCacheChecksum !== oldCacheChecksum;
    }
    if (didInvalidate) {
        fs.writeFileSync(cacheFilePath, newCacheChecksum);
    }
    return didInvalidate;
};

var generateCacheChecksum = function(options) {
    var checksums = [];
    var settingsChecksum = md5(fs.readFileSync(optionsFile));
    _.each(options.files, function(file) {
        var checksum = md5(path.basename(file) + fs.readFileSync(file));
        return checksums.push(checksum);
    });
    return md5(settingsChecksum + JSON.stringify(checksums));
};

var generateFonts = function(compileStep, options) {
    return generateSVGFont(options.files, options, function(svgFontPath) {
        if (_.intersection(options.types, ['ttf', 'eot', 'woff']).length) {
            generateTTFFont(svgFontPath, options, function(ttfFontPath) {
                if (_.contains(options.types, 'eot')) {
                    generateEOTFont(ttfFontPath, options);
                }
                if (_.contains(options.types, 'woff')) {
                    return generateWoffFont(ttfFontPath, options);
                }
            });
        }
        return generateStylesheets(compileStep, options);
    });
};

var generateSVGFont = function(files, options, done) {
    var codepoint = 0xE001;
    options.glyphs = _.compact(_.map(files, function(file) {
        var matches;
        matches = file.match(/^(?:u([0-9a-f]{4})\-)?(.*).svg$/i);
        if (matches) {
            return {
                name: path.basename(matches[2]).toLowerCase().replace(/\s/g, '-'),
                stream: fs.createReadStream(file),
                codepoint: matches[1] ? parseInt(matches[1], 16) : codepoint++
            };
        }
        return false;
    }));
    var fontStream = svgicons2svgfont(options.glyphs, _.extend(options, {
        log: function() {},
        error: function() {}
    }));
    var tempStream = temp.createWriteStream();
    return fontStream.pipe(tempStream).on('finish', function() {
        var svgDestPath;
        if (_.contains(options.types, 'svg')) {
            svgDestPath = path.join(process.cwd(), options.dest, options.fontName + '.svg');
            fs.createFileSync(svgDestPath);
            fs.writeFileSync(svgDestPath, fs.readFileSync(tempStream.path));
            options.fontFaceURLS.svg = path.join(options.fontFaceBaseURL, options.fontName + '.svg');
        }
        if (_.isFunction(done)) {
            return done(tempStream.path);
        }
    });
};

var generateTTFFont = function(svgFontPath, options, done) {
    var font = svg2ttf(fs.readFileSync(svgFontPath, {
        encoding: 'utf8'
    }), {});
    font = new Buffer(font.buffer);
    var tempFile = temp.openSync(options.fontName + '-ttf');
    fs.writeFileSync(tempFile.path, font);
    if (_.contains(options.types, 'ttf')) {
        var ttfDestPath = path.join(process.cwd(), options.dest, options.fontName + '.ttf');
        fs.createFileSync(ttfDestPath);
        fs.writeFileSync(ttfDestPath, font);
        options.fontFaceURLS.ttf = path.join(options.fontFaceBaseURL, options.fontName + '.ttf');
    }
    if (_.isFunction(done)) {
        return done(tempFile.path);
    }
};

var generateEOTFont = function(ttfFontPath, options, done) {
    var ttf = new Uint8Array(fs.readFileSync(ttfFontPath));
    var font = new Buffer(ttf2eot(ttf).buffer);
    var tempFile = temp.openSync(options.fontName + '-eot');
    fs.writeFileSync(tempFile.path, font);
    var eotDestPath = path.join(process.cwd(), options.dest, options.fontName + '.eot');
    fs.createFileSync(eotDestPath);
    fs.writeFileSync(eotDestPath, font);
    options.fontFaceURLS.eot = path.join(options.fontFaceBaseURL, options.fontName + '.eot');
    if (_.isFunction(done)) {
        return done(tempFile.path);
    }
};

var generateWoffFont = function(ttfFontPath, options, done) {
    var ttf = new Uint8Array(fs.readFileSync(ttfFontPath));
    var font = new Buffer(ttf2woff(ttf).buffer);
    var tempFile = temp.openSync(options.fontName + '-woff');
    fs.writeFileSync(tempFile.path, font);
    var eotDestPath = path.join(process.cwd(), options.dest, options.fontName + '.woff');
    fs.createFileSync(eotDestPath);
    fs.writeFileSync(eotDestPath, font);
    options.fontFaceURLS.woff = path.join(options.fontFaceBaseURL, options.fontName + '.woff');
    if (_.isFunction(done)) {
        return done(tempFile.path);
    }
};

var generateStylesheets = function(compileStep, options) {
    var fontSrcs = [];
    var glyphCodepointMap = {};
    var classNames = _.map(options.glyphs, function(glyph) {
        return '.' + options.classPrefix + glyph.name.replace(/\s+/g, '-');
    });
    _.each(options.glyphs, function(glyph) {
        return glyphCodepointMap[glyph.name] = glyph.codepoint.toString(16);
    });
    if (_.contains(options.types, 'eot')) {
        fontSrcs.push(getFontSrcURL({
            baseURL: options.fontFaceBaseURL,
            fontName: options.fontName,
            extension: '.eot'
        }));
    }
    var srcs = [];
    _.each(options.types, function(type) {
        switch (type) {
            case 'svg':
                return srcs.push(getFontSrcURL({
                    baseURL: options.fontFaceBaseURL,
                    fontName: options.fontName,
                    extension: '.svg#' + options.fontName + '?v=' + new Date().getTime(),
                    format: 'svg'
                }));
            case 'ttf':
                return srcs.push(getFontSrcURL({
                    baseURL: options.fontFaceBaseURL,
                    fontName: options.fontName,
                    extension: '.ttf' + '?v=' + new Date().getTime(),
                    format: 'truetype'
                }));
            case 'eot':
                return srcs.push(getFontSrcURL({
                    baseURL: options.fontFaceBaseURL,
                    fontName: options.fontName,
                    extension: '.eot?#iefix' + '?v=' + new Date().getTime(),
                    format: 'embedded-opentype'
                }));
            case 'woff':
                return srcs.push(getFontSrcURL({
                    baseURL: options.fontFaceBaseURL,
                    fontName: options.fontName,
                    extension: '.woff' + '?v=' + new Date().getTime(),
                    format: 'woff'
                }));
        }
    });
    fontSrcs.push(srcs.join(', '));
    if (!options.stylesheets) {
        var stylesheets = {};
        options.stylesheetFilename = options.stylesheetFilename || (options.fontName + '.css');
        stylesheets[options.stylesheetFilename] = options.stylesheetTemplate;
    } else {
        stylesheets = options.stylesheets;
    }
    var results = [];
    for (fileName in stylesheets) {
        var filePath = stylesheets[fileName];
        var templatePath = path.join(process.cwd(), filePath);
        if (!fs.existsSync(templatePath)) {
            console.log('\n[iconfont] template file not found at ' + templatePath);
            continue;
        }
        var template = fs.readFileSync(templatePath, 'utf8');
        var data = _.template(template, {
            glyphCodepointMap: glyphCodepointMap,
            classPrefix: options.classPrefix,
            classNames: classNames.join(', '),
            fontName: options.fontName,
            fontFaceBaseURL: options.fontFaceBaseURL,
            types: options.types,
            fontSrcs: fontSrcs
        });
        var stylesheetDestPath = path.join(options.stylesheetsDestBasePath, fileName);
        fs.ensureFileSync(stylesheetDestPath);
        fs.writeFileSync(stylesheetDestPath, data);
        if (path.extname(stylesheetDestPath) === '.css') {
            results.push(compileStep.addStylesheet({
                path: stylesheetDestPath,
                data: data
            }));
        } else {
            results.push(void 0);
        }
    }
    return results;
};

var getFontSrcURL = function(options) {
    var parts = ['url("', options.baseURL, '/', options.fontName, options.extension, '")'];
    if (_.isString(options.format && options.format.length)) {
        parts = parts.concat([' format("', options.format, '")']);
    }
    return parts.join('');
};

var getFiles = function(srcPaths) {
    if (_.isString(srcPaths)) {
        srcPaths = [srcPaths];
    }
    var matches = _.map(srcPaths, function(srcPath) {
        srcPath = path.join(process.cwd(), srcPath);
        if (!fs.existsSync(srcPath)) {
            return false;
        }
        return fs.readdirSync(srcPath).map(function(file) {
            if (path.extname(file) === '.svg') {
                return path.join(srcPath, file);
            }
            return false;
        });
    });
    return _.uniq(_.compact(_.flatten(matches)));
};

var loadJSONFile = function(filePath) {
    var content = fs.readFileSync(filePath);
    try {
        return JSON.parse(content);
    } catch (_error) {
        console.log('Error: failed to parse ', filePath, ' as JSON');
        return {};
    }
};

Plugin.registerSourceHandler('iconfont.json', {
    archMatching: 'web'
}, handler);

Plugin.registerSourceHandler('svg', {
    archMatching: 'web'
}, handler);
