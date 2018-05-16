export default {
  app: {
    name: 'tailoring.io',
    tagLine: 'Dead simple software for tailors.'
  },
  login: {
    formTitle: 'Login',
    email: 'Email address',
    password: 'Password',
    rememberMe: 'Use cookies and keep me logged in',
    submitForm: 'Login',
    invalidInput: 'Please provide your email and password',
    createAccount: {
      noAccount: 'Don\'t have an account? {startTrialLink}.',
      createAccount: 'Start your 30 day free trial now'
    }
  },
  register: {
    formTitle: 'Create an account',
    companyName: 'Name of your company',
    email: 'Email address',
    emailHelper: 'We use your email to verify your account, for logging in, for password resets and a single email to inform you that your free trial will expire in five days.',
    password: 'Password',
    passwordHelper: 'Minimum of {passwordLength} characters.',
    rememberMe: 'Use cookies and keep me logged in',
    submitForm: 'Create account',
    invalidInput: 'Please provide your email and password',
    verifyEmail: 'A verification email has been sent to your inbox. Follow the instructions in that email to continue.'
  },
  fields: {
    email: {
      email: "This isn't a valid email address",
      unique: 'This email address is already in use'
    },
    generic: {
      array: 'This must be a list of values',
      required: 'This field is required',
      string: 'This field must be a string'
    },
    password: {
      length: 'Your password is too short'
    }
  }
}
