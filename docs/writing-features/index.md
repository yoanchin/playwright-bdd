# Writing features
Write features in `*.feature` files using [Gherkin syntax](https://cucumber.io/docs/gherkin/reference/#keywords). All keywords are supported.

Example `sample.feature`:

```gherkin
@desktop
Feature: Playwright site

    @jira:123
    Scenario: Check title
        Given I open url "https://playwright.dev"
        When I click link "Get started"
        Then I see in title "Playwright"
```

Tags allow running a subset of tests using the `--tags` option with [tags expression](https://cucumber.io/docs/cucumber/api/?lang=javascript#tag-expressions):
```
npx bddgen --tags "@desktop and not @slow" && npx playwright test
```

?> Since Playwright **1.42** Gherkin tags are mapped to [Playwright tags](https://playwright.dev/docs/test-annotations#tag-tests)

You can also [access tags inside step definitions](writing-steps/bdd-fixtures.md#tags).

