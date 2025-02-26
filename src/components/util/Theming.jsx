import { styled } from "@mui/material/styles";
import { purple, pink } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

const PurpleButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

const CategoryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "primary",
  width: "95%",
  fontSize: "13px",
  fontWeight: 800,
  wordWrap: "break-word",
  whiteSpace: "normal",
  margin: "1px",
  height: "60px",
  // "&:hover": {
  //   backgroundColor: purple[700],
  // },
}));

const PinkButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(pink[500]),

  backgroundColor: pink[500],
  "&:hover": {
    backgroundColor: pink[700],
  },
}));

const PosTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    title={
      <>
        <Typography color="error">Tip:</Typography>
        <Typography variant="body1" color="inherit">
          {props.title}
        </Typography>
      </>
    }
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const PosAlert = (props) => {
  const { message, setMessage } = props;
  const handleClose = () => {
    setMessage(null);
  };

  return (
    <Dialog open={message ? true : false} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">Message</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export { PurpleButton, PinkButton, PosTooltip, PosAlert, CategoryButton };
