"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveBuildYaml = exports.resolveLibPathsFromLdConf = exports.readLines = exports.getArtifactPath = exports.checkCodeUri = exports.checkCommands = exports.isCopyCodeBuildRuntime = exports.getExcludeFilesEnv = exports.sleep = void 0;
var core_1 = require("@serverless-devs/core");
var constant_1 = require("./constant");
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var readline_1 = __importDefault(require("readline"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var constant_2 = require("./constant");
var BUILDARTIFACTS = path_1.default.join('.s', 'build', 'artifacts');
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function getExcludeFilesEnv() {
    return [
        path_1.default.join('.s', 'build'),
        path_1.default.join('.s', 'nas'),
        path_1.default.join('.s', 'tmp'),
        path_1.default.join('.s', 'logs'),
        's.yml',
    ].join(';');
}
exports.getExcludeFilesEnv = getExcludeFilesEnv;
function isCopyCodeBuildRuntime(runtime) {
    for (var _i = 0, SUPPORTRUNTIMEBUILDList_1 = constant_2.SUPPORTRUNTIMEBUILDList; _i < SUPPORTRUNTIMEBUILDList_1.length; _i++) {
        var supportRuntime = SUPPORTRUNTIMEBUILDList_1[_i];
        if (runtime.includes(supportRuntime)) {
            return true;
        }
    }
    return false;
}
exports.isCopyCodeBuildRuntime = isCopyCodeBuildRuntime;
function checkCommands(commands, runtime) {
    if (lodash_1.default.isEmpty(commands)) {
        throw new Error("Input error, use 's build --help' for info.");
    }
    var buildCommand = commands[0];
    if (!lodash_1.default.includes(constant_2.BUILDCOMMANDList, buildCommand)) {
        var errorMessage = "Install command error, unknown subcommand '" + buildCommand + "', use 's build --help' for info.";
        throw new Error(errorMessage);
    }
    if (!runtime) {
        throw new Error('runtime required.');
    }
    var notIsUseDocker = buildCommand !== 'docker';
    if (notIsUseDocker && runtime === 'custom-container') {
        var errorMessage = "'" + runtime + "' needs to pass the 's build docker' command.";
        throw new Error(errorMessage);
    }
}
exports.checkCommands = checkCommands;
function checkCodeUri(codeUri) {
    if (!codeUri) {
        return '';
    }
    var src = lodash_1.default.isString(codeUri) ? codeUri : codeUri.src;
    if (!src) {
        core_1.Logger.info(constant_1.CONTEXT, 'No Src configured, skip building.');
        return '';
    }
    if (lodash_1.default.endsWith(src, '.zip') || lodash_1.default.endsWith(src, '.jar') || lodash_1.default.endsWith(src, '.war')) {
        core_1.Logger.info(constant_1.CONTEXT, 'Artifact configured, skip building.');
        return '';
    }
    return src;
}
exports.checkCodeUri = checkCodeUri;
function getArtifactPath(_a) {
    var baseDir = _a.baseDir, serviceName = _a.serviceName, functionName = _a.functionName;
    var rootArtifact = path_1.default.join(baseDir, BUILDARTIFACTS);
    return path_1.default.join(rootArtifact, serviceName, functionName);
}
exports.getArtifactPath = getArtifactPath;
function readLines(fileName) {
    return new Promise(function (resolve, reject) {
        var lines = [];
        readline_1.default
            .createInterface({ input: fs_extra_1.default.createReadStream(fileName) })
            .on('line', function (line) { return lines.push(line); })
            .on('close', function () { return resolve(lines); })
            .on('error', reject);
    });
}
exports.readLines = readLines;
function resolveLibPaths(confdPath) {
    return __awaiter(this, void 0, void 0, function () {
        var confLines;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs_extra_1.default.existsSync(confdPath)) {
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, Promise.all(fs_extra_1.default
                            .readdirSync(confdPath, 'utf-8')
                            .filter(function (f) { return f.endsWith('.conf'); })
                            .map(function (f) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, readLines(path_1.default.join(confdPath, f))];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 1:
                    confLines = _a.sent();
                    return [2 /*return*/, lodash_1.default.flatten(confLines).reduce(function (lines, line) {
                            // remove the first and last blanks and leave only the middle
                            var found = line.match(/^\s*(\/.*)\s*$/);
                            if (found && found[1].startsWith('/')) {
                                lines.push(found[1]);
                            }
                            return lines;
                        }, [])];
            }
        });
    });
}
function resolveLibPathsFromLdConf(baseDir, codeUri) {
    return __awaiter(this, void 0, void 0, function () {
        var envs, confdPath, stats, libPaths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    envs = {};
                    confdPath = path_1.default.resolve(baseDir, codeUri, '.s/root/etc/ld.so.conf.d');
                    return [4 /*yield*/, fs_extra_1.default.pathExists(confdPath)];
                case 1:
                    if (!(_a.sent())) {
                        return [2 /*return*/, envs];
                    }
                    return [4 /*yield*/, fs_extra_1.default.lstat(confdPath)];
                case 2:
                    stats = _a.sent();
                    if (stats.isFile()) {
                        return [2 /*return*/, envs];
                    }
                    return [4 /*yield*/, resolveLibPaths(confdPath)];
                case 3:
                    libPaths = _a.sent();
                    if (!lodash_1.default.isEmpty(libPaths)) {
                        envs.LD_LIBRARY_PATH = libPaths.map(function (path) { return "/code/.s/root" + path; }).join(':');
                    }
                    return [2 /*return*/, envs];
            }
        });
    });
}
exports.resolveLibPathsFromLdConf = resolveLibPathsFromLdConf;
function saveBuildYaml(_a) {
    var region = _a.region, serviceProps = _a.serviceProps, functionProps = _a.functionProps, project = _a.project;
    return __awaiter(this, void 0, void 0, function () {
        var baseDir, rootArtifactsDir, projectName, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    baseDir = process.cwd();
                    rootArtifactsDir = path_1.default.join(baseDir, BUILDARTIFACTS);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    functionProps.codeUri = path_1.default.join(serviceProps.name, functionProps.name);
                    projectName = project.ProjectName;
                    delete project.ProjectName;
                    if (project.AccessAlias) {
                        project.Access = project.AccessAlias;
                        delete project.AccessAlias;
                    }
                    return [4 /*yield*/, fs_extra_1.default.writeFile(path_1.default.join(rootArtifactsDir, projectName + ".build.yml"), js_yaml_1.default.dump((_b = {},
                            _b[projectName] = __assign(__assign({}, project), { Properties: {
                                    region: region,
                                    service: serviceProps,
                                    function: functionProps,
                                } }),
                            _b)))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _c.sent();
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.saveBuildYaml = saveBuildYaml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBK0M7QUFDL0MsdUNBQXFDO0FBQ3JDLGtEQUF1QjtBQUN2Qiw4Q0FBd0I7QUFDeEIsc0RBQWdDO0FBQ2hDLG9EQUEyQjtBQUMzQixzREFBMEI7QUFDMUIsdUNBQXVFO0FBR3ZFLElBQU0sY0FBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUU3RCxTQUFnQixLQUFLLENBQUMsRUFBVTtJQUM5QixPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTztRQUN6QixVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUpELHNCQUlDO0FBRUQsU0FBZ0Isa0JBQWtCO0lBQ2hDLE9BQU87UUFDTCxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUM7UUFDeEIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQ3RCLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQztRQUN0QixjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7UUFDdkIsT0FBTztLQUNSLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsQ0FBQztBQVJELGdEQVFDO0FBRUQsU0FBZ0Isc0JBQXNCLENBQUMsT0FBZTtJQUNwRCxLQUE2QixVQUF1QixFQUF2Qiw0QkFBQSxrQ0FBdUIsRUFBdkIscUNBQXVCLEVBQXZCLElBQXVCLEVBQUU7UUFBakQsSUFBTSxjQUFjLGdDQUFBO1FBQ3ZCLElBQUksT0FBTyxD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