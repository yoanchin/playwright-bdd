Feature: scenario-outline

  Background:
    Given TestCase '<testCase>'

  Scenario Outline: Check doubled1
    Given State <start>
    Then Doubled <start> equals <end>

    Examples:{'datafile':'testdata/testdata.xlsx','sheetName':'integration_DataTable1','key':'Data'}