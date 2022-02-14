import React from 'react';
import loadable from '@loadable/component';

const BankingPanel = loadable(() => import('./BankingPanel' /* webpackChunkName: "Dashboard" */), {fallback: <span>&nbsp;</span>});
const CreditCardsPanel = loadable(() => import('./CreditCardsPanel' /* webpackChunkName: "Dashboard" */), {fallback: <span>&nbsp;</span>});
const CreditScorePanel = loadable(() => import('./CreditScorePanel' /* webpackChunkName: "Dashboard" */), {fallback: <span>&nbsp;</span>});
const DebtIncomePanel = loadable(() => import('./DebtIncomePanel' /* webpackChunkName: "Dashboard" */), {fallback: <span>&nbsp;</span>});
const LoansPanel = loadable(() => import('./LoansPanel' /* webpackChunkName: "Dashboard" */), {fallback: <span>&nbsp;</span>});
const NetWorthPanel = loadable(() => import('./NetWorthPanel' /* webpackChunkName: "Dashboard" */), {fallback: <span>&nbsp;</span>});

export {
    BankingPanel,
    CreditCardsPanel,
    CreditScorePanel,
    DebtIncomePanel,
    LoansPanel,
    NetWorthPanel
}