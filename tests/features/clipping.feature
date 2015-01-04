Feature: Web Clipper

  Scenario: User clips webpage
    When I navigate to a webpage
    And I use the extension to save
    Then the page should be saved to my canvas
