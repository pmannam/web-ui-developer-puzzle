# Code Smells

## Date Formatting

In the "book-search.component.html" file, replaced date formatting function with an Angular date pipe for consistent date formatting throughout the application.

## Form Validation

Added form validation to the book search field in the "book-search.component.html" and "book-search.component.ts" files. The search button is now disabled when the search field is empty.

## Test Case Descriptions

Updated incorrect test case descriptions in various files to provide meaningful and accurate descriptions related to their functionality.

## Function Renaming

In the "reading-list.reducer.ts" file, renamed functions to "confirmedAddToReadingList" and "confirmedRemoveFromReadingList" to reflect their responsibilities.

## Missing Book Information

Addressed issues where some book information (author name, publisher name, published date, and description) was missing by adding alternate messages in the "book-search.component.html" and "reading-list.component.html" files.

## Search Results Persistence

Fixed an issue in "book-search.component.html" where previous search results reappeared when the search term was cleared. Now, results are displayed based on the presence of the search term.

## Clear Button

Added a clear button in the "book-search.component.html" to reset the search field and call the "clearSearch" action.

## State Management

Enhanced the state management for adding books to the reading list by updating the "isAdded" property in the "index.ts"

# Accessibility Checks:
## Lighthouse 

    1. Corrected the absence of ARIA-LABEL for some buttons to ensure they have accessible names.

    2. Addressed the issue of insufficient contrast ratio between background and foreground colors.

    3. Enhanced the styling of button elements to improve keyboard navigation and usability.

## Manual

    1. Revamped the styling of the Reading List button in the navbar to enhance its focusability and user experience.

    2. Improved the hover styling of the 'Want to Read' button and adjusted the search example text color for better visibility.

    3. Transformed the "JavaScript" anchor tag into a button, added suitable styling, and made it keyboard focusable for accessibility.

    4. Added alt-text for book-covers images, labeling them as 'book cover' to prevent styling issues with long book titles.

    5. Made interactive controls keyboard focusable to accommodate users who rely on keyboards.

