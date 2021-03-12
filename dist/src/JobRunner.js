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
Object.defineProperty(exports, "__esModule", { value: true });
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cron = require('node-cron');
class JobRunner {
    runCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout, stderr } = yield exec(command);
                console.log('stdout:', stdout);
                console.log('stderr:', stderr);
                return { stdout, stderr };
            }
            catch (err) {
                console.error(err);
            }
        });
    }
    jobRestartPm2() {
        return __awaiter(this, void 0, void 0, function* () {
            const command = "/home/goku/.nvm/versions/node/v12.20.0/bin/pm2 restart all";
            return yield this.runCommand(command);
        });
    }
    runJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            cron.schedule('0 */2 * * *', () => __awaiter(this, void 0, void 0, function* () {
                console.log("running job restart pm2 every two hours");
                const result = yield this.jobRestartPm2();
                console.log(result);
            }));
        });
    }
}
exports.JobRunner = JobRunner;
//# sourceMappingURL=JobRunner.js.map