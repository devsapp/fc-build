import Logs from '../src/index';

const INPUTS = {
  Properties: {},
  Credentials: {},
  Project: {
    ProjectName: 'build',
    Component: '',
    Provider: 'alibaba',
  },
  Command: 'logs',
  Args:
    '-s Thu Jan 28 2021 16:48:10 GMT+0800 -e Thu Jan 28 2021 17:48:10 GMT+0800 -r ab35f35a-4876-42a9-8924-18372abaff1d',
  Path: {
    ConfigPath: '',
  },
};

// @ts-ignore
describe('test/index.test.ts', () => {
  // @ts-ignore
  it('should 返回输入参数', async () => {});
});
