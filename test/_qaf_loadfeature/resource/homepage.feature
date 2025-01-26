Feature: Playwright Home Page

  Scenario Outline: Check title
    Given I am on Playwright home page
    When I click link '<link>'
    Then I see in title '<title>'

    Examples:{'datafile':'testdata/testdata1.json'}
