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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBNkc7QUFFN0csNERBQXNDO0FBRXRDLDZDQUErRDtBQUMvRCx1Q0FBOEM7QUFROUM7SUFBQTtJQW1FQSxDQUFDO0lBaEVPLHFCQUFLLEdBQVgsVUFBWSxNQUFlOzs7Ozs7O3dCQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO3dCQUN0QyxXQUFXLFNBQUcsTUFBTSxDQUFDLE9BQU8sMENBQUUsV0FBVyxDQUFDO3dCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFJLFdBQVcsd0JBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFHLENBQUMsQ0FBQzt3QkFFeEUsSUFBSSxHQUFHOzRCQUNYLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQzs0QkFDdEIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDOzRCQUNqQixLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7eUJBQ3RDLENBQUM7d0JBQ0ksS0FDSixtQkFBWSxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUQ5QyxTQUFnQixFQUFiLFFBQVEsbUJBQUcsRUFBRSxLQUFBLEVBQUUsa0JBQWUsRUFBZixVQUFVLG1CQUFHLEVBQUUsS0FBQSxFQUFFLENBQUMsT0FBQSxDQUNXO3dCQUV2RCxJQUFJLENBQUMsRUFBRTs0QkFDTCxXQUFJLENBQUMsZUFBSSxDQUFDLENBQUM7NEJBQ1gsc0JBQU87eUJBQ1I7d0JBRW1CLHFCQUFNLG9CQUFhLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQXhELFdBQVcsR0FBRyxTQUEwQzt3QkFDOUQsc0JBQWUsQ0FBQyx1QkFBWSxFQUFFOzRCQUM1QixPQUFPLEVBQUUsT0FBTzs0QkFDaEIsR0FBRyxFQUFFLFdBQVcsQ0FBQyxTQUFTOzRCQUMxQixNQUFNLEVBQUUsVUFBVTt5QkFDbkIsQ0FBQyxDQUFDO3dCQUVHLEtBQTZELE1BQU0sQ0FBQyxLQUFLLEVBQXZFLE1BQU0sWUFBQSxFQUFXLFlBQVksYUFBQSxFQUFZLGFBQWEsY0FBQSxDQUFrQjt3QkFDMUUsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUM7d0JBRXRDLElBQUk7NEJBQ0YscUJBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7eUJBQ2xDO3dCQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUNWLE1BQU0sQ0FBQyxDQUFDO3lCQUNUO3dCQUVLLE1BQU0sR0FBZ0I7NEJBQzFCLE1BQU0sUUFBQTs0QkFDTixZQUFZLGNBQUE7NEJBQ1osYUFBYSxlQUFBOzRCQUNiLFdBQVcsRUFBRTtnQ0FDWCxTQUFTLEVBQUUsRUFBRTtnQ0FDYixXQUFXLEVBQUUsRUFBRTtnQ0FDZixlQUFlLEVBQUUsRUFBRTs2QkFDcEI7NEJBQ0QsV0FBVyxFQUFFLFlBQVksQ0FBQyxJQUFJOzRCQUM5QixZQUFZLEVBQUUsYUFBYSxDQUFDLElBQUk7eUJBQ2pDLENBQUM7d0JBRUksT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUV6RCxNQUFNLEdBQVk7NEJBQ3RCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSzt5QkFDcEIsQ0FBQzt3QkFFa0IscUJBQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQXpDLFdBQVcsR0FBRyxTQUEyQjt3QkFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBSSxXQUFXLHdCQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7d0JBQ25GLElBQUksV0FBVyxDQUFDLFlBQVksRUFBRTs0QkFDNUIsTUFBTSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO3lCQUNoRDs2QkFBTTs0QkFDTCxNQUFNLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7eUJBQ2xDO3dCQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7d0JBQ2pELHNCQUFPLE1BQU0sRUFBQzs7OztLQUNmO0lBakVpQjtRQUFqQixjQUFPLENBQUMsa0JBQU8sQ0FBQzs7eUNBQWlCO0lBa0VwQyxZQUFDO0NBQUEsQUFuRUQsSUFtRUM7a0JBbkVvQixLQUFLIn0=