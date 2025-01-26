Feature: scenario-outline

  Scenario Outline: Check doubled
    Given State <start>
    Then Doubled <start> equals <end>

    Examples:{'datafile':'testdata/testdata.xlsx','sheetName':'integration_DataTable2'}