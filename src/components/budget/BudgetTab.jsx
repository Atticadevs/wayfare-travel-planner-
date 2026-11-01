import { useMemo, useState } from 'react'
import { useAutoAdd } from '../../hooks/useAutoAdd'
import { useRates } from '../../hooks/useRates'
import { getSpendRows } from '../../store/selectors'
import { toast } from '../../store/useToastStore'
import { useTripStore } from '../../store/useTripStore'
import { BudgetSummary } from './BudgetSummary'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseList } from './ExpenseList'

/** Budget and expenses tab for one trip. */
export function BudgetTab({ trip, bookings, expenses }) {
  const rates = useRates()
  const [modal, setModal] = useState({ open: false, expense: null })
  const { addExpense, updateExpense, deleteExpense, restore } = useTripStore.getState()
  const close = () => setModal((m) => ({ ...m, open: false }))
  const openAdd = () => setModal({ open: true, expense: null })
  useAutoAdd(openAdd)

  const rows = useMemo(() => getSpendRows(trip, bookings, expenses, rates), [trip, bookings, expenses, rates])

  const submit = (values) => {
    if (modal.expense) {
      updateExpense(modal.expense.id, values)
      toast('Expense updated')
    } else {
      addExpense({ ...values, tripId: trip.id })
      toast('Expense added')
    }
    close()
  }

  const remove = (id) => {
    const expense = expenses.find((e) => e.id === id)
    deleteExpense(id)
    toast(`“${expense.title}” deleted`, { actionLabel: 'Undo', onAction: () => restore('expenses', expense) })
  }

  return (
    <div className="space-y-6">
      <BudgetSummary trip={trip} rows={rows} />
      <ExpenseList
        rows={rows}
        currency={trip.budget.currency}
        onAdd={openAdd}
        onEdit={(id) => setModal({ open: true, expense: expenses.find((e) => e.id === id) })}
        onDelete={remove}
      />
      <ExpenseForm open={modal.open} expense={modal.expense} trip={trip} onClose={close} onSubmit={submit} />
    </div>
  )
}
