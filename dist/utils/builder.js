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
    function Builder(projectName, useDocker, dockerfile) {
        this.projectName = projectName;
        this.useDocker = useDocker;
        this.dockerfile = dockerfile;
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
            var useDocker, functionProps, codeUri, runtime, baseDir, image, codeSkipBuild, src, buildSaveUri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        useDocker = this.useDocker;
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
                        baseDir = process.cwd();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOENBQXlEO0FBQ3pELHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFDeEIsa0RBQXVCO0FBQ3ZCLHNFQUErQztBQUMvQywrQ0FBeUM7QUFDekMsaUNBQTRFO0FBQzVFLDREQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsdUNBQXFDO0FBY3JDO0lBT0UsaUJBQVksV0FBbUIsRUFBRSxTQUFrQixFQUFFLFVBQWtCO1FBQ3JFLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFSyw0QkFBVSxHQUFoQixVQUFpQixVQUF1Qjs7OztnQkFDOUIscUJBQXFCLEdBQUssVUFBVSxDQUFDLGFBQWEsc0JBQTdCLENBQThCO2dCQUUzRCxJQUFJLENBQUMscUJBQXFCLEVBQUU7b0JBQ3BCLFlBQVksR0FBRyx1REFBdUQsQ0FBQztvQkFDN0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDL0I7Z0JBRUssY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksWUFBWSxDQUFDO2dCQUN2RCxJQUFJLENBQUMsa0JBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEVBQUU7b0JBQzVCLFlBQVksR0FBRyxzQkFBc0IsQ0FBQztvQkFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDL0I7Z0JBRUssU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQztnQkFDOUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtvQkFDUixZQUFZLEdBQUcsMENBQTBDLENBQUM7b0JBQ2hFLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQy9CO2dCQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3RDLHdCQUFRLENBQUMscUJBQW1CLFNBQVMsWUFBTyxjQUFjLE9BQUksRUFBRTtvQkFDOUQsS0FBSyxFQUFFLFNBQVM7aUJBQ2pCLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBZSxTQUFTLG1CQUFnQixDQUFDLENBQUM7Z0JBQzFELHNCQUFPLFNBQVMsRUFBQzs7O0tBQ2xCO0lBRUssdUJBQUssR0FBWCxVQUFZLFVBQXVCOzs7Ozs7d0JBQ3pCLFNBQVMsR0FBSyxJQUFJLFVBQVQsQ0FBVTt3QkFDM0IsSUFBSSxTQUFTLEVBQUU7NEJBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQzt5QkFDOUM7d0JBQ08sYUFBYSxHQUFLLFVBQVUsY0FBZixDQUFnQjt3QkFDN0IsT0FBTyxHQUFjLGFBQWEsUUFBM0IsRUFBRSxPQUFPLEdBQUssYUFBYSxRQUFsQixDQUFtQjt3QkFDckMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzt3QkFFOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBSSxJQUFJLENBQUMsV0FBVyxxQkFBZ0IsT0FBTyxNQUFHLENBQUMsQ0FBQzs2QkFFOUQsQ0FBQSxTQUFTLElBQUksT0FBTyxLQUFLLGtCQUFrQixDQUFBLEVBQTNDLHdCQUEyQzt3QkFDL0IscUJBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBQTs7d0JBQXpDLEtBQUssR0FBRyxTQUFpQzt3QkFDL0Msc0JBQU8sRUFBRSxLQUFLLE9BQUEsRUFBRSxFQUFDOzRCQUdHLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLEVBQUE7O3dCQUF2RSxhQUFhLEdBQUcsU0FBdUQ7d0JBQzdFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQUksSUFBSSxDQUFDLFdBQVcsMkJBQXNCLGFBQWEsTUFBRyxDQUFDLENBQUM7d0JBRXhFLEdBQUcsR0FBRyxvQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUVsQyxJQUFJLENBQUMsYUFBYSxFQUFFOzRCQUNsQixzQkFBTyxFQUFFLEVBQUM7eUJBQ1g7NkJBR0csU0FBUyxFQUFULHdCQUFTO3dCQUNJLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFBOzt3QkFBeEQsWUFBWSxHQUFHLFNBQXlDLENBQUM7OzRCQUUxQyxxQkFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBQTs7d0JBQXhELFlBQVksR0FBRyxTQUF5QyxDQUFDOzs0QkFHM0Qsc0JBQU8sRUFBRSxZQUFZLGNBQUEsRUFBRSxFQUFDOzs7O0tBQ3pCO0lBRUssK0JBQWEsR0FBbkIsVUFBb0IsRUFRTixFQUFFLEdBQVc7WUFQekIsTUFBTSxZQUFBLEVBQ04sV0FBVyxpQkFBQSxFQUNYLFlBQVksa0JBQUEsRUFDWixZQUFZLGtCQUFBLEVBQ1osYUFBYSxtQkFBQSxFQUNiLGVBQWMsRUFBZCxPQUFPLG1CQUFHLElBQUksS0FBQSxFQUNkLFdBQVcsaUJBQUE7Ozs7Ozt3QkFFTCxNQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7d0JBRTlCLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ3hCLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDbEMsZUFBZSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLE9BQU8sU0FBQSxFQUFFLFdBQVcsYUFBQSxFQUFFLFlBQVksY0FBQSxFQUFFLENBQUMsQ0FBQzt3QkFFN0UscUJBQU0sb0JBQStCLENBQUM7Z0NBQ2pELE1BQU0sUUFBQTtnQ0FDTixXQUFXLGFBQUE7Z0NBQ1gsWUFBWSxjQUFBO2dDQUNaLFlBQVksY0FBQTtnQ0FDWixhQUFhLGVBQUE7Z0NBQ2IsT0FBTyxTQUFBO2dDQUNQLE9BQU8sU0FBQTtnQ0FDUCxlQUFlLGlCQUFBO2dDQUNmLE9BQU8sU0FBQTtnQ0FDUCxXQUFXLGFBQUE7Z0NBQ1gsTUFBTSxRQUFBOzZCQUNQLENBQUMsRUFBQTs7d0JBWkksSUFBSSxHQUFHLFNBWVg7d0JBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2YsTUFBSSxJQUFJLENBQUMsV0FBVywrQ0FBMEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUcsQ0FDckYsQ0FBQzt3QkFFSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzt3QkFFN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUNBQWdDLFNBQVcsQ0FBQyxDQUFDO3dCQUUvQyxxQkFBTSxrQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFBOzt3QkFBOUIsTUFBTSxHQUFHLFNBQXFCO3dCQUNwQyxJQUFJLE1BQU0sQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFOzRCQUNyQixZQUFZLEdBQUcsb0JBQWtCLFdBQVcsU0FBSSxZQUFZLFlBQVMsQ0FBQzs0QkFDNUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQzt5QkFDL0I7d0JBQ0Qsc0JBQU8sZUFBZSxFQUFDOzs7O0tBQ3hCO0lBRUssK0JBQWEsR0FBbkIsVUFDRSxFQUF5RSxFQUN6RSxHQUFHO1lBREQsV0FBVyxpQkFBQSxFQUFFLFlBQVksa0JBQUEsRUFBRSxhQUFhLG1CQUFBLEVBQUUsZUFBYyxFQUFkLE9BQU8sbUJBQUcsSUFBSSxLQUFBOzs7Ozs7d0JBRzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEdBQUcsMEJBQWtCLEVBQUUsQ0FBQzt3QkFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO3dCQUU3QixPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUN0QixPQUFPLEdBQUssYUFBYSxRQUFsQixDQUFtQjt3QkFFNUIsTUFBTSxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUM5QixRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBRW5DLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxPQUFPLFNBQUEsRUFBRSxXQUFXLGFBQUEsRUFBRSxZQUFZLGNBQUEsRUFBRSxDQUFDLENBQUM7d0JBR2pGLFVBQVUsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzt3QkFDcEQsSUFBSSxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTs0QkFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQ2IsK0VBQStFLEVBQy9FLFFBQVEsQ0FDVCxDQUFDO3lCQUNIO3dCQUVLLE9BQU8sR0FBRyxJQUFJLHFCQUFVLENBQUMsT0FBTyxDQUNwQyxXQUFXLEVBQ1gsWUFBWSxFQUNaLFFBQVEsRUFDUixPQUFPLEVBQ1AsWUFBWSxFQUNaLE9BQU8sRUFDUCxNQUFNLENBQ1AsQ0FBQzt3QkFDRixxQkFBTSxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUE7O3dCQUFyQixTQUFxQixDQUFDO3dCQUN0QixzQkFBTyxZQUFZLEVBQUM7Ozs7S0FDckI7SUFFSywrQkFBYSxHQUFuQixVQUFvQixFQUF5QztZQUF2QyxPQUFPLGFBQUEsRUFBRSxPQUFPLGFBQUEsRUFBRSxPQUFPLGFBQUE7Ozs7Ozt3QkFDdkMsR0FBRyxHQUFHLG9CQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGFBQVcsR0FBSyxDQUFDLENBQUM7d0JBQ3BDLElBQUksQ0FBQyxHQUFHLEVBQUU7NEJBQ1Isc0JBQU8sS0FBSyxFQUFDO3lCQUNkO3dCQUVLLFVBQVUsR0FBRyxjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQzt3QkFDNUIscUJBQU0scUJBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsRUFBQTs7d0JBQXhFLFNBQVMsR0FBRyxTQUE0RDt3QkFDOUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQ2Ysd0JBQXNCLGdCQUFDLENBQUMsT0FBTyxDQUM3QixTQUFTLENBQ1Ysb0NBQStCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUcsQ0FDeEUsQ0FBQzt3QkFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQzdDLElBQUksZ0JBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxFQUFFOzRCQUNqRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDOzRCQUNwRCxzQkFBTyxLQUFLLEVBQUM7eUJBQ2Q7d0JBRUQsc0JBQU8sSUFBSSxFQUFDOzs7O0tBQ2I7SUFFRCx1Q0FBcUIsR0FBckIsVUFBc0IsU0FBUztRQUM3QixJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLENBQUM7SUFDakQsQ0FBQztJQUVELHNDQUFvQixHQUFwQixVQUFxQixFQUFpRDtZQUEvQyxPQUFPLGFBQUEsRUFBRSxXQUFXLGlCQUFBLEVBQUUsWUFBWSxrQkFBQTtRQUN2RCxJQUFNLFlBQVksR0FBRyx1QkFBZSxDQUFDLEVBQUUsT0FBTyxTQUFBLEVBQUUsV0FBVyxhQUFBLEVBQUUsWUFBWSxjQUFBLEVBQUUsQ0FBQyxDQUFDO1FBRTdFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQUksSUFBSSxDQUFDLFdBQVcsMEJBQXFCLFlBQVksTUFBRyxDQUFDLENBQUM7UUFFNUUsSUFBSSxrQkFBRSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFJLElBQUksQ0FBQyxXQUFXLDRDQUF5QyxDQUFDLENBQUM7WUFDakYsa0JBQUUsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBSSxJQUFJLENBQUMsV0FBVyxtQ0FBZ0MsQ0FBQyxDQUFDO1NBQ3pFO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBSSxJQUFJLENBQUMsV0FBVywyQkFBd0IsQ0FBQyxDQUFDO1FBQ2hFLGtCQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQUksSUFBSSxDQUFDLFdBQVcseUNBQXNDLENBQUMsQ0FBQztRQUM5RSxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDOztJQTFNaUI7UUFBakIsY0FBTyxDQUFDLGtCQUFPLENBQUM7c0RBQVMsY0FBTyxvQkFBUCxjQUFPOzJDQUFDO0lBMk1wQyxjQUFDO0NBQUEsQUE1TUQsSUE0TUM7a0JBNU1vQixPQUFPIn0=