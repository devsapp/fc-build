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
exports.processFunfile = exports.getFunfile = void 0;
var lodash_1 = __importDefault(require("lodash"));
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var logger_1 = __importDefault(require("../common/logger"));
var parser = __importStar(require("./parser"));
var utils_1 = require("./utils");
var docker_1 = require("./docker");
var uuid = require('uuid');
function getFunfile(codeUri) {
    return __awaiter(this, void 0, void 0, function () {
        var funfilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    funfilePath = path_1.default.join(codeUri, 'Funfile');
                    return [4 /*yield*/, fs_extra_1.default.pathExists(funfilePath)];
                case 1:
                    if (_a.sent()) {
                        return [2 /*return*/, funfilePath];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.getFunfile = getFunfile;
function convertFunfileToDockerfile(funfilePath, dockerfilePath, runtime, serviceName, functionName) {
    return __awaiter(this, void 0, void 0, function () {
        var dockerfileContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, parser.funfileToDockerfile(funfilePath, runtime, serviceName, functionName)];
                case 1:
                    dockerfileContent = _a.sent();
                    return [4 /*yield*/, fs_extra_1.default.writeFile(dockerfilePath, dockerfileContent)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function getWorkDir(funfilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, line, src, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    _i = 0;
                    return [4 /*yield*/, utils_1.readLines(funfilePath)];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    line = _a[_i];
                    if (line.startsWith('WORKDIR ')) {
                        src = lodash_1.default.compact(line.split(' '))[1];
                        return [2 /*return*/, src + "/."];
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 2];
                case 4: return [3 /*break*/, 6];
                case 5:
                    e_1 = _b.sent();
                    logger_1.default.debug(e_1.toString());
                    return [2 /*return*/, '/code/.'];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function processFunfile(serviceName, codeUri, funfilePath, funcArtifactDir, runtime, functionName) {
    return __awaiter(this, void 0, void 0, function () {
        var dockerfilePath, tag, imageTag, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    logger_1.default.log('Funfile exist, Fun will use container to build forcely', 'yellow');
                    dockerfilePath = path_1.default.join(codeUri, '.Funfile.generated.dockerfile');
                    return [4 /*yield*/, convertFunfileToDockerfile(funfilePath, dockerfilePath, runtime, serviceName, functionName)];
                case 1:
                    _c.sent();
                    tag = "fun-cache-" + uuid.v4();
                    return [4 /*yield*/, docker_1.buildImage(codeUri, dockerfilePath, tag)];
                case 2:
                    imageTag = _c.sent();
                    // copy fun install generated artifact files to artifact dir
                    logger_1.default.log("copying function artifact to " + funcArtifactDir);
                    _a = docker_1.copyFromImage;
                    _b = [imageTag];
                    return [4 /*yield*/, getWorkDir(funfilePath)];
                case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent(), funcArtifactDir]))];
                case 4:
                    _c.sent();
                    // TODO: process nas folder
                    // const nasConfig = (serviceRes.Properties || {}).NasConfig;
                    // let nasMappings;
                    // if (nasConfig) {
                    //   nasMappings = await nas.convertNasConfigToNasMappings(nas.getDefaultNasDir(baseDir), nasConfig, serviceName);
                    // }
                    // await copyNasArtifact(nasMappings, imageTag, baseDir, funcArtifactDir);
                    return [4 /*yield*/, fs_extra_1.default.remove(dockerfilePath)];
                case 5:
                    // TODO: process nas folder
                    // const nasConfig = (serviceRes.Properties || {}).NasConfig;
                    // let nasMappings;
                    // if (nasConfig) {
                    //   nasMappings = await nas.convertNasConfigToNasMappings(nas.getDefaultNasDir(baseDir), nasConfig, serviceName);
                    // }
                    // await copyNasArtifact(nasMappings, imageTag, baseDir, funcArtifactDir);
                    _c.sent();
                    return [4 /*yield*/, fs_extra_1.default.rename(path_1.default.join(funcArtifactDir, '.fun'), path_1.default.join(funcArtifactDir, '.s'))];
                case 6:
                    _c.sent();
                    return [2 /*return*/, imageTag];
            }
        });
    });
}
exports.processFunfile = processFunfile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC1maWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2luc3RhbGwtZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsa0RBQXVCO0FBQ3ZCLDhDQUF3QjtBQUN4QixzREFBMEI7QUFDMUIsNERBQXNDO0FBQ3RDLCtDQUFtQztBQUNuQyxpQ0FBb0M7QUFDcEMsbUNBQXFEO0FBRXJELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU3QixTQUFzQixVQUFVLENBQUMsT0FBZTs7Ozs7O29CQUN4QyxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzlDLHFCQUFNLGtCQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFBOztvQkFBcEMsSUFBSSxTQUFnQyxFQUFFO3dCQUNwQyxzQkFBTyxXQUFXLEVBQUM7cUJBQ3BCO29CQUNELHNCQUFPLElBQUksRUFBQzs7OztDQUNiO0FBTkQsZ0NBTUM7QUFFRCxTQUFlLDBCQUEwQixDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxZQUFZOzs7Ozt3QkFDN0UscUJBQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxFQUFBOztvQkFBckcsaUJBQWlCLEdBQUcsU0FBaUY7b0JBRTNHLHFCQUFNLGtCQUFFLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQyxFQUFBOztvQkFBckQsU0FBcUQsQ0FBQzs7Ozs7Q0FDdkQ7QUFFRCxTQUFlLFVBQVUsQ0FBQyxXQUFtQjs7Ozs7OzswQkFFTTtvQkFBNUIscUJBQU0saUJBQVMsQ0FBQyxXQUFXLENBQUMsRUFBQTs7b0JBQTVCLEtBQUEsU0FBNEI7Ozt5QkFBNUIsQ0FBQSxjQUE0QixDQUFBO29CQUFwQyxJQUFJO29CQUNiLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDekIsR0FBRyxHQUFHLGdCQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsc0JBQVUsR0FBRyxPQUFJLEVBQUM7cUJBQ25COzs7b0JBSmdCLElBQTRCLENBQUE7Ozs7O29CQU8vQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxHQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztvQkFDM0Isc0JBQU8sU0FBUyxFQUFDOzs7OztDQUVwQjtBQUVELFNBQXNCLGNBQWMsQ0FDbEMsV0FBbUIsRUFDbkIsT0FBZSxFQUNmLFdBQW1CLEVBQ25CLGVBQXVCLEVBQ3ZCLE9BQWUsRUFDZixZQUFvQjs7Ozs7O29CQUVwQixnQkFBTSxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFFekUsY0FBYyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLCtCQUErQixDQUFDLENBQUM7b0JBQzNFLHFCQUFNLDBCQUEwQixDQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsRUFBQTs7b0JBQWpHLFNBQWlHLENBQUM7b0JBRTVGLEdBQUcsR0FBRyxlQUFhLElBQUksQ0FBQyxFQUFFLEVBQUksQ0FBQztvQkFDWixxQkFBTSxtQkFBVSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUE7O29CQUFqRSxRQUFRLEdBQVcsU0FBOEM7b0JBRXZFLDREQUE0RDtvQkFDNUQsZ0JBQU0sQ0FBQyxHQUFHLENBQUMsa0NBQWdDLGVBQWlCLENBQUMsQ0FBQztvQkFDeEQsS0FBQSxzQkFBYSxDQUFBOzBCQUFDLFFBQVE7b0JBQUUscUJBQU0sVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFBO3dCQUEzRCxxQkFBTSw0QkFBd0IsU0FBNkIsRUFBRSxlQUFlLEdBQUMsRUFBQTs7b0JBQTdFLFNBQTZFLENBQUM7b0JBRTlFLDJCQUEyQjtvQkFFM0IsNkRBQTZEO29CQUM3RCxtQkFBbUI7b0JBQ25CLG1CQUFtQjtvQkFDbkIsa0hBQWtIO29CQUNsSCxJQUFJO29CQUNKLDBFQUEwRTtvQkFDMUUscUJBQU0sa0JBQUUsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUE7O29CQVIvQiwyQkFBMkI7b0JBRTNCLDZEQUE2RDtvQkFDN0QsbUJBQW1CO29CQUNuQixtQkFBbUI7b0JBQ25CLGtIQUFrSDtvQkFDbEgsSUFBSTtvQkFDSiwwRUFBMEU7b0JBQzFFLFNBQStCLENBQUM7b0JBQ2hDLHFCQUFNLGtCQUFFLENBQUMsTUFBTSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQyxFQUFFLGNBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUE7O29CQUFyRixTQUFxRixDQUFDO29CQUV0RixzQkFBTyxRQUFRLEVBQUM7Ozs7Q0FDakI7QUFoQ0Qsd0NBZ0NDIn0=