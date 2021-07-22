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
exports.copyFromImage = exports.buildImage = exports.pullImageIfNeed = exports.dockerRun = exports.resolvePasswdMount = exports.resolveCodeUriToMount = exports.generateDockerEnvs = exports.generateRamdomContainerName = void 0;
var core_1 = require("@serverless-devs/core");
var lodash_1 = __importDefault(require("lodash"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var tar_fs_1 = __importDefault(require("tar-fs"));
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
function buildImage(dockerBuildDir, dockerfilePath, imageTag) {
    return new Promise(function (resolve, reject) {
        var tarStream = tar_fs_1.default.pack(dockerBuildDir);
        docker.buildImage(tarStream, {
            dockerfile: path_1.default.relative(dockerBuildDir, dockerfilePath),
            t: imageTag,
        }, function (error, stream) {
            containers.add(stream);
            if (error) {
                reject(error);
                return;
            }
            stream.on('error', function (e) {
                containers.delete(stream);
                reject(e);
            });
            stream.on('end', function () {
                containers.delete(stream);
                resolve(imageTag);
            });
            followProgress(stream, function (err, res) {
                err ? reject(err) : resolve(res);
            });
        });
    });
}
exports.buildImage = buildImage;
function zipTo(archive, to) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_extra_1.default.ensureDir(to)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            archive.pipe(tar_fs_1.default.extract(to)).on('error', reject).on('finish', resolve);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function copyFromImage(imageName, from, to) {
    return __awaiter(this, void 0, void 0, function () {
        var container, archive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, docker.createContainer({
                        Image: imageName,
                    })];
                case 1:
                    container = _a.sent();
                    return [4 /*yield*/, container.getArchive({
                            path: from,
                        })];
                case 2:
                    archive = _a.sent();
                    return [4 /*yield*/, zipTo(archive, to)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, container.remove()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.copyFromImage = copyFromImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2RvY2tlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBK0M7QUFDL0Msa0RBQXVCO0FBQ3ZCLHNEQUEwQjtBQUMxQixrREFBeUI7QUFDekIsOENBQXdCO0FBQ3hCLHdEQUErQjtBQUMvQixzREFBZ0M7QUFDaEMsb0RBQXVDO0FBQ3ZDLG9FQUF5RDtBQUN6RCxpQ0FBc0Y7QUFDdEYsNkJBQWlEO0FBQ2pELHVDQUFxQztBQUdyQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUUxQyxrQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUV2QixJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztBQUM1QixJQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDO0FBQzNDLElBQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLHlCQUF5QixDQUFDO0FBaUJ4RixTQUFTLG9CQUFvQixDQUFDLGFBQTZCO0lBQ2pELElBQUEsb0JBQW9CLEdBQUssYUFBYSxxQkFBbEIsQ0FBbUI7SUFFL0MsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1FBQ3pCLE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELFNBQWUsZUFBZSxDQUFDLElBQUk7Ozs7OztvQkFDM0IsS0FBSyxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDO29CQUU1QyxhQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFPLEVBQUUseUJBQXVCLE9BQU8sQ0FBQyxRQUFVLENBQUMsQ0FBQzt5QkFFN0QsQ0FBQSxJQUFJLElBQUksS0FBSyxDQUFBLEVBQWIsd0JBQWE7eUJBQ1gsSUFBSSxDQUFDLFVBQVUsRUFBZix3QkFBZTtvQkFDYSxxQkFBTSx3QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFBOztvQkFBL0UscUJBQXFCLEdBQUcsU0FBdUQ7b0JBQ3JGLElBQUksS0FBSyxJQUFJLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7d0JBQ3ZDLFlBQVksR0FBRywyQkFBeUIscUJBQXFCLHlJQUFzSSxDQUFDO3dCQUMxTSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUMvQjs7d0JBR2lCLHFCQUFNLHFDQUFxQyxFQUFFLEVBQUE7O29CQUE3RCxhQUFhLEdBQUcsU0FBNkM7Ozs7b0JBS3JELHFCQUFNLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUE7O29CQUQ5QyxrREFBa0Q7b0JBQ2xELFNBQVMsR0FBRyxTQUFrQyxDQUFDOzs7O29CQUUvQyxJQUFJLElBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLCtCQUErQixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksYUFBYSxFQUFFO3dCQUN6RSxZQUFZLEdBQ2hCLHlQQUF5UCxDQUFDO3dCQUM1UCxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUMvQjtvQkFDRCxJQUFJLElBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFO3dCQUN2RCxZQUFZLEdBQU0sSUFBRSxDQUFDLE9BQU8sK0ZBQTRGLENBQUM7d0JBQy9ILE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7cUJBQy9CO29CQUNELE1BQU0sSUFBRSxDQUFDO3dCQUVYLHNCQUFPLFNBQVMsRUFBQzs7OztDQUNsQjtBQUVELFNBQWUscUNBQXFDOzs7Ozt3QkFDL0IscUJBQU0sTUFBTSxDQUFDLElBQUksRUFBRSxFQUFBOztvQkFBaEMsVUFBVSxHQUFHLFNBQW1CO29CQUN0QyxhQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFPLEVBQUUsa0JBQWdCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFHLENBQUMsQ0FBQztvQkFFcEUscUJBQU0sbUJBQW1CLENBQUMsVUFBVSxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsRUFBQTs7b0JBQXpELFNBQXlELENBQUM7b0JBRXBELEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO3lCQUNsQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxnQkFBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDO3lCQUM5QixNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBZCxDQUFjLENBQUM7eUJBQzdCLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHO3dCQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLE9BQU8sR0FBRyxDQUFDO29CQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFFVCxzQkFBTyxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBQzs7OztDQUN0RTtBQUVELFNBQWUsbUJBQW1CLENBQUMsYUFBcUI7Ozs7WUFDaEQsR0FBRyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckMsU0FBUztZQUNULElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQzVELFlBQVksR0FBRyw2Q0FBMkMsYUFBYSxrRUFBK0QsQ0FBQztnQkFDN0ksTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUMvQjs7OztDQUNGO0FBRUQsU0FBZSxVQUFVLENBQUMsU0FBaUI7Ozs7O3dCQUMxQixxQkFBTSxNQUFNLENBQUMsVUFBVSxDQUFDO3dCQUNyQyxPQUFPLEVBQUU7NEJBQ1AsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO3lCQUN2QjtxQkFDRixDQUFDLEVBQUE7O29CQUpJLE1BQU0sR0FBRyxTQUliO29CQUVGLHNCQUFPLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFDOzs7O0NBQzFCO0FBRUQsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVU7SUFDeEMsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBRXBCLElBQU0sVUFBVSxHQUFHLFVBQUMsS0FBSztRQUNqQixJQUFBLE1BQU0sR0FBSyxLQUFLLE9BQVYsQ0FBVztRQUV2QixJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbEIsTUFBTSxHQUFNLEtBQUssQ0FBQyxNQUFNLFNBQUksS0FBSyxDQUFDLFFBQVUsQ0FBQztTQUM5QztRQUVELElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRTtZQUNKLElBQUEsRUFBRSxHQUFLLEtBQUssR0FBVixDQUFXO1lBRXJCLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2pCLGdDQUFnQztnQkFDaEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNoQztZQUNELFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBSSxFQUFFLFVBQU8sTUFBUSxDQUFDLENBQUM7U0FDcEM7YUFBTTtZQUNMLElBQUksZ0JBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFO2dCQUMxQixLQUFLLENBQUMsTUFBTSxHQUFNLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFLLENBQUM7YUFDckM7WUFDRCwwREFBMEQ7WUFDMUQsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUksS0FBSyxDQUFDLE1BQU0sT0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQyxDQUFDO0lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBRUQsU0FBZSxTQUFTLENBQUMsU0FBaUI7Ozs7Ozt3QkFDekIscUJBQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQTs7b0JBQXJDLE1BQU0sR0FBRyxTQUE0QjtvQkFFckMsUUFBUSxHQUFHLGdCQUFnQixDQUFDO29CQUUzQixxQkFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNOzRCQUN2QyxhQUFNLENBQUMsSUFBSSxDQUNULGtCQUFPLEVBQ1AseUJBQXVCLFNBQVMsdUNBQWtDLFNBQVMsZ0NBQTZCLENBQ3pHLENBQUM7NEJBRUYsSUFBTSxVQUFVLEdBQUcsVUFBTyxHQUFHOztvQ0FDM0IsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQ0FFMUIsSUFBSSxHQUFHLEVBQUU7d0NBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dDQUNaLHNCQUFPO3FDQUNSO29DQUNELE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O2lDQUNuQixDQUFDOzRCQUVGLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7NEJBQ3ZCLHNCQUFzQjs0QkFDdEIsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzt3QkFDckMsQ0FBQyxDQUFDLEVBQUE7d0JBbkJGLHNCQUFPLFNBbUJMLEVBQUM7Ozs7Q0FDSjtBQUVELFNBQWdCLDJCQUEyQjtJQUN6QyxPQUFPLGFBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFHLENBQUM7QUFDdEYsQ0FBQztBQUZELGtFQUVDO0FBRUQsU0FBc0Isa0JBQWtCLENBQUMsRUFhM0I7UUFaWixNQUFNLFlBQUEsRUFDTixPQUFPLGFBQUEsRUFDUCxXQUFXLGlCQUFBLEVBQ1gsV0FBVyxpQkFBQSxFQUNYLFlBQVksa0JBQUEsRUFDWixZQUFZLGtCQUFBLEVBQ1osYUFBYSxtQkFBQSxFQUNiLFNBQVMsZUFBQSxFQUNULFVBQVUsZ0JBQUEsRUFDVixhQUFhLG1CQUFBLEVBQ2IsUUFBUSxjQUFBLEVBQ1IsU0FBUyxlQUFBOzs7Ozs7b0JBRUgsSUFBSSxHQUFZLEVBQUUsQ0FBQztvQkFFekIsSUFBSSxVQUFVLEVBQUU7d0JBQ2QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztxQkFDckQ7b0JBRU8sT0FBTyxHQUFjLGFBQWEsUUFBM0IsRUFBRSxPQUFPLEdBQUssYUFBYSxRQUFsQixDQUFtQjtvQkFFM0IscUJBQU0saUNBQXlCLENBQUMsT0FBTyxFQUFFLG9CQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQTs7b0JBQXpFLE9BQU8sR0FBRyxTQUErRDtvQkFFL0UsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBRTdCLElBQUksU0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFO3dCQUNyQixRQUFRLEdBQUcsc0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFFaEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7cUJBQy9CO3lCQUFNLElBQUksU0FBUyxFQUFFO3dCQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTs0QkFDbEIsYUFBYSxFQUFFLFNBQVM7eUJBQ3pCLENBQUMsQ0FBQztxQkFDSjtvQkFFRCxJQUFJLGFBQWEsSUFBSSxPQUFPLEtBQUssT0FBTyxFQUFFO3dCQUN4QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDO3FCQUNyQztvQkFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUV6RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTt3QkFDbEIsS0FBSyxFQUFFLElBQUk7d0JBQ1gsb0JBQW9CLEVBQUUsMEJBQWtCLEVBQUU7d0JBQzFDLGVBQWUsRUFBRSxJQUFJO3dCQUNyQixnQkFBZ0IsRUFBRSxXQUFXLENBQUMsV0FBVzt3QkFDekMsb0JBQW9CLEVBQUUsV0FBVyxDQUFDLGVBQWU7d0JBQ2pELGFBQWEsRUFBRSxXQUFXLENBQUMsU0FBUzt3QkFDcEMsU0FBUyxFQUFFLE1BQU07d0JBQ2pCLGdCQUFnQixFQUFFLFlBQVk7d0JBQzlCLFVBQVUsRUFBRSxhQUFhLENBQUMsT0FBTzt3QkFDakMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxVQUFVLElBQUksR0FBRzt3QkFDL0MsVUFBVSxFQUFFLGFBQWEsQ0FBQyxPQUFPLElBQUksQ0FBQzt3QkFDdEMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxXQUFXO3dCQUN6Qyx1QkFBdUIsRUFBRSxhQUFhLENBQUMscUJBQXFCLElBQUksQ0FBQzt3QkFDakUsZUFBZSxFQUFFLFdBQVc7d0JBQzVCLHVCQUF1Qjt3QkFDdkIsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDLFlBQVksSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTzt3QkFDdEUsdUJBQXVCO3dCQUN2QixvQkFBb0IsRUFBRSxDQUFDLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRO3FCQUN0RSxDQUFDLENBQUM7b0JBRUgsc0JBQU8sWUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDOzs7O0NBQ3JCO0FBaEVELGdEQWdFQztBQVNELHdEQUF3RDtBQUN4RCxTQUFzQixxQkFBcUIsQ0FDekMsVUFBa0IsRUFDbEIsUUFBZTtJQUFmLHlCQUFBLEVBQUEsZUFBZTs7Ozs7O29CQUVYLE1BQU0sR0FBRyxJQUFJLENBQUM7b0JBRUoscUJBQU0sa0JBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUE7O29CQUFsQyxLQUFLLEdBQUcsU0FBMEI7b0JBRXhDLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUFFO3dCQUN2QixNQUFNLEdBQUcsT0FBTyxDQUFDO3FCQUNsQjt5QkFBTTt3QkFDTCx3Q0FBd0M7d0JBQ3hDLGdIQUFnSDt3QkFDaEgsTUFBTSxHQUFHLGNBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7cUJBQzlEO29CQUVELHdDQUF3QztvQkFDeEMsc0JBQU87NEJBQ0wsSUFBSSxFQUFFLE1BQU07NEJBQ1osTUFBTSxFQUFFLFVBQVU7NEJBQ2xCLE1BQU0sRUFBRSxNQUFNOzRCQUNkLFFBQVEsRUFBRSxRQUFRO3lCQUNuQixFQUFDOzs7O0NBQ0g7QUF2QkQsc0RBdUJDO0FBRUQsU0FBc0Isa0JBQWtCOzs7Ozs7eUJBQ2xDLENBQUEsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUEsRUFBNUIsd0JBQTRCOzt3QkFFNUIsSUFBSSxFQUFFLE1BQU07O29CQUNKLHFCQUFNLGdCQUFlLEVBQUUsRUFBQTt3QkFGakMsdUJBRUUsU0FBTSxHQUFFLFNBQXVCO3dCQUMvQixTQUFNLEdBQUUsYUFBYTt3QkFDckIsV0FBUSxHQUFFLElBQUk7NkJBQ2Q7d0JBR0osc0JBQU8sSUFBSSxFQUFDOzs7O0NBQ2I7QUFYRCxnREFXQztBQUVELFNBQXNCLFNBQVMsQ0FBQyxJQUFTOzs7Ozt3QkFDdkMscUJBQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBQTs7b0JBQWpDLFNBQWlDLENBQUM7b0JBRWhCLHFCQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBQTs7b0JBQXZDLFNBQVMsR0FBRyxTQUEyQjtvQkFFdkMsVUFBVSxHQUFHO3dCQUNqQixNQUFNLEVBQUUsSUFBSTt3QkFDWixNQUFNLEVBQUUsSUFBSTt3QkFDWixLQUFLLEVBQUUsSUFBSTt3QkFDWCxNQUFNLEVBQUUsSUFBSTt3QkFDWixNQUFNLEVBQUUsSUFBSTtxQkFDYixDQUFDO29CQUVhLHFCQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUE7O29CQUEzQyxNQUFNLEdBQUcsU0FBa0M7b0JBRWpELElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ1YsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNyRTtvQkFFRCxxQkFBTSxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUE7O29CQUF2QixTQUF1QixDQUFDO3lCQUdwQixLQUFLLEVBQUwsd0JBQUs7b0JBQ1cscUJBQU0sU0FBUyxDQUFDLElBQUksQ0FBQzs0QkFDckMsTUFBTSxFQUFFLElBQUk7NEJBQ1osTUFBTSxFQUFFLElBQUk7NEJBQ1osTUFBTSxFQUFFLElBQUk7eUJBQ2IsQ0FBQyxFQUFBOztvQkFKSSxTQUFTLEdBQUcsU0FJaEI7b0JBRUYsU0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7b0JBR3pFLFVBQVUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUU3QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBSUUscUJBQU0sU0FBUyxDQUFDLElBQUksRUFBRSxFQUFBOztvQkFBL0IsTUFBTSxHQUFHLFNBQXNCO29CQUVyQyxhQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFPLEVBQUUscUJBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQUcsQ0FBQyxDQUFDO29CQUVwRSxVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFaEMsc0JBQU8sTUFBTSxFQUFDOzs7O0NBQ2Y7QUE3Q0QsOEJBNkNDO0FBRUQsU0FBc0IsZUFBZSxDQUFDLFNBQWlCOzs7Ozs7b0JBQ3JELGFBQU0sQ0FBQyxLQUFLLENBQUMsa0JBQU8sRUFBRSx5Q0FBdUMsU0FBUyxjQUFXLENBQUMsQ0FBQztvQkFDckUscUJBQU0sVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFBOztvQkFBbkMsS0FBSyxHQUFHLFNBQTJCO29CQUN6QyxhQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFPLEVBQUUsWUFBVSxTQUFTLFdBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFlBQVksT0FBRyxDQUFDLENBQUM7eUJBRTlFLENBQUMsS0FBSyxFQUFOLHdCQUFNO29CQUNSLHFCQUFNLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBQTs7b0JBQTFCLFNBQTBCLENBQUM7OztvQkFFM0IsYUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBTyxFQUFFLHdCQUFzQixTQUFTLFFBQUssQ0FBQyxDQUFDOzs7Ozs7Q0FFOUQ7QUFWRCwwQ0FVQztBQUVELFNBQWdCLFVBQVUsQ0FBQyxjQUFzQixFQUFFLGNBQXNCLEVBQUUsUUFBZ0I7SUFFekYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLElBQU0sU0FBUyxHQUFHLGdCQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO1lBQzNCLFVBQVUsRUFBRSxjQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUM7WUFDekQsQ0FBQyxFQUFFLFFBQVE7U0FDWixFQUFFLFVBQUMsS0FBSyxFQUFFLE1BQU07WUFDZixVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXZCLElBQUksS0FBSyxFQUFFO2dCQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDZCxPQUFPO2FBQ1I7WUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUM7Z0JBQ25CLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUU7Z0JBQ2YsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBRUgsY0FBYyxDQUFDLE1BQU0sRUFBRSxVQUFDLEdBQUcsRUFBRSxHQUFHO2dCQUM5QixHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUE3QkQsZ0NBNkJDO0FBRUQsU0FBZSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUU7Ozs7d0JBRTlCLHFCQUFNLGtCQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxFQUFBOztvQkFBdEIsU0FBc0IsQ0FBQztvQkFFdkIscUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTs0QkFDaEMsT0FBTyxDQUFDLElBQUksQ0FBQyxnQkFBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFDMUUsQ0FBQyxDQUFDLEVBQUE7O29CQUZGLFNBRUUsQ0FBQzs7Ozs7Q0FDSjtBQUVELFNBQXNCLGFBQWEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUU7Ozs7O3dCQUNuQyxxQkFBTSxNQUFNLENBQUMsZUFBZSxDQUFDO3dCQUM3QyxLQUFLLEVBQUUsU0FBUztxQkFDakIsQ0FBQyxFQUFBOztvQkFGSSxTQUFTLEdBQUcsU0FFaEI7b0JBRWMscUJBQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQzs0QkFDekMsSUFBSSxFQUFFLElBQUk7eUJBQ1gsQ0FBQyxFQUFBOztvQkFGSSxPQUFPLEdBQUcsU0FFZDtvQkFFRixxQkFBTSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFBOztvQkFBeEIsU0FBd0IsQ0FBQztvQkFFekIscUJBQU0sU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFBOztvQkFBeEIsU0FBd0IsQ0FBQzs7Ozs7Q0FDMUI7QUFaRCxzQ0FZQyJ9