"use strict";
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
exports.resolveLibPathsFromLdConf = exports.readLines = exports.getArtifactPath = exports.checkCodeUri = exports.checkCommands = exports.isCopyCodeBuildRuntime = exports.getExcludeFilesEnv = exports.sleep = void 0;
var core_1 = require("@serverless-devs/core");
var constant_1 = require("./constant");
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var readline_1 = __importDefault(require("readline"));
var fs_extra_1 = __importDefault(require("fs-extra"));
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
    for (var _i = 0, SUPPORTRUNTIMEBUILDList_1 = constant_1.SUPPORTRUNTIMEBUILDList; _i < SUPPORTRUNTIMEBUILDList_1.length; _i++) {
        var supportRuntime = SUPPORTRUNTIMEBUILDList_1[_i];
        if (runtime.includes(supportRuntime)) {
            return true;
        }
    }
    return false;
}
exports.isCopyCodeBuildRuntime = isCopyCodeBuildRuntime;
function checkCommands(useDocker, runtime) {
    if (!runtime) {
        throw new Error('runtime required.');
    }
    if (!useDocker && runtime === 'custom-container') {
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
                        envs.LD_LIBRARY_PATH = libPaths.map(function (p) { return "/code/.s/root" + p; }).join(':');
                    }
                    return [2 /*return*/, envs];
            }
        });
    });
}
exports.resolveLibPathsFromLdConf = resolveLibPathsFromLdConf;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQStDO0FBQy9DLHVDQUE4RDtBQUM5RCxrREFBdUI7QUFDdkIsOENBQXdCO0FBQ3hCLHNEQUFnQztBQUNoQyxzREFBMEI7QUFJMUIsSUFBTSxjQUFjLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRTdELFNBQWdCLEtBQUssQ0FBQyxFQUFVO0lBQzlCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPO1FBQ3pCLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBSkQsc0JBSUM7QUFFRCxTQUFnQixrQkFBa0I7SUFDaEMsT0FBTztRQUNMLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztRQUN4QixjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUM7UUFDdEIsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDO1FBQ3RCLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztRQUN2QixPQUFPO0tBQ1IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDZCxDQUFDO0FBUkQsZ0RBUUM7QUFFRCxTQUFnQixzQkFBc0IsQ0FBQyxPQUFlO0lBQ3BELEtBQTZCLFVBQXVCLEVBQXZCLDRCQUFBLGtDQUF1QixFQUF2QixxQ0FBdUIsRUFBdkIsSUFBdUIsRUFBRTtRQUFqRCxJQUFNLGNBQWMsZ0NBQUE7UUFDdkIsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQ3BDLE9B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