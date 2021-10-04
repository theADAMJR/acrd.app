// stop unknown property react error
export const filterProps = (props: object) => {
  return {
    ...props,
    titleName: undefined,
    initialValue: undefined,
  }
}