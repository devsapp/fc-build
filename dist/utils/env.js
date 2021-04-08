"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDebugEnv = exports.addEnv = void 0;
var core_1 = require("@serverless-devs/core");
var constant_1 = require("./constant");
var ip_1 = __importDefault(require("ip"));
var lodash_1 = __importDefault(require("lodash"));
var IDE_PYCHARM = 'pycharm';
var sysLibs = [
    '/usr/local/lib',
    '/usr/lib',
    '/usr/lib/x86_64-linux-gnu',
    '/usr/lib64',
    '/lib',
    '/lib/x86_64-linux-gnu',
    '/python/lib/python2.7/site-packages',
    '/python/lib/python3.6/site-packages',
];
var sysPaths = ['/usr/local/bin', '/usr/local/sbin', '/usr/bin', '/usr/sbin', '/sbin', '/bin'];
var fcPaths = ['/code', '/code/node_modules/.bin'];
var fcLibs = ['/code', '/code/lib', '/usr/local/lib'];
var modulePaths = ['/python/bin', '/node_modules/.bin'];
function duplicateRemoval(str) {
    var spliceValue = str.split(':');
    return lodash_1.default.union(spliceValue).join(':');
}
function generateLibPath(envs, prefix) {
    var libPath = lodash_1.default.union(sysLibs.map(function (p) { return prefix + "/root" + p; }), fcLibs).join(':');
    if (envs.LD_LIBRARY_PATH) {
        libPath = envs.LD_LIBRARY_PATH + ":" + libPath;
    }
    return duplicateRemoval(libPath);
}
function generatePath(envs, prefix) {
    var path = lodash_1.default.union(sysPaths.map(function (p) { return prefix + "/root" + p; }), fcPaths, modulePaths.map(function (p) { return "" + prefix + p; }), sysPaths).join(':');
    if (envs.PATH) {
        path = envs.PATH + ":" + path;
    }
    return duplicateRemoval(path);
}
function generateNodePaths(envs, prefix) {
    var defaultPath = '/usr/local/lib/node_modules';
    var customPath = prefix + "/node_modules";
    var path;
    if (envs.NODE_PATH) {
        path = envs.NODE_PATH + ":" + customPath + ":" + defaultPath;
    }
    else {
        path = customPath + ":" + defaultPath;
    }
    return duplicateRemoval(path);
}
function addEnv(envVars) {
    var envs = Object.assign({}, envVars);
    var prefix = '/code/.s';
    envs.LD_LIBRARY_PATH = generateLibPath(envs, prefix);
    envs.PATH = generatePath(envs, prefix);
    envs.NODE_PATH = generateNodePaths(envs, '/code');
    var defaultPythonPath = prefix + "/python";
    if (!envs.PYTHONUSERBASE) {
        envs.PYTHONUSERBASE = defaultPythonPath;
    }
    return envs;
}
exports.addEnv = addEnv;
function generateDebugEnv(runtime, debugPort, debugIde) {
    var remoteIp = ip_1.default.address();
    switch (runtime) {
        case 'nodejs12':
        case 'nodejs10':
        case 'nodejs8':
            return { DEBUG_OPTIONS: "--inspect-brk=0.0.0.0:" + debugPort };
        case 'nodejs6':
            return { DEBUG_OPTIONS: "--debug-brk=" + debugPort };
        case 'python2.7':
        case 'python3':
            if (debugIde === IDE_PYCHARM) {
                return {};
            }
            return { DEBUG_OPTIONS: "-m ptvsd --host 0.0.0.0 --port " + debugPort + " --wait" };
        case 'java8':
            return {
                DEBUG_OPTIONS: "-agentlib:jdwp=transport=dt_socket,server=y,suspend=y,quiet=y,address=" + debugPort,
            };
        case 'php7.2':
            core_1.Logger.info(constant_1.CONTEXT, "using remote_ip " + remoteIp);
            return {
                XDEBUG_CONFIG: "remote_enable=1 remote_autostart=1 remote_port=" + debugPort + " remote_host=" + remoteIp,
            };
        case 'dotnetcore2.1':
            return { DEBUG_OPTIONS: 'true' };
        default:
            core_1.report('could not found runtime.', {
                type: 'error',
                context: constant_1.CONTEXT,
            });
            throw new Error('could not found runtime.');
    }
}
exports.generateDebugEnv = generateDebugEnv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2Vudi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4Q0FBdUQ7QUFDdkQsdUNBQXFDO0FBQ3JDLDBDQUFvQjtBQUNwQixrREFBdUI7QUFHdkIsSUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDO0FBQzlCLElBQU0sT0FBTyxHQUFHO0lBQ2QsZ0JBQWdCO0lBQ2hCLFVBQVU7SUFDViwyQkFBMkI7SUFDM0IsWUFBWTtJQUNaLE1BQU07SUFDTix1QkFBdUI7SUFDdkIscUNBQXFDO0lBQ3JDLHFDQUFxQztDQUN0QyxDQUFDO0FBQ0YsSUFBTSxRQUFRLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNqRyxJQUFNLE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3JELElBQU0sTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3hELElBQU0sV0FBVyxHQUFHLENBQUMsYUFBYSxFQUFFLG9CQUFvQixDQUFDLENBQUM7QUFFMUQsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFXO0lBQ25DLElBQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsT0FBTyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFDLElBQWEsRUFBRSxNQUFjO0lBQ3BELElBQUksT0FBTyxHQUFHLGdCQUFDLENBQUMsS0FBSyxDQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUcsTUFBTSxhQUFRLENBQUcsRUFBcEIsQ0FBb0IsQ0FBQyxF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