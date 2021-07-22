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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRuntimeToDockerImage = void 0;
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
    java11: 'java11',
    'php7.2': 'php7.2',
    'dotnetcore2.1': 'dotnetcore2.1',
    custom: 'custom',
};
function resolveRuntimeToDockerImage(runtime) {
    return __awaiter(this, void 0, void 0, function () {
        var name_1, imageName, errorMessage;
        return __generator(this, function (_a) {
            if (runtimeImageMap[runtime]) {
                name_1 = runtimeImageMap[runtime];
                imageName = DEFAULT_REGISTRY + "/aliyunfc/runtime-" + name_1 + ":build-" + IMAGE_VERSION;
                return [2 /*return*/, imageName];
            }
            errorMessage = "resolveRuntimeToDockerImage: invalid runtime name " + runtime + ". Supported list: " + Object.keys(runtimeImageMap);
            throw new Error(errorMessage);
        });
    });
}
exports.resolveRuntimeToDockerImage = resolveRuntimeToDockerImage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWltYWdlLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZ2V0LWltYWdlLW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFFbEMsSUFBQSxpQkFBaUIsR0FBSyxPQUFPLENBQUMsR0FBRyxrQkFBaEIsQ0FBaUI7QUFDMUMsSUFBTSxhQUFhLEdBQUcsaUJBQWlCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7QUFDL0UsSUFBTSxnQkFBZ0IsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsZ0JBQWdCLElBQUkseUJBQXlCLENBQUM7QUFDeEYsSUFBTSxlQUFlLEdBQUc7SUFDdEIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsT0FBTyxFQUFFLFNBQVM7SUFDbEIsUUFBUSxFQUFFLFVBQVU7SUFDcEIsUUFBUSxFQUFFLFVBQVU7SUFDcEIsV0FBVyxFQUFFLFdBQVc7SUFDeEIsT0FBTyxFQUFFLFdBQVc7SUFDcEIsS0FBSyxFQUFFLE9BQU87SUFDZCxNQUFNLEVBQUUsUUFBUTtJQUNoQixRQUFRLEVBQUUsUUFBUTtJQUNsQixlQUFlLEVBQUUsZUFBZTtJQUNoQyxNQUFNLEVBQUUsUUFBUTtDQUNqQixDQUFDO0FBRUYsU0FBc0IsMkJBQTJCLENBQUMsT0FBZTs7OztZQUMvRCxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDdEIsU0FBTyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLFNBQVMsR0FBTSxnQkFBZ0IsMEJBQXFCLE1BQUksZUFBVSxhQUFlLENBQUM7Z0JBQ3hGLHNCQUFPLFNBQVMsRUFBQzthQUNsQjtZQUNLLFlBQVksR0FBRyx1REFBcUQsT0FBTywwQkFBcUIsTUFBTSxDQUFDLElBQUksQ0FDL0csZUFBZSxDQUNkLENBQUM7WUFFSixNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7Q0FDL0I7QUFYRCxrRUFXQyJ9