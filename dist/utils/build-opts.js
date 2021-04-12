"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var core_1 = require("@serverless-devs/core");
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var nested_object_assign_1 = __importDefault(require("nested-object-assign"));
var docker = __importStar(require("./docker"));
var env_1 = require("./env");
var constant_1 = require("./constant");
var pkg = require('../../package.json');
var FC_DOCKER_VERSION = process.env.FC_DOCKER_VERSION;
var IMAGE_VERSION = FC_DOCKER_VERSION || pkg['fc-docker'].version || '1.9.2';
var DEFAULT_REGISTRY = pkg['fc-docker'].registry_default || 'registry.hub.docker.com';
var runtimeImageMap = {
    nodejs6: 'nodejs6',
    nodejs8: 'nodejs8',
    nodejs10: 'nodejs10',
    nodejs12: 'nodejs12',
    'python2.7': 'python2.7',
    python3: 'python3.6',
    java8: 'java8',
    'php7.2': 'php7.2',
    'dotnetcore2.1': 'dotnetcore2.1',
    custom: 'custom',
};
function generateBuildContainerBuildOpts(_a) {
    var credentials = _a.credentials, region = _a.region, serviceName = _a.serviceName, serviceProps = _a.serviceProps, functionName = _a.functionName, functionProps = _a.functionProps, baseDir = _a.baseDir, codeUri = _a.codeUri, funcArtifactDir = _a.funcArtifactDir, verbose = _a.verbose, stages = _a.stages;
    return __awaiter(this, void 0, void 0, function () {
        var runtime, containerName, envs, codeMount, passwdMount, funcArtifactMountDir, artifactDirMount, mounts, params, cmd, opts;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    runtime = functionProps.runtime;
                    containerName = docker.generateRamdomContainerName();
                    return [4 /*yield*/, docker.generateDockerEnvs({
                            region: region,
                            baseDir: baseDir,
                            serviceName: serviceName,
                            serviceProps: serviceProps,
                            functionName: functionName,
                            credentials: credentials,
                            functionProps: functionProps,
                        })];
                case 1:
                    envs = _b.sent();
                    return [4 /*yield*/, docker.resolveCodeUriToMount(path_1.default.resolve(baseDir, codeUri), false)];
                case 2:
                    codeMount = _b.sent();
                    return [4 /*yield*/, docker.resolvePasswdMount()];
                case 3:
                    passwdMount = _b.sent();
                    funcArtifactMountDir = '/artifactsMount';
                    artifactDirMount = {
                        Type: 'bind',
                        Source: funcArtifactDir,
                        Target: funcArtifactMountDir,
                        ReadOnly: false,
                    };
                    mounts = lodash_1.default.compact([codeMount, artifactDirMount, passwdMount]);
                    params = {
                        method: 'build',
                        serviceName: serviceName,
                        functionName: functionName,
                        sourceDir: '/code',
                        runtime: runtime,
                        artifactDir: codeUri === funcArtifactDir ? '/code' : funcArtifactMountDir,
                        stages: stages,
                        verbose: verbose,
                    };
                    cmd = ['fun-install', 'build', '--json-params', JSON.stringify(params)];
                    return [4 /*yield*/, generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs)];
                case 4:
                    opts = _b.sent();
                    return [2 /*return*/, opts];
            }
        });
    });
}
exports.default = generateBuildContainerBuildOpts;
function generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs) {
    return __awaiter(this, void 0, void 0, function () {
        var hostOpts, ioOpts, imageName, opts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hostOpts = {
                        HostConfig: {
                            AutoRemove: true,
                            Mounts: mounts,
                        },
                    };
                    ioOpts = {
                        OpenStdin: true,
                        Tty: false,
                        StdinOnce: true,
                        AttachStdin: true,
                        AttachStdout: true,
                        AttachStderr: true,
                    };
                    return [4 /*yield*/, resolveRuntimeToDockerImage(runtime)];
                case 1:
                    imageName = _a.sent();
                    opts = nested_object_assign_1.default({
                        Env: resolveDockerEnv(envs),
                        Image: imageName,
                        name: containerName,
                        Cmd: cmd,
                        User: resolveDockerUser(),
                    }, ioOpts, hostOpts);
                    return [2 /*return*/, opts];
            }
        });
    });
}
function resolveDockerUser() {
    var userId = 0;
    var groupId = 0;
    if (process.platform === 'linux') {
        userId = process.getuid();
        groupId = process.getgid();
    }
    return userId + ":" + groupId;
}
function resolveRuntimeToDockerImage(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var name_1, imageName, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (runtimeImageMap[runtime]) {
                        name_1 = runtimeImageMap[runtime];
                        imageName = DEFAULT_REGISTRY + "/aliyunfc/runtime-" + name_1 + ":build-" + IMAGE_VERSION;
                        return [2 /*return*/, imageName];
                    }
                    errorMessage = "resolveRuntimeToDockerImage: invalid runtime name " + runtime + ". Supported list: " + Object.keys(runtimeImageMap);
                    return [4 /*yield*/, core_1.report(errorMessage, {
                            type: 'error',
                            context: constant_1.CONTEXT,
                        })];
                case 1:
                    _a.sent();
                    throw new Error(errorMessage);
            }
        });
    });
}
function resolveDockerEnv(envs) {
    if (envs === void 0) { envs = {}; }
    return lodash_1.default.map(env_1.addEnv(envs || {}), function (v, k) { return k + "=" + v; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9idWlsZC1vcHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhDQUErQztBQUMvQyxrREFBdUI7QUFDdkIsOENBQXdCO0FBQ3hCLDhFQUFzRDtBQUN0RCwrQ0FBbUM7QUFDbkMsNkJBQStCO0FBQy9CLHVDQUFxQztBQUdyQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNsQyxJQUFBLGlCQUFpQixHQUFLLE9BQU8sQ0FBQyxHQUFHLGtCQUFoQixDQUFpQjtBQUUxQyxJQUFNLGFBQWEsR0FBRyxpQkFBaUIsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztBQUMvRSxJQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSx5QkFBeUIsQ0FBQztBQUN4RixJQUFNLGVBQWUsR0FBRztJQUN0QixPQUFPLEVBQUUsU0FBUztJQUNsQixPQUFPLEVBQUUsU0FBUztJQUNsQixRQUFRLEVBQUUsVUFBVTtJQUNwQixRQUFRLEVBQUUsVUFBVTtJQUNwQixXQUFXLEVBQUUsV0FBVztJQUN4QixPQUFPLEVBQUUsV0FBVztJQUNwQixLQUFLLEVBQUUsT0FBTztJQUNkLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLGVBQWUsRUFBRSxlQUFlO0lBQ2hDLE1BQU0sRUFBRSxRQUFRO0NBQ2pCLENBQUM7QUFnQkYsU0FBOEIsK0JBQStCLENBQUMsRUFZakQ7UUFYWCxXQUFXLGlCQUFBLEVBQ1gsTUFBTSxZQUFBLEVBQ04sV0FBVyxpQkFBQSxFQUNYLFlBQVksa0JBQUEsRUFDWixZQUFZLGtCQUFBLEVBQ1osYUFBYSxtQkFBQSxFQUNiLE9BQU8sYUFBQSxF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