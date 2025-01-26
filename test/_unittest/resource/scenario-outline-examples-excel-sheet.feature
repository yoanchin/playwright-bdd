    Scenario Outline: Search Keyword
        When I search for "<searchKey>"
        Then I get at least <number> results
        Then it should have "<searchResult>" in search results

        Examples:{'datafile':'test/_unittest/testdata/testdata.xlsx','sheetName':'DataTable3'}