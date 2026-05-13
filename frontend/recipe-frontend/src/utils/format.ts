export const formatDate = (dateValue?: any) => {
  if (!dateValue) return '-'

  let date: Date

  if (dateValue._seconds !== undefined) {
    date = new Date(dateValue._seconds * 1000)
  } 
  else if (typeof dateValue.toDate === 'function') {
    date = dateValue.toDate()
  } 
  else {
    date = new Date(dateValue)
  }
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
