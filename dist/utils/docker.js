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
        var isMac, pathsOutofSharedPaths, errorMessage, dockerToolBox, container, ex_1, errorMessage, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
            barLines[id](id + ": " + status);
        }
        else {
            if (lodash_1.default.has(event, 'aux.ID')) {
                event.stream = event.aux.ID + "\n";
            }
            // If there is no id, the line should be wrapped manually.
            var out = event.status ? event.status + "\n" : event.stream;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBK0M7QUFDL0Msa0RBQXVCO0FBQ3ZCLHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFDeEIsd0RBQStCO0FBQy9CLHNEQUFnQztBQUNoQyxvREFBdUM7QUFDdkMsb0VBQXlEO0FBQ3pELGlDQUFzRjtBQUN0Riw2QkFBaUQ7QUFDakQsdUNBQXFDO0FBR3JDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBRTFDLGtCQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZCLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQU0sRUFBRSxDQUFDO0FBQzVCLElBQU0sVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDN0IsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUM7QUFDM0MsSUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLElBQUkseUJBQXlCLENBQUM7QUFpQnhGLFNBQVMsb0JBQW9CLENBQUMsYUFBNkI7SUFDakQsSUFBQSxvQkFBb0IsR0FBSyxhQUFhLHFCQUFsQixDQUFtQjtJQUUvQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7UUFDekIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRUQsU0FBZSxlQUFlLENBQUMsSUFBSTs7Ozs7O29CQUMzQixLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUM7b0JBRTVDLGFBQU0sQ0FBQyxLQUFLLENBQUMsa0JBQU8sRUFBRSx5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