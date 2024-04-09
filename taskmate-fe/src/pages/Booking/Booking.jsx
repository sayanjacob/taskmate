import React from 'react'

const Booking = () => {
  const booking=sessionStorage.getItem('data')
  const bbb=JSON.parse(booking)
  return (
    <div className='' style={{'backgroundColor':'white'}}>
        {bbb.user_contact_info[0]}
        {bbb.payment.id}



    </div>
  )
}

export default Booking