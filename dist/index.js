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
var core_1 = require("@serverless-devs/core");
var builder_1 = __importDefault(require("./utils/builder"));
var constant_1 = require("./utils/constant");
var utils_1 = require("./utils/utils");
var logger_1 = __importDefault(require("./common/logger"));
logger_1.default.setContent(constant_1.CONTEXT);
var Build = /** @class */ (function () {
    function Build() {
    }
    Build.prototype.build = function (inputs) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var projectName, apts, _d, useDocker, _e, dockerfile, h, _f, region, serviceProps, functionProps, runtime, params, builder, output, buildOutput;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        logger_1.default.info('Build artifact start...');
                        projectName = (_a = inputs.project) === null || _a === void 0 ? void 0 : _a.projectName;
                        logger_1.default.debug("[" + projectName + "]inputs params: " + JSON.stringify(inputs.props));
                        apts = {
                            string: ['dockerfile'],
                            boolean: ['help', 'use-docker'],
                            alias: { dockerfile: 'f', 'use-docker': 'd', help: 'h' },
                        };
                        _d = core_1.commandParse({ args: inputs.args }, apts).data || {}, useDocker = _d.d, _e = _d.dockerfile, dockerfile = _e === void 0 ? '' : _e, h = _d.h;
                        if (h) {
                            core_1.help(constant_1.HELP);
                            return [2 /*return*/];
                        }
                        core_1.reportComponent(constant_1.CONTEXT_NAME, {
                            command: 'build',
                            uid: (_b = inputs.credentials) === null || _b === void 0 ? void 0 : _b.AccountID,
                            remark: 'fc build',
                        });
                        _f = inputs.props, region = _f.region, serviceProps = _f.service, functionProps = _f.function;
                        runtime = functionProps.runtime;
                        utils_1.checkCommands(useDocker, runtime);
                        params = {
                            region: region,
                            serviceProps: serviceProps,
                            functionProps: functionProps,
                            credentials: {
                                AccountID: '',
                                AccessKeyID: '',
                                AccessKeySecret: '',
                            },
                            serviceName: serviceProps.name,
                            functionName: functionProps.name,
                        };
                        builder = new builder_1.default(projectName, useDocker, dockerfile, (_c = inputs === null || inputs === void 0 ? void 0 : inputs.path) === null || _c === void 0 ? void 0 : _c.configPath);
                        output = {
                            props: inputs.props,
                        };
                        return [4 /*yield*/, builder.build(params)];
                    case 1:
                        buildOutput = _g.sent();
                        logger_1.default.debug("[" + projectName + "] Build output: " + JSON.stringify(buildOutput));
                        if (buildOutput.buildSaveUri) {
                            output.buildSaveUri = buildOutput.buildSaveUri;
                        }
                        else {
                            output.image = buildOutput.image;
                        }
                        logger_1.default.info('Build artifact successfully.');
                        return [2 /*return*/, output];
                }
            });
        });
    };
    return Build;
}());
exports.default = Build;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBNEU7QUFDNUUsNERBQXNDO0FBRXRDLDZDQUErRDtBQUMvRCx1Q0FBOEM7QUFDOUMsMkRBQXFDO0FBRXJDLGdCQUFNLENBQUMsVUFBVSxDQUFDLGtCQUFPLENBQUMsQ0FBQztBQU8zQjtJQUFBO0lBNkRBLENBQUM7SUEzRE8scUJBQUssR0FBWCxVQUFZLE1BQWU7Ozs7Ozs7d0JBQ3pCLGdCQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7d0JBQ2pDLFdBQVcsU0FBRyxNQUFNLENBQUMsT0FBTywwQ0FBRSxXQUFXLENBQUM7d0JBQ2hELGdCQUFNLENBQUMsS0FBSyxDQUFDLE1BQUksV0FBVyx3QkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFHLENBQUMsQ0FBQzt3QkFFekUsSUFBSSxHQUFHOzRCQUNYLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDdEIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQzs0QkFDL0IsS0FBSyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7eUJBQ3pELENBQUM7d0JBQ0ksS0FDSixtQkFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUQzQyxTQUFTLE9BQUEsRUFBRSxrQkFBZSxFQUFmLFVBQVUsbUJBQUcsRUFBRSxLQUFBLEVBQUUsQ0FBQyxPQUFBLENBQ2U7d0JBRXZELElBQUksQ0FBQyxFQUFFOzRCQUNMLFdBQUksQ0FBQyxlQUFJLENBQUMsQ0FBQzs0QkFDWCxzQkFBTzt5QkFDUjt3QkFFRCxzQkFBZSxDQUFDLHVCQUFZLEVBQUU7NEJBQzVCLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixHQUFHLFFBQUUsTUFBTSxDQUFDLFdBQVcsMENBQUUsU0FBUzs0QkFDbEMsTUFBTSxFQUFFLFVBQVU7eUJBQ25CLENBQUMsQ0FBQzt3QkFFRyxLQUE2RCxNQUFNLENBQUMsS0FBSyxFQUF2RSxNQUFNLFlBQUEsRUFBVyxZQUFZLGFBQUEsRUFBWSxhQUFhLGNBQUEsQ0FBa0I7d0JBQ3hFLE9BQU8sR0FBSyxhQUFhLFFBQWxCLENBQW1CO3dCQUVsQyxxQkFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFFNUIsTUFBTSxHQUFnQjs0QkFDMUIsTUFBTSxRQUFBOzRCQUNOLFlBQVksY0FBQTs0QkFDWixhQUFhLGVBQUE7NEJBQ2IsV0FBVyxFQUFFO2dDQUNYLFNBQVMsRUFBRSxFQUFFO2dDQUNiLFdBQVcsRUFBRSxFQUFFO2dDQUNmLGVBQWUsRUFBRSxFQUFFOzZCQUNwQjs0QkFDRCxXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7NEJBQzlCLFlBQVksRUFBRSxhQUFhLENBQUMsSUFBSTt5QkFDakMsQ0FBQzt3QkFFSSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsVUFBVSxRQUFFLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxJQUFJLDBDQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUVwRixNQUFNLEdBQVk7NEJBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzt5QkFDcEIsQ0FBQzt3QkFFa0IscUJBQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQXpDLFdBQVcsR0FBRyxTQUEyQjt3QkFDL0MsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBSSxXQUFXLHdCQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7d0JBQzlFLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRTs0QkFDNUIsTUFBTSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO3lCQUNoRDs2QkFBTTs0QkFDTCxNQUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7eUJBQ2xDO3dCQUVELGdCQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7d0JBQzVDLHNCQUFPLE1BQU0sRUFBQzs7OztLQUNmO0lBQ0gsWUFBQztBQUFELENBQUMsQUE3REQsSUE2REMifQ==