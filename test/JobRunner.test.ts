
import {JobRunner} from "../src/JobRunner";

describe('jobrunner', function () {
    it('jobrunner works', async  function () {
        const runner = new JobRunner()
        const result = await runner.jobRestartPm2()
        expect(result).toBeDefined()
    });
    
    it('jobrunner does cron', async  function () {
        const runner = new JobRunner()
        const result = await runner.runJobs()
    });
});
