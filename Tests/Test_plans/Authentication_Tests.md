# Authentication Test Plan

## Purpose

Verify that GradeWise authenticates users securely and applies role-based access rules correctly.

## Scope

- Login with admin and judge accounts
- Client-side input validation
- JWT creation and validation
- Authentication and authorization responses for protected routes
- Prevention of password-hash exposure

## Test Environment

| Item | Value |
| --- | --- |
| Frontend | `http://localhost:3000` |
| Backend | `http://localhost:3001` |
| Database | Local demo MongoDB Atlas cluster |
| Admin account | ID `900000001` |
| Judge account | ID `900000002` |
| Password | Local `DEMO_PASSWORD` value;  |

## Test Cases

| ID | Scenario | Test technique | Priority | Expected result | Automation target |
| --- | --- | --- | --- | --- | --- |
| AUTH-001 | Log in with valid admin credentials | Equivalence partitioning (valid input) | Critical | User reaches the admin area and receives a valid JWT | Playwright E2E + Postman API |
| AUTH-002 | Log in with valid judge credentials | Equivalence partitioning (valid input) | Critical | User reaches the judge area and receives a valid JWT | Playwright E2E + Postman API |
| AUTH-003 | Log in with an invalid password | Equivalence partitioning (invalid input) | High | Login is rejected and an error is shown; no token is stored | Playwright E2E + Postman API |
| AUTH-004 | Submit an empty ID or password | Required-field validation | High | Client shows a validation message and does not send a login request | React component test + manual |
| AUTH-005 | Enter an ID with 8 characters, then 9 characters | Boundary value analysis | Medium | 8 characters is rejected; 9 characters passes the length validation | React component test + manual |
| AUTH-006 | Validate a newly issued token with `/check-token` | State validation | High | API returns `success: true` and safe user details | Postman API |
| AUTH-007 | Call an admin-protected endpoint without a token | Negative/security testing | Critical | API returns `401 Unauthorized` | Postman API |
| AUTH-008 | Call an admin-protected endpoint with a judge token | Decision table / permissions matrix | Critical | API returns `403 Forbidden` | Postman API + Playwright E2E |
| AUTH-009 | Retrieve current admin data with a valid admin token | Security regression testing | Critical | Response does not contain `password` or a password hash | Postman API |


## Test Suite Definitions

| Suite | Included cases | Goal |
| --- | --- | --- |
| Smoke | AUTH-001, AUTH-002, AUTH-007 | Confirm the essential authentication path works |
| Regression | AUTH-001 through AUTH-009 | Detect authentication regressions after changes |
| Security | AUTH-006 through AUTH-009 | Verify token handling, role restrictions, and response safety |

