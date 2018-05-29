export default {
  app: {
    name: 'tailoring.io',
    tagLine: 'Dead simple software for tailors.',
    mainDrawer: {
      accountListHeader: 'Account',
      accountSettings: 'Account settings',
      accountSettingsSub: 'Change email, password, etc.',
      logout: 'Logout'
    }
  },
  index: {
    title: '{company} dashboard',
    customers: {
      heading: 'Your customers',
      search: 'Find customers'
    }
  },
  customer: {
    view: {
      edit: 'Edit customer',
      contact: {
        heading: 'Contact {name}'
      },
      notes: {
        heading: 'Notes'
      },
      orders: {
        heading: 'Orders',
        none: 'No orders yet!',
        new: 'Create a new order'
      }
    },
    edit: {
      formTitleEdit: 'Edit customer {name}',
      formTitleNew: 'New customer',
      name: 'Customer name',
      email: 'Optional email address',
      telephone: 'Optional telephone number',
      notes: {
        heading: 'Notes',
        note: 'Add a note',
        addNote: 'Add another'
      },
      submitForm: 'Save'
    }
  },
  account: {
    awaitingEmailVerification: "Your email isn't yet verified and until it is you won't be able to create customers, orders, etc.",
    awaitingPasswordReset: "You requested a password reset and until it's complete you won't be able to create customers, orders, etc."
  },
  login: {
    formTitle: 'Login',
    email: 'Email address',
    password: 'Password',
    rememberMe: 'Use a cookie to keep me logged in',
    submitForm: 'Login',
    invalidInput: 'Please provide your email address and password',
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
    passwordHelper: 'Minimum of {passwordLength} characters. Try using a sentence instead of a word.',
    rememberMe: 'Use a cookie to keep me logged in',
    submitForm: 'Create account',
    invalidInput: 'Please provide your email and password',
    verifyEmail: 'A verification email has been sent to your inbox. Follow the instructions in that email to continue.'
  },
  verify: {
    formTitle: 'Verify your email address',
    password: 'Password',
    rememberMe: 'Use a cookie to keep me logged in',
    invalidInput: 'Please provide your password',
    invalidIdInUrl: 'The URL is invalid. Have you already verified your email address?',
    submitForm: 'Verify and login'
  },
  fields: {
    email: {
      email: "This isn't a valid email address",
      unique: 'This email address is already in use'
    },
    generic: {
      array: 'This must be a list of values',
      required: 'This field is required',
      string: 'This field must be a string',
      uuid: 'This value should be a valid identifier but it isn\'t in the format we expected'
    },
    password: {
      length: 'Your password is too short',
      invalid: 'Invalid password',
      invalid_email_or_password: 'Invalid email or password'
    },
    verify: {
      code_invalid: 'Either this verification code has expired or your password is invalid.'
    }
  }
}
