import MailDev from 'maildev'

const maildev = new MailDev({
  smtp: 1025,
})

const connectmail = () => {
  maildev.listen(() => {
    console.log(`We're now listening emails!`)
  })
}

export default connectmail
