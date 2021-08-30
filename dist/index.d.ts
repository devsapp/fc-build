import { IInputs } from './interface';
interface IOutput {
    props: any;
    image?: string;
    buildSaveUri?: string;
}
export default class Build {
    build(inputs: IInputs): Promise<IOutput>;
}
export {};
