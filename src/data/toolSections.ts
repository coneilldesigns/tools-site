export interface Tool {
  name: string;
  path: string;
  enabled: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  content: {
    type: 'heading' | 'paragraph';
    text: string;
  }[];
}

export interface ToolSection {
  icon: string;
  title: string;
  tools: Tool[];
}

export const toolSections: ToolSection[] = [
  {
    icon: "💰",
    title: "Money & Currency",
    tools: [
      {
        name: "Currency Converter",
        path: "currency-converter",
        enabled: true,
        seo: {
          title: "Currency Converter | Free Online Currency Conversion Tool",
          description: "Convert currencies between different countries with our free online currency converter. Quick, accurate, and easy to use currency conversion tool.",
          keywords: ["currency converter", "currency conversion", "currency exchange", "currency calculator", "currency rate converter"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Currency Converter?'
          },
          {
            type: 'paragraph',
            text: 'A currency converter is a tool that helps you convert amounts between different currencies. This is useful for international transactions, travel, or simply keeping track of your finances in different currencies.'
          },
          {
            type: 'heading',
            text: 'How to Use the Currency Converter'
          },
          {
            type: 'paragraph',
            text: 'Simply enter the amount you want to convert and select the source and target currencies. The converter will instantly show you the equivalent amount in the target currency. You can also use the dropdown menus to select currencies by name or code.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Convert between any two currencies worldwide\n• Instant conversion results\n• Support for major currencies\n• Dark mode support for comfortable viewing\n• Easy-to-use interface with instant results'
          }
        ]
      },
      {
        name: "Crypto Converter",
        path: "crypto-converter",
        enabled: true,
        seo: {
          title: "Crypto Converter | Free Online Crypto Conversion Tool",
          description: "Convert cryptocurrencies between different currencies with our free online crypto converter. Quick, accurate, and easy to use crypto conversion tool.",
          keywords: ["crypto converter", "crypto conversion", "crypto exchange", "crypto calculator", "crypto rate converter"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Crypto Converter?'
          },
          {
            type: 'paragraph',
            text: 'A crypto converter is a tool that helps you convert amounts between different cryptocurrencies. This is useful for international transactions, travel, or simply keeping track of your finances in different cryptocurrencies.'
          },
          {
            type: 'heading',
            text: 'How to Use the Crypto Converter'
          },
          {
            type: 'paragraph',
            text: 'Simply enter the amount you want to convert and select the source and target cryptocurrencies. The converter will instantly show you the equivalent amount in the target cryptocurrency. You can also use the dropdown menus to select cryptocurrencies by name or code.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Convert between any two cryptocurrencies worldwide\n• Instant conversion results\n• Support for major cryptocurrencies\n• Dark mode support for comfortable viewing\n• Easy-to-use interface with instant results'
          }
        ]
      },
      {
        name: "Crypto Charts",
        path: "crypto-chart",
        enabled: true,
        seo: {
          title: "Crypto Chart | Free Online Crypto Chart Tool",
          description: "Visualize the price of your favorite cryptocurrencies with our free online crypto chart. Get real-time updates on the latest crypto prices and trends.",
          keywords: ["crypto chart", "crypto charting", "crypto chart tool", "crypto charting tool", "crypto charting tool"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Crypto Chart?'
          },
          {
            type: 'paragraph',
            text: 'A crypto chart is a tool that helps you visualize the price of your favorite cryptocurrencies. This is useful for keeping track of your investments, monitoring the latest crypto prices, and staying up-to-date with the latest crypto trends.'
          },
          {
            type: 'heading',
            text: 'How to Use the Crypto Chart'
          },
          {
            type: 'paragraph',
            text: 'Simply enter the cryptocurrency you want to track, and the chart will instantly show you the current price, price change, and other relevant information. You can also use the chart to visualize the price history and trends.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Visualize the price of any cryptocurrency in real-time\n• Visualize price history and trends with a chart\n• Get instant price updates and notifications\n• Support for multiple cryptocurrencies\n• Dark mode support for comfortable viewing'
          }
        ]
      },
      {
        name: "Stock Charts",
        path: "stock-chart",
        enabled: false,
        seo: {
          title: "Stock Chart | Free Online Stock Chart Tool",
          description: "Visualize the price of your favorite stocks with our free online stock chart. Get real-time updates on the latest stock prices and trends.",
          keywords: ["stock chart", "stock charting", "stock chart tool", "stock charting tool", "stock charting tool"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Stock Chart?'
          },
          {
            type: 'paragraph',
            text: 'A stock chart is a tool that helps you visualize the price of your favorite stocks. This is useful for keeping track of your investments, monitoring the latest stock prices, and staying up-to-date with the latest stock trends.'
          },
          {
            type: 'heading',
            text: 'How to Use the Stock Chart'
          },
          {
            type: 'paragraph',
            text: 'Simply enter the stock you want to track, and the chart will instantly show you the current price, price change, and other relevant information. You can also use the chart to visualize the price history and trends.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Visualize the price of any stock in real-time\n• Visualize price history and trends with a chart\n• Get instant price updates and notifications\n• Support for multiple stocks\n• Dark mode support for comfortable viewing'
          }
        ]
      },
      {
        name: "Stock Ticker",
        path: "stock-ticker",
        enabled: false,
        seo: {
          title: "Stock Ticker | Free Online Stock Market Dashboard",
          description: "Track multiple stocks at once with our free online stock ticker. View real-time prices, changes, and market data in an easy-to-read grid format.",
          keywords: ["stock ticker", "stock dashboard", "stock market ticker", "stock price tracker", "market dashboard"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Stock Ticker?'
          },
          {
            type: 'paragraph',
            text: 'A stock ticker is a dashboard that displays real-time stock prices and market data in an easy-to-read format. It shows multiple stocks simultaneously with color-coded price changes, making it perfect for monitoring your portfolio or tracking market trends.'
          },
          {
            type: 'heading',
            text: 'How to Use the Stock Ticker'
          },
          {
            type: 'paragraph',
            text: 'The stock ticker automatically displays current prices, percentage changes, and key market data for popular stocks. Use the filters to view specific sectors, sort by different criteria, and enable auto-refresh for real-time updates.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Real-time stock prices and changes\n• Color-coded price movements (green/red)\n• Filter by sector (Technology, Finance, etc.)\n• Sort by symbol, change %, or volume\n• Auto-refresh every 30 seconds\n• Market cap and volume data\n• Responsive grid layout'
          }
        ]
      },
    ]
  },
  {
    icon: "🔢",
    title: "Unit & Measurement Converters",
    tools: [
      { 
        name: "Feet ⇄ Inches", 
        path: "feet-to-inches",
        enabled: true,
        seo: {
          title: "Feet to Inches Converter | Free Online Length Conversion Tool",
          description: "Convert feet to inches and inches to feet with our free online calculator. Quick, accurate, and easy to use length conversion tool.",
          keywords: ["feet to inches", "inches to feet", "length converter", "measurement conversion", "feet inches calculator"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Feet to Inches Converter?'
          },
          {
            type: 'paragraph',
            text: 'A feet to inches converter is a tool that helps you convert measurements between feet and inches. This is particularly useful for construction, interior design, and any project requiring precise length measurements.'
          },
          {
            type: 'heading',
            text: 'How to Use the Converter'
          },
          {
            type: 'paragraph',
            text: 'Simply enter your measurement in either feet or inches, and the converter will instantly show you the equivalent in the other unit. The tool supports both conversion directions and provides precise calculations.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Convert feet to inches\n• Convert inches to feet\n• Precise calculations\n• Easy-to-use interface\n• Instant results'
          }
        ]
      },
      { 
        name: "CM ⇄ Inches", 
        path: "cm-to-inches",
        enabled: true,
        seo: {
          title: "CM to Inches Converter | Free Online Length Conversion Tool",
          description: "Convert centimeters to inches and inches to centimeters with our free online calculator. Quick, accurate, and easy to use length conversion tool.",
          keywords: ["cm to inches", "inches to cm", "centimeter converter", "length conversion", "metric imperial converter"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a CM to Inches Converter?'
          },
          {
            type: 'paragraph',
            text: 'A CM to inches converter is a tool that helps you convert measurements between centimeters and inches. This is essential for international projects, design work, and any situation requiring conversion between metric and imperial units.'
          },
          {
            type: 'heading',
            text: 'How to Use the Converter'
          },
          {
            type: 'paragraph',
            text: 'Enter your measurement in either centimeters or inches, and the converter will instantly show you the equivalent in the other unit. The tool provides precise calculations for both conversion directions.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Convert centimeters to inches\n• Convert inches to centimeters\n• Precise calculations\n• Easy-to-use interface\n• Instant results'
          }
        ]
      },
      { 
        name: "Miles ⇄ KM", 
        path: "miles-to-km",
        enabled: true,
        seo: {
          title: "Miles to Kilometers Converter | Free Online Distance Conversion Tool",
          description: "Convert miles to kilometers and kilometers to miles with our free online calculator. Quick, accurate, and easy to use distance conversion tool.",
          keywords: ["miles to km", "kilometers to miles", "distance converter", "metric imperial conversion", "mile kilometer calculator"]
        },
        content: []
      },
      { 
        name: "Fahrenheit ⇄ Celsius", 
        path: "fahrenheit-to-celsius",
        enabled: true,
        seo: {
          title: "Fahrenheit to Celsius Converter | Free Online Temperature Conversion Tool",
          description: "Convert Fahrenheit to Celsius and Celsius to Fahrenheit with our free online calculator. Quick, accurate, and easy to use temperature conversion tool.",
          keywords: ["fahrenheit to celsius", "celsius to fahrenheit", "temperature converter", "temperature conversion", "fahrenheit celsius calculator"]
        },
        content: []
      },
      { 
        name: "Grams ⇄ Ounces", 
        path: "grams-to-ounces",
        enabled: false,
        seo: {
          title: "Grams to Ounces Converter | Free Online Weight Conversion Tool",
          description: "Convert grams to ounces and ounces to grams with our free online calculator. Quick, accurate, and easy to use weight conversion tool.",
          keywords: ["grams to ounces", "ounces to grams", "weight converter", "mass conversion", "metric imperial weight calculator"]
        },
        content: []
      },
      { 
        name: "Litres ⇄ Gallons", 
        path: "litres-to-gallons",
        enabled: false,
        seo: {
          title: "Liters to Gallons Converter | Free Online Volume Conversion Tool",
          description: "Convert liters to gallons and gallons to liters with our free online calculator. Quick, accurate, and easy to use volume conversion tool.",
          keywords: ["liters to gallons", "gallons to liters", "volume converter", "liquid conversion", "metric imperial volume calculator"]
        },
        content: []
      }
    ]
  },
  {
    icon: "⏰",
    title: "Time & Date Tools",
    tools: [
      { 
        name: "Time zone converter", 
        path: "time-zone-converter",
        enabled: true,
        seo: {
          title: "Time Zone Converter | Free Online Time Zone Conversion Tool",
          description: "Convert times between different time zones with our free online time zone converter. Quick, accurate, and easy to use time conversion tool.",
          keywords: ["time zone converter", "time zone conversion", "world clock", "time difference calculator", "time zone calculator"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Time Zone Converter?'
          },
          {
            type: 'paragraph',
            text: 'A time zone converter is an essential tool that helps you convert times between different time zones around the world. Whether you are scheduling international meetings, planning travel, or coordinating with team members across the globe, this tool makes it easy to understand what time it is in different locations.'
          },
          {
            type: 'heading',
            text: 'How to Use the Time Zone Converter'
          },
          {
            type: 'paragraph',
            text: 'Simply select your source time zone and the time you want to convert, then choose your target time zone. The converter will instantly show you the equivalent time in your desired time zone. You can also use the map to visually select time zones and see the current time differences.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Convert between any time zones worldwide\n• Visual time zone map for easy selection\n• Support for daylight saving time\n• Current time display for all time zones\n• Easy-to-use interface with instant results'
          }
        ]
      },
      { 
        name: "Countdown timer", 
        path: "countdown-timer",
        enabled: true,
        seo: {
          title: "Countdown Timer | Free Online Countdown Clock Tool",
          description: "Create and manage countdown timers with our free online countdown timer. Perfect for events, deadlines, and time tracking.",
          keywords: ["countdown timer", "countdown clock", "timer tool", "event countdown", "time tracking"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Countdown Timer?'
          },
          {
            type: 'paragraph',
            text: 'A countdown timer is a tool that helps you track the time remaining until a specific event or deadline. Whether you are counting down to a special occasion, tracking project deadlines, or managing time-sensitive tasks, this tool provides a visual and accurate way to monitor the time remaining.'
          },
          {
            type: 'heading',
            text: 'How to Use the Countdown Timer'
          },
          {
            type: 'paragraph',
            text: 'Set your target date and time using the calendar interface, and the timer will automatically start counting down. The timer displays days, hours, minutes, and seconds remaining, with a progress bar showing the overall progress towards your target time.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Easy date and time selection\n• Visual progress tracking\n• Precise countdown display\n• Responsive design for all devices\n• Dark mode support for comfortable viewing'
          }
        ]
      },
      { 
        name: "Age calculator", 
        path: "age-calculator",
        enabled: true,
        seo: {
          title: "Age Calculator | Free Online Age Calculation Tool",
          description: "Calculate exact age in years, months, and days with our free online age calculator. Quick and accurate age calculation tool.",
          keywords: ["age calculator", "birth date calculator", "age calculation", "birthday calculator", "age in years months days"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is an Age Calculator?'
          },
          {
            type: 'paragraph',
            text: 'An age calculator is a tool that helps you determine the exact age of a person, object, or event. It calculates the precise duration between a birth date and the current date, breaking down the age into years, months, and days for accurate age determination.'
          },
          {
            type: 'heading',
            text: 'How to Use the Age Calculator'
          },
          {
            type: 'paragraph',
            text: 'Enter the birth date or start date, and the calculator will automatically compute the exact age. The results show a detailed breakdown of years, months, and days, making it perfect for precise age calculations for any purpose.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Precise age calculation\n• Detailed breakdown of years, months, and days\n• Easy date selection\n• Instant results\n• Support for historical dates'
          }
        ]
      },
      { 
        name: "Days between dates", 
        path: "days-between-dates",
        enabled: true,
        seo: {
          title: "Days Between Dates Calculator | Free Online Date Difference Tool",
          description: "Calculate the number of days between two dates with our free online calculator. Quick and accurate date difference calculation.",
          keywords: ["days between dates", "date difference calculator", "date calculator", "days calculator", "date range calculator"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Days Between Dates Calculator?'
          },
          {
            type: 'paragraph',
            text: 'A days between dates calculator is a tool that helps you determine the exact number of days between any two dates. This is useful for planning events, calculating durations, or determining time spans between important dates.'
          },
          {
            type: 'heading',
            text: 'How to Use the Calculator'
          },
          {
            type: 'paragraph',
            text: 'Select your start date and end date using the calendar interface. The calculator will instantly show you the total number of days between these dates, including or excluding the end date based on your preference.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Calculate days between any two dates\n• Option to include/exclude end date\n• Support for historical dates\n• Easy-to-use calendar interface\n• Instant calculation results'
          }
        ]
      },
      { 
        name: "What day was it?", 
        path: "what-day-was-it",
        enabled: true,
        seo: {
          title: "What Day Was It? | Free Online Day of Week Calculator",
          description: "Find out what day of the week a specific date was with our free online calculator. Quick and easy day of week lookup tool.",
          keywords: ["what day was it", "day of week calculator", "date to day converter", "historical date calculator", "day finder"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is the Day of Week Calculator?'
          },
          {
            type: 'paragraph',
            text: 'This tool helps you determine what day of the week any date fell on. Whether you\'re curious about historical dates, planning future events, or need to know the day of the week for any date, this calculator provides instant answers.'
          },
          {
            type: 'heading',
            text: 'How to Use the Calculator'
          },
          {
            type: 'paragraph',
            text: 'Simply enter any date using the calendar interface, and the calculator will instantly tell you what day of the week that date was or will be. The tool works for both past and future dates.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Calculate day of week for any date\n• Support for historical dates\n• Easy date selection\n• Instant results\n• Works for past and future dates'
          }
        ]
      },
      { 
        name: "Unix timestamp converter", 
        path: "unix-timestamp-converter",
        enabled: true,
        seo: {
          title: "Unix Timestamp Converter | Free Online Timestamp Conversion Tool",
          description: "Convert Unix timestamps to human-readable dates and vice versa with our free online converter. Quick and accurate timestamp conversion.",
          keywords: ["unix timestamp converter", "timestamp to date", "date to timestamp", "epoch converter", "unix time calculator"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Unix Timestamp Converter?'
          },
          {
            type: 'paragraph',
            text: 'A Unix timestamp converter is a tool that helps you convert between Unix timestamps (seconds since January 1, 1970) and human-readable dates. This is particularly useful for developers, system administrators, and anyone working with Unix-based systems.'
          },
          {
            type: 'heading',
            text: 'How to Use the Converter'
          },
          {
            type: 'paragraph',
            text: 'Enter either a Unix timestamp or a human-readable date, and the converter will instantly show you the equivalent in the other format. The tool supports both conversion directions and provides detailed date information.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Convert Unix timestamps to dates\n• Convert dates to Unix timestamps\n• Support for milliseconds\n• Detailed date information\n• Easy-to-use interface'
          }
        ]
      }
    ]
  },
  {
    icon: "🔤",
    title: "Text & Writing Tools",
    tools: [
      { 
        name: "Word/character counter", 
        path: "word-counter",
        enabled: true,
        seo: {
          title: "Word Counter | Free Online Word and Character Count Tool",
          description: "Count words, characters, sentences, and paragraphs with our free online word counter. Perfect for essays, articles, and social media posts.",
          keywords: ["word counter", "character counter", "text counter", "word count tool", "writing tool"]
        },
        content: []
      },
      { 
        name: "Text case converter", 
        path: "text-case-converter",
        enabled: true,
        seo: {
          title: "Text Case Converter | Free Online Text Case Transformation Tool",
          description: "Convert text between different cases (uppercase, lowercase, title case) with our free online text case converter. Quick and easy text transformation.",
          keywords: ["text case converter", "case converter", "text transformer", "uppercase converter", "lowercase converter"]
        },
        content: []
      },
      { 
        name: "Remove line breaks / extra spaces", 
        path: "text-cleaner",
        enabled: true,
        seo: {
          title: "Text Cleaner | Free Online Text Formatting Tool",
          description: "Clean and format text by removing extra spaces, line breaks, and unwanted characters with our free online text cleaner. Quick and easy text formatting.",
          keywords: ["text cleaner", "text formatter", "remove line breaks", "remove extra spaces", "text formatting tool"]
        },
        content: []
      },
      { 
        name: "Lorem Ipsum generator", 
        path: "lorem-ipsum-generator",
        enabled: true,
        seo: {
          title: "Lorem Ipsum Generator | Free Online Dummy Text Generator",
          description: "Generate Lorem Ipsum placeholder text with our free online generator. Perfect for design mockups and content placeholders.",
          keywords: ["lorem ipsum generator", "dummy text generator", "placeholder text", "lorem ipsum tool", "text generator"]
        },
        content: []
      }
    ]
  },
  {
    icon: "🧮",
    title: "Math & Number Tools",
    tools: [
      { 
        name: "Tip calculator", 
        path: "tip-calculator",
        enabled: true,
        seo: {
          title: "Tip Calculator | Free Online Gratuity Calculator",
          description: "Calculate tips and split bills with our free online tip calculator. Quick and easy gratuity calculation for restaurants and services.",
          keywords: ["tip calculator", "gratuity calculator", "bill splitter", "restaurant tip calculator", "service tip calculator"]
        },
        content: []
      },
      { 
        name: "Percentage calculator", 
        path: "percentage-calculator",
        enabled: false,
        seo: {
          title: "Percentage Calculator | Free Online Percentage Calculation Tool",
          description: "Calculate percentages, increases, decreases, and differences with our free online percentage calculator. Quick and accurate percentage calculations.",
          keywords: ["percentage calculator", "percent calculator", "percentage increase", "percentage decrease", "percentage difference"]
        },
        content: []
      },
      { 
        name: "Loan / mortgage calculator", 
        path: "loan-calculator",
        enabled: false,
        seo: {
          title: "Loan Calculator | Free Online Mortgage and Loan Calculator",
          description: "Calculate loan payments, interest rates, and amortization schedules with our free online loan calculator. Perfect for mortgages and personal loans.",
          keywords: ["loan calculator", "mortgage calculator", "payment calculator", "interest calculator", "amortization calculator"]
        },
        content: []
      },
      { 
        name: "Random number generator", 
        path: "random-number-generator",
        enabled: false,
        seo: {
          title: "Random Number Generator | Free Online Random Number Tool",
          description: "Generate random numbers within a specified range with our free online random number generator. Perfect for games, simulations, and random selection.",
          keywords: ["random number generator", "random number tool", "random number picker", "random number calculator", "random number selector"]
        },
        content: []
      },
      { 
        name: "GPA calculator", 
        path: "gpa-calculator",
        enabled: false,
        seo: {
          title: "GPA Calculator | Free Online Grade Point Average Calculator",
          description: "Calculate your GPA with our free online GPA calculator. Quick and accurate grade point average calculation for students.",
          keywords: ["gpa calculator", "grade point average", "gpa calculation", "grade calculator", "academic calculator"]
        },
        content: []
      },
      { 
        name: "BMI calculator", 
        path: "bmi-calculator",
        enabled: true,
        seo: {
          title: "BMI Calculator | Free Online Body Mass Index Calculator",
          description: "Calculate your Body Mass Index (BMI) with our free online BMI calculator. Quick and accurate health assessment tool.",
          keywords: ["bmi calculator", "body mass index", "bmi calculation", "health calculator", "weight calculator"]
        },
        content: []
      },
      { 
        name: "Prime number checker", 
        path: "prime-number-checker",
        enabled: false,
        seo: {
          title: "Prime Number Checker | Free Online Prime Number Tool",
          description: "Check if a number is prime with our free online prime number checker. Quick and accurate prime number verification.",
          keywords: ["prime number checker", "prime number calculator", "prime number tool", "prime number verifier", "prime number detector"]
        },
        content: []
      }
    ]
  },
  {
    icon: "📦",
    title: "Package & Shipping Tools",
    tools: [
      { 
        name: "Universal Tracking", 
        path: "universal-tracking",
        enabled: false,
        seo: {
          title: "Universal Package Tracking | Track Any Shipping Number",
          description: "Track packages from multiple carriers with our universal tracking tool. Enter any tracking number to get real-time shipping updates.",
          keywords: ["package tracking", "shipping tracker", "universal tracking", "tracking number", "parcel tracking"]
        },
        content: []
      }
    ]
  },
  {
    icon: "💼",
    title: "Business & Productivity Tools",
    tools: [
      { 
        name: "Invoice generator", 
        path: "invoice-generator",
        enabled: false,
        seo: {
          title: "Invoice Generator | Free Online Invoice Creation Tool",
          description: "Create professional invoices with our free online invoice generator. Quick and easy invoice creation for businesses and freelancers.",
          keywords: ["invoice generator", "invoice creator", "invoice maker", "business invoice", "professional invoice"]
        },
        content: []
      },
      { 
        name: "Meeting scheduler", 
        path: "meeting-scheduler",
        enabled: false,
        seo: {
          title: "Meeting Scheduler | Free Online Meeting Planning Tool",
          description: "Schedule and organize meetings with our free online meeting scheduler. Perfect for team coordination and event planning.",
          keywords: ["meeting scheduler", "meeting planner", "appointment scheduler", "meeting organizer", "event scheduler"]
        },
        content: []
      },
      { 
        name: "QR code generator", 
        path: "qr-code-generator",
        enabled: false,
        seo: {
          title: "QR Code Generator | Free Online QR Code Creation Tool",
          description: "Create custom QR codes with our free online QR code generator. Perfect for marketing, business cards, and digital content.",
          keywords: ["qr code generator", "qr code creator", "qr code maker", "qr code tool", "qr code designer"]
        },
        content: []
      },
      { 
        name: "Barcode generator", 
        path: "barcode-generator",
        enabled: false,
        seo: {
          title: "Barcode Generator | Free Online Barcode Creation Tool",
          description: "Create various types of barcodes with our free online barcode generator. Perfect for inventory, retail, and product management.",
          keywords: ["barcode generator", "barcode creator", "barcode maker", "barcode tool", "barcode designer"]
        },
        content: []
      },
      { 
        name: "Email signature generator", 
        path: "email-signature-generator",
        enabled: false,
        seo: {
          title: "Email Signature Generator | Free Online Signature Creation Tool",
          description: "Create professional email signatures with our free online signature generator. Perfect for business and personal email accounts.",
          keywords: ["email signature generator", "signature creator", "email signature maker", "professional signature", "business signature"]
        },
        content: []
      },
      { 
        name: "Resume builder", 
        path: "resume-builder",
        enabled: false,
        seo: {
          title: "Resume Builder | Free Online Resume Creation Tool",
          description: "Create professional resumes with our free online resume builder. Perfect for job seekers and career advancement.",
          keywords: ["resume builder", "resume creator", "resume maker", "professional resume", "job resume"]
        },
        content: []
      }
    ]
  },
  {
    icon: "📐",
    title: "Design & Web Tools",
    tools: [
      { 
        name: "Color picker / converter", 
        path: "color-picker",
        enabled: true,
        seo: {
          title: "Color Picker | Free Online Color Selection and Conversion Tool",
          description: "Pick colors and convert between color formats with our free online color picker. Perfect for web design and digital art.",
          keywords: ["color picker", "color converter", "color tool", "color selector", "color palette"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Color Picker & Converter?'
          },
          {
            type: 'paragraph',
            text: 'A color picker and converter is a tool that allows you to select colors visually and convert between different color formats such as HEX, RGB, HSL, and CMYK. It is essential for designers, developers, and digital artists who need precise color values for their projects.'
          },
          {
            type: 'heading',
            text: 'How to Use the Color Picker'
          },
          {
            type: 'paragraph',
            text: 'Simply pick a color using the visual color picker or enter a value in your preferred format. The tool will instantly display the color in multiple formats, making it easy to copy and use in your designs or code.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Visual color selection\n• Convert between HEX, RGB, HSL, and CMYK\n• Copy color values with one click\n• Real-time color preview\n• User-friendly interface'
          }
        ]
      },
      { 
        name: "CSS box shadow generator", 
        path: "box-shadow-generator",
        enabled: true,
        seo: {
          title: "CSS Box Shadow Generator | Free Online Shadow Effect Tool",
          description: "Create CSS box shadows with our free online generator. Perfect for web design and UI development.",
          keywords: ["box shadow generator", "css shadow", "shadow effect", "web design tool", "ui shadow"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a CSS Box Shadow Generator?'
          },
          {
            type: 'paragraph',
            text: 'A CSS box shadow generator is a tool that helps you create and customize box-shadow effects for your web elements. It provides a visual interface to adjust shadow parameters and instantly see the results, making it easy to design modern UI effects.'
          },
          {
            type: 'heading',
            text: 'How to Use the Box Shadow Generator'
          },
          {
            type: 'paragraph',
            text: "Adjust the shadow's offset, blur, spread, color, and inset options using the sliders or input fields. The tool will generate the corresponding CSS code, which you can copy and use directly in your stylesheets."
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Real-time box shadow preview\n• Adjustable offset, blur, spread, and color\n• Inset shadow option\n• Copy-ready CSS code\n• Intuitive and responsive design'
          }
        ]
      },
      { 
        name: "Regex Tester", 
        path: "regex-tester",
        enabled: true,
        seo: {
          title: "Regex Tester | Free Online Regular Expression Tester",
          description: "Test and validate regular expressions with our free online regex tester. Perfect for web development and data validation.",
          keywords: ["regex tester", "regex validator", "regex tool", "regex checker", "regex matcher"]
        },
        content: [
          {
            type: 'heading',
            text: 'What is a Regex Tester?'
          },
          {
            type: 'paragraph',
            text: 'A regex tester is a tool that allows you to test and validate regular expressions. It is essential for web development and data validation.'
          },
          {
            type: 'heading',
            text: 'How to Use the Regex Tester'
          },
          {
            type: 'paragraph',
            text: 'Simply enter your regular expression and test string in the input fields. The tool will instantly show you the results, including whether the expression matches or not.'
          },
          {
            type: 'heading',
            text: 'Features'
          },
          {
            type: 'paragraph',
            text: '• Real-time regex testing\n• Test multiple expressions at once\n• Syntax highlighting\n• Copy-ready results\n• User-friendly interface'
          }
        ]
      },
      { 
        name: "CSS Units Converter", 
        path: "css-units-converter",
        enabled: true,
        seo: {
          title: "CSS Units Converter | Free Online CSS Unit Tool",
          description: "Easily convert px to rem with our simple CSS unit converter. Quickly transform pixel values to rem units for better scalability and accessibility.",
          keywords: ["css units converter", "px to rem", "css converter", "unit converter", "responsive design"]
        },
        content: []
      }
    ]
  },
  {
    icon: "📚",
    title: "Language & Learning Tools",
    tools: [
      { 
        name: "Reading time estimator", 
        path: "reading-time-estimator",
        enabled: false,
        seo: {
          title: "Reading Time Estimator | Free Online Reading Duration Calculator",
          description: "Estimate reading time for any text with our free online reading time estimator. Perfect for content creators and readers.",
          keywords: ["reading time estimator", "reading duration", "reading calculator", "content timing", "read time"]
        },
        content: []
      },
      { 
        name: "Number to words", 
        path: "number-to-words",
        enabled: false,
        seo: {
          title: "Number to Words Converter | Free Online Number Spelling Tool",
          description: "Convert numbers to words with our free online number to words converter. Perfect for writing and documentation.",
          keywords: ["number to words", "number spelling", "number converter", "number writer", "number translator"]
        },
        content: []
      },
      { 
        name: "Spelling checker", 
        path: "spelling-checker",
        enabled: false,
        seo: {
          title: "Spelling Checker | Free Online Spell Check Tool",
          description: "Check spelling and grammar with our free online spelling checker. Perfect for writing and editing.",
          keywords: ["spelling checker", "spell check", "grammar checker", "writing tool", "text checker"]
        },
        content: []
      },
      { 
        name: "Roman numerals converter", 
        path: "roman-numerals",
        enabled: false,
        seo: {
          title: "Roman Numerals Converter | Free Online Roman Number Tool",
          description: "Convert between Roman numerals and regular numbers with our free online converter. Perfect for education and historical references.",
          keywords: ["roman numerals converter", "roman numbers", "number converter", "roman numeral tool", "ancient numbers"]
        },
        content: []
      },
      { 
        name: "Morse code translator", 
        path: "morse-code",
        enabled: false,
        seo: {
          title: "Morse Code Translator | Free Online Morse Code Tool",
          description: "Translate text to Morse code and vice versa with our free online translator. Perfect for learning and communication.",
          keywords: ["morse code translator", "morse code converter", "morse code tool", "telegraph code", "morse translator"]
        },
        content: []
      }
    ]
  },
  {
    icon: "🔐",
    title: "Privacy & Security Tools",
    tools: [
      { 
        name: "Password generator", 
        path: "password-generator",
        enabled: false,
        seo: {
          title: "Password Generator | Free Online Secure Password Creator",
          description: "Generate secure passwords with our free online password generator. Perfect for account security and protection.",
          keywords: ["password generator", "secure password", "password creator", "password maker", "security tool"]
        },
        content: []
      },
      { 
        name: "Password strength checker", 
        path: "password-strength",
        enabled: false,
        seo: {
          title: "Password Strength Checker | Free Online Password Security Tool",
          description: "Check password strength with our free online password strength checker. Perfect for security assessment.",
          keywords: ["password strength checker", "password security", "password analyzer", "security checker", "password tool"]
        },
        content: []
      },
      { 
        name: "Base64 encode/decode", 
        path: "base64",
        enabled: false,
        seo: {
          title: "Base64 Encoder/Decoder | Free Online Data Encoding Tool",
          description: "Encode and decode Base64 data with our free online tool. Perfect for data transmission and storage.",
          keywords: ["base64 encoder", "base64 decoder", "data encoding", "base64 tool", "data converter"]
        },
        content: []
      },
      { 
        name: "URL encoder/decoder", 
        path: "url-encoder",
        enabled: false,
        seo: {
          title: "URL Encoder/Decoder | Free Online URL Encoding Tool",
          description: "Encode and decode URLs with our free online tool. Perfect for web development and data handling.",
          keywords: ["url encoder", "url decoder", "url encoding", "url tool", "web tool"]
        },
        content: []
      },
      { 
        name: "Text encrypt/decrypt", 
        path: "text-encrypt",
        enabled: false,
        seo: {
          title: "Text Encrypt/Decrypt | Free Online Text Encryption Tool",
          description: "Encrypt and decrypt text with our free online tool. Perfect for secure communication and data protection.",
          keywords: ["text encryption", "text decryption", "encrypt text", "decrypt text", "security tool"]
        },
        content: []
      }
    ]
  },
  {
    icon: "🔄",
    title: "Fun & Random Tools",
    tools: [
      { 
        name: "Coin flipper", 
        path: "coin-flipper",
        enabled: false,
        seo: {
          title: "Coin Flipper | Free Online Virtual Coin Flip Tool",
          description: "Flip a virtual coin with our free online coin flipper. Perfect for decision making and games.",
          keywords: ["coin flipper", "virtual coin", "coin flip", "decision maker", "random tool"]
        },
        content: []
      },
      { 
        name: "Dice roller", 
        path: "dice-roller",
        enabled: false,
        seo: {
          title: "Dice Roller | Free Online Virtual Dice Rolling Tool",
          description: "Roll virtual dice with our free online dice roller. Perfect for games and random number generation.",
          keywords: ["dice roller", "virtual dice", "dice roll", "random dice", "game tool"]
        },
        content: []
      },
      { 
        name: "Would-you-rather question generator", 
        path: "would-you-rather",
        enabled: false,
        seo: {
          title: "Would You Rather Generator | Free Online Question Generator",
          description: "Generate would-you-rather questions with our free online tool. Perfect for games and icebreakers.",
          keywords: ["would you rather", "question generator", "game questions", "icebreaker", "fun tool"]
        },
        content: []
      },
      { 
        name: "Truth or Dare tool", 
        path: "truth-or-dare",
        enabled: false,
        seo: {
          title: "Truth or Dare Generator | Free Online Game Tool",
          description: "Generate truth or dare questions with our free online tool. Perfect for parties and social games.",
          keywords: ["truth or dare", "game generator", "party game", "social game", "fun tool"]
        },
        content: []
      },
      { 
        name: "Random name picker", 
        path: "random-name-picker",
        enabled: false,
        seo: {
          title: "Random Name Picker | Free Online Name Selection Tool",
          description: "Pick random names with our free online name picker. Perfect for games and random selection.",
          keywords: ["random name picker", "name selector", "random name", "name generator", "selection tool"]
        },
        content: []
      }
    ]
  }
]; 