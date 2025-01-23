import { QafDocumentUtil } from "./qafDocumentUtil";
import { Scenario } from "./scenario";
import { QafDocument } from "./qafDocument";
import * as Types from '@cucumber/messages';
import _ from "lodash";
import { GherkinDocumentUtil } from "./gherkinDocumentUtil";

export class LodashUtil {
    public static setTable(envelope:Types.Envelope,qafDocument: QafDocument): Types.Envelope{
        QafDocumentUtil.setTableHeaders(qafDocument.getScenarios());
        QafDocumentUtil.setTableBodys(qafDocument.getScenarios());
        let scenarios : Scenario[] = qafDocument.getScenarios();
        if(scenarios.length == 0){ return envelope; }
        let obj:Types.GherkinDocument = envelope.gherkinDocument as Types.GherkinDocument;
        const propertyName = 'feature.children';
        // Check if the object has the property and if the property is an array
        if (_.has(obj, propertyName) && _.isArray(obj['feature']?.['children'])) {
            // Filter out non-scenario nodes
            const filteredChildren = _.filter(obj['feature']['children'], 
                (child) => child.scenario !== undefined
            );
            // Iterate over the array and add a new property node to each element
            _.forEach(filteredChildren, (item,index) => {
                if(scenarios[index].getHasDP()){
                    // Add a new property node and set it to a new object
                    _.set(item, 'scenario.examples[0].tableHeader', qafDocument.getScenarios()[index].tableHeader);
                    _.set(item, 'scenario.examples[0].tableBody', qafDocument.getScenarios()[index].tableBody);
                }
            });
        }
        return envelope;
    }
    
    public static genEnvelopesWithPickles(envelope:Types.Envelope,qafDocument: QafDocument): Types.Envelope[]{
        let EnvelopesWithPickles: Types.Envelope[] = [];
        this.genPickles(envelope,qafDocument).forEach((pickle:Types.Pickle) => {
            EnvelopesWithPickles.push({
                pickle: pickle
            } as Types.Envelope)
        })
        return EnvelopesWithPickles;
    }

    public static genPickles(envelope:Types.Envelope,qafDocument: QafDocument): Types.Pickle[]{
        let pickles: Types.Pickle[] = [];
        //this.setTable(envelope,qafDocument);
        let obj:Types.GherkinDocument = envelope.gherkinDocument as Types.GherkinDocument;
        qafDocument.getScenarios().forEach((scenario:Scenario,index_s_of_qaf) => {
            if(scenario.getHasDP()){
                //loop through the scenarios and generate pickles
                // loop table body cells and one cell generate one pickle
                scenario.tableBody?.forEach((tableRow,index_tb) => {
                    let tbody_id: string = tableRow.id;
                    let uri: string = GherkinDocumentUtil.getUriFromGherkinDocument(obj),
                    name: string = scenario.getScenarioName(),
                    language: string = "en",
                    astNodeIdsForSteps: string[][] = [],
                    types: Types.PickleStepType[] = [], 
                    texts: string[] = [],
                    tagNames: string []= [], 
                    astNodeIds: string []= [],
                    ids: string[] = [],
                    stepArguments:Types.PickleStepArgument[] = [];
                    //filter backgrounds and scenarios
                    const filteredBackgrounds = _.filter(obj['feature']?.['children'], 
                        (child) => child.background !== undefined
                    );

                    _.forEach(filteredBackgrounds, (item,index_b) => {
                        //todo add step to pickle
                        let steps: readonly Types.Step[] = item?.['background']?.['steps'] || [];
                        _.forEach(steps, (step,index_s) => {
                            let astNodeIdsOfOneSteps_b: string[] =[];
                            
                            types.push(step.keywordType as unknown as Types.PickleStepType);
                            let changedText_b = this.replaceParamWithValue(step.text,scenario.getTestData()[index_tb]);
                            texts.push(changedText_b.result);
                            if(!changedText_b.changed){
                                astNodeIdsOfOneSteps_b = [step.id,tbody_id];
                            }else{
                                astNodeIdsOfOneSteps_b = [step.id,tbody_id];
                            }
                            astNodeIdsForSteps.push(astNodeIdsOfOneSteps_b);
                            //if step has argument, add it to stepArguments
                            //else add undefined
                            LodashUtil.addStepArguments(step, stepArguments);
                        })
                    });
                    const filteredScenarios = _.filter(obj['feature']?.['children'], 
                        (child) => child.scenario !== undefined
                    );
                    let scenario_id = filteredScenarios[index_s_of_qaf]?.['scenario']?.['id'] || "";
                    let steps: readonly Types.Step[] = filteredScenarios[index_s_of_qaf]?.['scenario']?.['steps'] || [];
                    ids = [ scenario_id , tbody_id ];
                    _.forEach(steps, (step,index_s) => {
                        let astNodeIdsOfOneSteps: string[] = [];
                        types.push(step.keywordType as unknown as Types.PickleStepType);
                        let changedText = this.replaceParamWithValue(step.text,scenario.getTestData()[index_tb]);
                        texts.push(changedText.result);
                        if(!changedText.changed){
                            astNodeIdsOfOneSteps = [step.id,tbody_id];
                        }else{
                            astNodeIdsOfOneSteps = [step.id,tbody_id];
                        }
                        astNodeIdsForSteps.push(astNodeIdsOfOneSteps);
                        //if step has argument, add it to stepArguments
                        //else add undefined
                        LodashUtil.addStepArguments(step, stepArguments);
                    });
                    // add tags of feature and scenario
                    _.forEach(obj['feature']?.['tags'],(item_tag_f,index_t) => {
                        tagNames.push(item_tag_f.name);
                        astNodeIds.push(item_tag_f.id);
                    });
                    // add tags of scenario
                    _.forEach(filteredScenarios[index_s_of_qaf]?.['scenario']?.['tags'],(item_tag_s,index_t) => {
                        tagNames.push(item_tag_s.name);
                        astNodeIds.push(item_tag_s.id);
                    });
                    pickles.push(GherkinDocumentUtil.genPickle(uri,name,language,astNodeIdsForSteps,types,texts,tagNames,astNodeIds,ids,stepArguments));
                })
            }
        })
        return pickles;
    }

    public static genTableAndPickles(envelope:Types.Envelope,qafDocument: QafDocument): Types.Pickle[]{
        let pickles: Types.Pickle[] = [];
        this.setTable(envelope,qafDocument);
        let obj:Types.GherkinDocument = envelope.gherkinDocument as Types.GherkinDocument;
        qafDocument.getScenarios().forEach((scenario:Scenario,index_s_of_qaf) => {
            if(scenario.getHasDP()){
                //loop through the scenarios and generate pickles
                // loop table body cells and one cell generate one pickle
                scenario.tableBody?.forEach((tableRow,index_tb) => {
                    let tbody_id: string = tableRow.id;
                    let uri: string = GherkinDocumentUtil.getUriFromGherkinDocument(obj),
                    name: string = scenario.getScenarioName(),
                    language: string = "en",
                    astNodeIdsForSteps: string[][] = [],
                    types: Types.PickleStepType[] = [], 
                    texts: string[] = [],
                    tagNames: string []= [], 
                    astNodeIds: string []= [],
                    ids: string[] = [],
                    stepArguments:Types.PickleStepArgument[] = [];
                    //filter backgrounds and scenarios
                    const filteredBackgrounds = _.filter(obj['feature']?.['children'], 
                        (child) => child.background !== undefined
                    );

                    _.forEach(filteredBackgrounds, (item,index_b) => {
                        //todo add step to pickle
                        let steps: readonly Types.Step[] = item?.['background']?.['steps'] || [];
                        _.forEach(steps, (step,index_s) => {
                            let astNodeIdsOfOneSteps_b: string[] =[];
                            
                            types.push(step.keywordType as unknown as Types.PickleStepType);
                            let changedText_b = this.replaceParamWithValue(step.text,scenario.getTestData()[index_tb]);
                            texts.push(changedText_b.result);
                            if(!changedText_b.changed){
                                astNodeIdsOfOneSteps_b = [step.id,tbody_id];
                            }else{
                                astNodeIdsOfOneSteps_b = [step.id,tbody_id];
                            }
                            astNodeIdsForSteps.push(astNodeIdsOfOneSteps_b);
                            //if step has argument, add it to stepArguments
                            //else add undefined
                            LodashUtil.addStepArguments(step, stepArguments);
                        })
                    });
                    const filteredScenarios = _.filter(obj['feature']?.['children'], 
                        (child) => child.scenario !== undefined
                    );
                    let scenario_id = filteredScenarios[index_s_of_qaf]?.['scenario']?.['id'] || "";
                    let steps: readonly Types.Step[] = filteredScenarios[index_s_of_qaf]?.['scenario']?.['steps'] || [];
                    ids = [ scenario_id , tbody_id ];
                    _.forEach(steps, (step,index_s) => {
                        let astNodeIdsOfOneSteps: string[] = [];
                        types.push(step.keywordType as unknown as Types.PickleStepType);
                        let changedText = this.replaceParamWithValue(step.text,scenario.getTestData()[index_tb]);
                        texts.push(changedText.result);
                        if(!changedText.changed){
                            astNodeIdsOfOneSteps = [step.id,tbody_id];
                        }else{
                            astNodeIdsOfOneSteps = [step.id,tbody_id];
                        }
                        astNodeIdsForSteps.push(astNodeIdsOfOneSteps);
                        //if step has argument, add it to stepArguments
                        //else add undefined
                        LodashUtil.addStepArguments(step, stepArguments);
                    });
                    // add tags of feature and scenario
                    _.forEach(obj['feature']?.['tags'],(item_tag_f,index_t) => {
                        tagNames.push(item_tag_f.name);
                        astNodeIds.push(item_tag_f.id);
                    });
                    // add tags of scenario
                    _.forEach(filteredScenarios[index_s_of_qaf]?.['scenario']?.['tags'],(item_tag_s,index_t) => {
                        tagNames.push(item_tag_s.name);
                        astNodeIds.push(item_tag_s.id);
                    });
                    pickles.push(GherkinDocumentUtil.genPickle(uri,name,language,astNodeIdsForSteps,types,texts,tagNames,astNodeIds,ids,stepArguments));
                })
            }
        })
        return pickles;
    }
    
    private static addStepArguments(step: Types.Step, stepArguments: Types.PickleStepArgument[]) {
        let stepArgument: any = "";
        if (step.dataTable) {
            stepArgument = this.convertDatatabletoPickleTable(step.dataTable);
        } else {
            stepArgument = undefined;
        }
        stepArguments.push(stepArgument);
    }

    public static replaceParamWithValue(original: string,values: any[]): {result:string,changed:boolean} {
        let changed = false;
        let matches = original.match(/<([^>]+)>/g) || [];
        if (matches.length > 0) {
            changed = true;
            for(let i = 0;i < matches.length; i++) {
                let key = this.convertParam(matches[i]);
                let value = values[0][`${key}`];
                if (value) {
                    original = original.replace(`<${key}>`, value);
                }
            }
        }
        return{result:original,changed:changed} ;
    }
    
    public static convertParam(currLine: string): string {
        return currLine.replace(/>/g, '').replace(/</g, '');
    }

    public static convertDatatabletoPickleTable(dataTable: Types.DataTable): Types.PickleStepArgument {
        let temprows:Types.PickleTableRow[] = []
        _.forEach(dataTable.rows, (row) => {
            let newCells:Types.PickleTableCell[] = [];
            _.forEach(row.cells, (cell) => {
                let newCell = _.omit(cell, 'location');
                newCells.push(newCell);
            })
            temprows.push({
                cells: newCells,
            });
        });
        let pickleTable: Types.PickleStepArgument = {
            dataTable: {
                rows: temprows,
            }
            
        };
        return pickleTable;
    }

}
