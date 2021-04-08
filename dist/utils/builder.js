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
var build_opts_1 = __importDefault(require("./build-opts"));
var docker_1 = require("./docker");
var constant_1 = require("./constant");
var Builder = /** @class */ (function () {
    function Builder(projectName, commands, parameters) {
        this.projectName = projectName;
        this.commands = commands;
        this.parameters = parameters;
    }
    Builder.prototype.buildImage = function (buildInput) {
        return __awaiter(this, void 0, void 0, function () {
            var customContainer, errorMessage, _a, d, dockerfile, dockerFileName, errorMessage, imageName, errorMessage, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        customContainer = buildInput.functionProps.customContainer;
                        if (!!customContainer) return [3 /*break*/, 2];
                        errorMessage = "No 'CustomContainer' configuration found in Function.";
                        return [4 /*yield*/, core_1.report(errorMessage, {
                                type: 'error',
                                context: constant_1.CONTEXT,
                            })];
                    case 1:
                        _b.sent();
                        throw new Error(errorMessage);
                    case 2:
                        _a = this.parameters, d = _a.d, dockerfile = _a.dockerfile;
                        dockerFileName = d || dockerfile || 'Dockerfile';
                        if (!!fs_extra_1.default.existsSync(dockerFileName)) return [3 /*break*/, 4];
                        errorMessage = 'No dockerfile found.';
                        return [4 /*yield*/, core_1.report(errorMessage, {
                                type: 'error',
                                context: constant_1.CONTEXT,
                            })];
                    case 3:
                        _b.sent();
                        throw new Error(errorMessage);
                    case 4:
                        imageName = customContainer.image;
                        if (!!imageName) return [3 /*break*/, 6];
                        errorMessage = 'Function/CustomContainer/Image required.';
                        return [4 /*yield*/, core_1.report(errorMessage, {
                                type: 'error',
                                context: constant_1.CONTEXT,
                            })];
                    case 5:
                        _b.sent();
                        throw new Error(errorMessage);
                    case 6:
                        _b.trys.push([6, 7, , 9]);
                        this.logger.info('Building image...');
                        child_process_1.execSync("docker build -t " + imageName + " -f " + dockerFileName + " .", {
                            stdio: 'inherit',
                        });
                        this.logger.log("Build image(" + imageName + ") successfully");
                        return [2 /*return*/, imageName];
                    case 7:
                        e_1 = _b.sent();
                        return [4 /*yield*/, core_1.report(e_1, {
                                type: 'error',
                                context: constant_1.CONTEXT,
                            })];
                    case 8:
                        _b.sent();
                        throw e_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Builder.prototype.build = function (buildInput) {
        return __awaiter(this, void 0, void 0, function () {
            var useDocker, functionProps, codeUri, runtime, baseDir, image, codeSkipBuild, src, buildSaveUri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        useDocker = this.isUseDocker();
                        if (useDocker) {
                            this.logger.info('Use docker for building.');
                        }
                        functionProps = buildInput.functionProps;
                        codeUri = functionProps.codeUri, runtime = functionProps.runtime;
                        baseDir = process.cwd();
                        this.logger.debug("[" + this.projectName + "] Runtime is " + runtime + ".");
                        if (!(useDocker && runtime === 'custom-container')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.buildImage(buildInput)];
                    case 1:
                        image = _a.sent();
                        return [2 /*return*/, { image: image }];
                    case 2: return [4 /*yield*/, this.codeSkipBuild({ baseDir: baseDir, codeUri: codeUri, runtime: runtime })];
                    case 3:
                        codeSkipBuild = _a.sent();
                        this.logger.debug("[" + this.projectName + "] Code skip build: " + codeSkipBuild + ".");
                        src = utils_1.checkCodeUri(codeUri);
                        if (!codeSkipBuild) {
                            return [2 /*return*/, {}];
                        }
                        if (!useDocker) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.buildInDocker(buildInput, src)];
                    case 4:
                        buildSaveUri = _a.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.buildArtifact(buildInput, src)];
                    case 6:
                        buildSaveUri = _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/, { buildSaveUri: buildSaveUri }];
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
                        baseDir = process.cwd();
                        codeUri = path_1.default.join(baseDir, src);
                        funcArtifactDir = this.initBuildArtifactDir({ baseDir: baseDir, serviceName: serviceName, functionName: functionName });
                        return [4 /*yield*/, build_opts_1.default({
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
                        this.logger.info('Build function using image: ' + usedImage);
                        return [4 /*yield*/, docker_1.dockerRun(opts)];
                    case 2:
                        exitRs = _c.sent();
                        if (!(exitRs.StatusCode !== 0)) return [3 /*break*/, 4];
                        errorMessage = "build function " + serviceName + "/" + functionName + " error.";
                        return [4 /*yield*/, core_1.report(errorMessage, {
                                type: 'error',
                                context: constant_1.CONTEXT,
                            })];
                    case 3:
                        _c.sent();
                        throw new Error(errorMessage);
                    case 4: return [2 /*return*/, funcArtifactDir];
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
                        baseDir = process.cwd();
                        runtime = functionProps.runtime;
                        stages = ['install', 'build'];
                        codePath = path_1.default.join(baseDir, src);
                        artifactPath = this.initBuildArtifactDir({ baseDir: baseDir, serviceName: serviceName, functionName: functionName });
                        fcfilePath = path_1.default.resolve(codePath, 'fcfile');
                        if (fs_extra_1.default.existsSync(fcfilePath)) {
                            this.logger.log("Found fcfile in src directory, maybe you want to use 's build docker' ?", 'yellow');
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
    Builder.prototype.isUseDocker = function () {
        return this.commands[0] === 'docker';
    };
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", Object)
    ], Builder.prototype, "logger", void 0);
    return Builder;
}());
exports.default = Builder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQWlFO0FBQ2pFLHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFDeEIsa0RBQXVCO0FBQ3ZCLHNFQUErQztBQUMvQywrQ0FBeUM7QUFDekMsaUNBQTRFO0FBQzVFLDREQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsdUNBQXFDO0FBY3JDO0lBT0UsaUJBQVksV0FBbUIsRUFBRSxRQUFlLEVBQUUsVUFBbUI7UUFDbkUsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDL0IsQ0FBQztJQUVLLDRCQUFVLEdBQWhCLFVBQWlCLFVBQXVCOzs7Ozs7d0JBQzlCLGVBQWUsR0FBSyxVQUFVLENBQUMsYUFBYSxnQkFBN0IsQ0FBOEI7NkJBRWpELENBQUMsZUFBZSxFQUFoQix3QkFBZ0I7d0JBQ1osWUFBWSxHQUFHLHVEQUF1RCxDQUFDO3dCQUM3RSxxQkFBTSxhQUFNLENBQUMsWUFBWSxFQUFFO2dDQUN6QixJQUFJLEVBQUUsT0FBTztnQ0FDYixPQUFPLEVBQUUsa0JBQU87NkJBQ2pCLENBQUMsRUFBQTs7d0JBSEYsU0FHRSxDQUFDO3dCQUNILE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7O3dCQUcxQixLQUFvQixJQUFJLENBQUMsVUFBVSxFQUFqQyxDQUFDLE9BQUEsRUFBRSxVQUFVLGdCQUFBLENBQXFCO3dCQUNwQyxjQUFjLEdBQUcsQ0FBQyxJQUFJLFVBQVUsSUFBSSxZQUFZLENBQUM7NkJBQ25ELENBQUMsa0JBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFD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