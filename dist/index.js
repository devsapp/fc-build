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
var builder_1 = __importDefault(require("./utils/builder"));
var constant_1 = require("./utils/constant");
var utils_1 = require("./utils/utils");
var Build = /** @class */ (function () {
    function Build() {
    }
    Build.prototype.build = function (inputs) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var projectName, apts, _b, _c, commands, _d, dockerfile, h, credentials, _e, region, serviceProps, functionProps, runtime, params, builder, output, buildOutput;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        // @ts-ignore
                        delete inputs.Credentials;
                        // @ts-ignore
                        delete inputs.credentials;
                        this.logger.info('Build artifact start...');
                        projectName = (_a = inputs.project) === null || _a === void 0 ? void 0 : _a.projectName;
                        this.logger.debug("[" + projectName + "]inputs params: " + JSON.stringify(inputs));
                        apts = {
                            string: ['dockerfile'],
                            boolean: ['help'],
                            alias: { dockerfile: 'd', help: 'h' },
                        };
                        _b = core_1.commandParse({ args: inputs.args }, apts).data || {}, _c = _b._, commands = _c === void 0 ? [] : _c, _d = _b.dockerfile, dockerfile = _d === void 0 ? '' : _d, h = _b.h;
                        if (h) {
                            core_1.help(constant_1.HELP);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, core_1.getCredential(inputs.project.access)];
                    case 1:
                        credentials = _f.sent();
                        core_1.reportComponent(constant_1.CONTEXT_NAME, {
                            command: 'build',
                            uid: credentials.AccountID,
                            remark: 'fc build',
                        });
                        _e = inputs.props, region = _e.region, serviceProps = _e.service, functionProps = _e.function;
                        runtime = functionProps.runtime;
                        try {
                            utils_1.checkCommands(commands, runtime);
                        }
                        catch (e) {
                            throw e;
                        }
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
                        builder = new builder_1.default(projectName, commands, dockerfile);
                        output = {
                            props: inputs.props,
                        };
                        return [4 /*yield*/, builder.build(params)];
                    case 2:
                        buildOutput = _f.sent();
                        this.logger.debug("[" + projectName + "] Build output: " + JSON.stringify(buildOutput));
                        if (buildOutput.buildSaveUri) {
                            output.buildSaveUri = buildOutput.buildSaveUri;
                        }
                        else {
                            output.image = buildOutput.image;
                        }
                        this.logger.info('Build artifact successfully.');
                        return [2 /*return*/, output];
                }
            });
        });
    };
    __decorate([
        core_1.HLogger(constant_1.CONTEXT),
        __metadata("design:type", Object)
    ], Build.prototype, "logger", void 0);
    return Build;
}());
exports.default = Build;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBNkc7QUFFN0csNERBQXNDO0FBRXRDLDZDQUErRDtBQUMvRCx1Q0FBOEM7QUFROUM7SUFBQTtJQXdFQSxDQUFDO0lBckVPLHFCQUFLLEdBQVgsVUFBWSxNQUFlOzs7Ozs7O3dCQUN6QixhQUFhO3dCQUNiLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQzt3QkFDMUIsYUFBYTt3QkFDYixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUM7d0JBRTFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7d0JBQ3RDLFdBQVcsU0FBRyxNQUFNLENBQUMsT0FBTywwQ0FBRSxXQUFXLENBQUM7d0JBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQUksV0FBVyx3QkFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUcsQ0FBQyxDQUFDO3dCQUV4RSxJQUFJLEdBQUc7NEJBQ1gsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUN0QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7NEJBQ2pCLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTt5QkFDdEMsQ0FBQzt3QkFDSSxLQUNKLG1CQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLEVBRDlDLFNBQWdCLEVBQWIsUUFBUSxtQkFBRyxFQUFFLEtBQUEsRUFBRSxrQkFBZSxFQUFmLFVBQVUsbUJBQUcsRUFBRSxLQUFBLEVBQUUsQ0FBQyxPQUFBLENBQ1c7d0JBRXZELElBQUksQ0FBQyxFQUFFOzRCQUNMLFdBQUksQ0FBQyxlQUFJLENBQUMsQ0FBQzs0QkFDWCxzQkFBTzt5QkFDUjt3QkFFbUIscUJBQU0sb0JBQWEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBeEQsV0FBVyxHQUFHLFNBQTBDO3dCQUM5RCxzQkFBZSxDQUFDLHVCQUFZLEVBQUU7NEJBQzVCLE9BQU8sRUFBRSxPQUFPOzRCQUNoQixHQUFHLEVBQUUsV0FBVyxDQUFDLFNBQVM7NEJBQzFCLE1BQU0sRUFBRSxVQUFVO3lCQUNuQixDQUFDLENBQUM7d0JBRUcsS0FBNkQsTUFBTSxDQUFDLEtBQUssRUFBdkUsTUFBTSxZQUFBLEVBQVcsWUFBWSxhQUFBLEVBQVksYUFBYSxjQUFBLENBQWtCO3dCQUMxRSxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQzt3QkFFdEMsSUFBSTs0QkFDRixxQkFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzt5QkFDbEM7d0JBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ1YsTUFBTSxDQUFDLENBQUM7eUJBQ1Q7d0JBRUssTUFBTSxHQUFnQjs0QkFDMUIsTUFBTSxRQUFBOzRCQUNOLFlBQVksY0FBQTs0QkFDWixhQUFhLGVBQUE7NEJBQ2IsV0FBVyxFQUFFO2dDQUNYLFNBQVMsRUFBRSxFQUFFO2dDQUNiLFdBQVcsRUFBRSxFQUFFO2dDQUNmLGVBQWUsRUFBRSxFQUFFOzZCQUNwQjs0QkFDRCxXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7NEJBQzlCLFlBQVksRUFBRSxhQUFhLENBQUMsSUFBSTt5QkFDakMsQ0FBQzt3QkFFSSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBRXpELE1BQU0sR0FBWTs0QkFDdEIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO3lCQUNwQixDQUFDO3dCQUVrQixxQkFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFBOzt3QkFBekMsV0FBVyxHQUFHLFNBQTJCO3dCQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFJLFdBQVcsd0JBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFHLENBQUMsQ0FBQzt3QkFDbkYsSUFBSSxXQUFXLENBQUMsWUFBWSxFQUFFOzRCQUM1QixNQUFNLENBQUMsWUFBWSxHQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUM7eUJBQ2hEOzZCQUFNOzRCQUNMLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQzt5QkFDbEM7d0JBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQzt3QkFDakQsc0JBQU8sTUFBTSxFQUFDOzs7O0tBQ2Y7SUF0RWlCO1FBQWpCLGNBQU8sQ0FBQyxrQkFBTyxDQUFDOzt5Q0FBaUI7SUF1RXBDLFlBQUM7Q0FBQSxBQXhFRCxJQXdFQztrQkF4RW9CLEtBQUsifQ==