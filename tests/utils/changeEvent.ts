export const changeEvent = (value: string | number) => ({ target: { value } })
export const getInputValue = (el: HTMLElement) => (el as HTMLInputElement).value
