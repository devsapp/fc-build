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
exports.generateBuildContainerBuildOpts = void 0;
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var nested_object_assign_1 = __importDefault(require("nested-object-assign"));
var docker = __importStar(require("./docker"));
var get_image_name_1 = require("./get-image-name");
var install_file_1 = require("./install-file");
var env_1 = require("./env");
function generateBuildContainerBuildOpts(_a) {
    var credentials = _a.credentials, region = _a.region, serviceName = _a.serviceName, serviceProps = _a.serviceProps, functionName = _a.functionName, functionProps = _a.functionProps, baseDir = _a.baseDir, codeUri = _a.codeUri, funcArtifactDir = _a.funcArtifactDir, verbose = _a.verbose, stages = _a.stages;
    return __awaiter(this, void 0, void 0, function () {
        var runtime, containerName, envs, codeMount, passwdMount, funcArtifactMountDir, artifactDirMount, mounts, params, cmd, imageName, filePath, opts;
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
                    return [4 /*yield*/, install_file_1.getFunfile(codeUri)];
                case 4:
                    filePath = _b.sent();
                    if (!filePath) return [3 /*break*/, 6];
                    return [4 /*yield*/, install_file_1.processFunfile(serviceName, codeUri, filePath, funcArtifactDir, runtime, functionName)];
                case 5:
                    imageName = _b.sent();
                    _b.label = 6;
                case 6: return [4 /*yield*/, generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs, imageName)];
                case 7:
                    opts = _b.sent();
                    return [2 /*return*/, opts];
            }
        });
    });
}
exports.generateBuildContainerBuildOpts = generateBuildContainerBuildOpts;
function generateContainerBuildOpts(runtime, containerName, mounts, cmd, envs, imageName) {
    return __awaiter(this, void 0, void 0, function () {
        var hostOpts, ioOpts, opts, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
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
                    _a = nested_object_assign_1.default;
                    _b = {
                        Env: resolveDockerEnv(envs)
                    };
                    _c = imageName;
                    if (_c) return [3 /*break*/, 2];
                    return [4 /*yield*/, get_image_name_1.resolveRuntimeToDockerImage(runtime)];
                case 1:
                    _c = (_d.sent());
                    _d.label = 2;
                case 2:
                    opts = _a.apply(void 0, [(_b.Image = _c,
                            _b.name = containerName,
                            _b.Cmd = cmd,
                            _b.User = resolveDockerUser(),
                            _b), ioOpts,
                        hostOpts]);
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
function resolveDockerEnv(envs) {
    if (envs === void 0) { envs = {}; }
    return lodash_1.default.map(env_1.addEnv(envs || {}), function (v, k) { return k + "=" + v; });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtb3B0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9idWlsZC1vcHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBdUI7QUFDdkIsOENBQXdCO0FBQ3hCLDhFQUFzRDtBQUN0RCwrQ0FBbUM7QUFFbkMsbURBQStEO0FBQy9ELCtDQUE0RDtBQUM1RCw2QkFBK0I7QUFnQi9CLFNBQXNCLCtCQUErQixDQUFDLEVBWXpDO1FBWFgsV0FBVyxpQkFBQSxFQUNYLE1BQU0sWUFBQSxFQUNOLFdBQVcsaUJBQUEsRUFDWCxZQUFZLGtCQUFBLEVBQ1osWUFBWSxrQkFBQSxFQUNaLGFBQWEsbUJBQUEsRUFDYixPQUFPLGFBQUEsRUFDUCxPQUFPLGFBQUEsRUFDUCxlQUFlLHFCQUFBLEVBQ2YsT0FBTyxhQUFBLEVBQ1AsTUFBTSxZQUFBOzs7Ozs7b0JBRUUsT0FBTyxHQUFLLGFBQWEsUUFBbEIsQ0FBbUI7b0JBRTVCLGFBQWEsR0FBRyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztvQkFFOUMscUJBQU0sTUFBTSxDQUFDLGtCQUFrQixDQUFDOzRCQUMzQyxNQUFNLFFBQUE7NEJBQ04sT0FBTyxTQUFBOzRCQUNQLFdBQVcsYUFBQTs0QkFDWCxZQUFZLGNBQUE7NEJBQ1osWUFBWSxjQUFBOzRCQUNaLFdBQVcsYUFBQTs0QkFDWCxhQUFhLGVBQUE7eUJBQ2QsQ0FBQyxFQUFBOztvQkFSSSxJQUFJLEdBQUcsU0FRWDtvQkFFZ0IscUJBQU0sTUFBTSxDQUFDLHFCQUFxQixDQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFBOztvQkFBckYsU0FBUyxHQUFHLFNBQXlFO29CQUV2RSxxQkFBTSxNQUFNLENBQUMsa0JBQWtCLEVBQUUsRUFBQTs7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