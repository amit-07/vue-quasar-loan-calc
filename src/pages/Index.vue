<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-badge color="secondary" multi-line class="q-mb-md">
        Rate of Interest: 7%
      </q-badge>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md loan-form">
        <q-input
          filled
          type="number"
          v-model="loan"
          label="Loan Amount *"
          hint="Amount of money in INR"
          bg-color="#f5f9fe"
          color="#7891a7"
          lazy-rules
          :rules="[
            (val) =>
              (val !== null && val !== '') ||
              'Please enter the loan amount required',
            (val) => val > 0 || 'Please type a value greater than 0'
          ]"
        />

        <q-input
          filled
          type="number"
          v-model="term"
          label="Time Period in weeks"
          hint="Total time period of loan"
          bg-color="#f5f9fe"
          color="#7891a7"
          lazy-rules
          :rules="[
            (val) =>
              (val > 0 && val < 1560) || 'Please type a value greater than 0'
          ]"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>

      <q-table
        title="My Loans"
        :data="loans"
        :columns="columns"
        row-key="loans"
        class="my-sticky-header-table loan-table"
        color="primary"
      >
        <template #body-cell-action="props">
          <q-td>
            <q-btn
              dense
              flat
              round
              color="secondary"
              field="edit"
              @click="repayEmi(props.row)"
              >Repay</q-btn
            >
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'PageIndex',
  methods: {
    generateId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    getEmiDetails(loanAmt, term, rate) {
      let interest = rate / 5200
      let top = Math.pow(1 + interest, term)
      let bottom = top - 1
      let ratio = top / bottom
      let EMI = loanAmt * interest * ratio
      let Total = EMI * term
      const EMIObj = {
        EMI: EMI.toFixed(0),
        Total: Total.toFixed(0)
      }
      return EMIObj
    },
    onSubmit(evt) {
      // evt.preventDefault()
      console.log(evt.target)
      const emiDetails = this.getEmiDetails(this.loan, this.term, this.rate)
      this.currentLoan = {
        loan: this.loan,
        term: this.term,
        id: this.generateId(),
        emi: emiDetails.EMI,
        total: emiDetails.Total
      }
      this.activeLoans = this.loans
      this.activeLoans.push(this.currentLoan)
      localStorage.setItem('activeLoans', JSON.stringify(this.activeLoans))
      evt.target.submit()
    },
    onReset(evt) {
      localStorage.clear()
      evt.target.reset()
    },
    repayEmi(item) {
      let updatedLoans = []
      let currentLoanIndex = this.loans.findIndex((v, i) => v.id === item.id)
      if (this.loans[currentLoanIndex]['total'] <= 0) {
        this.loans.splice(currentLoanIndex, 1)
        localStorage.setItem('activeLoans', JSON.stringify(this.activeLoans))
      } else {
        this.loans[currentLoanIndex]['total'] =
          this.loans[currentLoanIndex]['total'] -
          this.loans[currentLoanIndex].emi
        this.loans[currentLoanIndex]['term'] = this.loans[currentLoanIndex][
          'term'
        ]--
      }
    }
  },
  data() {
    return {
      loan: '',
      term: '',
      rate: 7,
      id: 0,
      emi: 0,
      total: 0,
      currentLoan: {},
      activeLoans: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Loan Id',
          align: 'left',
          field: (row) => row.id,
          format: (val) => `${val}`,
          sortable: true
        },
        {
          name: 'loan',
          align: 'center',
          label: 'Loan Amount',
          field: 'loan',
          sortable: true
        },
        { name: 'term', label: 'Loan Term', field: 'term', sortable: true },
        { name: 'emi', label: 'Weekly EMI', field: 'emi', sortable: true },
        { name: 'total', label: 'Total Amt', field: 'total', sortable: true },
        {
          name: 'action',
          align: 'center',
          label: 'Action',
          field: 'action'
        }
      ],
      loans: JSON.parse(window.localStorage.getItem('activeLoans') || '[]')
    }
  }
}
</script>
