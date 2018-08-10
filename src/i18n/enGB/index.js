export default {
  generic: {
    loading: 'Loading...',
    cancel: 'Cancel'
  },
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
      sampleGarments: 'Sample garments',
      sampleGarmentsSub: 'Set the sample garments to reference when taking a customer\'s measurements',
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
    table: {
      title: 'Measurements',
      subtitle: 'Here are the measurement settings which are displayed when measuring a customer. You can rename and delete existing measurements as well as create new ones.'
    },
    create: {
      label: 'Create a new measurement'
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
      title: 'Delete "{measurementSetting}"?',
      message: 'Are you sure you want to delete the "{measurementSetting}" setting? You won\'t be able to use it in future measurements.',
      confirm: 'Delete it',
      cancel: 'Cancel',
      error: 'An error occurred trying to delete this measurement setting'
    },
    edit: {
      error: 'An error occurred trying to save this measurement setting'
    },
    garmentTypeFilter: {
      label: 'Filter by garment',
      all: 'Show all'
    }
  },
  sampleGarments: {
    title: 'Sample garments',
    table: {
      title: 'Garments',
      subtitle: 'Here are the sample garments which can be used as a reference when measuring a customer. You can rename and delete existing garments as well as create new ones.'
    },
    create: {
      label: 'Create a new sample garment'
    },
    columns: {
      name: 'Name',
      garment: 'Garment',
      actions: 'Actions'
    },
    delete: {
      title: 'Delete "{garment}"?',
      message: 'Are you sure you want to delete the "{garment}" sample garment? You won\'t be able to use it in future measurements.',
      confirm: 'Delete it',
      cancel: 'Cancel',
      error: 'An error occurred trying to delete this garment'
    },
    edit: {
      error: 'An error occurred trying to save this garment'
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
      },
      measurements: {
        heading: 'Measurements',
        body: 'Body',
        garments: 'Garments',
        noMeasurements: 'No measurements yet!',
        addNew: 'Add measurements',
        edit: 'Edit measurements',
        view: 'View measurements'
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
  measurementProfile: {
    edit: {
      form: {
        name: {
          label: 'Profile name',
          helper: 'For example "Casual shirt" or "Dress shirt" to distinguish between two different shirt measurement profiles',
          default: 'Default'
        },
        commitMessage: {
          label: 'Change message',
          helper: 'An optional description of the changes (eg. why or how) that can be viewed on the customer\'s profile'
        },
        save: {
          label: 'Save changes'
        }
      }
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
    measurementSelect: {
      notSet: 'Please select'
    },
    email: {
      email: "This isn't a valid email address",
      unique: 'This email address is already in use'
    },
    generic: {
      array: 'This must be a list of values',
      required: 'This field is required',
      string: 'This field must be a string',
      invalid: 'This value is invalid', // Only presented to users if there's a mismatch between server/client validation.
      integer: 'The value must be a whole number',
      enum: 'The value selected isn\'t allowed',
      distinct: 'The value must be unique',
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
    measurementProfileType: {
      BODY: { short: 'Body measurements', title: 'Body measurements for {customer}' },
      GARMENT: { short: 'Garment measurements', title: '{garment} measurements for {customer}' }
    },
    measurementType: {
      BODY: { short: 'Body measurement', description: "This is a full measurement taken from the customer's body (eg. the customer's height or their neck circumference) and can be used on several types of garments at once." },
      GARMENT: { short: 'Garment measurement', description: 'This is the full length measurement of a part of particular a garment (eg. the sleeve length for a jacket).' },
      SAMPLE_ADJUSTMENT: { short: 'Sample garment adjustment', description: "This is a measurement that is based on an existing sample garment (eg. to take length off the sleeve length on a sample jacket). These measurements are only visible if you're basing the measurements on a sample garment." },
      ALTERATION: { short: 'Pattern alteration', description: 'These measurements are only applicable when performing garment alterations (eg. to reference a specific seam on a jacket that needs let out).' }
    },
    garmentType: {
      JACKET: { short: 'Jacket' },
      WAISTCOAT: { short: 'Waistcoat' },
      SHIRT: { short: 'Shirt' },
      TROUSERS: { short: 'Trousers' }
    },
    unitOfMeasurementType: {
      INCHES: {
        short: 'Inch | Inches',
        abbr: '{num}″',
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
        short: 'Centimetre | Centimetres',
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
