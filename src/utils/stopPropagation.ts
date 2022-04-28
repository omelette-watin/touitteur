const stopPropagation = (e: any) => {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}

export default stopPropagation
