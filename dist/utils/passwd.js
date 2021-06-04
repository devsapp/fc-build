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
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var passwdContent = "\nroot:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nsync:x:4:65534:sync:/bin:/bin/sync\ngames:x:5:60:games:/usr/games:/usr/sbin/nologin\nman:x:6:12:man:/var/cache/man:/usr/sbin/nologin\nlp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin\nmail:x:8:8:mail:/var/mail:/usr/sbin/nologin\nnews:x:9:9:news:/var/spool/news:/usr/sbin/nologin\nuucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin\nproxy:x:13:13:proxy:/bin:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nbackup:x:34:34:backup:/var/backups:/usr/sbin/nologin\nlist:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin\nirc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin\ngnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin\nsystemd-timesync:x:100:103:systemd Time Synchronization,,,:/run/systemd:/bin/false\nsystemd-network:x:101:104:systemd Network Management,,,:/run/systemd/netif:/bin/false\nsystemd-resolve:x:102:105:systemd Resolver,,,:/run/systemd/resolve:/bin/false\nsystemd-bus-proxy:x:103:106:systemd Bus Proxy,,,:/run/systemd:/bin/false\nmessagebus:x:104:108::/var/run/dbus:/bin/false\n";
function generatePwdFile(uid, gid) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!uid) {
                        uid = process.getuid();
                    }
                    if (!gid) {
                        gid = process.getgid();
                    }
                    filePath = path_1.default.join('/', 'tmp', "fun_" + uid + "_" + gid + "_passwd");
                    return [4 /*yield*/, fs_extra_1.default.pathExists(filePath)];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 3];
                    content = passwdContent + "funcrafter:x:" + uid + ":" + gid + "::/tmp:/usr/sbin/nologin";
                    return [4 /*yield*/, fs_extra_1.default.writeFile(filePath, content)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, filePath];
            }
        });
    });
}
exports.default = generatePwdFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFzc3dkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3Bhc3N3ZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNEQUEwQjtBQUMxQiw4Q0FBd0I7QUFFeEIsSUFBTSxhQUFhLEdBQUcsdXZDQXdCckIsQ0FBQztBQUVGLFNBQThCLGVBQWUsQ0FBQyxHQUFZLEVBQUUsR0FBWTs7Ozs7O29CQUN0RSxJQUFJLENBQUMsR0FBRyxFQUFFO3dCQUNSLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7cUJBQ3hCO29CQUNELElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ1IsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztxQkFDeEI7b0JBRUssUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxTQUFPLEdBQUcsU0FBSSxHQUFHLFlBQVMsQ0FBQyxDQUFDO29CQUU3RCxxQkFBTSxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBQTs7eUJBQS9CLENBQUMsQ0FBQyxTQUE2QixDQUFDLEVBQWhDLHdCQUFnQztvQkFDNUIsT0FBTyxHQUFNLGFBQWEscUJBQWlCLEdBQUcsU0FBSSxHQUFHLDZCQUEwQixDQUFDO29CQUN0RixxQkFBTSxrQkFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLEVBQUE7O29CQUFyQyxTQUFxQyxDQUFDOzt3QkFHeEMsc0JBQU8sUUFBUSxFQUFDOzs7O0NBQ2pCO0FBaEJELGtDQWdCQyJ9