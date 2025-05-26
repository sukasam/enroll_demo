# Enrollment

This project utilizes Commitizen, Husky, ESLint, Prettier, Jest, and React Testing Library to maintain a high-quality and consistent codebase. These tools help ensure proper code formatting, linting, standardized commit messages, and effective testing.

## Prerequisites

-   Node version: 18.19.0

## Installation

To install packages, run:

```bash
npm i --legacy-peer-deps
```

## Running the Project

To start local development, run:

```bash
npm run dev
```

## Tools

-   **Commitizen**: A command-line tool that enforces the use of conventional commit messages. It helps to create clear, concise, and standardized commit messages, making it easier to manage and understand the project's history.

-   **Husky**: A tool that simplifies the process of setting up and managing Git hooks. It helps to run pre-defined scripts before certain Git actions, like commits or pushes, ensuring that the codebase remains consistent and adhering to specific standards.

-   **ESLint**: A JavaScript linter that checks for syntax and style issues in your code. It helps to find and fix potential problems, improving the overall quality and maintainability of your codebase.

-   **Prettier**: An opinionated code formatter that automatically formats your code to follow a consistent style. It helps to enforce a uniform coding style across the entire project, making the code easier to read and understand.

-   **Jest**: A JavaScript testing framework that focuses on simplicity and ease of use. It provides a robust set of features for testing, including snapshot testing, mocking, and code coverage reporting.

-   **React Testing Library**: A lightweight set of utilities for testing React components that emphasizes accessibility and following best practices. It encourages testing components in a way that resembles how users interact with them, making tests more reliable and maintainable.

## Commands

-   `npm run lint` Runs ESLint on the entire project to check for syntax and style issues.
-   `npm run lint:fix` Runs ESLint with the --fix flag to automatically fix fixable issues in JavaScript files.
-   `npm run commit` Runs commitizen to create a standardized commit message.
-   `npm run test` Runs the Jest test suite for the project.

## Commitizen Conventional Commit Types

Conventional commits are a standardized format for commit messages, which makes them easier to read, understand, and manage. Here are some common commit types and their meanings:

-   `feat`: Introduces a new feature.
-   `fix`: Fixes a bug.
-   `docs`: Adds or updates documentation.
-   `style`: Updates code formatting (does not affect functionality).
-   `refactor`: Refactors code (does not add a feature or fix a bug).
-   `perf`: Improves performance.
-   `test`: Adds or updates tests.
-   `chore`: Changes to the build process or auxiliary tools and libraries.

## Commitizen Prompts and Usage

When using `npm run commit`, Commitizen will guide you through a series of prompts to help you create a properly formatted commit message. Here are the main prompts and their explanations:

1. **Select the type of change that you're committing**: Choose the appropriate commit type from the list (e.g., `feat`, `fix`, `docs`, etc.). See the "Commitizen Conventional Commit Types" section above for descriptions of each type.

2. **What is the scope of this change (e.g., component or file name)**: Specify the area of the codebase affected by the change, such as a component, module, or file name. This provides context for the change.

3. **Write a short, imperative tense description of the change**: Describe the change you've made in a concise and imperative manner, such as "Add login functionality" or "Fix header alignment issue."

4. **Provide a longer description of the change**: If needed, give more details about the change, including any necessary context or reasoning behind it.

5. **Are there any breaking changes?**: Indicate whether the change introduces any breaking changes that may affect the application's behavior or require manual intervention during the update process.

6. **Does this change affect any open issues?**: If the change is related to an open issue or ticket, select "yes." When prompted to "Add issue references (e.g., 'fix #123', 're #123')", paste the ticket link. This will associate the commit with the relevant ticket, providing better traceability and context for the change.

Follow these prompts when using Commitizen to ensure clear and consistent commit messages across the project.

## Important Note

Please remember to use the `npm run commit` command instead of `git commit` when making commits to ensure proper usage of Commitizen and standardized commit messages. This command will prompt you to input the commit message using conventional commits format.

# Prod Server Setup Notes

SSH into the new servers then:

-   install docker with these commands

```
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
sudo systemctl restart docker
```

-   Add in the ssh keys

```
cd .ssh
vi authorized_keys
{insert enroll.pub ssh key}
:wq {Enter}
```

NOTE: You might need to reconnect to see docker info or docker ps
NOTE: IP Address changes 
    1. change in travis.yml
    2. scripts/blueGreenDeployment/serverConfigs.js


# Unit Testing Notes
## Running Unit Tests

-   To run the unit tests, run the following command:

```bash
npm run test
``` 

-   To run the unit tests with coverage, run the following command:

```bash
npm run test:coverage
```

# Coding Unit Tests
### Mocking Data

-   To mock data create a new file in the `__mocks__` folder that is named after the file you are trying to mock.
-   __Example__: If you are trying to mock the data in `src/contexts/UserContext.tsx`, create a new file in the `__mocks__` folder that is named `UserContext.tsx`.
-   Copy the data you wish to mock from the original file and paste it into the new mock file.
```
.
├── components
│   ├── __mocks__
│   │   └── user.js
│   │   └── order.tsx
│   └── user.js
│   └── order.tsx
```
```JavaScript
export const useUser = jest.fn().mockReturnValue({
    activeAccordionSection: null,
    resetBacktoDefault: jest.fn(),
    enrollerId: null,
});

export default useUser;
```

### Using Mocked Data
-   Now on any test file you can use `jest.mock("Contexts/UserContext");` to pull that default mock data into your test file.
-   To override the default mock data you can use 
```JavaScript
(useUser as jest.Mock).mockReturnValue({
    ...useUser(),
    activeAccordionSection: 1, // will override the default value of null
    mainAddress: null // will be created on the new mocked object
});
```

### Evaluating Mocked Values
If you do not include the `...useUser()` in the mock return statement then the mocked object will not have the default values assigned to it.

-   In order to evaluate values from the mocked object  simply use this syntax:
```JavaScript
expect(useUser().resetBacktoDefault).toHaveBeenCalled(); //restBacktoDefault is a function from the default mock data
```

### Clearing Mocks
-   To clear the mocks after each test you can use `jest.clearAllMocks();`
-   We must start using `jest.clearAllMocks();` instead of `jest.resetAllMocks();`
-   `resetAllMocks()` will destroy all mocks including the default mock data
-   `clearAllMocks()` will clear out all custom mocks but keep the default mock data

