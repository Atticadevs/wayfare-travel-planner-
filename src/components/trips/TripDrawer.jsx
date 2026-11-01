import { Button } from '../ui/Button'
import { Drawer } from '../ui/Drawer'
import { TRIP_FORM_ID, TripForm } from './TripForm'

/** Right-side drawer (bottom sheet on mobile) for adding or editing a trip. */
export function TripDrawer({ open, trip, onClose, onSubmit }) {
  return (
    <Drawer
      open={open}
      title={trip ? 'Edit trip' : 'Add trip'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={TRIP_FORM_ID}>
            {trip ? 'Save changes' : 'Create trip'}
          </Button>
        </>
      }
    >
      <TripForm trip={trip} onSubmit={onSubmit} />
    </Drawer>
  )
}
