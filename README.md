# HomeCentral ReadMe Documentation

## Current Status:

*Early Development*

## Overview

HomeCentral is a web application for managing personal home activities, including home financials, inventory management, recipes, shopping lists, scheduling, and more.

***

## Dependencies

### Back-End

- Python v3.8.3
- PyYaml
- ua-parser
- user-agents
- Django v3.0.6
  - DjangoRestFramework
  - DjangoRestFramework-JWT 
  - DjangoRestFramework-Recursive
  - Django-Filter
  - Django-Extensions
  - django-user-agents
  - django-redis

### Front-End

- Axios v0.21.1
- Babel v7.14.3
  - Babel-Loader v8.2.2
  - Babel/plugin-syntax-dynamic-import v7.8.3
  - Babel-plugin-transform-class-properties v6.24.1
  - Babel/preset-env v7.14.2
  - Babel/preset-react v7.13.13
- Clean-webpack-plugin v3.0.0
- Loadable/component
- Material-UI (Core) v4.11.4
  - Material-UI (Icons) v4.11.2
  - Material-UI (Lab) v4.0.0
- React v17.0.2
  - React-Redux v7.2.4
  - React-Router-DOM v5.2.0
- Redux v4.1.0
  - Redux-Thunk v2.3.0
- Webpack v4.46.0
  - Webpack-CLI v3.3.12

### External
- MySQL Server
- Redis Server

***

## Modules

### Core

- Organizations
- Homes
- People

### Financials

- **Management**
  - Accounts
    - Banking (Checking/Savings)
    - Credit Cards
    - Investments
    - Loans
  - Assets
  - Budgets
  - Categories
  - Financial Institutions (type of Organization)
- **Activity**
  - View/Edit Transactions
- **Reporting**
  - Summary Dashboard
  - Budget Analysis

### Inventory

- **Management**
  - Categories
  - Items
  - Recipes
  - Suppliers (type of Organization)
- **Activity**
  - Inventory Tracking
    - Count
    - Deplete
    - Receive
  - Meal Planning
  - Reconcile Inventory Financials
  - Shopping Lists
    - Recommended Items
      - Integrated with Meal Planning
    - Manual Items    
    - Integrated with Receiving
- **Reporting**
  - Summary Dashboard
  - Meal Plan Overview
  - Recipe Instructions
  - Usage Analysis
  