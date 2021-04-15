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
var pkg = require('../../package.json');
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
                    if (!(opts && isMac)) return [3 /*break*/, 2];
                    if (!opts.HostConfig) return [3 /*break*/, 2];
                    return [4 /*yield*/, docker_support_1.default(opts.HostConfig.Mounts)];
                case 1:
                    pathsOutofSharedPaths = _a.sent();
                    if (isMac && pathsOutofSharedPaths.length > 0) {
                        errorMessage = "Please add directory '" + pathsOutofSharedPaths + "' to Docker File sharing list, more information please refer to https://github.com/alibaba/funcraft/blob/master/docs/usage/faq-zh.md";
                        throw new Error(errorMessage);
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, isDockerToolBoxAndEnsureDockerVersion()];
                case 3:
                    dockerToolBox = _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, docker.createContainer(opts)];
                case 5:
                    // see https://github.com/apocas/dockerode/pull/38
                    container = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    ex_1 = _a.sent();
                    if (ex_1.message.indexOf('invalid mount config for type') !== -1 && dockerToolBox) {
                        errorMessage = "The default host machine path for docker toolbox is under 'C:\\Users', Please make sure your project is in this directory. If you want to mount other disk paths, please refer to https://github.com/alibaba/funcraft/blob/master/docs/usage/faq-zh.md.";
                        throw new Error(errorMessage);
                    }
                    if (ex_1.message.indexOf('drive is not shared') !== -1 && isWin) {
                        errorMessage = ex_1.message + "More information please refer to https://docs.docker.com/docker-for-windows/#shared-drives";
                        throw new Error(errorMessage);
                    }
                    throw ex_1;
                case 7: return [2 /*return*/, container];
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
            cur = serverVersion.split('.');
            // 1.13.1
            if (Number.parseInt(cur[0]) === 1 && Number.parseInt(cur[1]) <= 13) {
                errorMessage = "We detected that your docker version is " + serverVersion + ", for a better experience, please upgrade the docker version.";
                throw new Error(errorMessage);
            }
            return [2 /*return*/];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBK0M7QUFDL0Msa0RBQXVCO0FBQ3ZCLHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFDeEIsd0RBQStCO0FBQy9CLHNEQUFnQztBQUNoQyxvREFBdUM7QUFDdkMsb0VBQXlEO0FBQ3pELGlDQUFzRjtBQUN0Riw2QkFBaUQ7QUFDakQsdUNBQXFDO0FBR3JDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZCLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO0FBQzVCLElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7QUFDM0MsSUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLElBQUkseUJBQXlCLENBQUM7QUFpQnhGLFNBQVMsb0JBQW9CLENBQUMsYUFBNkI7SUFDakQsSUFBQSxvQkFBb0IsR0FBSyxhQUFhLHFCQUFsQixDQUFtQjtJQUUvQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7UUFDekIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsU0FBZSxlQUFlLENBQUMsSUFBSTs7Ozs7O29CQUMzQixLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7b0JBQ3JDLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxLQUFLLFFB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