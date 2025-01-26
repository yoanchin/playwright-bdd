    Scenario: Search InfoStrech with results
        When I search for "QAFWebElement"
        Then it should have following search results:
            | QMetry Automation Framework |
            | Custom & component          |