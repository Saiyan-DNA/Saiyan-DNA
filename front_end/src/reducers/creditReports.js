import { CREDIT_REPORTS_LOADING, CREDIT_REPORTS_LOADED, CREDIT_REPORTS_LOAD_ERROR } from '../actions/types';
import { CREDIT_REPORT_LOADING, CREDIT_REPORT_LOADED, CREDIT_REPORT_LOAD_ERROR } from '../actions/types';
import { CREDIT_REPORT_SAVING, CREDIT_REPORT_SAVED, CREDIT_REPORT_SAVE_ERROR } from '../actions/types';
import { CREDIT_REPORT_DELETING, CREDIT_REPORT_DELETED, CREDIT_REPORT_DELETE_ERROR } from '../actions/types';


const initialState = {
    creditReports: [],
    currentReport: {},
    creditReportsLoading: false,
    creditReportsLoaded: false,
    creditReportsLoadError: false,
    creditReportLoading: false,
    creditReportLoaded: false,
    creditReportLoadError: false,
    creditReportSaving: false,
    creditReportSaved: false,
    creditReportSaveError: false,
    creditReportDeleting: false,
    creditReportDeleted: false,
    creditReportDeleteError: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case CREDIT_REPORTS_LOADING:
            return {
                ...state,
                creditReports: [],
                creditReportsLoading: true,
                creditReportsLoaded: false,
                creditReportsLoadError: false,
            }
        case CREDIT_REPORTS_LOADED:
            return {
                ...state,
                creditReports: action.payload,
                creditReportsLoading: false,
                creditReportsLoaded: true,
                creditReportsLoadError: false,
            }
        case CREDIT_REPORTS_LOAD_ERROR:
            return {
                ...state,
                creditReports: [],
                creditReportsLoading: false,
                creditReportsLoaded: false,
                creditReportsLoadError: true,
            }
        default:
            return state;
    }
}