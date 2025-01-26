import assert from "node:assert";
import { describe, it } from "node:test";
import { GherkinDocumentUtil } from "../../src/qafbdd/gherkinDocumentUtil";
import { IdGenerator } from '@cucumber/messages';
import * as Types from '@cucumber/messages/';
function isValidUUID(uuid: string): boolean {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

describe('GherkinDocument Util', function() {
    it('should get new uuid', function() {
        let uuidArray:string[] = [];
        let newUuid1:string = IdGenerator.uuid()();
        uuidArray.push(newUuid1);
        let newUuid2:string = IdGenerator.uuid()();
        uuidArray.push(newUuid2);
        let newUuid3:string = IdGenerator.uuid()();
        uuidArray.push(newUuid3);
        assert.equal(uuidArray.length, 3);
        assert.ok(isValidUUID(newUuid1));
        assert.ok(isValidUUID(newUuid2));
        assert.ok(isValidUUID(newUuid3));
    });

    it('should gen location by line number', function() {
        let location: Types.Location = GherkinDocumentUtil.genLocation(1);
        assert.equal(location.line, 1);

        let location1: Types.Location = GherkinDocumentUtil.genLocation(100);
        assert.equal(location1.line, 100);
    });

    it('should gen tabel cell by line number and value', function() {
        let tableCell: Types.TableCell = GherkinDocumentUtil.genTableCell("value1",1);
        assert.equal(tableCell.location.line, 1);
        assert.equal(tableCell.value, "value1");

        let tableCell2: Types.TableCell = GherkinDocumentUtil.genTableCell("value2",100);
        assert.equal(tableCell2.location.line, 100);
        assert.equal(tableCell2.value, "value2");
    });

    it('should gen table cells by line number and value', function() {
        let tableCells: Types.TableCell[] = GherkinDocumentUtil.genTableCells(["value1","value2"],[1,100]);
        assert.equal(tableCells[0].location.line, 1);
        assert.equal(tableCells[0].value, "value1");
        assert.equal(tableCells[1].location.line, 100);
        assert.equal(tableCells[1].value, "value2");
    });

    it('should gen table header by line number and value', function() {
        let tableRow: Types.TableRow = GherkinDocumentUtil.genTableHeader(["value1","value2"],[1,100],1);
        assert.equal(tableRow.location.line, 1);
        assert.equal(tableRow.cells[0].location.line, 1);
        assert.equal(tableRow.cells[0].value, "value1");
        assert.equal(tableRow.cells[1].location.line, 100);
        assert.equal(tableRow.cells[1].value, "value2");
        assert.ok(isValidUUID(tableRow.id));
    });

    it('should gen table body by line number and value', function() {
        let tableBody: Types.TableRow[] = GherkinDocumentUtil.genTableBody([["value1","value2"],["value3","value4"]],[[1,100],[2,200]],[1,2]);
        assert.equal(tableBody.length, 2);
        assert.equal(tableBody[0].location.line, 1);
        assert.equal(tableBody[0].cells[0].value, "value1");
        assert.equal(tableBody[0].cells[0].location.line, 1);
        assert.equal(tableBody[0].cells[1].value, "value2");
        assert.equal(tableBody[0].cells[1].location.line, 100);
        assert.equal(tableBody[1].location.line, 2);
        assert.equal(tableBody[1].cells[0].value, "value3");
        assert.equal(tableBody[1].cells[0].location.line, 2);
        assert.equal(tableBody[1].cells[1].value, "value4");
        assert.equal(tableBody[1].cells[1].location.line, 200);
        assert.ok(isValidUUID(tableBody[0].id));
        assert.ok(isValidUUID(tableBody[1].id));
    });
    
  });