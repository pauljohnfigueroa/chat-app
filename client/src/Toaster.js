import SweetAlert from 'sweetalert2'

const Toast = SweetAlert.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  onOpen: toast => {
    toast.addEventListener('mouseenter', SweetAlert.stopTimer)
    toast.addEventListener('mouseleave', SweetAlert.resumeTimer)
  }
})

const makeToast = (type, msg) => {
  Toast.fire({
    icon: type,
    title: msg
  })
}

export default makeToast
