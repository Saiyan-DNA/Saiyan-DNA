import axios from 'axios';

import { NET_WORTH_LOADED, NET_WORTH_LOADING, NET_WORTH_LOAD_ERROR } from './types';

import { getAccounts } from '../actions/accounts';
import { getAssets } from '../actions/assets';

import { createMessage } from './messages';


// Get Net Worth
export const getNetWorth = () => (dispatch, getState) => {
    if (!getState().dashboard.netWorthLoading && !getState().dashboard.netWorthLoaded) {
        dispatch({type: NET_WORTH_LOADING});

        if (!getState().accounts.accountsLoaded || !getState().assets.assetsLoaded) {
            dispatch({type: NET_WORTH_LOAD_ERROR});
    
            if (!getState().accounts.accountsLoaded) dispatch(getAccounts());   
            if (!getState().assets.assetsLoaded) dispatch(getAssets());
    
            return;
        }

        var accounts = getState().accounts.accounts;
        var assets = getState().assets.assets;
        var checkingAccounts = accounts.filter(account => account.account_type.value === "CK");
        var savingsAccounts = accounts.filter(account => account.account_type.value === "SV");
        var investments = accounts.filter(account => account.account_type.value === "IN");
        var creditCards = accounts.filter(account => account.account_type.value === "CR");
        var loans = accounts.filter(account => account.account_type.value === "LN");
        
        var totalAssets = 0
        totalAssets += checkingAccounts.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);
        totalAssets += savingsAccounts.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);
        totalAssets += investments.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);
        totalAssets += assets.map(asset => asset.current_value).reduce((prev, curr) => prev + curr, 0);

        var totalLiabilities = 0
        totalLiabilities += creditCards.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);
        totalLiabilities += loans.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);

        var creditCardsOwed = creditCards.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);
        var creditCardsLimit = creditCards.map(acct => acct.credit_limit).reduce((prev, curr) => prev + curr, 0);
        var creditCardsAvailable = creditCardsLimit - creditCardsOwed;

        var loansOwed = loans.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0);
        var loansLimit = loans.map(acct => acct.credit_limit).reduce((prev, curr) => prev + curr, 0);
        var loansPaid = loansLimit - loansOwed;
        
        var netWorth = totalAssets - totalLiabilities;

        let netWorthData = {
            netWorth: netWorth,
            totalAssets: totalAssets,
            totalLiabilities: totalLiabilities,
            checkingAccounts: {
                count: checkingAccounts.length,
                balance: checkingAccounts.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0)
            },
            savingsAccounts: {
                count: savingsAccounts.length, 
                balance: savingsAccounts.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0)
            },
            investments: {
                count: investments.length, 
                balance: investments.map(acct => acct.current_balance).reduce((prev, curr) => prev + curr, 0)
            },
            property: {
                count: assets.length, 
                balance: assets.map(asset => asset.current_value).reduce((prev, curr) => prev + curr, 0)
            },
            creditCards: {
                count: creditCards.length, 
                balance: creditCardsOwed,
                available: creditCardsAvailable,
                limit: creditCardsLimit,
                utilization: (creditCardsOwed / creditCardsLimit) * 100
            },
            loans: {
                count: loans.length, 
                balance: loansOwed,
                limit: loansLimit,
                paid: loansPaid,
                percentPaid: loansPaid/loansLimit * 100
            }
        }

        dispatch({type: NET_WORTH_LOADED, payload: netWorthData});
    }      
};