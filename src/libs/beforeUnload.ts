
const pristineBeforeUnload = window.onbeforeunload

// Prevent the user to accidentally exit
export function setBeforeUnload() {
  window.onbeforeunload = () => 'Are you sure you want to quit?'
}

// Restore default window behavior
export function restoreBeforeUnload() {
  window.onbeforeunload = pristineBeforeUnload
}