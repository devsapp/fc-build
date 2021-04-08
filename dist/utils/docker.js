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
exports.pullImageIfNeed = exports.dockerRun = exports.resolvePasswdMount = exports.resolveCodeUriToMount = exports.generateDockerEnvs = exports.generateRamdomContainerName = void 0;
var core_1 = require("@serverless-devs/core");
var lodash_1 = __importDefault(require("lodash"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var dockerode_1 = __importDefault(require("dockerode"));
var draftlog_1 = __importDefault(require("draftlog"));
var passwd_1 = __importDefault(require("./passwd"));
var docker_support_1 = __importDefault(require("./docker-support"));
var utils_1 = require("./utils");
var env_1 = require("./env");
var constant_1 = require("./constant");
var pkg = require('../package.json');
draftlog_1.default.into(console);
var docker = new dockerode_1.default();
var containers = new Set();
var isWin = process.platform === 'win32';
var DEFAULT_REGISTRY = pkg['fc-docker'].registry_default || 'registry.hub.docker.com';
function generateFunctionEnvs(functionProps) {
    var environmentVariables = functionProps.environmentVariables;
    if (!environmentVariables) {
        return {};
    }
    return Object.assign({}, environmentVariables);
}
function createContainer(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var isWin, isMac, pathsOutofSharedPaths, errorMessage, dockerToolBox, container, ex_1, errorMessage, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isWin = process.platform === 'win32';
                    isMac = process.platform === 'darwin';
                    core_1.Logger.debug(constant_1.CONTEXT, "Operating platform: " + process.platform);
                    if (!(opts && isMac)) return [3 /*break*/, 3];
                    if (!opts.HostConfig) return [3 /*break*/, 3];
                    return [4 /*yield*/, docker_support_1.default(opts.HostConfig.Mounts)];
                case 1:
                    pathsOutofSharedPaths = _a.sent();
                    if (!(isMac && pathsOutofSharedPaths.length > 0)) return [3 /*break*/, 3];
                    errorMessage = "Please add directory '" + pathsOutofSharedPaths + "' to Docker File sharing list, more information please refer to https://github.com/alibaba/funcraft/blob/master/docs/usage/faq-zh.md";
                    return [4 /*yield*/, core_1.report(errorMessage, {
                            type: 'error',
                            context: constant_1.CONTEXT,
                        })];
                case 2:
                    _a.sent();
                    throw new Error(errorMessage);
                case 3: return [4 /*yield*/, isDockerToolBoxAndEnsureDockerVersion()];
                case 4:
                    dockerToolBox = _a.sent();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 13]);
                    return [4 /*yield*/, docker.createContainer(opts)];
                case 6:
                    // see https://github.com/apocas/dockerode/pull/38
                    container = _a.sent();
                    return [3 /*break*/, 13];
                case 7:
                    ex_1 = _a.sent();
                    if (!(ex_1.message.indexOf('invalid mount config for type') !== -1 && dockerToolBox)) return [3 /*break*/, 9];
                    errorMessage = "The default host machine path for docker toolbox is under 'C:\\Users', Please make sure your project is in this directory. If you want to mount other disk paths, please refer to https://github.com/alibaba/funcraft/blob/master/docs/usage/faq-zh.md.";
                    return [4 /*yield*/, core_1.report(errorMessage, {
                            type: 'error',
                            context: constant_1.CONTEXT,
                        })];
                case 8:
                    _a.sent();
                    throw new Error(errorMessage);
                case 9:
                    if (!(ex_1.message.indexOf('drive is not shared') !== -1 && isWin)) return [3 /*break*/, 11];
                    errorMessage = ex_1.message + "More information please refer to https://docs.docker.com/docker-for-windows/#shared-drives";
                    return [4 /*yield*/, core_1.report(errorMessage, {
                            type: 'error',
                            context: constant_1.CONTEXT,
                        })];
                case 10:
                    _a.sent();
                    throw new Error(errorMessage);
                case 11: return [4 /*yield*/, core_1.report(ex_1, {
                        type: 'error',
                        context: constant_1.CONTEXT,
                    })];
                case 12:
                    _a.sent();
                    throw ex_1;
                case 13: return [2 /*return*/, container];
            }
        });
    });
}
function isDockerToolBoxAndEnsureDockerVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var dockerInfo, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, docker.info()];
                case 1:
                    dockerInfo = _a.sent();
                    core_1.Logger.debug(constant_1.CONTEXT, "Docker info: " + JSON.stringify(dockerInfo));
                    return [4 /*yield*/, detectDockerVersion(dockerInfo.ServerVersion || '')];
                case 2:
                    _a.sent();
                    obj = (dockerInfo.Labels || [])
                        .map(function (e) { return lodash_1.default.split(e, '=', 2); })
                        .filter(function (e) { return e.length === 2; })
                        .reduce(function (acc, cur) {
                        acc[cur[0]] = cur[1];
                        return acc;
                    }, {});
                    return [2 /*return*/, process.platform === 'win32' && obj.provider === 'virtualbox'];
            }
        });
    });
}
function detectDockerVersion(serverVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var cur, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cur = serverVersion.split('.');
                    if (!(Number.parseInt(cur[0]) === 1 && Number.parseInt(cur[1]) <= 13)) return [3 /*break*/, 2];
                    errorMessage = "We detected that your docker version is " + serverVersion + ", for a better experience, please upgrade the docker version.";
                    return [4 /*yield*/, core_1.report(errorMessage, {
                            type: 'error',
                            context: constant_1.CONTEXT,
                        })];
                case 1:
                    _a.sent();
                    throw new Error(errorMessage);
                case 2: return [2 /*return*/];
            }
        });
    });
}
function imageExist(imageName) {
    return __awaiter(this, void 0, void 0, function () {
        var images;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, docker.listImages({
                        filters: {
                            reference: [imageName],
                        },
                    })];
                case 1:
                    images = _a.sent();
                    return [2 /*return*/, images.length > 0];
            }
        });
    });
}
function followProgress(stream, onFinished) {
    var barLines = {};
    var onProgress = function (event) {
        var status = event.status;
        if (event.progress) {
            status = event.status + " " + event.progress;
        }
        if (event.id) {
            var id = event.id;
            if (!barLines[id]) {
                // @ts-ignore: 引入 draftlog 注入的方法
                barLines[id] = console.draft();
            }
            barLines[id](id + ': ' + status);
        }
        else {
            if (lodash_1.default.has(event, 'aux.ID')) {
                event.stream = event.aux.ID + '\n';
            }
            // If there is no id, the line should be wrapped manually.
            var out = event.status ? event.status + '\n' : event.stream;
            process.stdout.write(out);
        }
    };
    docker.modem.followProgress(stream, onFinished, onProgress);
}
function pullImage(imageName) {
    return __awaiter(this, void 0, void 0, function () {
        var stream, registry;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, docker.pull(imageName)];
                case 1:
                    stream = _a.sent();
                    registry = DEFAULT_REGISTRY;
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            core_1.Logger.info(constant_1.CONTEXT, "begin pulling image " + imageName + ", you can also use docker pull " + imageName + " to pull image by yourself.");
                            var onFinished = function (err) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    containers.delete(stream);
                                    if (err) {
                                        reject(err);
                                        return [2 /*return*/];
                                    }
                                    resolve(registry);
                                    return [2 /*return*/];
                                });
                            }); };
                            containers.add(stream);
                            // pull image progress
                            followProgress(stream, onFinished);
                        })];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function generateRamdomContainerName() {
    return "s_local_" + new Date().getTime() + "_" + Math.random().toString(36).substr(2, 7);
}
exports.generateRamdomContainerName = generateRamdomContainerName;
function generateDockerEnvs(_a) {
    var region = _a.region, baseDir = _a.baseDir, credentials = _a.credentials, serviceName = _a.serviceName, serviceProps = _a.serviceProps, functionName = _a.functionName, functionProps = _a.functionProps, debugPort = _a.debugPort, httpParams = _a.httpParams, ishttpTrigger = _a.ishttpTrigger, debugIde = _a.debugIde, debugArgs = _a.debugArgs;
    return __awaiter(this, void 0, void 0, function () {
        var envs, runtime, codeUri, confEnv, debugEnv;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    envs = {};
                    if (httpParams) {
                        Object.assign(envs, { FC_HTTP_PARAMS: httpParams });
                    }
                    runtime = functionProps.runtime, codeUri = functionProps.codeUri;
                    return [4 /*yield*/, utils_1.resolveLibPathsFromLdConf(baseDir, utils_1.checkCodeUri(codeUri))];
                case 1:
                    confEnv = _b.sent();
                    Object.assign(envs, confEnv);
                    if (debugPort && !debugArgs) {
                        debugEnv = env_1.generateDebugEnv(runtime, debugPort, debugIde);
                        Object.assign(envs, debugEnv);
                    }
                    else if (debugArgs) {
                        Object.assign(envs, {
                            DEBUG_OPTIONS: debugArgs,
                        });
                    }
                    if (ishttpTrigger && runtime === 'java8') {
                        envs.fc_enable_new_java_ca = 'true';
                    }
                    Object.assign(envs, generateFunctionEnvs(functionProps));
                    Object.assign(envs, {
                        local: true,
                        BUILD_EXCLIUDE_FILES: utils_1.getExcludeFilesEnv(),
                        TOOL_CACHE_PATH: '.s',
                        FC_ACCESS_KEY_ID: credentials.AccessKeyID,
                        FC_ACCESS_KEY_SECRET: credentials.AccessKeySecret,
                        FC_ACCOUND_ID: credentials.AccountID,
                        FC_REGION: region,
                        FC_FUNCTION_NAME: functionName,
                        FC_HANDLER: functionProps.handler,
                        FC_MEMORY_SIZE: functionProps.memorySize || 128,
                        FC_TIMEOUT: functionProps.timeout || 3,
                        FC_INITIALIZER: functionProps.initializer,
                        FC_INITIALIZATIONIMEOUT: functionProps.initializationTimeout || 3,
                        FC_SERVICE_NAME: serviceName,
                        // @ts-ignore: 多类型，动态判断
                        FC_SERVICE_LOG_PROJECT: ((serviceProps || {}).logConfig || {}).project,
                        // @ts-ignore: 多类型，动态判断
                        FC_SERVICE_LOG_STORE: ((serviceProps || {}).logConfig || {}).logstore,
                    });
                    return [2 /*return*/, env_1.addEnv(envs)];
            }
        });
    });
}
exports.generateDockerEnvs = generateDockerEnvs;
// todo: 当前只支持目录以及 jar。 code uri 还可能是 oss 地址、目录、jar、zip?
function resolveCodeUriToMount(absCodeUri, readOnly) {
    if (readOnly === void 0) { readOnly = true; }
    return __awaiter(this, void 0, void 0, function () {
        var target, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    target = null;
                    return [4 /*yield*/, fs_extra_1.default.lstat(absCodeUri)];
                case 1:
                    stats = _a.sent();
                    if (stats.isDirectory()) {
                        target = '/code';
                    }
                    else {
                        // could not use path.join('/code', xxx)
                        // in windows, it will be translate to \code\xxx, and will not be recorgnized as a valid path in linux container
                        target = path_1.default.posix.join('/code', path_1.default.basename(absCodeUri));
                    }
                    // Mount the code directory as read only
                    return [2 /*return*/, {
                            Type: 'bind',
                            Source: absCodeUri,
                            Target: target,
                            ReadOnly: readOnly,
                        }];
            }
        });
    });
}
exports.resolveCodeUriToMount = resolveCodeUriToMount;
function resolvePasswdMount() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(process.platform === 'linux')) return [3 /*break*/, 2];
                    _a = {
                        Type: 'bind'
                    };
                    return [4 /*yield*/, passwd_1.default()];
                case 1: return [2 /*return*/, (_a.Source = _b.sent(),
                        _a.Target = '/etc/passwd',
                        _a.ReadOnly = true,
                        _a)];
                case 2: return [2 /*return*/, null];
            }
        });
    });
}
exports.resolvePasswdMount = resolvePasswdMount;
function dockerRun(opts) {
    return __awaiter(this, void 0, void 0, function () {
        var container, attachOpts, stream, logStream, exitRs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pullImageIfNeed(opts.Image)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, createContainer(opts)];
                case 2:
                    container = _a.sent();
                    attachOpts = {
                        hijack: true,
                        stream: true,
                        stdin: true,
                        stdout: true,
                        stderr: true,
                    };
                    return [4 /*yield*/, container.attach(attachOpts)];
                case 3:
                    stream = _a.sent();
                    if (!isWin) {
                        container.modem.demuxStream(stream, process.stdout, process.stderr);
                    }
                    return [4 /*yield*/, container.start()];
                case 4:
                    _a.sent();
                    if (!isWin) return [3 /*break*/, 6];
                    return [4 /*yield*/, container.logs({
                            stdout: true,
                            stderr: true,
                            follow: true,
                        })];
                case 5:
                    logStream = _a.sent();
                    container.modem.demuxStream(logStream, process.stdout, process.stderr);
                    _a.label = 6;
                case 6:
                    containers.add(container.id);
                    stream.end();
                    return [4 /*yield*/, container.wait()];
                case 7:
                    exitRs = _a.sent();
                    core_1.Logger.debug(constant_1.CONTEXT, "Container wait: " + JSON.stringify(exitRs) + " ");
                    containers.delete(container.id);
                    return [2 /*return*/, exitRs];
            }
        });
    });
}
exports.dockerRun = dockerRun;
function pullImageIfNeed(imageName) {
    return __awaiter(this, void 0, void 0, function () {
        var exist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core_1.Logger.debug(constant_1.CONTEXT, "Determine whether the docker image '" + imageName + "' exists.");
                    return [4 /*yield*/, imageExist(imageName)];
                case 1:
                    exist = _a.sent();
                    core_1.Logger.debug(constant_1.CONTEXT, "Iamge '" + imageName + "' " + (exist ? 'exists' : 'not exists') + ".");
                    if (!!exist) return [3 /*break*/, 3];
                    return [4 /*yield*/, pullImage(imageName)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    core_1.Logger.info(constant_1.CONTEXT, "skip pulling image " + imageName + "...");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.pullImageIfNeed = pullImageIfNeed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBdUQ7QUFDdkQsa0RBQXVCO0FBQ3ZCLHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFDeEIsd0RBQStCO0FBQy9CLHNEQUFnQztBQUNoQyxvREFBdUM7QUFDdkMsb0VBQXlEO0FBQ3pELGlDQUFzRjtBQUN0Riw2QkFBaUQ7QUFDakQsdUNBQXFDO0FBR3JDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZDLGtCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZCLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO0FBQzVCLElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7QUFDM0MsSUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLElBQUkseUJBQXlCLENBQUM7QUFpQnhGLFNBQVMsb0JBQW9CLENBQUMsYUFBNkI7SUFDakQsSUFBQSxvQkFBb0IsR0FBSyxhQUFhLHFCQUFsQixDQUFtQjtJQUUvQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7UUFDekIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsU0FBZSxlQUFlLENBQUMsSUFBSTs7Ozs7O29CQUMzQixLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7b0JBQ3JDLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLFFB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