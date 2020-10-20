import { createMuiTheme } from '@material-ui/core/styles'
import pink from '@material-ui/core/colors/pink'
import indigo from '@material-ui/core/colors/indigo'

export default createMuiTheme({
  palette: {
    primary: indigo,
    secondary: pink,
  },
  typography: {
    useNextVariants: true,
  },
})
