# Styling Guide

These are the main ideas for the new styling approach in this project. The main goal is to separate the styling concerns from the components logic, in order to make the components logic cleaner and more readable. It's still a work in progress but the intention is to have a simplified styling system that is easier to maintain and scale.

## Directory Structure

-   **mixins/**: Contains reusable style patterns and utilities which we would like to be able to use in the components when identitifying common repetitive patterns in our components styling.

    -   `layout.ts`: Flex and grid layout utilities.
    -   `typography.ts`: Text styling utilities.
    -   `helpers.ts`: General styling helpers (e.g., visibility, positioning).

-   **utilities/**: Contains utility functions for styling.

    -   `styleUtils.ts`: Functions like `applyConditionalStyles` for conditional styling logic.

-   **theme/**: Contains theme definitions and types.
    -   `themes.ts`: Theme configurations. Currently only light theme is defined but we can add more if needed.

## Styling Patterns

### 1. **Theme-Driven Design**

Our goal is to have styles driven by a central theme, ensuring consistency across the application. The theme should provide tokens for colors, typography, spacing, and more.

### 2. **CSS-in-JS with Emotion**

We use Emotion's `css` function to define styles. This allows us to write CSS in JavaScript, benefiting from scoped styles and dynamic styling capabilities.

### 3. **Conditional Styling**

For conditional styles, we use the `applyConditionalStyles` utility function. This function allows us to apply styles based on conditions, keeping our components clean and readable. When using this function, we need to pass the theme as an argument for the styles object to be able to use theme tokens. When no dynamic styles are needed, we can just pass the styles object without the theme argument.

### 4. **Modular Styles**

Each component may have its own styles object if needed, where styles are defined using Emotion. This keeps styles close to the components they belong to, improving maintainability.

### 5. **Responsive Design**

We adopt a mobile-first approach, using theme breakpoints to enhance styles for larger screens. So it's recommended to define the styles for the smaller screens first and then use the theme breakpoints to enhance them for the larger screens.

## Testing

For testing components with themed styles, we use a custom render utility that wraps components with the necessary theme provider. This ensures consistent styling behavior in tests.

```typescript
import { render, screen } from "Shared/testUtils"; // instead of @testing-library/react

describe("MyComponent", () => {
    it("renders correctly", () => {
        render(<MyComponent />);
        // ... test assertions
    });
});
```

For more information about testing styled components, refer to:

-   [Testing Library Setup](https://testing-library.com/docs/react-testing-library/setup#custom-render)
-   [MUI Testing Guide](https://mui.com/material-ui/guides/testing/)
-   [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Best Practices

-   **Use Theme Tokens**: Always use theme tokens for colors, spacing, and typography to ensure consistency.
-   **Keep Styles Modular**: Define styles in separate objects and import them into components.
-   **Leverage CSS-in-JS**: Use Emotion's features to write dynamic and scoped styles.
-   **Document Your Styles**: Add comments to your styles to explain complex logic or decisions.
