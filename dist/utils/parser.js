"use strict";
/* eslint-disable no-await-in-loop */
// const dockerOpts = require('../docker-opts');
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
exports.funfileToDockerfile = void 0;
var lodash_1 = __importDefault(require("lodash"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var dockerfile_ast_1 = require("dockerfile-ast");
var logger_1 = __importDefault(require("../common/logger"));
var get_image_name_1 = require("./get-image-name");
var RESERVED_DOCKER_CMD = [
    'FROM', 'Add', 'ONBUILD',
    'ARG', 'CMD', 'ENTRYPOINT',
    'VOLUME', 'STOPSIGNAL'
];
function funfileToDockerfile(funfilePath, runtime, serviceName, functionName) {
    return __awaiter(this, void 0, void 0, function () {
        var content, funfile, dockerfile, _i, _a, instruction, ins, runtimeArgs, runtimeOfFunfile, imageName, range;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fs_extra_1.default.readFile(funfilePath, 'utf8')];
                case 1:
                    content = _b.sent();
                    funfile = dockerfile_ast_1.DockerfileParser.parse(content);
                    dockerfile = [];
                    _i = 0, _a = funfile.getInstructions();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    instruction = _a[_i];
                    ins = instruction.getInstruction();
                    if (lodash_1.default.includes(RESERVED_DOCKER_CMD, ins)) {
                        throw new Error("Currently, Funfile does not support the semantics of '" + ins + "'. \nIf you have a requirement, you can submit the issue at https://github.com/devsapp/fc/issues.");
                    }
                    if (!(ins.toUpperCase() === 'RUNTIME')) return [3 /*break*/, 4];
                    runtimeArgs = instruction.getArguments();
                    if (runtimeArgs.length !== 1) {
                        throw new Error('invalid RUNTIME for Funfile');
                    }
                    runtimeOfFunfile = runtimeArgs[0].getValue();
                    if (runtimeOfFunfile !== runtime) {
                        logger_1.default.warning("\nDetectionWarning: The 'runtime' of '" + serviceName + "/" + functionName + "' in your yml is inconsistent with that in Funfile.");
                    }
                    return [4 /*yield*/, get_image_name_1.resolveRuntimeToDockerImage(runtimeOfFunfile)];
                case 3:
                    imageName = _b.sent();
                    dockerfile.push('FROM ' + imageName + (" as " + runtimeOfFunfile));
                    return [3 /*break*/, 5];
                case 4:
                    range = instruction.getRange();
                    // @ts-ignore: .
                    dockerfile.push(instruction.getRangeContent(range));
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, dockerfile.join('\n')];
            }
        });
    });
}
exports.funfileToDockerfile = funfileToDockerfile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3BhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEscUNBQXFDO0FBQ3JDLGdEQUFnRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWhELGtEQUF1QjtBQUN2QixzREFBMEI7QUFDMUIsaURBQWtEO0FBQ2xELDREQUFzQztBQUN0QyxtREFBK0Q7QUFFL0QsSUFBTSxtQkFBbUIsR0FBRztJQUMxQixNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVM7SUFDeEIsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZO0lBQzFCLFFBQVEsRUFBRSxZQUFZO0NBQUMsQ0FBQztBQUUxQixTQUFzQixtQkFBbUIsQ0FBQyxXQUFtQixFQUFFLE9BQWUsRUFBRSxXQUFtQixFQUFFLFlBQW9COzs7Ozt3QkFDdkcscUJBQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxFQUFBOztvQkFBaEQsT0FBTyxHQUFHLFNBQXNDO29CQUVoRCxPQUFPLEdBQUcsaUNBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUUxQyxVQUFVLEdBQUcsRUFBRSxDQUFDOzBCQUU2QixFQUF6QixLQUFBLE9BQU8sQ0FBQyxlQUFlLEVBQUU7Ozt5QkFBekIsQ0FBQSxjQUF5QixDQUFBO29CQUF4QyxXQUFXO29CQUNkLEdBQUcsR0FBRyxXQUFXLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBRXpDLElBQUksZ0JBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLEVBQUU7d0JBQ3hDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQXlELEdBQUcsc0dBQ1csQ0FBQyxDQUFDO3FCQUMxRjt5QkFFRyxDQUFBLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxTQUFTLENBQUEsRUFBL0Isd0JBQStCO29CQUMzQixXQUFXLEdBQUcsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUUvQyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO3dCQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7cUJBQ2hEO29CQUVLLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFFbkQsSUFBSSxnQkFBZ0IsS0FBSyxPQUFPLEVBQUU7d0JBQ2hDLGdCQUFNLENBQUMsT0FBTyxDQUFDLDJDQUF5QyxXQUFXLFNBQUksWUFBWSx3REFBcUQsQ0FBQyxDQUFDO3FCQUMzSTtvQkFFaUIscUJBQU0sNENBQTJCLENBQUMsZ0JBQWdCLENBQUMsRUFBQTs7b0JBQS9ELFNBQVMsR0FBRyxTQUFtRDtvQkFDckUsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxJQUFHLFNBQU8sZ0JBQWtCLENBQUEsQ0FBQyxDQUFDOzs7b0JBRTNELEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3JDLGdCQUFnQjtvQkFDaEIsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztvQkExQjlCLElBQXlCLENBQUE7O3dCQThCbkQsc0JBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQzs7OztDQUM5QjtBQXRDRCxrREFzQ0MifQ==