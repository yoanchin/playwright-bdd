Feature: scenario-outline

 Background:
  Given I am on Google Search Page
  And I have valid search keyword
  And I set testCaseId as "<TDID>"

 Scenario Outline: Search Keyword
  When I search for "<searchKey>"
  Then I get at least <number> results
  Then it should have "<searchResult>" in search results

  Examples:{'datafile':'testdata/testdata.xlsx','sheetName':'DataTable2','key':'Data4'}