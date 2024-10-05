const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0
}
const isEmptyFunction = (fn) => {
  return (
    fn.toString().replace(/\s+/g, '') ===
    (() => {}).toString().replace(/\s+/g, '')
  )
}

const util = { isEmptyObject, isEmptyFunction }
export default util
