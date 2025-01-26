Feature: scenario-outline

  Background:
    Given I am on Playwright home page
    When I click link "<link>"
    Then I see in title "<title>"
    Then Test DataTable
    |brow1_value1|brow1_value2|brow1_value3|brow1_value4|brow1_value5|
    |brow2_value1|brow2_value2|brow2_value3|brow2_value4|brow2_value5|
    Then Test DataTable
    |brow3_value1|brow3_value2|brow3_value3|brow3_value4|brow3_value5|
    |brow4_value1|brow4_value2|brow4_value3|brow4_value4|brow4_value5|

  Scenario Outline: Check doubled
    Given I am on Playwright home page
    When I click link "<link>"
    Then I see in title "<title>"
    Then Test DataTable
    |row1_value1|row1_value2|row1_value3|row1_value4|row1_value5|
    |row2_value1|row2_value2|row2_value3|row2_value4|row2_value5|
    Then Test DataTable
    |row3_value1|row3_value2|row3_value3|row3_value4|row3_value5|
    |row4_value1|row4_value2|row4_value3|row4_value4|row4_value5|

    Examples:{'datafile':'testdata/testdata.xlsx','sheetName':'integration_DataTable2'}