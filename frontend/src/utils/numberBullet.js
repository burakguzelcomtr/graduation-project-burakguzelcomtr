export function displayOrder(value, index) {
  const number = Number(value)

  if (Number.isInteger(number) && number > 0) {
    return number
  }

  return index + 1
}

export function numberBulletSrc(value, index) {
  const number = displayOrder(value, index)

  if (number < 1 || number > 20) {
    return null
  }

  return `/assets/img/numbers/${number}.svg`
}