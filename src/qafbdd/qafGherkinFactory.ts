import { GherkinFileParser } from "./gherkinFileParser";

export class QafGherkinFactory {
    public static getParser(): GherkinFileParser {
        return new GherkinFileParser();
    }
}