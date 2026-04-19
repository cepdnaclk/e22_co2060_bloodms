# Frontend Refactoring Documentation

## Overview
This document explains the strategy, reusable functions, and design patterns introduced during the recent frontend refactoring to reduce complexity, particularly in large components like `SignUp.jsx` and `Login.jsx`.

## Applied Design Patterns

### 1. Custom Hooks (Behavioral Pattern)
React Custom Hooks allow extracting component logic into reusable functions.
- **`useForm.js`**: We extracted the complex form state management, validation logic (`handleChange`, `handleBlur`, `validateAll`), and error mapping into a generic hook. This reduced `SignUp.jsx` by over 100 lines and made form handling standardized across the app.

### 2. Service Layer (Structural Pattern)
The Service Layer pattern decouples the UI components from data fetching logic.
- **`authService.js`**: Instead of having raw `axios.post('http://localhost:8000/api/...`) calls scattered within UI components, we created an abstraction layer. This makes the API calls reusable, testable, and easier to modify if the backend URL or headers change.

### 3. Utility / Helper Pattern
Commonly used, stateless functions that format data or interact with third-party libraries (like SweetAlert2) are extracted into utilities.
- **`swalUtils.js`**: Extracted the repetitive configuration `swalBase` and created semantic helper functions (`showSuccessToast`, `showErrorToast`, `showWarningToast`).
- **`errorParser.js`**: Extracted complex Django API error flattening (`flattenApiErrors`) and field mapping (`mapApiKeyToFormField`) logic, making it available for any form that submits data to the Django backend.

## Summary of Reusable Functions

| Function / File | Purpose | Location |
|---|---|---|
| `useForm` | Generic form state & validation | `src/hooks/useForm.js` |
| `registerUser` | API call for user registration | `src/api/authService.js` |
| `resolveHospital` | API call for hospital resolution | `src/api/authService.js` |
| `showSuccessToast` | Display customized SweetAlert success popup | `src/utils/swalUtils.js` |
| `showErrorToast` | Display customized SweetAlert error popup | `src/utils/swalUtils.js` |
| `flattenApiErrors` | Flattens nested JSON error responses | `src/utils/errorParser.js` |

## How to use `useForm`
```javascript
import { useForm } from '../hooks/useForm';

const VALIDATORS = {
   email: (v) => (!v ? 'Email max length is req' : '')
};

const MyComponent = () => {
   const { formData, handleChange, handleBlur, validateAll, fieldErrors } = useForm({ email: '' }, VALIDATORS);

   // Use the returned handlers in your JSX!
}
```

By adhering to these patterns, future developers can quickly build new forms, trigger standard alerts, and communicate with the backend without duplicating code.
