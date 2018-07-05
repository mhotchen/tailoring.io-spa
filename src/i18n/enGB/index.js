export default {
  app: {
    name: 'tailoring.io',
    tagLine: 'Dead simple software for tailors.',
    mainDrawer: {
      accountListHeader: 'Account',
      accountSettings: 'Account settings',
      accountSettingsSub: 'Change email, password, etc.',
      appSettingsListHeader: 'App settings',
      measurementSettings: 'Measurement settings',
      measurementSettingsSub: 'Configure how you measure your customers',
      logout: 'Logout'
    }
  },
  index: {
    title: '{company} dashboard',
    customers: {
      heading: 'Your customers',
      view: 'Customer profile',
      order: 'New order',
      search: 'Find customers',
      searchResults: 'No search results | One search result | {count} search results',
      recentlyUpdated: "You don't have any customers yet | You have one customer | {count} most recently updated customers",
      total: "You don't have any customers yet | You have one customer | You have {total} customers"
    }
  },
  measurementSettings: {
    title: 'Measurement settings',
    unitOfMeasurement: {
      label: 'Unit of measurement your company uses',
      errorSaving: 'Unable to save your preferences. Try refreshing and giving it another go.'
    },
    columns: {
      name: 'Name',
      type: 'Measurement type',
      garments: 'Garment(s)',
      minValue: 'Minimum allowed value',
      maxValue: 'Maximum allowed value',
      actions: 'Actions'
    },
    delete: {
      message: 'Are you sure you want to delete the "{measurementSetting}" setting? You won\'t be able to use it in future measurements',
      confirm: 'Delete it',
      cancel: 'Cancel',
      error: 'An error occurred trying to delete this measurement setting'
    },
    garmentTypeFilter: {
      label: 'Filter by garment',
      all: 'Show all'
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
      enum: 'The value selected isn\'t allowed',
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
  },
  types: {
    measurementType: {
      BODY: { short: 'Body measurement', description: "This is a full measurement taken from the customer's body (eg. the customer's height or their neck circumference)" },
      GARMENT: { short: 'Garment measurement', description: 'This is the full length measurement of a part of particular a garment (eg. the sleeve length for a jacket)' },
      SAMPLE_ADJUSTMENT: { short: 'Adjustment of sample garment', description: "This is a measurement that is adjusting the measurement for an example garment (eg. to take length off the sleeve length on a sample jacket). These measurements are only visible if you're basing the measurements on a sample garment" },
      ALTERATION: { short: 'Pattern alteration', description: 'These measurements are only applicable when performing garment alterations (eg. to reference a specific seam on a jacket that needs let out)' }
    },
    garmentType: {
      JACKET: { short: 'Jacket' },
      WAISTCOAT: { short: 'Waistcoat' },
      SHIRT: { short: 'Shirt' },
      TROUSERS: { short: 'Trousers' }
    },
    unitOfMeasurementType: {
      INCHES: {
        short: 'Inches',
        abbr: '{num}"',
        subunits: {
          '000': '',
          '125': '⅛',
          '250': '¼',
          '375': '⅜',
          '500': '½',
          '625': '⅝',
          '750': '¾',
          '875': '⅞'
        }
      },
      CENTIMETERS: {
        short: 'Centimeters',
        abbr: '{num} cm',
        subunits: {
          '000': '',
          '250': '.25',
          '500': '.5',
          '750': '.75'
        }
      }
    }
  }
}
