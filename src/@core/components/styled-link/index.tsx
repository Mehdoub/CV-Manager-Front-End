import { styled } from "@mui/material";
import Link from "next/link";

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.9rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

export default StyledLink
