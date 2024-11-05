const isEmptyFunction = (fn) => {
  return (
    fn.toString().replace(/\s+/g, '') ===
    (() => {}).toString().replace(/\s+/g, '')
  )
}

const util = { isEmptyFunction }
export default util
