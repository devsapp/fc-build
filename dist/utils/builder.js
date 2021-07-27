"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var lodash_1 = __importDefault(require("lodash"));
var fc_builders_1 = __importDefault(require("@alicloud/fc-builders"));
var child_process_1 = require("child_process");
var utils_1 = require("./utils");
var build_opts_1 = require("./build-opts");
var docker_1 = require("./docker");
var constant_1 = require("./constant");
var install_file_1 = require("./install-file");
var Builder = /** @class */ (function () {
    function Builder(projectName, useDocker, dockerfile, configPath) {
        this.projectName = projectName;
        this.useDocker = useDocker;
        this.dockerfile = dockerfile;
        this.configDirPath = configPath ? path_1.default.dirname(configPath) : process.cwd();
    }
    Builder.prototype.buildImage = function (buildInput) {
        return __awaiter(this, void 0, void 0, function () {
            var customContainerConfig, errorMessage, dockerFileName, errorMessage, imageName, errorMessage;
            return __generator(this, function (_a) {
                customContainerConfig = buildInput.functionProps.customContainerConfig;
                if (!customContainerConfig) {
                    errorMessage = "No 'CustomContainer' configuration found in Function.";
                    throw new Error(errorMessage);
                }
                dockerFileName = this.dockerfile || 'Dockerfile';
                if (!fs_extra_1.default.existsSync(dockerFileName)) {
                    errorMessage = 'No dockerfile found.';
                    throw new Error(errorMessage);
                }
                imageName = customContainerConfig.image;
                if (!imageName) {
                    errorMessage = 'Function/CustomContainer/Image required.';
                    throw new Error(errorMessage);
                }
                this.logger.info('Building image...');
                child_process_1.execSync("docker build -t " + imageName + " -f " + dockerFileName + " .", {
                    stdio: 'inherit',
                });
                this.logger.log("Build image(" + imageName + ") successfully");
                return [2 /*return*/, imageName];
            });
        });
    };
    Builder.prototype.build = function (buildInput) {
        return __awaiter(this, void 0, void 0, function () {
            var useDocker, functionProps, codeUri, runtime, baseDir, image, src, funfilePath, codeSkipBuild, _a, buildSaveUri;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        useDocker = this.useDocker;
                        if (useDocker) {
                            this.logger.info('Use docker for building.');
                        }
                        functionProps = buildInput.functionProps;
                        codeUri = functionProps.codeUri, runtime = functionProps.runtime;
                        baseDir = this.configDirPath;
                        this.logger.debug("[" + this.projectName + "] Runtime is " + runtime + ".");
                        if (!(useDocker && runtime === 'custom-container')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.buildImage(buildInput)];
                    case 1:
                        image = _b.sent();
                        return [2 /*return*/, { image: image }];
                    case 2:
                        src = utils_1.checkCodeUri(codeUri);
                        return [4 /*yield*/, install_file_1.getFunfile(src)];
                    case 3:
                        funfilePath = _b.sent();
                        _a = funfilePath;
                        if (_a) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.codeSkipBuild({ baseDir: baseDir, codeUri: codeUri, runtime: runtime })];
                    case 4:
                        _a = (_b.sent());
                        _b.label = 5;
                    case 5:
                        codeSkipBuild = _a;
                        this.logger.debug("[" + this.projectName + "] Code skip build: " + codeSkipBuild + ".");
                        if (!codeSkipBuild) {
                            return [2 /*return*/, {}];
                        }
                        if (!(useDocker || funfilePath)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.buildInDocker(buildInput, src)];
                    case 6:
                        buildSaveUri = _b.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.buildArtifact(buildInput, src)];
                    case 8:
                        buildSaveUri = _b.sent();
                        _b.label = 9;
                    case 9: return [2 /*return*/, { buildSaveUri: buildSaveUri }];
                }
            });
        });
    };
    Builder.prototype.buildInDocker = function (_a, src) {
        var region = _a.region, serviceName = _a.serviceName, serviceProps = _a.serviceProps, functionName = _a.functionName, functionProps = _a.functionProps, _b = _a.verbose, verbose = _b === void 0 ? true : _b, credentials = _a.credentials;
        return __awaiter(this, void 0, void 0, function () {
            var stages, baseDir, codeUri, funcArtifactDir, opts, usedImage, exitRs, errorMessage;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        stages = ['install', 'build'];
                        baseDir = this.configDirPath;
                        codeUri = path_1.default.join(baseDir, src);
                        funcArtifactDir = this.initBuildArtifactDir({ baseDir: baseDir, serviceName: serviceName, functionName: functionName });
                        return [4 /*yield*/, build_opts_1.generateBuildContainerBuildOpts({
                                region: region,
                                serviceName: serviceName,
                                serviceProps: serviceProps,
                                functionName: functionName,
                                functionProps: functionProps,
                                baseDir: baseDir,
                                codeUri: codeUri,
                                funcArtifactDir: funcArtifactDir,
                                verbose: verbose,
                                credentials: credentials,
                                stages: stages,
                            })];
                    case 1:
                        opts = _c.sent();
                        this.logger.debug("[" + this.projectName + "] Generate Build Container Build Opts: " + JSON.stringify(opts));
                        usedImage = opts.Image;
                        this.logger.info("Build function using image: " + usedImage);
                        return [4 /*yield*/, docker_1.dockerRun(opts)];
                    case 2:
                        exitRs = _c.sent();
                        if (exitRs.StatusCode !== 0) {
                            errorMessage = "build function " + serviceName + "/" + functionName + " error.";
                            throw new Error(errorMessage);
                        }
                        return [2 /*return*/, funcArtifactDir];
                }
            });
        });
    };
    Builder.prototype.buildArtifact = function (_a, src) {
        var serviceName = _a.serviceName, functionName = _a.functionName, functionProps = _a.functionProps, _b = _a.verbose, verbose = _b === void 0 ? true : _b;
        return __awaiter(this, void 0, void 0, function () {
            var baseDir, runtime, stages, codePath, artifactPath, fcfilePath, builder;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        process.env.BUILD_EXCLIUDE_FILES = utils_1.getExcludeFilesEnv();
                        process.env.TOOL_CACHE_PATH = '.s';
                        baseDir = this.configDirPath;
                        runtime = functionProps.runtime;
                        stages = ['install', 'build'];
                        codePath = path_1.default.join(baseDir, src);
                        artifactPath = this.initBuildArtifactDir({ baseDir: baseDir, serviceName: serviceName, functionName: functionName });
                        fcfilePath = path_1.default.resolve(codePath, 'fcfile');
                        if (fs_extra_1.default.existsSync(fcfilePath)) {
                            this.logger.log("Found fcfile in src directory, maybe you want to use 's build --use-docker' ?", 'yellow');
                        }
                        builder = new fc_builders_1.default.Builder(serviceName, functionName, codePath, runtime, artifactPath, verbose, stages);
                        return [4 /*yield*/, builder.build()];
                    case 1:
                        _c.sent();
                        return [2 /*return*/, artifactPath];
                }
            });
        });
    };
    Builder.prototype.codeSkipBuild = function (_a) {
        var baseDir = _a.baseDir, codeUri = _a.codeUri, runtime = _a.runtime;
        return __awaiter(this, void 0, void 0, function () {
            var src, absCodeUri, taskFlows;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        src = utils_1.checkCodeUri(codeUri);
                        this.logger.debug("src is: " + src);
                        if (!src) {
                            return [2 /*return*/, false];
                        }
                        absCodeUri = path_1.default.resolve(baseDir, src);
                        return [4 /*yield*/, fc_builders_1.default.Builder.detectTaskFlow(runtime, absCodeUri)];
                    case 1:
                        taskFlows = _b.sent();
                        this.logger.debug("taskFlows isEmpty: " + lodash_1.default.isEmpty(taskFlows) + ",only default task flow is: " + this.isOnlyDefaultTaskFlow(taskFlows));
                        this.logger.debug(JSON.stringify(taskFlows));
                        if (lodash_1.default.isEmpty(taskFlows) || this.isOnlyDefaultTaskFlow(taskFlows)) {
                            this.logger.info('No need build for this project.');
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    Builder.prototype.isOnlyDefaultTaskFlow = function (taskFlows) {
        if (taskFlows.length !== 1) {
            return false;
        }
        return taskFlows[0].name === 'DefaultTaskFlow';
    };
    Builder.prototype.initBuildArtifactDir = function (_a) {
        var baseDir = _a.baseDir, serviceName = _a.serviceName, functionName = _a.functionName;
        var artifactPath = utils_1.getArtifactPath({ baseDir: baseDir, serviceName: serviceName, functionName: functionName });
        this.logger.debug("[" + this.projectName + "] Build save url: " + artifactPath + ".");
        if (fs_extra_1.default.pathExistsSync(artifactPath)) {
            this.logger.debug("[" + this.projectName + "] Folder already exists, delete folder.");
            fs_extra_1.default.rmdirSync(artifactPath, { recursive: true });
            this.logger.debug("[" + this.projectName + "] Deleted folder successfully.");
        }
        this.logger.debug("[" + this.projectName + "] Create build folder.");
        fs_extra_1.default.mkdirpSync(artifactPath);
        this.logger.debug("[" + this.projectName + "] Created build folder successfully.");
        return artifactPath;
    };
    var _a;
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", typeof (_a = typeof core_1.ILogger !== "undefined" && core_1.ILogger) === "function" ? _a : Object)
    ], Builder.prototype, "logger", void 0);
    return Builder;
}());
exports.default = Builder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXlEO0FBQ3pELHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFDeEIsa0RBQXVCO0FBQ3ZCLHNFQUErQztBQUMvQywrQ0FBeUM7QUFDekMsaUNBQTRFO0FBQzVFLDJDQUErRDtBQUMvRCxtQ0FBcUM7QUFDckMsdUNBQXFDO0FBRXJDLCtDQUE0QztBQWE1QztJQVFFLGlCQUFZLFdBQW1CLEVBQUUsU0FBa0IsRUFBRSxVQUFrQixFQUFFLFVBQWtCO1FBQ3pGLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDN0UsQ0FBQztJQUVLLDRCQUFVLEdBQWhCLFVBQWlCLFVBQXVCOzs7O2dCQUM5QixxQkFBcUIsR0FBSyxVQUFVLENBQUMsYUFBYSxzQkFBN0IsQ0FBOEI7Z0JBRTNELElBQUksQ0FBQyxxQkFBcUIsRUFBRTtvQkFDcEIsWUFBWSxHQUFHLHVEQUF1RCxDQUFDO29CQUM3RSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUMvQjtnQkFFSyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxZQUFZLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRTtvQkFDNUIsWUFBWSxHQUFHLHNC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