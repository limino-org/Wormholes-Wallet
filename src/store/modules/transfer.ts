
// Store that initiated the transaction
interface State {
  chooseContact: any;
  chooseToken: any;
  amount: number | null;
}

export default {
  state: {
    // Store contact data for selected contacts
    chooseContact: null,
    // Store the token data selected by tokencard
    chooseToken: null,
    // amount of money
    amount: null,
    // Transaction progress Popup
    tranactionModel: false,
    // Current transaction queue
    tranactionList: []
  },
  mutations: {
    CHOOSE_CONTACT(state: State, contact: any) {
      state.chooseContact = contact;
    },
    UPDATE_CHOOSETOKEN(state: State, token: any) {
      state.chooseToken = token;
    },
    UPDATE_AMOUNT(state: State, amount: number) {
      state.amount = amount;
    },
    // Clear selected data
    CLEAR_TX(state:State){
      state.chooseContact = null
      state.chooseToken = null
      state.amount = null
    },
    
  },
  actions: {
    clearTx({commit}: any){
      commit('CLEAR_TX')
    }
  },
  namespaced: true,
};
