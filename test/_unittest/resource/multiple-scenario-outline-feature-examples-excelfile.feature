@spacex_test1
Feature: Google Search

  @spacex_test1_datadriver
  Scenario Outline: Search Keyword using data from file
    When I search for "<searchKey>"
    Then I get at least <number> results
    Then it should have "<searchResult>" in search results

    Examples:{'datafile':'resources/testdata.xls',"sheetName":"B1",'key':'propose'}

  @spacex_test2_datadriver
  Scenario Outline: Search Keyword using data from file2
    When I search2 for "<searchKey>"
    Then I get2 at least <number> results
    Then it should2 have "<searchResult>" in search results

    Examples:{'datafile':'resources/testdata2.xls',"sheetName":"B2",'key':'propose2'}

  @spacex_test3_datadriver
  Scenario Outline: Search Keyword using data from file3
    When I search3 for "<searchKey>"
    Then I get3 at least <number> results
    Then it should3 have "<searchResult>" in search results

    Examples:{'datafile':'resources/testdata3.xls',"sheetName":"B3",'key':'propose3'}

  @spacex_test4_datadriver
  Scenario Outline: Search Keyword using data from file4
    When I search4 for "<searchKey>"
    Then I get4 at least <number> results
    Then it should4 have "<searchResult>" in search results

    Examples:{'datafile':'resources/testdata4.json'}