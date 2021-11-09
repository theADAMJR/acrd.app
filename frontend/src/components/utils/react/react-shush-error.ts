// stop unknown property react error
export const filterProps = (props: object) => {
  return {
    ...props,
    setTab: undefined,
    register: undefined,
    titleName: undefined,
    initialValue: undefined,
  }
}