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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveLibPathsFromLdConf = exports.readLines = exports.getArtifactPath = exports.checkCodeUri = exports.checkCommands = exports.isCopyCodeBuildRuntime = exports.getExcludeFilesEnv = exports.sleep = exports.isDebug = void 0;
var core_1 = require("@serverless-devs/core");
var constant_1 = require("./constant");
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var readline_1 = __importDefault(require("readline"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var BUILDARTIFACTS = path_1.default.join('.s', 'build', 'artifacts');
exports.isDebug = (_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.temp_params) === null || _b === void 0 ? void 0 : _b.includes('--debug');
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
exports.sleep = sleep;
function getExcludeFilesEnv() {
    return [
        '.s',
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
        var errorMessage = "'" + runtime + "' needs to pass the 's build --use-docker' command.";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUErQztBQUMvQyx1Q0FBOEQ7QUFDOUQsa0RBQXVCO0FBQ3ZCLDhDQUF3QjtBQUN4QixzREFBZ0M7QUFDaEMsc0RBQTBCO0FBSTFCLElBQU0sY0FBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNoRCxRQUFBLE9BQU8sZUFBRyxPQUFPLENBQUMsR0FBRywwQ0FBRSxXQUFXLDBDQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUU7QUFFckUsU0FBZ0IsS0FBSyxDQUFDLEVBQVU7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87UUFDekIsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFKRCxzQkFJQztBQUVELFNBQWdCLGtCQUFrQjtJQUNoQyxPQUFPO1FBQ0wsSUFBSTtRQUNKLE9BQU87S0FDUixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNkLENBQUM7QUFMRCxnREFLQztBQUVELFNBQWdCLHNCQUFzQixDQUFDLE9BQWU7SUFDcEQsS0FBNkIsVUFBdUIsRUFBdkIsNEJBQUEsa0NBQXVCLEVBQXZCLHFDQUF1QixFQUF2QixJQUF1QixFQUFFO1FBQWpELElBQU0sY0FBYyxnQ0FBQTtRQUN2QixJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDcEMsT0FBTyxJQUFJLENBQUM7U0FDYjtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBUEQsd0RBT0M7QUFFRCxTQUFnQixhQUFhLENBQUMsU0FBa0IsRUFBRSxPQUFl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