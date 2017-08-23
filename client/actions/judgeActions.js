import { JUDGES_FETCH, JUDGES_SUCCESS, JUDGES_ERROR, ADD_JUDGE, ADD_JUDGE_SUCCESS, ADD_JUDGE_ERROR } from './types';
import { toggleModal } from './modalsActions';

import * as eth from '../modules/ethereumService';

const judgesFormValidator = (values) => {
  const errors = {};

  if (!values.name) errors.name = 'Obavezno';
  if (!values.address) errors.address = 'Obavezno';

  errors.address = !web3.isAddress(values.address);

  return errors;
};

const submitAddJudgesForm = (judge) => (dispatch, getState) => {
  dispatch({ type: ADD_JUDGE });

  eth._registerJuryMember(judge.name, judge.address)
    .then((res) => {
      dispatch({ type: ADD_JUDGE_SUCCESS, payload: { judge: res } });
      toggleModal(getState().routing.locationBeforeTransitions.pathname, false);
    })
    .catch((error) => {
      dispatch({ type: ADD_JUDGE_ERROR, payload: { addJudgeError: error.message } });
    });
};

const fetchJudges = () => (dispatch) => {
  dispatch({ type: JUDGES_FETCH });
  eth.getJuries()
    .then((res) => {
      console.log(res);
      dispatch({
        type: JUDGES_SUCCESS,
        judges: res
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: JUDGES_ERROR,
        error
      });
    });
};

module.exports = {
  fetchJudges, judgesFormValidator, submitAddJudgesForm
};