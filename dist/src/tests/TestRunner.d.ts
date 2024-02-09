type Transformer = (code: string, filename: string) => Promise<string | false> | (string | false);
/**
 * Looks in a fixtures dir for .ts files, transforms them according to the
 * passed transformer, and compares the output to the expected output in the
 * `.expected` file.
 */
export default class TestRunner {
    _write: boolean;
    _fixturesDir: string;
    _testFixtures: string[];
    _otherFiles: Set<string>;
    _skip: Set<string>;
    _failureCount: number;
    _transformer: Transformer;
    constructor(fixturesDir: string, write: boolean, filter: string | null, testFilePattern: RegExp, ignoreFilePattern: RegExp | null, transformer: Transformer);
    run(): Promise<boolean>;
    _testFixture(fixture: string): Promise<void>;
    transform(code: string, filename: string): Promise<string | false>;
}
export {};
