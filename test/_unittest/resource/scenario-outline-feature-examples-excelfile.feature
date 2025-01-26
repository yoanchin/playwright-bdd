@spacex_test1
Feature: Google Search

  @spacex_test1_datadriver
  Scenario Outline: Search Keyword using data from file
    When I search for "<searchKey>"
    Then I get at least <number> results
    Then it should have "<searchResult>" in search results

    Examples:{'datafile':'resources/testdata.xls',"sheetName":"B1",'key':'propose'}