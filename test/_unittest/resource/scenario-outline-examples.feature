    Scenario Outline: Search Keyword
        When I search for "<searchKey>"
        Then I get at least <number> results
        Then it should have "<searchResult>" in search results

        Examples:
            | searchKey     | searchResult                          | number |
            | QMetry QAF    | QMetry Automation Framework           | 10     |
            | Selenium ISFW | Infostretch Test Automation Framework | 20     |